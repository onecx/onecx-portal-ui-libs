export type RouterLink = string | ((data?: any) => string) | ((data?: any) => Promise<string>) | Promise<string>
export type RowActionUrl = string | ((data?: any) => string | undefined)

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
  callback?: (data: any) => void
  routerLink?: RouterLink
}
