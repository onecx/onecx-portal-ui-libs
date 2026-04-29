import { Injectable, inject } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { AuthService } from '../auth.service'
import Semaphore from 'ts-semaphore'
import { KeycloakConfig, KeycloakInstance } from './keycloak.types'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

@Injectable()
export class KeycloakAuthService implements AuthService {
  private configService = inject(ConfigurationService)
  private keycloak: KeycloakInstance | undefined
  private readonly updateTokenSemaphore = new Semaphore(1)

  config?: Record<string, unknown>

  public async init(config?: Record<string, unknown>): Promise<boolean> {
    this.config = config
    let token = localStorage.getItem(KC_TOKEN_LS)
    let idToken = localStorage.getItem(KC_ID_TOKEN_LS)
    let refreshToken = localStorage.getItem(KC_REFRESH_TOKEN_LS)
    if (token && refreshToken) {
      const parsedToken = JSON.parse(atob(refreshToken.split('.')[1]))
      if (parsedToken.exp * 1000 < new Date().getTime()) {
        token = null
        refreshToken = null
        idToken = null
        this.clearKCStateFromLocalstorage()
      }
    }

    let kcConfig: KeycloakConfig | string
    const validKCConfig = await this.getValidKCConfig()
    kcConfig = { ...validKCConfig, ...(config ?? {}) }

    if (!kcConfig.clientId || !kcConfig.realm || !kcConfig.url) {
      kcConfig = './assets/keycloak.json'
    }

    const enableSilentSSOCheck =
      (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO)) === 'true'

    const timeSkew = await this.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_TIME_SKEW)

    try {
      await import('keycloak-js').then(({ default: Keycloak }) => {
        this.keycloak = new Keycloak(kcConfig)
      })
    } catch (err) {
      console.error(
        'Keycloak initialization failed! Could not load keycloak-js library which is required in the current environment.',
        err
      )
      throw new Error(
        'Keycloak initialization failed! Could not load keycloak-js library which is required in the current environment.'
      )
    }

    if (!this.keycloak) {
      throw new Error('Keycloak initialization failed!')
    }

    await this.setupEventListener()

    return this.keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
        idToken: idToken || undefined,
        refreshToken: refreshToken || undefined,
        token: token || undefined,
        timeSkew: timeSkew,
      })
      .catch((err) => {
        console.log(`Keycloak err: ${err}, try force login`)
        return this.keycloak?.login(this.config)
      })
      .then((loginOk) => {
        if (loginOk) {
          return this.keycloak?.token
        } else {
          return this.keycloak?.login(this.config).then(() => 'login')
        }
      })
      .then(() => {
        return true
      })
      .catch((err) => {
        console.log(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
        throw err
      })
  }

  protected async getValidKCConfig(): Promise<KeycloakConfig> {
    const clientId = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_CLIENT_ID)
    if (!clientId) {
      throw new Error('Invalid KC config, missing clientId')
    }
    const realm = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_REALM)
    if (!realm) {
      throw new Error('Invalid KC config, missing realm')
    }
    const url = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_URL)
    return {
      url,
      clientId,
      realm,
    }
  }

  private async setupEventListener() {
    if (this.keycloak) {
      const onTokenExpiredEnabled = (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED)) === 'true'

      const onAuthRefreshErrorEnabled = (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED)) === 'true'

      this.keycloak.onAuthError = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onAuthLogout = () => {
        console.log('SSO logout nav to root')
        this.clearKCStateFromLocalstorage()
        this.keycloak?.login(this.config)
      }
      this.keycloak.onAuthRefreshSuccess = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onAuthRefreshError = () => {
        this.updateLocalStorage()
        if (onAuthRefreshErrorEnabled) {
          console.log('Auth refresh error - initiating re-login')
          this.keycloak?.login(this.config)
        }
      }
      this.keycloak.onAuthSuccess = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onTokenExpired = () => {
        this.updateLocalStorage()
        if (onTokenExpiredEnabled) {
          // A semaphore is used to prevent executing multiple updateToken calls in parallel.
          this.updateTokenSemaphore.use(async () => {
            console.log('Token expired - proactively refreshing')
            this.keycloak?.updateToken()
          })
        }
      }
      this.keycloak.onActionUpdate = () => {
        this.updateLocalStorage()
      }
      this.keycloak.onReady = () => {
        this.updateLocalStorage()
      }
    }
  }

  private updateLocalStorage() {
    if (this.keycloak) {
      if (this.keycloak.token) {
        localStorage.setItem(KC_TOKEN_LS, this.keycloak.token)
      } else {
        localStorage.removeItem(KC_TOKEN_LS)
      }
      if (this.keycloak.idToken) {
        localStorage.setItem(KC_ID_TOKEN_LS, this.keycloak.idToken)
      } else {
        localStorage.removeItem(KC_ID_TOKEN_LS)
      }
      if (this.keycloak.refreshToken) {
        localStorage.setItem(KC_REFRESH_TOKEN_LS, this.keycloak.refreshToken)
      } else {
        localStorage.removeItem(KC_REFRESH_TOKEN_LS)
      }
    }
  }

  private clearKCStateFromLocalstorage() {
    localStorage.removeItem(KC_ID_TOKEN_LS)
    localStorage.removeItem(KC_TOKEN_LS)
    localStorage.removeItem(KC_REFRESH_TOKEN_LS)
  }

  private getSilentSSOUrl() {
    let currentBase = document.getElementsByTagName('base')[0].href
    if (currentBase === '/') {
      currentBase = ''
    }
    return `${currentBase}/assets/silent-check-sso.html`
  }

  getIdToken(): string | null {
    return this.keycloak?.idToken ?? null
  }
  getAccessToken(): string | null {
    return this.keycloak?.token ?? null
  }

  logout(): void {
    this.keycloak?.logout()
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    // A semaphore is used to prevent executing multiple updateToken calls in parallel.
    // Allows one request at a time once execution is completed, additional calls will be dismmied by keycloak
    return this.updateTokenSemaphore.use(async () => {
      if (!this.keycloak?.authenticated) {
        return this.keycloak?.login(this.config).then(() => false) ?? Promise.reject('Keycloak not initialized!')
      }
      
      const minValidity = await this.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY)

      return this.keycloak.updateToken(minValidity)
    })
  }

  getAuthProviderName(): string {
    return 'keycloak-auth'
  }

  hasRole(_role: string): boolean {
    return false
  }

  getUserRoles(): string[] {
    return []
  }

  getHeaderValues(): Record<string, string> {
    return { 'apm-principal-token': this.getIdToken() ?? '', Authorization: `Bearer ${this.getAccessToken()}` }
  }

  async getConfigValueNumberOrUndefined(configKey: CONFIG_KEY): Promise<number | undefined> {
    const value = await this.configService.getProperty(configKey)
    if (value === undefined) return undefined

    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return undefined
    return parsed
  }
}
