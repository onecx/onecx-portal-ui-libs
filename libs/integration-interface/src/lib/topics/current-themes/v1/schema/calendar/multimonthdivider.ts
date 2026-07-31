import z from 'zod'
import { withRef, border } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Schema for the divider between multiple months in a calendar view.
 */
export class CalendarMultiMonthDividerSchema {
  static readonly schema = z
    .object({
      border: border.default({
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      }),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarMultiMonthDivider' })
}
