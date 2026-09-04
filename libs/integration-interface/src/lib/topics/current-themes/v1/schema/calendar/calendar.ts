import z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { CalendarSettingsSchema } from './settings'
import { CalendarPanelSchema } from './panel'
import { CalendarPanelButtonSchema } from './panelbutton'
import { CalendarInputIconSchema } from './inputicon'
import { CalendarTimePickerSchema } from './timepicker'
import { CalendarTimeInputSchema } from './timeinput'
import { CalendarTimeSeperatorSchema } from './timeseperator'
import { CalendarMultiMonthDividerSchema } from './multimonthdivider'
import { CalendarFooterButtonBarSchema } from './footerbuttonbar'
import { CalendarInputSchema } from './input'

export class CalendarSchema {
  private static readonly tokens = {
    transitionDuration: withRef(z.string()).default('{{primitives.transition.duration}}'),
  }

  static readonly schema = z
    .object({
      settings: (CalendarSettingsSchema.schema as typeof CalendarSettingsSchema.schema).optional(),
      input: (CalendarInputSchema.schema as typeof CalendarInputSchema.schema).prefault({}),
      panel: (CalendarPanelSchema.schema as typeof CalendarPanelSchema.schema).prefault({}),
      // Seperate button with calendar icon to open the panel
      calendarIconButton: (CalendarPanelButtonSchema.schema as typeof CalendarPanelButtonSchema.schema).prefault({}),
      // Calendar icon inside the input field
      inputCalendarIcon: (CalendarInputIconSchema.schema as typeof CalendarInputIconSchema.schema).prefault({}),
      timePicker: (CalendarTimePickerSchema.schema as typeof CalendarTimePickerSchema.schema).optional(),
      timePickerButton: (CalendarPanelButtonSchema.schema as typeof CalendarPanelButtonSchema.schema).prefault({}),
      timeInput: (CalendarTimeInputSchema.schema as typeof CalendarTimeInputSchema.schema).prefault({}),
      timeSeparator: (CalendarTimeSeperatorSchema.schema as typeof CalendarTimeSeperatorSchema.schema).prefault({}),
      multiMonthDivider: (
        CalendarMultiMonthDividerSchema.schema as typeof CalendarMultiMonthDividerSchema.schema
      ).prefault({}),
      footerButtonBar: (CalendarFooterButtonBarSchema.schema as typeof CalendarFooterButtonBarSchema.schema).prefault(
        {}
      ),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'calendar', kind: 'child' })
}
