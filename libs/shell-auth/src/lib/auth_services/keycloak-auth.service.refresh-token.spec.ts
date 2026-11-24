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

// The test tokens are built at runtime (not hardcoded literals) so no secret-looking token appears in the source.
const JWT_HEADER_SEGMENT = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }), 'utf8').toString('base64url')
const JWT_SIGNATURE_SEGMENT = 'signature'

function base64UrlSegment(payloadJson: string): string {
  return Buffer.from(payloadJson, 'utf8').toString('base64url')
}

function buildJwt(payload: Record<string, unknown> | string): string {
  return `${JWT_HEADER_SEGMENT}.${base64UrlSegment(typeof payload === 'string' ? payload : JSON.stringify(payload))}.${JWT_SIGNATURE_SEGMENT}`
}

// Payload encodes to a base64url segment that contains '_' (RFC 4648 section 5).
const REFRESH_TOKEN_WITH_SPECIALS = buildJwt({ exp: 4102444800, sub: 'user-1', name: 'Zoë ☃ ?>?' })
// Valid, unexpired token whose payload encodes to a plain base64url segment (no '-', no '_').
const REFRESH_TOKEN_VALID = buildJwt({ exp: 4102444800, sub: 'user-1' })
// Expired in the past (exp = 1970).
const REFRESH_TOKEN_EXPIRED = buildJwt({ exp: 1, sub: 'user-1' })
// Decodable payload (an empty object) that carries no numeric exp claim.
const REFRESH_TOKEN_WITHOUT_EXP = buildJwt({})
// Payload is not valid JSON, so the stored value cannot be a decodable jwt.
const REFRESH_TOKEN_INVALID_JSON = buildJwt('{not-json')
// Exactly two dot-separated segments: a valid payload but the wrong JWT segment count.
const REFRESH_TOKEN_MISSING_SEGMENT = `${JWT_HEADER_SEGMENT}.${base64UrlSegment(JSON.stringify({ exp: 4102444800, sub: 'user-1' }))}`

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

describe('KeycloakAuthService init with a reusable stored refresh token', () => {
  let service: KeycloakAuthService

  beforeEach(() => {
    localStorage.clear()
    mockKeycloakInstances.length = 0
    service = buildService()
  })

  it('given a stored refresh token whose payload encodes to base64url containing _, when init() runs, then the stored tokens are passed to keycloak.init', async () => {
    storeTokens(REFRESH_TOKEN_WITH_SPECIALS)

    await service.init()

    expect(firstInitOptions()).toMatchObject({
      token: 'stored-token',
      idToken: 'stored-id-token',
      refreshToken: REFRESH_TOKEN_WITH_SPECIALS,
    })
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

describe('KeycloakAuthService init with an unusable stored refresh token', () => {
  let service: KeycloakAuthService

  beforeEach(() => {
    localStorage.clear()
    mockKeycloakInstances.length = 0
    service = buildService()
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

  it('given a stored refresh token that is not a three-segment jwt, when init() runs, then the stored tokens are removed', async () => {
    storeTokens(REFRESH_TOKEN_MISSING_SEGMENT)

    await service.init()

    expect(localStorage.getItem(KC_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_ID_TOKEN_LS)).toBeNull()
    expect(localStorage.getItem(KC_REFRESH_TOKEN_LS)).toBeNull()
  })

  it('given a stored refresh token whose payload is not valid json, when init() runs, then the stored tokens are removed', async () => {
    storeTokens(REFRESH_TOKEN_INVALID_JSON)

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
})
