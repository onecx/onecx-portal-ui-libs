import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { StartedUiContainer } from '../containers/abstract/onecx-ui'
import { StartedSvcContainer } from '../containers/abstract/onecx-svc'
import { StartedBffContainer } from '../containers/abstract/onecx-bff'
import { StartedCustomSvcContainer } from '../containers/svc/custom-svc'
import { StartedCustomBffContainer } from '../containers/bff/custom-bff'
import { StartedCustomUiContainer } from '../containers/ui/custom-ui'

export type AllowedContainerTypes =
  | StartedOnecxPostgresContainer
  | StartedOnecxKeycloakContainer
  | StartedSvcContainer
  | StartedBffContainer
  | StartedUiContainer
  | StartedCustomSvcContainer
  | StartedCustomBffContainer
  | StartedCustomUiContainer
