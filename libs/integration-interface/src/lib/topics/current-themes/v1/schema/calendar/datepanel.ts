import z from 'zod'
import { bg, withRef, color } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { CalendarViewMarginSchema } from './viewmargin'
import { CalendarWeekDayLabelSchema } from './weekdaylabel'
import { CalendarPickerCellSchema } from './pickercell'
import { CalendarTodaySchema } from './today'

export class CalendarDatePanelSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultVariant.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    margin: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      weekDayLabel: (CalendarWeekDayLabelSchema.schema as typeof CalendarWeekDayLabelSchema.schema).prefault({}),
      dayView: (CalendarViewMarginSchema.schema as typeof CalendarViewMarginSchema.schema).prefault({}),
      dateCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      monthView: (CalendarViewMarginSchema.schema as typeof CalendarViewMarginSchema.schema).prefault({}),
      monthCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      yearView: (CalendarViewMarginSchema.schema as typeof CalendarViewMarginSchema.schema).prefault({}),
      yearCell: (CalendarPickerCellSchema.schema as typeof CalendarPickerCellSchema.schema).prefault({}),
      today: (CalendarTodaySchema.schema as typeof CalendarTodaySchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendarDatePanel' })
}
