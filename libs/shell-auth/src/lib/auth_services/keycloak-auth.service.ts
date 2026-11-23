import { Injectable, inject } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import Keycloak, { KeycloakInitOptions, KeycloakServerConfig } from 'keycloak-js'
import { AuthService } from '../auth.service'
import { createLogger } from '../utils/logger.utils'
import { setKeycloakAuthEventHandlers } from './keycloak-event-handlers'
import Semaphore from 'ts-semaphore'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

@Injectable()
export class KeycloakAuthService implements AuthService {
  private readonly logger = createLogger('KeycloakAuthService')
  private configService = inject(ConfigurationService)
  private keycloak: Keycloak | undefined
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
        this.logger.info(
          `[KC init] 1 Stored refresh token expired at ${new Date(parsedToken.exp * 1000).toISOString()}, clearing stored tokens`
        )
        token = null
        refreshToken = null
        idToken = null
        this.clearKCStateFromLocalstorage()
      } else {
        this.logger.info(
          `[KC init] 1 Stored refresh token valid until ${new Date(parsedToken.exp * 1000).toISOString()}, will attempt to reuse`
        )
      }
    } else {
      this.logger.info('[KC init] 1 No stored tokens found, will require fresh login')
    }

    let kcConfig: KeycloakServerConfig | string
    const validKCConfig = await this.getValidKCConfig()
    kcConfig = { ...validKCConfig, ...(config ?? {}) }

    if (!kcConfig.clientId || !kcConfig.realm || !kcConfig.url) {
      kcConfig = './assets/keycloak.json'
    }

    const enableSilentSSOCheck =
      (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO)) === 'true'

    const timeSkew = await this.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_TIME_SKEW)
    this.logger.info(`[KC init] Config: `, {
      timeSkew,
      silentSSO: enableSilentSSOCheck,
      hasStoredToken: !!token,
      hasStoredRefreshToken: !!refreshToken,
      kcConfig,
    })

    try {
      await import('keycloak-js').then(({ default: Keycloak }) => {
        this.keycloak = new Keycloak(kcConfig)
      })
    } catch (err) {
      const errorMessage =
        'Keycloak initialization failed! Could not load keycloak-js library which is required in the current environment.'
      this.logger.error(errorMessage, err)
      throw new Error(errorMessage)
    }

    if (!this.keycloak) {
      throw new Error('Keycloak initialization failed!')
    }

    await this.setupEventListener()

    return this.completeInit({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
      idToken: idToken || undefined,
      refreshToken: refreshToken || undefined,
      token: token || undefined,
      timeSkew: timeSkew,
    })
  }

  private async completeInit(options: KeycloakInitOptions): Promise<boolean> {
    let authenticated
    try {
      authenticated = await this.keycloak?.init(options)
    } catch (err) {
      this.logger.warn(`Keycloak err: ${err}, try force login`)
    }
    if (authenticated) {
      return true
    }
    try {
      await this.keycloak?.login(this.config)
    } catch (err) {
      this.logger.error(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
      throw err
    }
    return true
  }

  protected async getValidKCConfig(): Promise<KeycloakServerConfig> {
    const clientId = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_CLIENT_ID)
    if (!clientId) {
      throw new Error('Invalid KC config, missing clientId')
    }
    const realm = await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_REALM)
    if (!realm) {
      throw new Error('Invalid KC config, missing realm')
    }
    const url = (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_URL)) ?? ''
    return {
      url,
      clientId,
      realm,
    }
  }

  private async setupEventListener() {
    if (this.keycloak) {
      const handlers = {
        config: this.config,
        configService: this.configService,
        updateTokenSemaphore: this.updateTokenSemaphore,
        updateLocalStorage: () => this.updateLocalStorage(),
        clearKCStateFromLocalstorage: () => this.clearKCStateFromLocalstorage(),
      }
      await setKeycloakAuthEventHandlers(this.keycloak, this.logger, handlers)
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
    return this.updateTokenSemaphore.use(async () => {
      if (!this.keycloak?.authenticated) {
        this.logger.warn('[KC updateTokenIfNeeded] not authenticated, redirecting to login')
        return this.keycloak?.login(this.config).then(() => false) ?? Promise.reject('Keycloak not initialized!')
      }

      const minValidity = await this.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY)
      const expiry = this.keycloak.tokenParsed?.exp
      this.logger.info(`[KC updateTokenIfNeeded] 4 minValidity`, {
        minValidity,
        expiry: expiry ? new Date(expiry * 1000).toISOString() : 'unknown',
      })

      const refreshed = await this.keycloak.updateToken(minValidity)
      this.logger.info(`[KC updateTokenIfNeeded] 4 tokenRefreshed`, { refreshed })
      return refreshed
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
