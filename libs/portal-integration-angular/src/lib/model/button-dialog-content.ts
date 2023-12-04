import { EventEmitter, Type } from '@angular/core'

export interface ButtonDialogContent {
  component: Type<any>
  resultEmitter?: EventEmitter<any>
  mainButtonDetails?: ButtonDialogDetails
  sideButtonEnabled?: boolean
  sideButtonDetails?: ButtonDialogDetails
  data?: any
}

export interface ButtonDialogData {
  component: Type<any>
  mainButtonDetails: ButtonDialogDetails
  sideButtonEnabled: boolean
  sideButtonDetails: ButtonDialogDetails
  data: any
}

export interface ButtonDialogDetails {
  label: string
  icon: string
  closeDialog: boolean
  valueToEmit: any
}
