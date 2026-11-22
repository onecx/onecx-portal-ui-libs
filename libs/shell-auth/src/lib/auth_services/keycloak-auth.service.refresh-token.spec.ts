import { Injector } from '@angular/core'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

type CapturedKeycloakInstance = {
  init: jest.Mock
  login: jest.Mock
  updateToken: jest.Mock
}

const mockKeycloakInstances: CapturedKeycloakInstance[] = []

jest.mock('keycloak-js', () => {
  class Keycloak {
    init = jest.fn().mockResolvedValue(true)
    login = jest.fn().mockResolvedValue(undefined)
    updateToken = jest.fn().mockResolvedValue(true)

    constructor() {
      mockKeycloakInstances.push(this)
    }
  }
  return { __esModule: true, default: Keycloak }
})

const KC_TOKEN_LS = 'onecx_kc_token'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'

// Payload encodes to a base64url segment that contains '-' and '_' (RFC 4648 section 5).
const REFRESH_TOKEN_WITH_SPECIALS =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDAsInN1YiI6InVzZXItMSIsIm5hbWUiOiJab8OrIOKYgyA_Pj8ifQ.signature'
// Payload encodes to a standard base64url segment (no '-', no '_').
const REFRESH_TOKEN_VALID =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDAsInN1YiI6InVzZXItMSJ9.signature'
// Expired in the past (exp = 1970).
const REFRESH_TOKEN_EXPIRED = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEsInN1YiI6InVzZXItMSJ9.signature'
// Decodable payload (an empty object) that carries no numeric exp claim.
const REFRESH_TOKEN_WITHOUT_EXP = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.signature'

function buildService(): KeycloakAuthService {
  const configService = { getProperty: jest.fn(async () => 'value') }
  const injector = Injector.create([
    { provide: ConfigurationService, useValue: configService },
    { provide: KeycloakAuthService, useClass: KeycloakAuthService },
  ])
  return injector.get(KeycloakAuthService)
}

function storeTokens(refreshToken: string): void {
  localStorage.setItem(KC_TOKEN_LS, 'stored-token')
  localStorage.setItem(KC_ID_TOKEN_LS, 'stored-id-token')
  localStorage.setItem(KC_REFRESH_TOKEN_LS, refreshToken)
}

function firstInitOptions(): unknown {
  return mockKeycloakInstances[0]?.init.mock.calls[0]?.[0]
}

describe('KeycloakAuthService init stored refresh token handling', () => {
  let service: KeycloakAuthService

  beforeEach(() => {
    localStorage.clear()
    mockKeycloakInstances.length = 0
    service = buildService()
  })

  it('given a stored refresh token whose payload encodes to base64url containing _ and -, when init() runs, then the stored tokens are passed to keycloak.init', async () => {
    storeTokens(REFRESH_TOKEN_WITH_SPECIALS)

    await service.init()

    expect(firstInitOptions()).toMatchObject({
      token: 'stored-token',
      idToken: 'stored-id-token',
      refreshToken: REFRESH_TOKEN_WITH_SPECIALS,
    })
  })

  it('given a stored refresh token that is not a decodable jwt, when init() runs, then the stored tokens are removed and keycloak.init is called without tokens', async () => {
    storeTokens('not-a-jwt')

    await service.init()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
    expect(firstInitOptions()).toMatchObject({ token: undefined, idToken: undefined, refreshToken: undefined })
  })

  it('given a stored refresh token that decodes but has no numeric exp, when init() runs, then the stored tokens are removed', async () => {
    storeTokens(REFRESH_TOKEN_WITHOUT_EXP)

    await service.init()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
  })

  it('given a stored refresh token that is expired, when init() runs, then the stored tokens are removed', async () => {
    storeTokens(REFRESH_TOKEN_EXPIRED)

    await service.init()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
  })

  it('given a stored refresh token that is valid and not expired, when init() runs, then the stored tokens are passed to keycloak.init', async () => {
    storeTokens(REFRESH_TOKEN_VALID)

    await service.init()

    expect(firstInitOptions()).toMatchObject({
      token: 'stored-token',
      idToken: 'stored-id-token',
      refreshToken: REFRESH_TOKEN_VALID,
    })
  })
})
