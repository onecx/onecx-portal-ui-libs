import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { HealthCheck } from 'testcontainers/build/types'
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
  environments?: string[]
  networkAlias: string
  healtCheck?: HealthCheck
  svcDetails: SvcDetails
}
