import {Endpoint} from './endpoint.model'

export interface Route {
    url?: string
    baseUrl?: string
    remoteEntryUrl?: string
    appId?: string
    productName?: string
    technology?: string
    exposedModule?: string
    pathMatch?: string
    remoteName?: string
    elementName?: string
    displayName?: string
    endpoints?: Array<Endpoint>
  }