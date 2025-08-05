import { BffDetails } from './bff.model'

export interface BffContainerInterface {
  image: string
  environments?: string[]
  networkAlias: string
  bffDetails: BffDetails
}
