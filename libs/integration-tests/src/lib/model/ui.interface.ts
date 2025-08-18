import { Environment } from 'testcontainers/build/types'

export interface UiDetails {
  appBaseHref: string
  appId: string
  productName: string
}

export interface CustomUiContainerInterface {
  image: string
  environments?: Environment
  networkAlias: string
  uiDetails: UiDetails
}
