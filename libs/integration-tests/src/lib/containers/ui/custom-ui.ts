import { UiContainer, StartedUiContainer } from '../abstract/onecx-ui'

export class CustomUiContainer extends UiContainer {
  constructor(image: string) {
    super(image)
  }
}
export class StartedCustomUiContainer extends StartedUiContainer {}
