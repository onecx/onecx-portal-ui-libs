import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Message component settings shape. No `.default()` on any field — left to the underlying
 * component's own defaults, matching the `add-theme-usage` skill's settings convention.
 * Registered as a structural pass-through (no `axis`) so build-time axis introspection treats
 * its keys as non-axis members, like the other component settings shapes.
 */
export const messageSettingsShape = z
  .object({
    closable: withRef(z.boolean()).optional(),
    life: withRef(z.number()).optional(),
    size: withRef(z.enum(['small', 'large'])).optional(),
    variant: withRef(z.enum(['text', 'outlined', 'simple'])).optional(),
  })
  .register(themeSchemaRegistry, { id: 'messageSettings' })
