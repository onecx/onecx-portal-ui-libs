import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

type KeycloakInitArgs = { silentCheckSsoRedirectUri?: string }
type KeycloakPrototype = { init: (options?: KeycloakInitArgs) => Promise<boolean> }

// keycloak-js is ESM and init() loads it both statically and via a dynamic import.
// A manual mock factory keeps jest from loading the real module and gives both the
// static and the dynamic import the same class, so the service's keycloak.init is
// observable through the prototype.
jest.mock('keycloak-js', () => {
  class MockKeycloak {
    readonly config: unknown
    constructor(config: unknown) {
      this.config = config
    }
    init(_options?: KeycloakInitArgs): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return { __esModule: true, default: MockKeycloak }
})

function baseConfig(): Record<string, string> {
  return {
    [CONFIG_KEY.KEYCLOAK_REALM]: 'onecx',
    [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'onecx-portal',
    [CONFIG_KEY.KEYCLOAK_URL]: 'https://keycloak.local',
  }
}

function insertBaseElement(href: string): void {
  const base = document.createElement('base')
  base.setAttribute('href', href)
  document.head.appendChild(base)
}

function removeBaseElement(): void {
  document.head.querySelector('base')?.remove()
}

function buildService(config: Record<string, string>): KeycloakAuthService {
  const injector = Injector.create({
    providers: [{ provide: ConfigurationService, useValue: { getProperty: jest.fn() } }, KeycloakAuthService],
  })
  const configService = injector.get(ConfigurationService)
  // Only getProperty is read by the code under test; resolve the keys it needs.
  jest.spyOn(configService, 'getProperty').mockImplementation(async (key) => config[key])
  return injector.get(KeycloakAuthService)
}

describe('KeycloakAuthService silent SSO redirect URI', () => {
  let mockInit: jest.SpyInstance
  let origin: string

  beforeEach(() => {
    localStorage.clear()
    const { default: Keycloak } = jest.requireMock<{ default: { prototype: KeycloakPrototype } }>('keycloak-js')
    mockInit = jest.spyOn(Keycloak.prototype, 'init').mockResolvedValue(true)
    origin = window.location.origin
  })

  afterEach(() => {
    removeBaseElement()
    mockInit.mockRestore()
  })

  function redirectUri(): string | undefined {
    const options = mockInit.mock.calls[0][0] as KeycloakInitArgs
    return options.silentCheckSsoRedirectUri
  }

  it('given a base href and silent SSO enabled, when init runs, then the redirect URI uses a single slash', async () => {
    insertBaseElement('/app/')
    const config = { ...baseConfig(), [CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO]: 'true' }
    const service = buildService(config)
    await service.init(config)
    expect(redirectUri()).toBe(`${origin}/app/assets/silent-check-sso.html`)
  })

  it('given no base element and silent SSO enabled, when init runs, then the redirect URI resolves against the document URL', async () => {
    const config = { ...baseConfig(), [CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO]: 'true' }
    const service = buildService(config)
    await expect(service.init(config)).resolves.toEqual(true)
    expect(redirectUri()).toBe(`${origin}/assets/silent-check-sso.html`)
  })

  it('given silent SSO disabled, when init runs, then the redirect URI is undefined', async () => {
    const config = { ...baseConfig(), [CONFIG_KEY.KEYCLOAK_ENABLE_SILENT_SSO]: 'false' }
    const service = buildService(config)
    await service.init(config)
    expect(redirectUri()).toBeUndefined()
  })
})
