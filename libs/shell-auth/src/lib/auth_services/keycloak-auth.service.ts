import { Injectable, inject } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import Keycloak, { KeycloakServerConfig } from 'keycloak-js'
import { AuthService } from '../auth.service'
import { createLogger } from '../utils/logger.utils'
import Semaphore from 'ts-semaphore'
import { getValidKeycloakConfig } from './keycloak-config'
import {
  clearStoredKeycloakTokens,
  persistKeycloakTokens,
  readStoredTokens,
  type KeycloakTokenValues,
} from './keycloak-token-storage'

@Injectable()
export class KeycloakAuthService implements AuthService {
  private readonly logger = createLogger('KeycloakAuthService')
  private configService = inject(ConfigurationService)
  private keycloak: Keycloak | undefined
  private readonly updateTokenSemaphore = new Semaphore(1)

  config?: Record<string, unknown>

  public async init(config?: Record<string, unknown>): Promise<boolean> {
    this.config = config
    const stored = this.restoreStoredTokens()

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
      hasStoredToken: !!stored.token,
      hasStoredRefreshToken: !!stored.refreshToken,
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

    return this.keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
        idToken: stored.idToken || undefined,
        refreshToken: stored.refreshToken || undefined,
        token: stored.token || undefined,
        timeSkew: timeSkew,
      })
      .catch((err) => {
        this.logger.warn(`Keycloak err: ${err}, try force login`)
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
        this.logger.error(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
        throw err
      })
  }

  private restoreStoredTokens(): KeycloakTokenValues {
    const stored = readStoredTokens()
    if (!stored.token || !stored.refreshToken) {
      this.logger.info('[KC init] 1 No stored tokens found, will require fresh login')
      return stored
    }
    const parsedToken = JSON.parse(atob(stored.refreshToken.split('.')[1]))
    if (parsedToken.exp * 1000 >= Date.now()) {
      this.logger.info(
        `[KC init] 1 Stored refresh token valid until ${new Date(parsedToken.exp * 1000).toISOString()}, will attempt to reuse`
      )
      return stored
    }
    this.logger.info(
      `[KC init] 1 Stored refresh token expired at ${new Date(parsedToken.exp * 1000).toISOString()}, clearing stored tokens`
    )
    clearStoredKeycloakTokens()
    return { token: null, idToken: null, refreshToken: null }
  }

  protected async getValidKCConfig(): Promise<KeycloakServerConfig> {
    return getValidKeycloakConfig(this.configService)
  }

  private async setupEventListener() {
    if (this.keycloak) {
      const onTokenExpiredEnabled =
        (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED)) === 'true'

      const onAuthRefreshErrorEnabled =
        (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED)) === 'true'

      this.logger.info(`[KC events] 1 setupEventListener() `, { onTokenExpiredEnabled, onAuthRefreshErrorEnabled })

      this.keycloak.onAuthError = (errorData) => {
        this.logger.error(`[KC event] 2.1 onAuthError:`, { errorData })
        this.updateLocalStorage()
      }
      this.keycloak.onAuthLogout = () => {
        this.logger.info('[KC event] 2.2 onAuthLogout - SSO session ended, navigating to login')
        clearStoredKeycloakTokens()
        this.keycloak?.login(this.config)
      }
      this.keycloak.onAuthRefreshSuccess = () => {
        this.updateLocalStorage()
        const expiry = this.keycloak?.tokenParsed?.exp
        this.logger.info(`[KC event] 2.3 onAuthRefreshSuccess - token silently refreshed, new expiry: `, {
          expiry: expiry ? new Date(expiry * 1000).toISOString() : 'unknown',
        })
      }
      this.keycloak.onAuthRefreshError = () => {
        this.logger.warn(`[KC event] 2.4.1           onAuthRefreshError - refresh token or SSO session has expired`, {
          onAuthRefreshErrorEnabled,
        })
        this.updateLocalStorage()
        if (onAuthRefreshErrorEnabled) {
          this.logger.info('[KC event] 2.4.1           onAuthRefreshError - initiating re-login')
          this.keycloak?.login(this.config)
        }
      }
      this.keycloak.onAuthSuccess = () => {
        this.updateLocalStorage()
        const expiry = this.keycloak?.tokenParsed?.exp
        this.logger.info(`[KC event] 2.5 onAuthSuccess - authenticated, token expires: `, {
          expiry: expiry ? new Date(expiry * 1000).toISOString() : 'unknown',
        })
      }
      this.keycloak.onTokenExpired = () => this.handleTokenExpired().catch((err) => this.handleTokenExpiredFailure(err))
      this.keycloak.onActionUpdate = (state) => {
        this.logger.info(`[KC event] 2.7 onActionUpdate`, { state })
        this.updateLocalStorage()
      }
      this.keycloak.onReady = (authenticated) => {
        this.updateLocalStorage()
        this.logger.info(`[KC event] 2.8 onReady `, { authenticated })
      }
    }
  }

  private async handleTokenExpired(): Promise<void> {
    const expiry = this.keycloak?.tokenParsed?.exp
    const onTokenExpiredEnabled = await this.isTokenExpiredRefreshEnabled()
    this.logger.info(`[KC event] 2.6 onTokenExpired at ${new Date().toISOString()} ,`, {
      expiry: expiry ? new Date(expiry * 1000).toISOString() : 'unknown',
      onTokenExpiredEnabled,
    })
    this.updateLocalStorage()
    if (onTokenExpiredEnabled) {
      // proactivelyRefreshToken catches and logs its own updateToken rejection, so the
      // onTokenExpired handler-failure catch only guards other failures here (e.g. token persistence).
      await this.proactivelyRefreshToken()
    } else {
      this.logger.info(
        '[KC event] 2.6            onTokenExpired - proactive refresh disabled, token will stay expired until next API call triggers updateTokenIfNeeded()'
      )
    }
  }

  private async isTokenExpiredRefreshEnabled(): Promise<boolean> {
    return (await this.configService.getProperty(CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED)) === 'true'
  }

  private handleTokenExpiredFailure(err: unknown): void {
    this.logger.error('[KC event] 2.6 onTokenExpired - handler failed', err)
  }

  private async proactivelyRefreshToken(): Promise<void> {
    // A semaphore is used to prevent executing multiple updateToken calls in parallel.
    // The callback awaits updateToken() so the semaphore is held until the refresh settles,
    // keeping a proactive refresh from overlapping with updateTokenIfNeeded().
    await this.updateTokenSemaphore.use(async () => {
      this.logger.info('[KC event] 2.6           onTokenExpired - proactively calling updateToken()')
      try {
        await this.keycloak?.updateToken()
      } catch (err) {
        this.logger.error('[KC event] 2.6 onTokenExpired - proactive updateToken failed', err)
      }
    })
  }

  private updateLocalStorage() {
    if (this.keycloak) {
      persistKeycloakTokens(this.keycloak)
    }
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
