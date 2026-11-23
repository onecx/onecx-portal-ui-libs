import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

jest.mock('keycloak-js', () => {
  const init = jest.fn()
  const login = jest.fn()
  return { __esModule: true, default: jest.fn(() => ({ init, login })) }
})

const keycloakModule = jest.requireMock('keycloak-js') as { default: jest.Mock }

const createFixture = () => {
  // The factory returns a stable object, so every `new Keycloak(...)` shares the same jest.fn instances.
  const keycloak = new keycloakModule.default() as unknown as { init: jest.Mock; login: jest.Mock }
  const configServiceStub = {
    getProperty: jest.fn(async (key: CONFIG_KEY): Promise<string | undefined> => {
      if (key === CONFIG_KEY.KEYCLOAK_CLIENT_ID) return 'client-id'
      if (key === CONFIG_KEY.KEYCLOAK_REALM) return 'realm'
      if (key === CONFIG_KEY.KEYCLOAK_URL) return 'https://keycloak.example.com'
      return undefined
    }),
  }
  const service = Injector.create({
    providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configServiceStub }],
  }).get(KeycloakAuthService)
  return { keycloak, service }
}

describe('KeycloakAuthService.init, given keycloak init rejects or resolves false', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('when init runs, then login is called exactly once and init resolves true', async () => {
    const { keycloak, service } = createFixture()
    keycloak.init.mockRejectedValue(new Error('init failed'))
    keycloak.login.mockResolvedValue(undefined)

    const result = await service.init()

    expect(keycloak.login).toHaveBeenCalledTimes(1)
    expect(keycloak.login).toHaveBeenCalledWith(undefined)
    expect(result).toBe(true)
  })

  it('when init runs, then login is called once and init resolves true', async () => {
    const { keycloak, service } = createFixture()
    keycloak.init.mockResolvedValue(false)
    keycloak.login.mockResolvedValue(undefined)

    const result = await service.init()

    expect(keycloak.login).toHaveBeenCalledTimes(1)
    expect(keycloak.login).toHaveBeenCalledWith(undefined)
    expect(result).toBe(true)
  })
})

describe('KeycloakAuthService.init, given keycloak init resolves true or login rejects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('when init runs, then login is not called and init resolves true', async () => {
    const { keycloak, service } = createFixture()
    keycloak.init.mockResolvedValue(true)

    const result = await service.init()

    expect(keycloak.login).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('when init runs, then init rejects with the login error', async () => {
    const { keycloak, service } = createFixture()
    const loginError = new Error('login failed')
    keycloak.init.mockRejectedValue(new Error('init failed'))
    keycloak.login.mockRejectedValue(loginError)

    const promise = service.init()

    await expect(promise).rejects.toBe(loginError)
  })
})

describe('KeycloakAuthService.init options', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('given no silent sso config, when init runs, then options carry the stored tokens and time skew', async () => {
    const { keycloak, service } = createFixture()
    keycloak.init.mockResolvedValue(true)

    await service.init()

    expect(keycloak.init.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: undefined,
        idToken: undefined,
        refreshToken: undefined,
        token: undefined,
        timeSkew: undefined,
      })
    )
  })

  it('given a stored refresh token is valid, when init runs, then options reuse the stored tokens', async () => {
    const now = Date.now()
    const refreshToken = `.${Buffer.from(JSON.stringify({ exp: Math.floor(now / 1000) + 3600 })).toString('base64')}`
    localStorage.setItem('onecx_kc_token', 'access-token')
    localStorage.setItem('onecx_kc_idToken', 'id-token')
    localStorage.setItem('onecx_kc_refreshToken', refreshToken)
    const { keycloak, service } = createFixture()
    keycloak.init.mockResolvedValue(true)

    await service.init()

    expect(keycloak.init.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        token: 'access-token',
        idToken: 'id-token',
        refreshToken,
      })
    )
  })
})
