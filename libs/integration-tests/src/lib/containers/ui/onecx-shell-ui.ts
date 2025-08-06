import { getCommonEnvironmentVariables } from '../../utils/common-env'
import { StartedUiContainer, UiContainer } from '../abstract/onecx-ui'
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
    private startedUiContainer: StartedUiContainer,
    private clientUserId: string
  ) {
    super(
      startedUiContainer['startedTestContainer'], // Access protected property
      startedUiContainer['details'], // Access private property via bracket notation
      startedUiContainer.getNetworkAliases(),
      startedUiContainer.getPort()
    )
  }

  getClientUserId(): string {
    return this.clientUserId
  }

  // Delegate all other methods to the wrapped container
  override getAppBaseHref(): string {
    return this.startedUiContainer.getAppBaseHref()
  }

  override getAppId(): string {
    return this.startedUiContainer.getAppId()
  }

  override getProductName(): string {
    return this.startedUiContainer.getProductName()
  }
}
