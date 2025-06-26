import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'

export interface SvcDetails {
  databaseUsername: string
  databasePassword: string
}

export interface SvcContainerServices {
  databaseContainer?: StartedOnecxPostgresContainer
  keycloakContainer: StartedOnecxKeycloakContainer
}
