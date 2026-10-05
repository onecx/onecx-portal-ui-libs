import * as z from 'zod'
import { bg, border, color, withRef } from '../primitives'

export const accordionContentShape = z.object({
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  border: border.pick({ width: true, color: true, style: true }).optional(),
  padding: withRef(z.string()).optional(),
})

export const accordionContentDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  background: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
  },
  border: {
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  },
  padding: '{{primitives.space.md}}',
}
