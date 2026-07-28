import z from 'zod'
import { withRef, color } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Calendar week day label schema.
 */
export class CalendarWeekDayLabelSchema {
  static readonly schema = z
    .object({
      padding: withRef(z.string()).default('{{primitives.space.xs}}'),
      fontWeight: withRef(z.string()).default('{{primitives.font.weight.bold}}'),
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarWeekDayLabel' })
}
