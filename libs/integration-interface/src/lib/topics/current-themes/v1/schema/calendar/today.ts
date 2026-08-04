import z from 'zod'
import { bg, withRef, color } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Calendar schema for the today cell in the calendar date panel.
 */
export class CalendarTodaySchema {
  static readonly schema = z
    .object({
      background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
      color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarToday' })
}
