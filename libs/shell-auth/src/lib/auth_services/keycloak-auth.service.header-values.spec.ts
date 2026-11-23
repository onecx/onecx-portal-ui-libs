import { Injector } from '@angular/core'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'

jest.mock('keycloak-js', () => {
  const KeycloakMock = jest.fn().mockImplementation(() => ({
    token: 'abc',
    idToken: 'id-abc',
    authenticated: true,
    tokenParsed: {},
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn().mockResolvedValue(true),
    updateToken: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  }))
  return { __esModule: true, default: KeycloakMock }
})

describe('KeycloakAuthService.getHeaderValues', () => {
  const configurationValues: Partial<Record<CONFIG_KEY, string>> = {
    [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'test-client',
    [CONFIG_KEY.KEYCLOAK_REALM]: 'test-realm',
  }
  const configurationStub = {
    getProperty: jest.fn((key: CONFIG_KEY) => Promise.resolve(configurationValues[key])),
  }

  const createService = () =>
    Injector.create({
      providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configurationStub }],
    }).get(KeycloakAuthService)

  it('given no access token is available when getHeaderValues is called then the result has no Authorization entry', () => {
    const service = createService()
    const headerValues = service.getHeaderValues()
    expect(headerValues).toEqual({ 'apm-principal-token': '' })
  })

  it('given an access token abc is available when getHeaderValues is called then the result contains the Authorization header and the id token', async () => {
    const service = createService()
    await service.init()
    const headerValues = service.getHeaderValues()
    expect(headerValues).toEqual({ 'apm-principal-token': 'id-abc', Authorization: 'Bearer abc' })
  })
})
