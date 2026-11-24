import type { ComponentLogger } from '@onecx/accelerator'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import type Keycloak from 'keycloak-js'
import Semaphore from 'ts-semaphore'
import { KeycloakAuthEventHandlers, setKeycloakAuthEventHandlers } from './keycloak-event-handlers'

type FakeKeycloak = {
  login: jest.Mock
  updateToken: jest.Mock
  tokenParsed?: { exp?: number }
  onAuthError?: (errorData: unknown) => void
  onAuthLogout?: () => void
  onAuthRefreshSuccess?: () => void
  onAuthRefreshError?: () => void
  onAuthSuccess?: () => void
  onTokenExpired?: () => void
  onActionUpdate?: (state: 'success' | 'cancelled' | 'error') => void
  onReady?: (authenticated: boolean | undefined) => void
}

async function setup(flags: { tokenExpired?: boolean; refreshError?: boolean } = {}) {
  const keycloak: FakeKeycloak = {
    login: jest.fn().mockResolvedValue(undefined),
    updateToken: jest.fn().mockResolvedValue(true),
  }
  const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() }
  const auth = {
    config: { some: 'config' },
    configService: {
      getProperty: jest.fn(async (key: CONFIG_KEY) => {
        if (key === CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED) return flags.tokenExpired ? 'true' : 'false'
        if (key === CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED) return flags.refreshError ? 'true' : 'false'
        return undefined
      }),
    } as unknown as ConfigurationService,
    updateTokenSemaphore: new Semaphore(1),
    updateLocalStorage: jest.fn(),
    clearKCStateFromLocalstorage: jest.fn(),
  } satisfies KeycloakAuthEventHandlers

  await setKeycloakAuthEventHandlers(keycloak as unknown as Keycloak, logger as unknown as ComponentLogger, auth)
  return { keycloak, logger, auth }
}

const flush = () => new Promise((resolve) => setTimeout(resolve))

describe('setKeycloakAuthEventHandlers', () => {
  it('given onAuthError fires, then it logs the error and persists the tokens', async () => {
    const { keycloak, logger, auth } = await setup()

    keycloak.onAuthError?.({ error: 'x' })

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('onAuthError'), { errorData: { error: 'x' } })
    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
  })

  it('given onAuthLogout fires, then the stored state is cleared and a login is started', async () => {
    const { keycloak, auth } = await setup()

    keycloak.onAuthLogout?.()

    expect(auth.clearKCStateFromLocalstorage).toHaveBeenCalledTimes(1)
    expect(keycloak.login).toHaveBeenCalledWith({ some: 'config' })
  })

  it('given the login started by onAuthLogout fails, then the failure is logged', async () => {
    const { keycloak, logger } = await setup()
    keycloak.login.mockRejectedValue(new Error('login failed'))

    keycloak.onAuthLogout?.()
    await flush()

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('login redirect failed'), expect.anything())
  })

  it.each([
    ['with', { exp: 4102444800 }, '2100-01-01T00:00:00.000Z'],
    ['without', undefined, 'unknown'],
  ])('given onAuthRefreshSuccess fires %s an expiry, then the expiry is logged', async (_name, parsed, expected) => {
    const { keycloak, logger, auth } = await setup()
    keycloak.tokenParsed = parsed

    keycloak.onAuthRefreshSuccess?.()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('onAuthRefreshSuccess'), { expiry: expected })
  })

  it.each([
    ['with', { exp: 4102444800 }, '2100-01-01T00:00:00.000Z'],
    ['without', undefined, 'unknown'],
  ])('given onAuthSuccess fires %s an expiry, then the expiry is logged', async (_name, parsed, expected) => {
    const { keycloak, logger, auth } = await setup()
    keycloak.tokenParsed = parsed

    keycloak.onAuthSuccess?.()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('onAuthSuccess'), { expiry: expected })
  })

  it('given onAuthRefreshError fires and re-login is enabled, then a login is started', async () => {
    const { keycloak, auth } = await setup({ refreshError: true })

    keycloak.onAuthRefreshError?.()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(keycloak.login).toHaveBeenCalledWith({ some: 'config' })
  })

  it('given onAuthRefreshError fires and re-login is disabled, then no login is started', async () => {
    const { keycloak, auth } = await setup()

    keycloak.onAuthRefreshError?.()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(keycloak.login).not.toHaveBeenCalled()
  })

  it('given onTokenExpired fires and proactive refresh is enabled, then updateToken is called', async () => {
    const { keycloak, auth } = await setup({ tokenExpired: true })

    keycloak.onTokenExpired?.()
    await flush()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(keycloak.updateToken).toHaveBeenCalledTimes(1)
  })

  it('given onTokenExpired fires, proactive refresh is enabled and updateToken fails, then the failure is logged', async () => {
    const { keycloak, logger } = await setup({ tokenExpired: true })
    keycloak.updateToken.mockRejectedValue(new Error('refresh failed'))

    keycloak.onTokenExpired?.()
    await flush()

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('updateToken() failed'), expect.anything())
  })

  it('given onTokenExpired fires and proactive refresh is disabled, then updateToken is not called', async () => {
    const { keycloak, auth } = await setup()

    keycloak.onTokenExpired?.()
    await flush()

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
    expect(keycloak.updateToken).not.toHaveBeenCalled()
  })

  it('given onActionUpdate fires, then the tokens are persisted', async () => {
    const { keycloak, auth } = await setup()

    keycloak.onActionUpdate?.('success')

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
  })

  it('given onReady fires, then the tokens are persisted', async () => {
    const { keycloak, auth } = await setup()

    keycloak.onReady?.(true)

    expect(auth.updateLocalStorage).toHaveBeenCalledTimes(1)
  })
})
