import { TestBed } from '@angular/core/testing'
import { ConfigurationService, CONFIG_KEY } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

const mockKeycloakConstructor = jest.fn()

jest.mock('keycloak-js', () => ({
  __esModule: true,
  default: mockKeycloakConstructor,
}))

describe('KeycloakAuthService (COMPLETE)', () => {
  let service: KeycloakAuthService
  let configValues: Partial<Record<CONFIG_KEY, string>>

  const createMockKeycloak = () =>
  ({
    authenticated: true,
    token: 'access-token',
    idToken: 'id-token',
    refreshToken: 'refresh-token',

    onTokenExpired: undefined,
    onAuthRefreshError: undefined,
    onAuthError: undefined,
    onAuthLogout: undefined,
    onAuthRefreshSuccess: undefined,
    onAuthSuccess: undefined,
    onActionUpdate: undefined,
    onReady: undefined,

    init: jest.fn().mockResolvedValue(true),
    updateToken: jest.fn().mockResolvedValue(true),
    login: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  } as any)

  beforeEach(() => {
    jest.resetAllMocks()

    configValues = {
      [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'client',
      [CONFIG_KEY.KEYCLOAK_REALM]: 'realm',
      [CONFIG_KEY.KEYCLOAK_URL]: 'http://kc',
      [CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED]: 'false',
      [CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED]: 'false',
    }

    TestBed.configureTestingModule({
      providers: [
        KeycloakAuthService,
        {
          provide: ConfigurationService,
          useValue: {
            getProperty: jest.fn((k: CONFIG_KEY) =>
              Promise.resolve(configValues[k])
            ),
          },
        },
      ],
    })

    service = TestBed.inject(KeycloakAuthService)

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  /* ---------- INIT ---------- */

  it('initializes keycloak with defaults', async () => {
    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(kc.init).toHaveBeenCalled()
  })

  it('passes timeSkew to keycloak.init', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_TIME_SKEW] = '5'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(kc.init).toHaveBeenCalledWith(
      expect.objectContaining({ timeSkew: 5 })
    )
  })

  /* ---------- STORED TOKENS ---------- */

  it('uses stored valid tokens', async () => {
    ; (localStorage.getItem as jest.Mock).mockImplementation((k: string) => {
      if (k === 'onecx_kc_refreshToken')
        return 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.test'
      if (k === 'onecx_kc_token') return 'stored-token'
      if (k === 'onecx_kc_idToken') return 'stored-id'
      return null
    })

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(kc.init).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'stored-token',
        idToken: 'stored-id',
        refreshToken: expect.any(String),
      })
    )
  })

  it('clears expired stored tokens', async () => {
    const expired =
      'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMDB9.test'

      ; (localStorage.getItem as jest.Mock).mockReturnValue(expired)

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(localStorage.removeItem).toHaveBeenCalledWith('onecx_kc_token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('onecx_kc_idToken')
    expect(localStorage.removeItem).toHaveBeenCalledWith('onecx_kc_refreshToken')
  })

  /* ---------- EVENTS ---------- */

  it('refreshes token on expiry when enabled', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED] = 'true'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    kc.onTokenExpired?.()

    expect(kc.updateToken).toHaveBeenCalled()
  })

  it('logs in on refresh error when enabled', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_ON_AUTH_REFRESH_ERROR_ENABLED] = 'true'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    kc.onAuthRefreshError?.()

    expect(kc.login).toHaveBeenCalled()
  })

  it('writes tokens to localStorage on ready', async () => {
    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    kc.onReady?.()

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'onecx_kc_token',
      kc.token
    )
  })

  /* ---------- UPDATE TOKEN ---------- */

  it('passes minValidity when configured', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_UPDATE_TOKEN_MIN_VALIDITY] = '30'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    await service.updateTokenIfNeeded()

    expect(kc.updateToken).toHaveBeenCalledWith(30)
  })

  it('calls updateToken without minValidity when not configured', async () => {
    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    await service.updateTokenIfNeeded()

    expect(kc.updateToken).toHaveBeenCalledWith(undefined)
  })

  it('forces login when not authenticated', async () => {
    const kc = createMockKeycloak()
    kc.authenticated = false
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})
    await service.updateTokenIfNeeded()

    expect(kc.login).toHaveBeenCalled()
  })

  /* ---------- SILENT SSO ---------- */

  it('configures silent SSO with base "/"', async () => {
    const base = document.createElement('base')
    base.href = '/'
    document.head.appendChild(base)

    configValues[CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO] = 'true'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(kc.init).toHaveBeenCalledWith(
      expect.objectContaining({
        silentCheckSsoRedirectUri: expect.stringContaining(
          '/assets/silent-check-sso.html'
        ),
      })
    )


    base.remove()
  })

  it('configures silent SSO without base tag', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO] = 'true'

    const kc = createMockKeycloak()
    mockKeycloakConstructor.mockReturnValue(kc)

    await service.init({})

    expect(kc.init).toHaveBeenCalled()
  })

  /* ---------- MISC ---------- */

  it('logs out', () => {
    const kc = createMockKeycloak()
    service['keycloak'] = kc

    service.logout()

    expect(kc.logout).toHaveBeenCalled()
  })

  it('returns auth provider name', () => {
    expect(service.getAuthProviderName()).toBe('keycloak-auth')
  })

  it('hasRole returns false', () => {
    expect(service.hasRole('admin')).toBe(false)
  })

  it('throws on missing required config', async () => {
    configValues[CONFIG_KEY.KEYCLOAK_CLIENT_ID] = undefined as any
    await expect(service.init({})).rejects.toThrow()
  })
})
