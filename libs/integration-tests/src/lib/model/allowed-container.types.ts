import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { StartedUiContainer } from '../containers/abstract/onecx-ui'
import { StartedSvcContainer } from '../containers/abstract/onecx-svc'
import { StartedBffContainer } from '../containers/abstract/onecx-bff'

export type AllowedContainerTypes =
  | StartedOnecxPostgresContainer
  | StartedOnecxKeycloakContainer
  | StartedSvcContainer
  | StartedBffContainer
  | StartedUiContainer
