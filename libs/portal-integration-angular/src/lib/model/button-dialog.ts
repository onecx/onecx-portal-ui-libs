import { Type } from '@angular/core'
import { PrimeIcon } from '../core/utils/primeicon.utils'

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
  icon?: PrimeIcon
  parameters?: Record<string, unknown>
}

export interface ButtonDialogConfig {
  primaryButtonDetails?: ButtonDialogButtonDetails
  secondaryButtonIncluded?: boolean
  secondaryButtonDetails?: ButtonDialogButtonDetails
}

export interface ButtonDialogData {
  config: ButtonDialogConfig
  component?: Type<any>
  componentData: any
}
