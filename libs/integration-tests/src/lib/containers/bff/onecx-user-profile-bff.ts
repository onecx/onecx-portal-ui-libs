import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class UserProfileBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-user-profile')
    this.withNetworkAliases('onecx-user-profile-bff')
  }
}

export class StartedUserProfileBffContainer extends StartedBffContainer {}
