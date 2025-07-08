import { StartedSvcContainer, SvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class DummySvcContainer extends SvcContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, { keycloakContainer })
    this.createDatabaseAtStart(false)
    this.withNetworkAliases('onecx-dummy-svc')
  }
}

export class StartedDummySvcContainer extends StartedSvcContainer {}
