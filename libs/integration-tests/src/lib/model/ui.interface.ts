import { HealthCheck } from 'testcontainers/build/types'

export interface UiDetails {
  appBaseHref: string
  appId: string
  productName: string
}

export interface UiContainerInterface {
  image: string
  environments?: string[]
  networkAlias: string
  healtCheck?: HealthCheck
  uiDetails: UiDetails
}
