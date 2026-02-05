import { IconClassType } from "./icon-type"

export interface OnecxIcon {
  name: string
  type: string
  body: string
  parent?: string | null
}


export interface IconRequested {
  type: 'IconRequested'
  name: string              // REAL icon name (mdi:xxx)
  classType: IconClassType
}

export interface IconsReceived {
  type: 'IconsReceived'
}

export type IconLoaderMessage = IconRequested | IconsReceived

