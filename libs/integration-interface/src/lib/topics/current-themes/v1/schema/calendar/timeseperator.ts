import * as z from 'zod'
import { color, font, withRef } from '../primitives'

/**
 * Shape for the time separator used in the calendar time picker.
 */
export const calendarTimeSeperatorShape = z.object({
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
})

/**
 * Default tokens for the time separator.
 */
export const calendarTimeSeperatorDefaults = {
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
  padding: '{{primitives.space.xs}}',
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
}
