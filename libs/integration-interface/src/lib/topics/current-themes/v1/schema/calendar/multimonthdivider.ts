import * as z from 'zod'
import { withRef, border } from '../primitives'

/**
 * Shape for the divider between multiple months in a calendar view.
 */
export const calendarMultiMonthDividerShape = z.object({
  border: border.optional(),
  gap: withRef(z.string()).optional(),
})

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
