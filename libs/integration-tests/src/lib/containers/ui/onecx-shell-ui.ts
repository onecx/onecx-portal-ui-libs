import { getCommonEnvironmentVariables } from '../../utils/common-env'
import { StartedUiContainer, UiContainer } from '../abstract/onecx-ui'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ShellUiContainer extends UiContainer {
  constructor(
    image: string,
    private keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image)
    this.withEnvironment({
      ONECX_PERMISSIONS_ENABLED: 'true',
      ONECX_PERMISSIONS_CACHE_ENABLED: 'false',
      ONECX_PERMISSIONS_PRODUCT_NAME: 'onecx-shell',
      KEYCLOAK_URL: `http://${keycloakContainer.getNetworkAliases()[0]}`,
      ONECX_VAR_REMAP: 'KEYCLOAK_REALM=KC_REALM;KEYCLOAK_CLIENT_ID=CLIENT_USER_ID',
      CLIENT_USER_ID: 'onecx-shell-ui-client',
    })
      .withEnvironment(getCommonEnvironmentVariables(this.keycloakContainer))
      .withNetworkAliases('onecx-shell-ui')
      .withAppBaseHref('/onecx-shell/')
  }
}

export class StartedShellUiContainer extends StartedUiContainer {}
