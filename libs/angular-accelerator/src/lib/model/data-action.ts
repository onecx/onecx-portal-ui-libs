export type RouterLink = 
  | string
  | (() => string)
  | (() => Promise<string>)
  | Promise<string>

export interface DataAction {
  id?: string
  /**
   * Translation key of the action name. Required: it is the visible label or tooltip and the accessible name of the
   * action button (combined with the row label, e.g. "Edit: Product A"). Use a non-empty key.
   */
  labelKey: string
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
