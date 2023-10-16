export interface MfePortalRegistration {
  portalName: string
  tenantId?: string
}

export enum ModuleType {
  Angular = 'ANGULAR',
  Webcomponent = 'WEBCOMPONENT',
}

export interface MicrofrontendDTO {
  id?: string
  remoteEntry?: string
  remoteName?: string
  exposedModule?: string
  displayName?: string
  moduleType?: ModuleType
  wcTagName?: string
  appId?: string
  appVersion?: string
  note?: string
  contact?: string
  remoteBaseUrl?: string
  portals?: MfePortalRegistration[]
}
