import * as z from 'zod'
import { border, withRef } from '../primitives'
import {
  calendarFooterButtonShape,
  calendarTodayButtonDefaults,
  calendarClearButtonDefaults,
} from './footerbutton'

/**
 * Shape of a single state block of the calendar footer button bar.
 * The bar's buttons sit inside the state block. No named severities exist for this node, so
 * tokens sit directly here instead of behind a `defaultSeverity` wrapper.
 */
const calendarFooterButtonBarStateShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.optional(),
  gap: withRef(z.string()).optional(),

  todayButton: calendarFooterButtonShape.prefault({}),
  clearButton: calendarFooterButtonShape.prefault({}),
})

/**
 * Shape for the footer button bar in the calendar panel.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarFooterButtonBarShape = z.object({
  defaultVariant: z.object({
    defaultState: calendarFooterButtonBarStateShape.prefault({}),
    hover: calendarFooterButtonBarStateShape.prefault({}),
    focus: calendarFooterButtonBarStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for the footer button bar.
 */
export const calendarFooterButtonBarDefaults = {
  defaultVariant: {
    defaultState: {
      padding: '{{primitives.space.md}}',
      border: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.md}}',
        radius: '{{primitives.border.radius.md}}',
        offset: '{{primitives.border.offset.none}}',
      },
      gap: '{{primitives.space.md}}',

      todayButton: calendarTodayButtonDefaults,
      clearButton: calendarClearButtonDefaults,
    },
  },
}
