import { UiDetails } from './ui.model'

export interface UiContainerInterface {
  image: string
  environments?: string[]
  networkAlias: string
  uiDetails: UiDetails
}
