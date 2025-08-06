import { HealthCheck } from 'testcontainers/build/types'

export interface BffDetails {
  permissionsProductName: string
}

export interface BffContainerInterface {
  image: string
  environments?: string[]
  networkAlias: string
  healtCheck?: HealthCheck
  bffDetails: BffDetails
}
