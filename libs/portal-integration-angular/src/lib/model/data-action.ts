export interface DataAction {
  labelKey?: string
  icon?: string
  permission: string
  classes?: string[]
  disabled?: boolean
  callback: (data: any) => void
}
