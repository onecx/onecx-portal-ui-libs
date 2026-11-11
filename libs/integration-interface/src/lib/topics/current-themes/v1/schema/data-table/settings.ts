import * as z from 'zod'
import { withRef } from '../primitives'

/** Component-level behaviour (not visual tokens). */
export const dataTableSettingsShape = z.object({
  checkboxColumnPosition: withRef(z.enum(['start', 'end'])).optional(),
  actionColumnPosition: withRef(z.enum(['start', 'end'])).optional(),
  actionColumnSticky: withRef(z.boolean()).optional(),
})

export const dataTableSettingsDefaults = {
  checkboxColumnPosition: 'start',
  actionColumnPosition: 'end',
  actionColumnSticky: false,
}
