import { Environment, HealthCheck } from 'testcontainers/build/types'

export interface BffDetails {
  permissionsProductName: string
}

export interface BffContainerInterface {
  image: string
  environments?: Environment
  networkAlias: string
  healthCheck?: HealthCheck
  bffDetails: BffDetails
}
