import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'

/**
 * Returns the common environment variables for UI containers, based on the provided Keycloak container.
 */
export function getCommonEnvironmentVariables(
  keycloakContainer: StartedOnecxKeycloakContainer
): Record<string, string> {
  return {
    KC_REALM: `${keycloakContainer.getRealm()}`,
    QUARKUS_OIDC_AUTH_SERVER_URL: `http://${keycloakContainer.getNetworkAliases()[0]}:${keycloakContainer.getPort()}/realms/${keycloakContainer.getRealm()}`,
    QUARKUS_OIDC_TOKEN_ISSUER: `http://${keycloakContainer.getNetworkAliases()[0]}/realms/${keycloakContainer.getRealm()}`,
    TKIT_SECURITY_AUTH_ENABLED: 'false',
    TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
    TKIT_LOG_JSON_ENABLED: 'false',
    TKIT_OIDC_HEALTH_ENABLED: 'false',
  }
}
