import z from 'zod'
import { bg, withRef, color } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export class CalendarTodaySchema {
  static readonly schema = z
    .object({
      background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
      color: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarToday' })
}
