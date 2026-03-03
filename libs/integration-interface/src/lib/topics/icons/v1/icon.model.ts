export interface IconCache {
  name: string
  type: string
  body: string
  parent?: string | null
}

export type IconClassType = 'svg' | 'background' | 'background-before'


export interface IconRequested {
  type: 'IconRequested'
  name: string              // REAL icon name (mdi:xxx)
}

export interface IconsReceived {
  type: 'IconsReceived'
}

export type Icon = IconRequested | IconsReceived

