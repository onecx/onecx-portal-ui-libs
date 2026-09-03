import * as z from 'zod'
import { withRef } from '../primitives'
import { calendarPickerCellShape, calendarPickerCellDefaults } from './pickercell'

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
