export enum Technologies {
  Angular = 'Angular',
  WebComponentScript = 'WebComponentScript',
  WebComponentModule = 'WebComponentModule',
}

export type RemoteComponent = {
  name: string
  baseUrl: string
  remoteEntryUrl: string
  appId: string
  productName: string
  exposedModule: string
  remoteName: string
  technology: Technologies
}
