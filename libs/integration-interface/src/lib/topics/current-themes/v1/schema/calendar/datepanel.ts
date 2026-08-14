import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { calendarTodayShape, calendarTodayDefaults } from './today'
import { calendarViewShape, calendarViewDefaults } from './view'
import { calendarWeekDayLabelShape, calendarWeekDayLabelDefaults } from './weekdaylabel'

/**
 * Shape for a single state block of the calendar date panel.
 */
const calendarDatePanelStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),

  weekDayLabel: calendarWeekDayLabelShape.prefault({}),
  dayView: calendarViewShape('dateCell').prefault({}),
  monthView: calendarViewShape('monthCell').prefault({}),
  yearView: calendarViewShape('yearCell').prefault({}),
  today: calendarTodayShape.prefault({}),
})

/**
 * Shape for the calendar date panel.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarDatePanelShape = z.object({
  defaultState: calendarDatePanelStateShape.prefault({}),
  hover: calendarDatePanelStateShape.prefault({}),
  focus: calendarDatePanelStateShape.prefault({}),
})

/**
 * Default tokens for the calendar date panel.
 */
export const calendarDatePanelDefaults = {
  defaultState: {
    background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    padding: '{{primitives.space.md}}',
    margin: '{{primitives.space.md}}',

    weekDayLabel: calendarWeekDayLabelDefaults,
    dayView: calendarViewDefaults('dateCell'),
    monthView: calendarViewDefaults('monthCell'),
    yearView: calendarViewDefaults('yearCell'),
    today: calendarTodayDefaults,
  },
}
