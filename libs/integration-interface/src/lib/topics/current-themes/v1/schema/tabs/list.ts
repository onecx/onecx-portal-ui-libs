import * as z from 'zod'
import { bg, color, border, withRef } from '../primitives'
import { tabsListContentDefaults, tabsListContentShape } from './listContent'

/**
 * Tabs tablist shape. The tab list contains all tabs and allows scrolling
 * through them if they don't fit into the viewport.
 */
export const tabsListShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  gap: withRef(z.string()).optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  border: border.optional(),
  content: tabsListContentShape.prefault({}),
})

export const tabsListDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  gap: '{{primitives.space.md}}',
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  border: {
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  },
  content: tabsListContentDefaults,
}
