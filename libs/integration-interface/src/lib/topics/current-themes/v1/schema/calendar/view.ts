import z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shared schema for view containers (dayView, monthView, yearView)
 */
export class CalendarViewSchema {
  static readonly schema = z
    .object({
      margin: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarView' })
}
