import { SvcDetails } from './service.model'

export interface SvcContainerInterface {
  image: string
  environments?: string[]
  networkAlias: string
  svcDetails: SvcDetails
}
