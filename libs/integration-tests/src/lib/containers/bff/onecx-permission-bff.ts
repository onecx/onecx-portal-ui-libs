import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class PermissionBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-permission')
    this.withNetworkAliases('onecx-permission-bff')
  }
}

export class StartedPermissionBffContainer extends StartedBffContainer {}
