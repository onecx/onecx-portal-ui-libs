import z from 'zod'
import { withRef, color, font } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Calendar week day label schema.
 */
export class CalendarWeekDayLabelSchema {
  static readonly schema = z
    .object({
      padding: withRef(z.string()).default('{{primitives.space.xs}}'),
      font: font.pick({ weight: true, size: true }).default({
        weight: '{{primitives.font.weight.bold}}',
        size: '{{primitives.font.size}}',
      }),
      color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarWeekDayLabel' })
}
