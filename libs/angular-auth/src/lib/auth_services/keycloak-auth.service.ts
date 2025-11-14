import { Injectable } from '@angular/core'
import { ConfigurationService, CONFIG_KEY } from '@onecx/angular-integration-interface'
import type { KeycloakOptions, KeycloakService } from 'keycloak-angular'
import { KeycloakConfig } from 'keycloak-js'
import { AuthService } from '../auth.service'

type KeycloakAngularModule = typeof import('keycloak-angular')

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

@Injectable()
export class KeycloakAuthService implements AuthService {

  kcConfig?: Record<string, unknown>

  private keycloakService?: KeycloakService
  private keycloakAngularModule?: KeycloakAngularModule
  private eventsAttached = false

  constructor(private configService: ConfigurationService) {}

  public async init(config?: Record<string, unknown>): Promise<boolean> {
    console.time('KeycloakAuthService')
    this.kcConfig = config
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

    const keycloakModule = await this.loadKeycloakAngularModule()
    const keycloakService = await this.ensureKeycloakService()

    this.setupEventListener(keycloakService, keycloakModule)

    let kcConfig: KeycloakConfig | string = { ...this.getValidKCConfig(), ...(config ?? {}) }
    if (!kcConfig.clientId || !kcConfig.realm || !kcConfig.url) {
      kcConfig = './assets/keycloak.json'
    }

    const enableSilentSSOCheck = this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO) === 'true'

    const kcOptions: KeycloakOptions = {
      loadUserProfileAtStartUp: false,
      config: kcConfig,
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
        idToken: idToken || undefined,
        refreshToken: refreshToken || undefined,
        token: token || undefined,
      },
      enableBearerInterceptor: false,
      bearerExcludedUrls: ['/assets'],
    }

    return keycloakService
      .init(kcOptions)
      .catch((err) => {
        console.log(`Keycloak err: ${err}, try force login`)
        return keycloakService.login(config)
      })
      .then((loginOk) => {
        if (loginOk) {
          return keycloakService.getToken()
        } else {
          return keycloakService.login(config).then(() => 'login')
        }
      })
      .then(() => {
        console.timeEnd('KeycloakAuthService')
        return true
      })
      .catch((err) => {
        console.log(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
        throw err
      })
  }

  protected getValidKCConfig(): KeycloakConfig {
    const clientId = this.configService.getProperty(CONFIG_KEY.KEYCLOAK_CLIENT_ID)
    if (!clientId) {
      throw new Error('Invalid KC config, missing clientId')
    }
    const realm = this.configService.getProperty(CONFIG_KEY.KEYCLOAK_REALM)
    if (!realm) {
      throw new Error('Invalid KC config, missing realm')
    }
    return {
      url: this.configService.getProperty(CONFIG_KEY.KEYCLOAK_URL),
      clientId,
      realm,
    }
  }

  private setupEventListener(keycloakService: KeycloakService, keycloakModule: KeycloakAngularModule) {
    if (this.eventsAttached) {
      return
    }
    this.eventsAttached = true
    keycloakService.keycloakEvents$.subscribe((ke) => {
      if (keycloakService.getKeycloakInstance().token) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_TOKEN_LS, keycloakService.getKeycloakInstance().token!)
      } else {
        localStorage.removeItem(KC_TOKEN_LS)
      }
      if (keycloakService.getKeycloakInstance().idToken) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_ID_TOKEN_LS, keycloakService.getKeycloakInstance().idToken!)
      } else {
        localStorage.removeItem(KC_ID_TOKEN_LS)
      }
      if (keycloakService.getKeycloakInstance().refreshToken) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_REFRESH_TOKEN_LS, keycloakService.getKeycloakInstance().refreshToken!)
      } else {
        localStorage.removeItem(KC_REFRESH_TOKEN_LS)
      }
      if (ke.type === keycloakModule.KeycloakEventType.OnAuthLogout) {
        console.log('SSO logout nav to root')
        this.clearKCStateFromLocalstorage()
        keycloakService.login(this.kcConfig)
      }
    })
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
    return this.assertKeycloakService().getKeycloakInstance().idToken ?? null
  }
  getAccessToken(): string | null {
    return this.assertKeycloakService().getKeycloakInstance().token ?? null
  }

  logout(): void {
    this.assertKeycloakService().logout()
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    const keycloakService = await this.ensureKeycloakService()
    if (!(await keycloakService.isLoggedIn())) {
      return keycloakService.login(this.kcConfig).then(() => false)
    } else {
      return keycloakService.updateToken()
    }
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

  private async loadKeycloakAngularModule(): Promise<KeycloakAngularModule> {
    if (this.keycloakAngularModule) {
      return this.keycloakAngularModule
    }
    try {
      const module = await import('keycloak-angular')
      this.keycloakAngularModule = module
      return module
    } catch (error) {
      throw new Error(
        'Failed to import the optional peer dependency "keycloak-angular". Please ensure it is installed to enable Keycloak authentication.'
      )
    }
  }

  private async ensureKeycloakService(): Promise<KeycloakService> {
    if (this.keycloakService) {
      return this.keycloakService
    }
    const keycloakModule = await this.loadKeycloakAngularModule()
    this.keycloakService = new keycloakModule.KeycloakService()
    return this.keycloakService
  }

  private assertKeycloakService(): KeycloakService {
    if (!this.keycloakService) {
      throw new Error('KeycloakAuthService has not been initialized. Call init() before using Keycloak APIs.')
    }
    return this.keycloakService
  }
}
