export interface Manifest {
  id: string
  name: string
  metaData: MetaData
  shared: Shared[]
  remotes: any[]
  exposes: Expose[]
}

export interface MetaData {
  name: string
  type: string
  buildInfo: BuildInfo
  remoteEntry: RemoteEntry
  types: Types
  globalName: string
  pluginVersion: string
  prefetchInterface: boolean
  publicPath: string
}

export interface BuildInfo {
  buildVersion: string
  buildName: string
}

export interface RemoteEntry {
  name: string
  path: string
  type: string
}

export interface Types {
  path: string
  name: string
  zip: string
  api: string
}

export interface Shared {
  id: string
  name: string
  version: string
  singleton: boolean
  requiredVersion: string
  assets: Assets
}

export interface Expose {
  id: string
  name: string
  assets: Assets
  path: string
}

export interface Assets {
  js: JsAssets
  css: CssAssets
}

export interface JsAssets {
  async: string[]
  sync: string[]
}

export interface CssAssets {
  async: string[]
  sync: string[]
}
