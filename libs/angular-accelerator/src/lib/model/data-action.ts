export interface DataAction {
  id?: string
  labelKey?: string
  icon?: string
  permission: string
  classes?: string[]
  disabled?: boolean
  actionVisibleField?: string
  actionEnabledField?: string
  callback: (data: any) => void
}
