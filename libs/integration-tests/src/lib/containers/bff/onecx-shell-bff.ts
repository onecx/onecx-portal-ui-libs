import { BffContainer, StartedBffContainer } from '../basic/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ShellBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-shell').withNetworkAliases('onecx-shell-bff')
  }
}

export class StartedShellBffContainer extends StartedBffContainer {}
