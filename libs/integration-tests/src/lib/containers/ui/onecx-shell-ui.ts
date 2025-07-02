import { StartedUiContainer, UiContainer } from '../abstract/onecx-ui'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ShellUiContainer extends UiContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image)
    this.withEnvironment({
      ONECX_PERMISSIONS_ENABLED: 'true',
      ONECX_PERMISSIONS_CACHE_ENABLED: 'false',
      ONECX_PERMISSIONS_PRODUCT_NAME: 'onecx-shell',
      APP_BASE_HREF: '/onecx-shell/',
      KEYCLOAK_URL: `http://${keycloakContainer.getNetworkAliases()[0]}`,
      ONECX_VAR_REMAP: 'KEYCLOAK_REALM=KC_REALM;KEYCLOAK_CLIENT_ID=CLIENT_USER_ID',
      CLIENT_USER_ID: 'onecx-shell-ui-client',
      KC_REALM: `${this.keycloakContainer?.getRealm()}`,
      QUARKUS_OIDC_AUTH_SERVER_URL: `http://${this.keycloakContainer?.getNetworkAliases()[0]}:${this.keycloakContainer?.getPort()}/realms/${this.keycloakContainer?.getRealm()}`,
      QUARKUS_OIDC_TOKEN_ISSUER: `http://${this.keycloakContainer?.getNetworkAliases()[0]}/realms/${this.keycloakContainer?.getRealm()}`,
      TKIT_SECURITY_AUTH_ENABLED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
      TKIT_LOG_JSON_ENABLED: 'false',
      TKIT_OIDC_HEALTH_ENABLED: 'false',
    })
    this.withNetworkAliases('onecx-shell-ui')
  }
}

export class StartedShellUiContainer extends StartedUiContainer {}
