import z from 'zod'
import { withRef, color, font } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Calendar schema for the time separator used in the calendar time picker.
 */
export class CalendarTimeSeperatorSchema {
  static readonly schema = z
    .object({
      color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
      padding: withRef(z.string()).default('{{primitives.space.xs}}'),
      font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }),
    })
    .register(themeSchemaRegistry, { id: 'calendarTimeSeperator' })
}
