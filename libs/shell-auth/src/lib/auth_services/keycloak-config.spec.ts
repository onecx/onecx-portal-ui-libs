import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { getValidKeycloakConfig } from './keycloak-config'

const serviceWith = (values: Partial<Record<CONFIG_KEY, string>>): ConfigurationService =>
  ({ getProperty: jest.fn(async (key: CONFIG_KEY) => values[key]) }) as unknown as ConfigurationService

describe('getValidKeycloakConfig', () => {
  describe('given a complete configuration', () => {
    it('when requested, then it returns url, clientId and realm', async () => {
      const service = serviceWith({
        [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'client',
        [CONFIG_KEY.KEYCLOAK_REALM]: 'realm',
        [CONFIG_KEY.KEYCLOAK_URL]: 'https://kc',
      })
      await expect(getValidKeycloakConfig(service)).resolves.toEqual({
        url: 'https://kc',
        clientId: 'client',
        realm: 'realm',
      })
    })
  })

  describe('given no url is configured', () => {
    it('when requested, then the url falls back to an empty string', async () => {
      const service = serviceWith({ [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'client', [CONFIG_KEY.KEYCLOAK_REALM]: 'realm' })
      await expect(getValidKeycloakConfig(service)).resolves.toEqual({ url: '', clientId: 'client', realm: 'realm' })
    })
  })

  describe('given the clientId is missing', () => {
    it('when requested, then it rejects mentioning clientId', async () => {
      await expect(getValidKeycloakConfig(serviceWith({ [CONFIG_KEY.KEYCLOAK_REALM]: 'realm' }))).rejects.toThrow(
        'missing clientId'
      )
    })
  })

  describe('given the realm is missing', () => {
    it('when requested, then it rejects mentioning realm', async () => {
      await expect(getValidKeycloakConfig(serviceWith({ [CONFIG_KEY.KEYCLOAK_CLIENT_ID]: 'client' }))).rejects.toThrow(
        'missing realm'
      )
    })
  })
})
