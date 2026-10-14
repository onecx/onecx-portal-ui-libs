import { Type } from '@angular/core'
import { DialogButton, DialogInitiator } from '../services/portal-dialog.service'
import { OptimusIcon } from '../utils/optimus-icon.utils'

/**
 * Optimus button severity values matching Optimus's documented button severity options.
 * Optimus uses 'warn' (not 'warning') as the severity value for warning buttons.
 */
export type DialogButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
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
 *   icon: OpenngIcons.TIMES,
 *   parameters: {
 *     value: 'meeting'
 *   }
 * }
 * ```
 */
export interface ButtonDialogButtonDetails {
  key: string
  id?: string
  icon?: OptimusIcon
  parameters?: Record<string, unknown>
  tooltipKey?: string
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' | string | undefined
  /**
   * Optional Optimus button severity.
   * When omitted, the button renders with Optimus's default appearance (no explicit severity class).
   * Allowed values: 'primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'
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
