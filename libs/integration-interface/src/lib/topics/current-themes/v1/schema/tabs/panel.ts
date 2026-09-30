import * as z from 'zod'
import { bg, color, font, withRef } from '../primitives'

/**
 * Tabs panel (tabpanel) shape. The content panel shown for the active tab.
 */
export const tabsPanelShape = z.object({
  font: font.pick({ size: true, weight: true, lineHeight: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  alignItems: withRef(z.string()).optional(),
  justifyContent: withRef(z.string()).optional(),
})

export const tabsPanelDefaults = {
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
    lineHeight: '{{primitives.font.lineHeight}}',
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  alignItems: '{{primitives.layout.alignItems}}',
  justifyContent: '{{primitives.layout.justifyContent}}',
}
