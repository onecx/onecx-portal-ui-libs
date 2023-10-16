import { LoadRemoteModuleOptions } from '@angular-architects/module-federation'
export type MicroFrontend = LoadRemoteModuleOptions & {
  id: string
  displayName: string
  appId?: string
  appVersion?: string
  lastUpdate?: Date
  remoteBaseUrl: string
  remoteName: string
  moduleType: string
  pathMatch: 'full' | 'prefix'
}

export interface MicrofrontendRegistration {
  creationDate?: string
  creationUser?: string
  modificationDate?: string
  modificationUser?: string
  id?: string
  appId?: string
  mfeId: string
  baseUrl: string
}
