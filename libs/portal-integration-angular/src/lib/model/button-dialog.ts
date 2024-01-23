import { Type } from '@angular/core'

export interface ButtonDialogButtonDetails {
  key: string
  icon?: string
  parameters?: Record<string, unknown>
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogButtonDetails
  secondaryButtonEnabled?: boolean
  secondaryButtonDetails?: ButtonDialogButtonDetails
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}
