import { Type } from '@angular/core'
import { DialogButton, DialogInitiator } from '../services/portal-dialog.service'
import { PrimeIcon } from '../utils/primeicon.utils'

/**
 * PrimeNG button severity values matching PrimeNG's documented button severity options
 * PrimeNG does not publicly export a severity type for its button, so we define a local union type
 */
export type DialogButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'danger'
  | 'contrast'

/**
 * Object describing details for button rendering containing key for translation, optional icon and optional parameters for translation
 *
 * @example
 * "Cancel meeting" button with X icon
 * ```
 * // assume such translation is in the translation file
 * const translations = {
 *   MY_KEY = 'Cancel {{value}}'
 * }
 * const buttonDetails: ButtonDialogButtonDetails = {
 *   key: 'MY_KEY',
 *   icon: PrimeIcons.TIMES,
 *   parameters: {
 *     value: 'meeting'
 *   }
 * }
 * ```
 */
export interface ButtonDialogButtonDetails {
  key: string
  id?: string
  icon?: PrimeIcon
  parameters?: Record<string, unknown>
  tooltipKey?: string
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' | string | undefined
  /**
   * Optional PrimeNG button severity.
   * When omitted, the button renders with PrimeNG's default appearance (no explicit severity class).
   * Allowed values: 'primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger', 'contrast'
   */
  severity?: DialogButtonSeverity
}

export interface ButtonDialogCustomButtonDetails extends ButtonDialogButtonDetails {
  id: string
  alignment: 'right' | 'left'
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogButtonDetails
  secondaryButtonIncluded?: boolean
  secondaryButtonDetails?: ButtonDialogButtonDetails
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
  initiatorRef?: HTMLElement
  onCloseFocus?: DialogInitiator
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}
