import * as z from 'zod'
import { bg, border, withRef } from '../primitives'

/**
 * Tabs list content shape. The scrollable inner area of the tablist that
 * holds the tabs. (Scroll-behavior tokens live on the root viewport.)
 */
export const tabsListContentShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  gap: withRef(z.string()).optional(),
  border: border.optional(),
})

export const tabsListContentDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  gap: '{{primitives.space.md}}',
  border: {
    width: '{{primitives.border.width.none}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.sm}}',
  },
}
