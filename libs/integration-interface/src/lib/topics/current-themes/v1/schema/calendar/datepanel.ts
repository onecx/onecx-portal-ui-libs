import z from 'zod'
import { bg, withRef, color } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { CalendarViewSchema } from './view'
import { CalendarWeekDayLabelSchema } from './weekdaylabel'
import { CalendarPickerCellSchema } from './pickercell'
import { CalendarTodaySchema } from './today'

/**
 * Calendar date panel schema.
 */
export class CalendarDatePanelSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    margin: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      weekDayLabel: (CalendarWeekDayLabelSchema.schema as typeof CalendarWeekDayLabelSchema.schema).prefault({}),
      dayView: (CalendarViewSchema.schema as typeof CalendarViewSchema.schema).prefault({}),
      dateCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      monthView: (CalendarViewSchema.schema as typeof CalendarViewSchema.schema).prefault({}),
      monthCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      yearView: (CalendarViewSchema.schema as typeof CalendarViewSchema.schema).prefault({}),
      yearCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      today: (CalendarTodaySchema.schema as typeof CalendarTodaySchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendarDatePanel', kind: 'child' })
}
