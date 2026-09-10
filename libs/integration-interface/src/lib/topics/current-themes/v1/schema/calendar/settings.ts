import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Calendar component settings shape.
 */
export const calendarSettingsShape = z.object({
  unstyled: withRef(z.boolean()).optional(),
  inputStyle: withRef(z.string()).optional(),
  inputStyleClass: withRef(z.string()).optional(),
  panelStyle: withRef(z.string()).optional(),
  panelStyleClass: withRef(z.string()).optional(),
  todayButtonStyleClass: withRef(z.string()).optional(),
  clearButtonStyleClass: withRef(z.string()).optional(),
  showIcon: withRef(z.boolean()).optional(),
  icon: withRef(z.string()).optional(),
  iconDisplay: withRef(z.enum(['input', 'button'])).optional(),
  appendTo: withRef(z.string()).optional(),
  size: withRef(z.enum(['small', 'large'])).optional(),
  variant: withRef(z.enum(['filled', 'outlined'])).optional(),
  fluid: withRef(z.boolean()).optional(),
  invalid: withRef(z.boolean()).optional(),
})
