import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedSvcContainer, SvcContainer } from '../abstract/onecx-svc'

// Create a custom service container class that extends SvcContainer
export class CustomSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
  }
}
export class StartedCustomSvcContainer extends StartedSvcContainer {}
