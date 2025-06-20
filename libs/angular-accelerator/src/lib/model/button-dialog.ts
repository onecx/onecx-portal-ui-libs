import { Type } from '@angular/core'
import { DialogButton } from '../services/portal-dialog.service'
import { PrimeIcon } from '../utils/primeicon.utils'

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
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}
