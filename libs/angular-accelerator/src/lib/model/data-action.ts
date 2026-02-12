export type RouterLink = 
  | string
  | (() => string)
  | (() => Promise<string>)
  | Promise<string>

export interface DataAction {
  id?: string
  labelKey?: string
  icon?: string
  permission: string | string[]
  classes?: string[]
  disabled?: boolean
  actionVisibleField?: string
  actionEnabledField?: string
  showAsOverflow?: boolean
  callback: (data: any) => void
  routerLink?: RouterLink
}
