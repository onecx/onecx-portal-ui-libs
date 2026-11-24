import { Injector } from '@angular/core'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }))

const KeycloakConstructor = (jest.requireMock('keycloak-js') as { default: jest.Mock }).default

interface KeycloakLike {
  authenticated: boolean
  token?: string
  idToken?: string
  refreshToken?: string
  tokenParsed?: { exp: number }
  init: jest.Mock
  login: jest.Mock
  logout: jest.Mock
  updateToken: jest.Mock
  onAuthError?: (data: unknown) => void
  onAuthLogout?: () => void
  onAuthRefreshSuccess?: () => void
  onAuthRefreshError?: () => void
  onAuthSuccess?: () => void
  onTokenExpired?: () => void
  onActionUpdate?: (state: string) => void
  onReady?: (authenticated: boolean) => void
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const jwtExpiringAt = (exp: number): string => `h.${btoa(JSON.stringify({ exp }))}.s`

let keycloak: KeycloakLike
let config: Record<string, string | undefined>

const createService = (): KeycloakAuthService => {
  const configStub = { getProperty: jest.fn(async (key: string) => config[key]) }
  return Injector.create({
    providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configStub }],
  }).get(KeycloakAuthService)
}

const installKeycloak = (overrides: Partial<KeycloakLike> = {}): KeycloakLike => {
  keycloak = {
    authenticated: true,
    token: 'token',
    idToken: 'idToken',
    refreshToken: 'refreshToken',
    tokenParsed: { exp: 9_999_999_999 },
    init: jest.fn(async () => true),
    login: jest.fn(async () => undefined),
    logout: jest.fn(),
    updateToken: jest.fn(async () => true),
    ...overrides,
  }
  KeycloakConstructor.mockImplementation(() => keycloak)
  return keycloak
}

describe('KeycloakAuthService init and events', () => {
  beforeEach(() => {
    localStorage.clear()
    config = {
      KEYCLOAK_CLIENT_ID: 'client',
      KEYCLOAK_REALM: 'realm',
      KEYCLOAK_URL: 'https://keycloak.example',
    }
  })
  afterEach(() => {
    jest.restoreAllMocks()
    KeycloakConstructor.mockReset()
  })

  describe('given stored tokens', () => {
    it('when the refresh token is still valid, then keycloak is initialised with the stored tokens', async () => {
      localStorage.setItem('onecx_kc_token', 'stored-token')
      localStorage.setItem('onecx_kc_idToken', 'stored-id')
      localStorage.setItem('onecx_kc_refreshToken', jwtExpiringAt(Math.floor(Date.now() / 1000) + 3600))
      installKeycloak()

      await createService().init()

      expect(keycloak.init).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'stored-token',
          idToken: 'stored-id',
          refreshToken: expect.stringContaining('h.'),
        })
      )
    })

    it('when the refresh token has expired, then stored tokens are cleared and not passed to keycloak', async () => {
      localStorage.setItem('onecx_kc_token', 'stored-token')
      localStorage.setItem('onecx_kc_idToken', 'stored-id')
      localStorage.setItem('onecx_kc_refreshToken', jwtExpiringAt(1))
      installKeycloak()

      await createService().init()

      expect(keycloak.init).toHaveBeenCalledWith(
        expect.objectContaining({ token: undefined, idToken: undefined, refreshToken: undefined })
      )
      expect(localStorage.getItem('onecx_kc_token')).toBeNull()
      expect(localStorage.getItem('onecx_kc_refreshToken')).toBeNull()
    })
  })

  describe('given keycloak cannot be constructed', () => {
    it('when init is called, then it rejects with a descriptive error', async () => {
      KeycloakConstructor.mockImplementation(() => {
        throw new Error('boom')
      })

      await expect(createService().init()).rejects.toThrow('Could not load keycloak-js library')
    })
  })

  describe('given an initialised service', () => {
    let service: KeycloakAuthService

    beforeEach(async () => {
      config['KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED'] = 'true'
      config['KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED'] = 'true'
      installKeycloak()
      service = createService()
      await service.init()
    })

    it('when onAuthSuccess fires, then the current tokens are persisted', () => {
      keycloak.onAuthSuccess?.()
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
      expect(localStorage.getItem('onecx_kc_idToken')).toBe('idToken')
    })

    it('when onAuthSuccess fires without token expiry, then it still persists', () => {
      keycloak.tokenParsed = undefined
      keycloak.onAuthSuccess?.()
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
    })

    it('when onAuthRefreshSuccess fires, then the refreshed tokens are persisted', () => {
      keycloak.token = 'refreshed'
      keycloak.onAuthRefreshSuccess?.()
      expect(localStorage.getItem('onecx_kc_token')).toBe('refreshed')
    })

    it('when onAuthRefreshSuccess fires without token expiry info, then it still persists', () => {
      keycloak.tokenParsed = undefined
      keycloak.onAuthRefreshSuccess?.()
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
    })

    it('when onTokenExpired fires after the keycloak instance is gone, then nothing is refreshed or persisted', async () => {
      const onTokenExpired = keycloak.onTokenExpired
      ;(service as unknown as { keycloak: undefined }).keycloak = undefined
      onTokenExpired?.()
      await flush()
      expect(keycloak.updateToken).not.toHaveBeenCalled()
      expect(localStorage.getItem('onecx_kc_token')).toBeNull()
    })

    it('when onAuthRefreshError fires and re-login is enabled, then login is triggered', () => {
      keycloak.onAuthRefreshError?.()
      expect(keycloak.login).toHaveBeenCalled()
    })

    it('when onAuthLogout fires, then stored tokens are cleared and login is triggered', () => {
      localStorage.setItem('onecx_kc_token', 'x')
      keycloak.onAuthLogout?.()
      expect(localStorage.getItem('onecx_kc_token')).toBeNull()
      expect(keycloak.login).toHaveBeenCalled()
    })

    it('when onAuthError, onActionUpdate or onReady fire, then tokens are persisted', () => {
      keycloak.onAuthError?.({ error: 'e' })
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
      localStorage.clear()
      keycloak.onActionUpdate?.('success')
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
      localStorage.clear()
      keycloak.onReady?.(true)
      expect(localStorage.getItem('onecx_kc_token')).toBe('token')
    })

    it('when onTokenExpired fires without token expiry info, then it still refreshes the token', async () => {
      keycloak.tokenParsed = undefined
      keycloak.onTokenExpired?.()
      await flush()
      expect(keycloak.updateToken).toHaveBeenCalledTimes(1)
    })

    it('when updateTokenIfNeeded is called, then it returns the refresh result', async () => {
      config['KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY'] = '30'
      keycloak.updateToken.mockResolvedValue(false)
      await expect(service.updateTokenIfNeeded()).resolves.toBe(false)
      expect(keycloak.updateToken).toHaveBeenCalledWith(30)
    })

    it('when updateTokenIfNeeded is called without token expiry info, then it still refreshes', async () => {
      keycloak.tokenParsed = undefined
      await expect(service.updateTokenIfNeeded()).resolves.toBe(true)
    })

    it('when not authenticated and updateTokenIfNeeded is called, then login is triggered and false returned', async () => {
      keycloak.authenticated = false
      await expect(service.updateTokenIfNeeded()).resolves.toBe(false)
      expect(keycloak.login).toHaveBeenCalled()
    })
  })

  describe('given the service was never initialised', () => {
    it('when updateTokenIfNeeded is called, then it rejects', async () => {
      await expect(createService().updateTokenIfNeeded()).rejects.toBe('Keycloak not initialized!')
    })
  })
})
