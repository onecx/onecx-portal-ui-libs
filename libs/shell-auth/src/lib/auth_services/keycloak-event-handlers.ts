import { CONFIG_KEY } from '@onecx/angular-integration-interface'
import type { ConfigurationService } from '@onecx/angular-integration-interface'
import type { ComponentLogger } from '@onecx/accelerator'
import type Keycloak from 'keycloak-js'
import type Semaphore from 'ts-semaphore'

/**
 * The KeycloakAuthService members the Keycloak event handlers below rely on. Extracted into a minimal dependency
 * so the handler wiring can be tested without instantiating the whole auth service.
 */
export interface KeycloakAuthEventHandlers {
  config?: Record<string, unknown>
  configService: ConfigurationService
  updateTokenSemaphore: Semaphore
  updateLocalStorage(): void
  clearKCStateFromLocalstorage(): void
}

/** Bundles the dependencies and resolved flags every event handler needs. */
interface KeycloakEventContext {
  keycloak: Keycloak
  logger: ComponentLogger
  auth: KeycloakAuthEventHandlers
  onTokenExpiredEnabled: boolean
  onAuthRefreshErrorEnabled: boolean
}

/**
 * Wires the Keycloak lifecycle event handlers onto the instance. Each handler persists the current token state to
 * localStorage and logs the transition; a few also trigger a re-login or a proactive token refresh.
 */
export async function setKeycloakAuthEventHandlers(
  keycloak: Keycloak,
  logger: ComponentLogger,
  auth: KeycloakAuthEventHandlers
): Promise<void> {
  const onTokenExpiredEnabled = await isFlagEnabled(auth, CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED)
  const onAuthRefreshErrorEnabled = await isFlagEnabled(auth, CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED)
  logger.info(`[KC events] 1 setupEventListener() `, { onTokenExpiredEnabled, onAuthRefreshErrorEnabled })
  const ctx: KeycloakEventContext = { keycloak, logger, auth, onTokenExpiredEnabled, onAuthRefreshErrorEnabled }
  bindOnAuthError(ctx)
  bindOnAuthLogout(ctx)
  bindOnAuthRefreshSuccess(ctx)
  bindOnAuthRefreshError(ctx)
  bindOnAuthSuccess(ctx)
  bindOnTokenExpired(ctx)
  bindOnActionUpdate(ctx)
  bindOnReady(ctx)
}

/** Reads one handler flag from the auth service's configuration service. */
async function isFlagEnabled(auth: KeycloakAuthEventHandlers, key: CONFIG_KEY): Promise<boolean> {
  return (await auth.configService.getProperty(key)) === 'true'
}

/** Formats the current token expiry (in seconds) as an ISO timestamp, or 'unknown' when absent. */
function getExpiry(keycloak: Keycloak): string {
  const expiry = keycloak.tokenParsed?.exp
  return expiry ? new Date(expiry * 1000).toISOString() : 'unknown'
}

function bindOnAuthError(ctx: KeycloakEventContext): void {
  ctx.keycloak.onAuthError = (errorData) => {
    ctx.logger.error(`[KC event] 2.1 onAuthError:`, { errorData })
    ctx.auth.updateLocalStorage()
  }
}

function bindOnAuthLogout(ctx: KeycloakEventContext): void {
  ctx.keycloak.onAuthLogout = () => {
    ctx.logger.info('[KC event] 2.2 onAuthLogout - SSO session ended, navigating to login')
    ctx.auth.clearKCStateFromLocalstorage()
    ctx.keycloak.login(ctx.auth.config)
  }
}

function bindOnAuthRefreshSuccess(ctx: KeycloakEventContext): void {
  ctx.keycloak.onAuthRefreshSuccess = () => {
    ctx.auth.updateLocalStorage()
    ctx.logger.info(`[KC event] 2.3 onAuthRefreshSuccess - token silently refreshed, new expiry: `, {
      expiry: getExpiry(ctx.keycloak),
    })
  }
}

function bindOnAuthRefreshError(ctx: KeycloakEventContext): void {
  ctx.keycloak.onAuthRefreshError = () => {
    ctx.logger.warn(`[KC event] 2.4.1           onAuthRefreshError - refresh token or SSO session has expired`, {
      onAuthRefreshErrorEnabled: ctx.onAuthRefreshErrorEnabled,
    })
    ctx.auth.updateLocalStorage()
    if (ctx.onAuthRefreshErrorEnabled) {
      ctx.logger.info('[KC event] 2.4.1           onAuthRefreshError - initiating re-login')
      ctx.keycloak.login(ctx.auth.config)
    }
  }
}

function bindOnAuthSuccess(ctx: KeycloakEventContext): void {
  ctx.keycloak.onAuthSuccess = () => {
    ctx.auth.updateLocalStorage()
    ctx.logger.info(`[KC event] 2.5 onAuthSuccess - authenticated, token expires: `, {
      expiry: getExpiry(ctx.keycloak),
    })
  }
}

function bindOnTokenExpired(ctx: KeycloakEventContext): void {
  ctx.keycloak.onTokenExpired = () => {
    ctx.logger.info(`[KC event] 2.6 onTokenExpired at ${new Date().toISOString()} ,`, {
      expiry: getExpiry(ctx.keycloak),
      onTokenExpiredEnabled: ctx.onTokenExpiredEnabled,
    })
    ctx.auth.updateLocalStorage()
    if (ctx.onTokenExpiredEnabled) {
      // A semaphore is used to prevent executing multiple updateToken calls in parallel.
      ctx.auth.updateTokenSemaphore.use(async () => {
        ctx.logger.info('[KC event] 2.6           onTokenExpired - proactively calling updateToken()')
        ctx.keycloak.updateToken()
      })
    } else {
      ctx.logger.info(
        '[KC event] 2.6            onTokenExpired - proactive refresh disabled, token will stay expired until next API call triggers updateTokenIfNeeded()'
      )
    }
  }
}

function bindOnActionUpdate(ctx: KeycloakEventContext): void {
  ctx.keycloak.onActionUpdate = (state) => {
    ctx.logger.info(`[KC event] 2.7 onActionUpdate`, { state })
    ctx.auth.updateLocalStorage()
  }
}

function bindOnReady(ctx: KeycloakEventContext): void {
  ctx.keycloak.onReady = (authenticated) => {
    ctx.auth.updateLocalStorage()
    ctx.logger.info(`[KC event] 2.8 onReady `, { authenticated })
  }
}
