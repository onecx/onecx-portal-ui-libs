import { UiContainer, StartedUiContainer } from '../abstract/onecx-ui'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class CustomUiContainer extends UiContainer {
  constructor(image: string) {
    super(image)
  }
}
export class StartedCustomUiContainer extends StartedUiContainer {}
