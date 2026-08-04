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
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.md}}',
      }),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'calendarMultiMonthDivider' })
}