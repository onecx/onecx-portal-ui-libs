import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Tabs viewport shape. Scroll behavior configuration for the tablist viewport.
 */
export const tabsViewportShape = z.object({
  scrollBehavior: withRef(z.string()).optional(),
  overscrollBehavior: withRef(z.string()).optional(),
  scrollbarWidth: withRef(z.string()).optional(),
  webkitScrollbarDisplay: withRef(z.string()).optional(),
})

export const tabsViewportDefaults = {
  scrollBehavior: 'smooth',
  overscrollBehavior: 'contain auto',
  scrollbarWidth: 'none',
  webkitScrollbarDisplay: 'none',
}
