import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

type KeycloakMock = {
  init: jest.Mock
  login: jest.Mock
  logout: jest.Mock
  updateToken: jest.Mock
  token?: string
  idToken?: string
  refreshToken?: string
  authenticated?: boolean
  tokenParsed?: { exp?: number }
  onAuthError?: (data: unknown) => void
  onAuthLogout?: () => void
  onAuthRefreshSuccess?: () => void
  onAuthRefreshError?: () => void
  onAuthSuccess?: () => void
  onTokenExpired?: () => void
  onActionUpdate?: (state: 'success' | 'cancelled' | 'error') => void
  onReady?: (authenticated: boolean | undefined) => void
}

const mockInstances: KeycloakMock[] = []
let mockConstructorError: Error | undefined
let mockConstructorArgs: unknown[] = []
let mockInitImpl: () => Promise<boolean>
let mockLoginImpl: () => Promise<void>

jest.mock('keycloak-js', () => {
  class Keycloak {
    init = jest.fn(() => mockInitImpl())
    login = jest.fn(() => mockLoginImpl())
    logout = jest.fn()
    updateToken = jest.fn().mockResolvedValue(true)

    constructor(...args: unknown[]) {
      if (mockConstructorError) throw mockConstructorError
      mockConstructorArgs = args
      mockInstances.push(this as unknown as KeycloakMock)
    }
  }
  return { __esModule: true, default: Keycloak }
})

const KC_TOKEN_LS = 'onecx_kc_token'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'

function buildService(properties: Partial<Record<CONFIG_KEY, string>> = {}): KeycloakAuthService {
  const defaults: Partial<Record<CONFIG_KEY, string>> = {
    [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'client',
    [CONFIG_KEY.KEYCLOAK_REALM]: 'realm',
    [CONFIG_KEY.KEYCLOAK_URL]: 'http://kc',
  }
  const all = { ...defaults, ...properties }
  const configService = { getProperty: jest.fn(async (key: CONFIG_KEY) => all[key]) }
  const injector = Injector.create([
    { provide: ConfigurationService, useValue: configService },
    { provide: KeycloakAuthService, useClass: KeycloakAuthService },
  ])
  return injector.get(KeycloakAuthService)
}

function toRefreshToken(exp: number): string {
  return `header.${Buffer.from(JSON.stringify({ exp })).toString('base64')}.signature`
}

function kc(): KeycloakMock {
  return mockInstances[0]
}

describe('KeycloakAuthService', () => {
  beforeEach(() => {
    localStorage.clear()
    mockInstances.length = 0
    mockConstructorError = undefined
    mockConstructorArgs = []
    mockInitImpl = () => Promise.resolve(true)
    mockLoginImpl = () => Promise.resolve()
    document.head.innerHTML = '<base href="http://localhost/base">'
  })

  describe('init', () => {
    it('given no stored tokens and a complete config, when init() runs, then keycloak is created from the config and init resolves true', async () => {
      const service = buildService({ [CONFIG_KEY.KEYCLOAK_TIME_SKEW]: '5' })

      await expect(service.init({ extra: 1 })).resolves.toBe(true)

      expect(mockConstructorArgs[0]).toEqual({ url: 'http://kc', clientId: 'client', realm: 'realm', extra: 1 })
      expect(kc().init).toHaveBeenCalledWith(
        expect.objectContaining({ onLoad: 'check-sso', timeSkew: 5, silentCheckSsoRedirectUri: undefined })
      )
    })

    it('given the url is missing from the config, when init() runs, then keycloak is created from the assets file', async () => {
      const service = buildService({ [CONFIG_KEY.KEYCLOAK_URL]: '' })

      await service.init()

      expect(mockConstructorArgs[0]).toBe('./assets/keycloak.json')
    })

    it('given a stored refresh token that has expired, when init() runs, then the stored tokens are cleared', async () => {
      localStorage.setItem(KC_TOKEN_LS, 'access')
      localStorage.setItem(KC_ID_TOKEN_LS, 'id')
      localStorage.setItem(KC_REFRESH_TOKEN_LS, toRefreshToken(1))
      const service = buildService()

      await service.init()

      expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
      expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
      expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
      expect(kc().init).toHaveBeenCalledWith(expect.objectContaining({ token: undefined, refreshToken: undefined }))
    })

    it('given a stored refresh token that is still valid, when init() runs, then the stored tokens are passed to keycloak', async () => {
      const refreshToken = toRefreshToken(4102444800)
      localStorage.setItem(KC_TOKEN_LS, 'access')
      localStorage.setItem(KC_ID_TOKEN_LS, 'id')
      localStorage.setItem(KC_REFRESH_TOKEN_LS, refreshToken)
      const service = buildService()

      await service.init()

      expect(kc().init).toHaveBeenCalledWith(expect.objectContaining({ token: 'access', idToken: 'id', refreshToken }))
    })

    it('given the clientId is missing, when init() runs, then it rejects', async () => {
      const service = buildService({ [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: '' })

      await expect(service.init()).rejects.toThrow('Invalid KC config, missing clientId')
    })

    it('given the realm is missing, when init() runs, then it rejects', async () => {
      const service = buildService({ [CONFIG_KEY.KEYCLOAK_REALM]: '' })

      await expect(service.init()).rejects.toThrow('Invalid KC config, missing realm')
    })

    it('given keycloak cannot be instantiated, when init() runs, then it rejects with an initialization error', async () => {
      mockConstructorError = new Error('boom')
      const service = buildService()

      await expect(service.init()).rejects.toThrow('Could not load keycloak-js library')
    })

    it('given keycloak.init resolves false, when init() runs, then a login is triggered and init resolves true', async () => {
      mockInitImpl = () => Promise.resolve(false)
      const service = buildService()

      await expect(service.init()).resolves.toBe(true)

      expect(kc().login).toHaveBeenCalledTimes(1)
    })

    it('given keycloak.init rejects, when init() runs, then a login is triggered', async () => {
      mockInitImpl = () => Promise.reject(new Error('init failed'))
      const service = buildService()

      await service.init()

      expect(kc().login).toHaveBeenCalled()
    })

    it('given keycloak.init and the login redirect both fail, when init() runs, then it rejects', async () => {
      mockInitImpl = () => Promise.reject(new Error('init failed'))
      const service = buildService()
      const failingLogin = new Error('login failed')
      mockLoginImpl = () => Promise.reject(failingLogin)

      await expect(service.init()).rejects.toBe(failingLogin)
    })
  })

  describe('keycloak events', () => {
    async function initialized(properties: Partial<Record<CONFIG_KEY, string>> = {}) {
      const service = buildService(properties)
      await service.init({ some: 'config' })
      return service
    }

    it('given onAuthError fires, then the keycloak tokens are persisted to local storage', async () => {
      await initialized()
      kc().token = 't'
      kc().idToken = 'i'
      kc().refreshToken = 'r'

      kc().onAuthError?.({ error: 'x' })

      expect(localStorage.getItem(KC_TOKEN_LS)).toBe('t')
      expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBe('i')
      expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBe('r')
    })

    it('given keycloak has no tokens, when an event persists them, then the stored entries are removed', async () => {
      await initialized()
      localStorage.setItem(KC_TOKEN_LS, 'old')
      localStorage.setItem(KC_ID_TOKEN_LS, 'old')
      localStorage.setItem(KC_REFRESH_TOKEN_LS, 'old')

      kc().onActionUpdate?.('success')

      expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
      expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
      expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
    })

    it('given onAuthLogout fires, then stored tokens are cleared and a login is triggered', async () => {
      await initialized()
      localStorage.setItem(KC_TOKEN_LS, 'old')

      kc().onAuthLogout?.()

      expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
      expect(kc().login).toHaveBeenCalledWith({ some: 'config' })
    })

    it.each([
      ['with', { exp: 4102444800 }],
      ['without', undefined],
    ])('given onAuthRefreshSuccess fires %s a token expiry, then the tokens are persisted', async (_name, parsed) => {
      await initialized()
      kc().token = 't'
      kc().tokenParsed = parsed

      kc().onAuthRefreshSuccess?.()

      expect(localStorage.getItem(KC_TOKEN_LS)).toBe('t')
    })

    it.each([
      ['with', { exp: 4102444800 }],
      ['without', undefined],
    ])('given onAuthSuccess fires %s a token expiry, then the tokens are persisted', async (_name, parsed) => {
      await initialized()
      kc().token = 't'
      kc().tokenParsed = parsed

      kc().onAuthSuccess?.()

      expect(localStorage.getItem(KC_TOKEN_LS)).toBe('t')
    })

    it('given onAuthRefreshError fires and the re-login is enabled, then a login is triggered', async () => {
      await initialized({ [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'true' })

      kc().onAuthRefreshError?.()

      expect(kc().login).toHaveBeenCalledWith({ some: 'config' })
    })

    it('given onAuthRefreshError fires and the re-login is disabled, then no login is triggered', async () => {
      await initialized()

      kc().onAuthRefreshError?.()

      expect(kc().login).not.toHaveBeenCalled()
    })

    it.each([
      ['with', { exp: 4102444800 }],
      ['without', undefined],
    ])(
      'given onTokenExpired fires %s an expiry and proactive refresh is enabled, then updateToken is called',
      async (_name, parsed) => {
        await initialized({ [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'true' })
        kc().tokenParsed = parsed

        kc().onTokenExpired?.()
        await new Promise((resolve) => setTimeout(resolve))

        expect(kc().updateToken).toHaveBeenCalledTimes(1)
      }
    )

    it('given onTokenExpired fires and proactive refresh is disabled, then updateToken is not called', async () => {
      await initialized()

      kc().onTokenExpired?.()
      await new Promise((resolve) => setTimeout(resolve))

      expect(kc().updateToken).not.toHaveBeenCalled()
    })

    it('given onReady fires, then the tokens are persisted', async () => {
      await initialized()
      kc().token = 't'

      kc().onReady?.(true)

      expect(localStorage.getItem(KC_TOKEN_LS)).toBe('t')
    })
  })

  describe('token accessors', () => {
    it('given keycloak is not initialized, then the tokens are null and logout does nothing', () => {
      const service = buildService()

      expect(service.getIdToken()).toBeNull()
      expect(service.getAccessToken()).toBeNull()
      expect(() => service.logout()).not.toThrow()
    })

    it('given keycloak is initialized, then the tokens are returned and logout is delegated', async () => {
      const service = buildService()
      await service.init()
      kc().token = 'access'
      kc().idToken = 'id'

      expect(service.getAccessToken()).toBe('access')
      expect(service.getIdToken()).toBe('id')
      expect(service.getHeaderValues()).toEqual({ 'apm-principal-token': 'id', Authorization: 'Bearer access' })
      service.logout()
      expect(kc().logout).toHaveBeenCalled()
    })

    it('given no id token, then the apm principal header is empty', () => {
      expect(buildService().getHeaderValues()['apm-principal-token']).toBe('')
    })

    it('then the provider metadata is static', () => {
      const service = buildService()

      expect(service.getAuthProviderName()).toBe('keycloak-auth')
      expect(service.hasRole('any')).toBe(false)
      expect(service.getUserRoles()).toEqual([])
    })
  })

  describe('updateTokenIfNeeded', () => {
    it('given keycloak is not initialized, then it rejects', async () => {
      await expect(buildService().updateTokenIfNeeded()).rejects.toBe('Keycloak not initialized!')
    })

    it('given the user is not authenticated, then a login is triggered and false is returned', async () => {
      const service = buildService()
      await service.init()
      kc().authenticated = false

      await expect(service.updateTokenIfNeeded()).resolves.toBe(false)

      expect(kc().login).toHaveBeenCalled()
    })

    it.each([
      ['with', { exp: 4102444800 }],
      ['without', undefined],
    ])(
      'given the user is authenticated %s an expiry, then the token is refreshed with the configured min validity',
      async (_name, parsed) => {
        const service = buildService({ [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '30' })
        await service.init()
        kc().authenticated = true
        kc().tokenParsed = parsed

        await expect(service.updateTokenIfNeeded()).resolves.toBe(true)

        expect(kc().updateToken).toHaveBeenCalledWith(30)
      }
    )
  })

  describe('getConfigValueNumberOrUndefined', () => {
    it('given a numeric, a missing and a non numeric value, then the number or undefined is returned', async () => {
      const service = buildService({
        [CONFIG_KEY.KEYCLOAK_TIME_SKEW]: '12',
        [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: 'abc',
      })

      await expect(service.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_TIME_SKEW)).resolves.toBe(12)
      await expect(
        service.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY)
      ).resolves.toBeUndefined()
      await expect(service.getConfigValueNumberOrUndefined(CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO)).resolves.toBe(
        undefined
      )
    })
  })
})
