import { EventEmitter, Type } from '@angular/core'

export interface ButtonDialogDetails {
  label: string
  icon?: string
  valueToEmit?: any
}

export interface ButtonDialogDynamicDialogDetails extends ButtonDialogDetails {
  closeDialog?: boolean
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogDetails | ButtonDialogDynamicDialogDetails
  secondaryButtonEnabled?: boolean
  secondaryButtonDetails?: ButtonDialogDetails | ButtonDialogDynamicDialogDetails
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}

export interface ButtonDialogDynamicDialogConfig {
  config?: ButtonDialogConfig
  component?: Type<any>
  componentData?: any
  emitter?: EventEmitter<any>
}
