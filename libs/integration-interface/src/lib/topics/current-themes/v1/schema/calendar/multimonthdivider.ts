import * as z from 'zod'
import { withRef, border } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shape for the divider between multiple months in a calendar view.
 */
export const calendarMultiMonthDividerShape = z
  .object({
    border: border.optional(),
    gap: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'calendarMultiMonthDividerShape', child: true })

/**
 * Default tokens for the multi-month divider.
 */
export const calendarMultiMonthDividerDefaults = {
  border: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
  },
  gap: '{{primitives.space.md}}',
}
