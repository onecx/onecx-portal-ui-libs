import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Message component settings shape. No `.default()` on any field — left to PrimeNG's
 * own component defaults, matching the `add-theme-usage` skill's settings convention.
 */
export const messageSettingsShape = z.object({
  closable: withRef(z.boolean()).optional(),
  life: withRef(z.number()).optional(),
  size: withRef(z.enum(['small', 'large'])).optional(),
  variant: withRef(z.enum(['text', 'outlined', 'simple'])).optional(),
})
