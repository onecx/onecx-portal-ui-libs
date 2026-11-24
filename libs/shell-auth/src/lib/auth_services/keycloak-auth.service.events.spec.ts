import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }))

const keycloakCtor = jest.requireMock('keycloak-js').default as jest.Mock

const encodeRefreshToken = (exp: number) => `.${Buffer.from(JSON.stringify({ exp })).toString('base64')}`

const createFixture = (properties: Record<string, string> = {}) => {
  const keycloak: Record<string, any> = {
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn().mockResolvedValue(undefined),
    updateToken: jest.fn().mockResolvedValue(true),
    token: 'new-token',
    idToken: 'new-id-token',
    refreshToken: 'new-refresh-token',
    authenticated: true,
    tokenParsed: { exp: 2000000000 },
  }
  keycloakCtor.mockImplementation(() => keycloak)
  const configServiceStub = {
    getProperty: jest.fn(async (key: CONFIG_KEY) => {
      if (key === CONFIG_KEY.KEYCLOAK_CLIENT_ID) return 'client-id'
      if (key === CONFIG_KEY.KEYCLOAK_REALM) return 'realm'
      if (key === CONFIG_KEY.KEYCLOAK_URL) return 'https://keycloak.example.com'
      return properties[key]
    }),
  }
  const service = Injector.create({
    providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configServiceStub }],
  }).get(KeycloakAuthService)
  return { keycloak, service }
}

describe('KeycloakAuthService, given an initialized service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('when a stored refresh token is expired, then stored tokens are cleared and not passed to init', async () => {
    localStorage.setItem('onecx_kc_token', 'old-token')
    localStorage.setItem('onecx_kc_idToken', 'old-id')
    localStorage.setItem('onecx_kc_refreshToken', encodeRefreshToken(1))
    const { keycloak, service } = createFixture()

    await service.init()

    expect(keycloak['init'].mock.calls[0][0]).toEqual(
      expect.objectContaining({ token: undefined, idToken: undefined, refreshToken: undefined })
    )
    expect(localStorage.getItem('onecx_kc_refreshToken')).toBeNull()
  })

  it('when keycloak-js cannot be constructed, then init rejects with a descriptive error', async () => {
    const { service } = createFixture()
    keycloakCtor.mockImplementation(() => {
      throw new Error('boom')
    })

    await expect(service.init()).rejects.toThrow('Could not load keycloak-js library')
  })

  it('when auth events fire, then tokens are persisted to local storage', async () => {
    const { keycloak, service } = createFixture()
    await service.init()

    keycloak['onAuthSuccess']()
    expect(localStorage.getItem('onecx_kc_token')).toBe('new-token')
    expect(localStorage.getItem('onecx_kc_idToken')).toBe('new-id-token')

    keycloak['tokenParsed'] = undefined
    keycloak['onAuthRefreshSuccess']()
    keycloak['onAuthSuccess']()
    keycloak['onAuthError']({ error: 'x' })
    keycloak['onActionUpdate']('SUCCESS')
    keycloak['onReady'](true)
    expect(localStorage.getItem('onecx_kc_refreshToken')).toBe('new-refresh-token')
  })

  it('when logout event fires, then stored tokens are cleared and login is triggered', async () => {
    const { keycloak, service } = createFixture()
    await service.init()
    localStorage.setItem('onecx_kc_token', 'x')

    keycloak['onAuthLogout']()

    expect(localStorage.getItem('onecx_kc_token')).toBeNull()
    expect(keycloak['login']).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['enabled', 'true', 1],
    ['disabled', 'false', 0],
  ])('when refresh error fires and re-login is %s, then login is called %d time(s)', async (_n, value, calls) => {
    const { keycloak, service } = createFixture({ [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: value })
    await service.init()

    keycloak['onAuthRefreshError']()

    expect(keycloak['login']).toHaveBeenCalledTimes(calls)
  })

  it.each([
    ['enabled', 'true', 1],
    ['disabled', 'false', 0],
  ])(
    'when token expires and proactive refresh is %s, then updateToken is called %d time(s)',
    async (_n, value, calls) => {
      const { keycloak, service } = createFixture({ [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: value })
      await service.init()

      keycloak['onTokenExpired']()
      keycloak['tokenParsed'] = undefined
      keycloak['onTokenExpired']()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(keycloak['updateToken']).toHaveBeenCalledTimes(calls * 2)
    }
  )

  it('when updateTokenIfNeeded runs while authenticated, then it returns the refresh result using min validity', async () => {
    const { keycloak, service } = createFixture({ [CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY]: '30' })
    await service.init()
    keycloak['updateToken'].mockResolvedValue(false)

    await expect(service.updateTokenIfNeeded()).resolves.toBe(false)
    keycloak['tokenParsed'] = undefined
    await expect(service.updateTokenIfNeeded()).resolves.toBe(false)
    expect(keycloak['updateToken']).toHaveBeenCalledWith(30)
  })

  it('when updateTokenIfNeeded runs while not authenticated, then login is called and false returned', async () => {
    const { keycloak, service } = createFixture()
    await service.init()
    keycloak['authenticated'] = false

    await expect(service.updateTokenIfNeeded()).resolves.toBe(false)
    expect(keycloak['login']).toHaveBeenCalled()
  })
})
