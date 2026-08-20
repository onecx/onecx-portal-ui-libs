import * as z from 'zod'
import { border, withRef } from '../primitives'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'
import { calendarTimeSeperatorShape, calendarTimeSeperatorDefaults } from './timeseperator'

/**
 * Shape of a single severity block of the calendar time picker.
 * The time picker's children (separator, button) sit inside the state block,
 * matching the placement of panel/datePanel/footerButtonBar children.
 */
const calendarTimePickerSeverityShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.optional(),
  gap: withRef(z.string()).optional(),
  buttonGap: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),

  timeSeparator: calendarTimeSeperatorShape.prefault({}),
  timePickerButton: calendarPanelButtonShape.prefault({}),
})

/**
 * Shape of a single state block of the calendar time picker (default severity only).
 */
const calendarTimePickerStateShape = z.object({
  defaultSeverity: calendarTimePickerSeverityShape.prefault({}),
})

/**
 * Shape for the calendar time picker.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarTimePickerShape = z.object({
  defaultVariant: z.object({
    defaultState: calendarTimePickerStateShape.prefault({}),
    hover: calendarTimePickerStateShape.prefault({}),
    focus: calendarTimePickerStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for the calendar time picker.
 */
export const calendarTimePickerDefaults = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        padding: '{{primitives.space.md}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          radius: '{{primitives.border.radius.md}}',
          offset: '{{primitives.border.offset.none}}',
        },
        gap: '{{primitives.space.md}}',
        buttonGap: '{{primitives.space.xs}}',
        margin: '{{primitives.space.md}}',

        timeSeparator: calendarTimeSeperatorDefaults,
        timePickerButton: calendarPanelButtonDefaults,
      },
    },
  },
}
