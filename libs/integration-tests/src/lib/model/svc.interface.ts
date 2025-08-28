import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { Environment, HealthCheck } from 'testcontainers/build/types'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'

export interface SvcDetails {
  databaseUsername: string
  databasePassword: string
}

export interface SvcContainerServices {
  databaseContainer?: StartedOnecxPostgresContainer
  keycloakContainer: StartedOnecxKeycloakContainer
}

export interface SvcContainerInterface {
  image: string
  environments?: Environment
  networkAlias: string
  healthCheck?: HealthCheck
  svcDetails: SvcDetails
}
