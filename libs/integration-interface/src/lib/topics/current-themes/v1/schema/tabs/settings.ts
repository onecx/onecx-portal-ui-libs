import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Tabs component settings shape. Non-visual configuration (unstyled, lazy,
 * selectOnFocus, showNavigators, scrollStrategy) rather than design tokens.
 */
export const tabsSettingsShape = z.object({
  unstyled: withRef(z.boolean()).optional(),
  lazy: withRef(z.boolean()).optional(),
  selectOnFocus: withRef(z.boolean()).optional(),
  showNavigators: withRef(z.boolean()).optional(),
  scrollStrategy: withRef(z.union([z.enum(['nearest', 'center']), z.literal(false)])).optional(),
})

export const tabsSettingsDefaults = {
  unstyled: false,
  lazy: false,
  selectOnFocus: false,
  showNavigators: true,
  scrollStrategy: 'nearest',
}
