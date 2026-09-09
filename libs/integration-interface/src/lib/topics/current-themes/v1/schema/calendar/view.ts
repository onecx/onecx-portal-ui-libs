import * as z from 'zod'
import { withRef } from '../primitives'
import { calendarPickerCellShape, calendarPickerCellDefaults } from './pickercell'
import { calendarWeekDayLabelShape, calendarWeekDayLabelDefaults } from './weekdaylabel'

export type CalendarViewCellFieldName = 'dateCell' | 'monthCell' | 'yearCell'

/**
 * Shared shape for view containers (dayView, monthView, yearView).
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export function calendarViewShape(cellFieldName: CalendarViewCellFieldName) {
  return z.object({
    margin: withRef(z.string()).optional(),
    [cellFieldName]: calendarPickerCellShape.prefault({}),
  })
}

/**
 * Default tokens for a view container (dayView, monthView, yearView).
 * @param cellFieldName - The cell field name corresponding to the shape
 */
export function calendarViewDefaults(cellFieldName: CalendarViewCellFieldName): Record<string, unknown> {
  return {
    margin: '{{primitives.space.md}}',
    [cellFieldName]: calendarPickerCellDefaults,
  }
}

/**
 * Shape for the day view specifically. PrimeNG only renders the weekday header row
 * (`.p-datepicker-weekday`) in date-cell mode — month/year views have no equivalent — so
 * `weekDayLabel` is added here rather than in the shared `calendarViewShape`/`monthView`/`yearView`.
 */
export const calendarDayViewShape = calendarViewShape('dateCell').extend({
  weekDayLabel: calendarWeekDayLabelShape.prefault({}),
})

/**
 * Default tokens for the day view (dateCell view + its weekday header row).
 */
export const calendarDayViewDefaults: Record<string, unknown> = {
  ...calendarViewDefaults('dateCell'),
  weekDayLabel: calendarWeekDayLabelDefaults,
}
