import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import type { KeycloakServerConfig } from 'keycloak-js'

export const getValidKeycloakConfig = async (configService: ConfigurationService): Promise<KeycloakServerConfig> => {
  const clientId = await configService.getProperty(CONFIG_KEY.KEYCLOAK_CLIENT_ID)
  if (!clientId) {
    throw new Error('Invalid KC config, missing clientId')
  }
  const realm = await configService.getProperty(CONFIG_KEY.KEYCLOAK_REALM)
  if (!realm) {
    throw new Error('Invalid KC config, missing realm')
  }
  const url = (await configService.getProperty(CONFIG_KEY.KEYCLOAK_URL)) ?? ''
  return {
    url,
    clientId,
    realm,
  }
}
