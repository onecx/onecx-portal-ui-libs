import z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shared schema for view containers (dayView, monthView, yearView)
 */
export class CalendarViewMarginSchema {
  static readonly schema = z
    .object({
      margin: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarViewMargin' })
}
