import * as z from 'zod'
import { color, font, withRef } from '../primitives'

/**
 * Calendar week day label shape.
 */
export const calendarWeekDayLabelShape = z.object({
  padding: withRef(z.string()).optional(),
  font: font.pick({ weight: true, size: true }).optional(),
  color: color.optional(),
})

/**
 * Default tokens for the week day label.
 */
export const calendarWeekDayLabelDefaults = {
  padding: '{{primitives.space.xs}}',
  font: {
    weight: '{{primitives.font.weight.bold}}',
    size: '{{primitives.font.size}}',
  },
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
}
