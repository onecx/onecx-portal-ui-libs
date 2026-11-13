export type RouterLink = string | ((data?: any) => string) | ((data?: any) => Promise<string>) | Promise<string>
/**
 * Internal Angular router link, optionally resolved per row. Relative values (including './' and '../')
 * resolve against the activated route; a leading '/' resolves from the Angular router root.
 * Use relative values to retain workspace/MFE route prefixes. External URLs are not supported.
 * Returning undefined hides the action.
 */
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
