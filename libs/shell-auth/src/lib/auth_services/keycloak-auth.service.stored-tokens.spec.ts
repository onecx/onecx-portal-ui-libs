import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import Keycloak from 'keycloak-js'
import { KeycloakAuthService } from './keycloak-auth.service'

type FakeKeycloak = {
  init: jest.Mock
  login: jest.Mock
  updateToken: jest.Mock
  authenticated?: boolean
  tokenParsed?: { exp?: number }
  token?: string
  onAuthError?: (errorData: unknown) => void
  onAuthLogout?: () => void
}

const fakeKeycloak: FakeKeycloak = { init: jest.fn(), login: jest.fn(), updateToken: jest.fn() }

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn(() => fakeKeycloak) }))

const KC_TOKEN_LS = 'onecx_kc_token'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'

function createService(): KeycloakAuthService {
  const configServiceStub = {
    getProperty: jest.fn(async (key: CONFIG_KEY): Promise<string | undefined> => {
      if (key === CONFIG_KEY.KEYCLOAK_CLIENT_ID) return 'client-id'
      if (key === CONFIG_KEY.KEYCLOAK_REALM) return 'realm'
      if (key === CONFIG_KEY.KEYCLOAK_URL) return 'https://keycloak.example.com'
      return undefined
    }),
  }
  return Injector.create({
    providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configServiceStub }],
  }).get(KeycloakAuthService)
}

function toRefreshToken(exp: number): string {
  return `header.${Buffer.from(JSON.stringify({ exp })).toString('base64')}.signature`
}

describe('KeycloakAuthService stored tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    fakeKeycloak.token = undefined
    fakeKeycloak.init.mockResolvedValue(true)
    fakeKeycloak.login.mockResolvedValue(undefined)
  })

  it('given a stored refresh token that has expired, when init runs, then the stored tokens are cleared and not passed to keycloak', async () => {
    localStorage.setItem(KC_TOKEN_LS, 'access-token')
    localStorage.setItem(KC_ID_TOKEN_LS, 'id-token')
    localStorage.setItem(KC_REFRESH_TOKEN_LS, toRefreshToken(1))

    await createService().init()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
    expect(fakeKeycloak.init).toHaveBeenCalledWith(
      expect.objectContaining({ token: undefined, idToken: undefined, refreshToken: undefined })
    )
  })

  it('given init ran, when keycloak reports an auth error, then the current token is persisted to local storage', async () => {
    await createService().init()
    fakeKeycloak.token = 'fresh-token'

    fakeKeycloak.onAuthError?.({ error: 'x' })

    expect(localStorage.getItem(KC_TOKEN_LS)).toBe('fresh-token')
  })

  it('given init ran, when keycloak reports a logout, then the stored tokens are cleared and a login is started', async () => {
    await createService().init()
    localStorage.setItem(KC_TOKEN_LS, 'stale-token')
    fakeKeycloak.login.mockClear()

    fakeKeycloak.onAuthLogout?.()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(fakeKeycloak.login).toHaveBeenCalledTimes(1)
  })

  it('given keycloak cannot be created, when init runs, then it rejects with an initialization error', async () => {
    jest.mocked(Keycloak).mockImplementationOnce(() => {
      throw new Error('cannot load')
    })

    await expect(createService().init()).rejects.toThrow('Could not load keycloak-js library')
  })

  it.each([
    ['with', { exp: 4102444800 }],
    ['without', undefined],
  ])(
    'given an authenticated user whose token has %s an expiry, when the token is updated, then keycloak refreshes it',
    async (_name, tokenParsed) => {
      const service = createService()
      await service.init()
      fakeKeycloak.authenticated = true
      fakeKeycloak.tokenParsed = tokenParsed
      fakeKeycloak.updateToken.mockResolvedValue(true)

      await expect(service.updateTokenIfNeeded()).resolves.toBe(true)

      expect(fakeKeycloak.updateToken).toHaveBeenCalledTimes(1)
    }
  )
})
