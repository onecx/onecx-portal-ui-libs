import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { calendarTodayShape, calendarTodayDefaults } from './today'
import { calendarViewShape, calendarViewDefaults, calendarDayViewShape, calendarDayViewDefaults } from './view'

/**
 * Shape of a single state block of the calendar date panel.
 * The date panel's children (views, today) sit inside the state block. No named
 * severities exist for this node, so tokens sit directly here instead of behind a
 * `defaultSeverity` wrapper.
 */
const calendarDatePanelStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),

  dayView: calendarDayViewShape.prefault({}),
  monthView: calendarViewShape('monthCell').prefault({}),
  yearView: calendarViewShape('yearCell').prefault({}),
  today: calendarTodayShape.prefault({}),
})

/**
 * Shape for the calendar date panel.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarDatePanelShape = z.object({
  defaultVariant: z
    .object({
      defaultState: calendarDatePanelStateShape.prefault({}),
      hover: calendarDatePanelStateShape.prefault({}),
      focus: calendarDatePanelStateShape.prefault({}),
    })
    .prefault({}),
})

/**
 * Default tokens for the calendar date panel.
 */
export const calendarDatePanelDefaults = {
  defaultVariant: {
    defaultState: {
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      padding: '{{primitives.space.md}}',
      margin: '{{primitives.space.md}}',

      dayView: calendarDayViewDefaults,
      monthView: calendarViewDefaults('monthCell'),
      yearView: calendarViewDefaults('yearCell'),
      today: calendarTodayDefaults,
    },
  },
}
