import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class CustomBffContainer extends BffContainer {
  constructor(image: string, keycloak: StartedOnecxKeycloakContainer) {
    super(image, keycloak)
  }
}

export class StartedCustomBffContainer extends StartedBffContainer {}
