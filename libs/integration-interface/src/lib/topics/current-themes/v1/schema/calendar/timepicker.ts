import * as z from 'zod'
import { border, withRef } from '../primitives'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'
import { calendarTimeSeperatorShape, calendarTimeSeperatorDefaults } from './timeseperator'

/**
 * Shape for a single state block of the calendar time picker.
 */
const calendarTimePickerStateShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.optional(),
  gap: withRef(z.string()).optional(),
  buttonGap: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),
})

/**
 * Shape for the calendar time picker.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarTimePickerShape = z.object({
  timeSeparator: calendarTimeSeperatorShape.prefault({}),
  timePickerButton: calendarPanelButtonShape.prefault({}),

  defaultState: calendarTimePickerStateShape.prefault({}),
  hover: calendarTimePickerStateShape.prefault({}),
  focus: calendarTimePickerStateShape.prefault({}),
})

/**
 * Default tokens for the calendar time picker.
 */
export const calendarTimePickerDefaults = {
  timeSeparator: calendarTimeSeperatorDefaults,
  timePickerButton: calendarPanelButtonDefaults,
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
    buttonGap: '{{primitives.space.xs}}',
    margin: '{{primitives.space.md}}',
  },
}
