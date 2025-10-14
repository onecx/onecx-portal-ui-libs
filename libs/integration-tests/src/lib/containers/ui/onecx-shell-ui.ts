import { getCommonEnvironmentVariables } from '../../utils/common-env.utils'
import { StartedUiContainer, UiContainer } from '../basic/onecx-ui'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ShellUiContainer extends UiContainer {
  private client_user_id = 'onecx-shell-ui-client'

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
      CLIENT_USER_ID: `${this.client_user_id}`,
    })
      .withEnvironment(getCommonEnvironmentVariables(this.keycloakContainer))
      .withNetworkAliases('onecx-shell-ui')
      .withAppBaseHref('/onecx-shell/')
  }

  override async start(): Promise<StartedShellUiContainer> {
    const startedUiContainer = await super.start()
    return new StartedShellUiContainer(startedUiContainer, this.client_user_id)
  }
}

export class StartedShellUiContainer extends StartedUiContainer {
  constructor(
    startedUiContainer: StartedUiContainer,
    private clientUserId: string
  ) {
    super(
      startedUiContainer.getStartedTestContainer(),
      startedUiContainer.getDetails(),
      startedUiContainer.getNetworkAliases(),
      startedUiContainer.getPort()
    )
  }

  getClientUserId(): string {
    return this.clientUserId
  }
}
