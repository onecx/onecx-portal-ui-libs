export type RemoteComponentsInfo = { components: RemoteComponent[]; slots: Slot[] }

export type RemoteComponent = {
  name: string
  baseUrl: string
  remoteEntryUrl: string
  appId: string
  productName: string
  exposedModule: string
}

export type Slot = {
  name: string
  components: Array<string>
}
