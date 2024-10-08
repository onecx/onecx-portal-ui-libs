export interface LocationState {
  url: string
  isFirst: boolean
  history: string[]
}
export interface OneCxState {
  location?: LocationState | undefined
}
