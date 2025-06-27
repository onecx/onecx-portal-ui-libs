import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ThemeBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-iam')
    this.withNetworkAliases('onecx-iam-bff')
  }
}

export class StartedIamBffContainer extends StartedBffContainer {}
