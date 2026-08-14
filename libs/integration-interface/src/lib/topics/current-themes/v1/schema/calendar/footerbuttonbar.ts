import * as z from 'zod'
import { border, withRef } from '../primitives'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'

/**
 * Shape for a single state block of the calendar footer button bar.
 */
const calendarFooterButtonBarStateShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.optional(),
  gap: withRef(z.string()).optional(),

  todayButton: calendarPanelButtonShape.prefault({}),
  clearButton: calendarPanelButtonShape.prefault({}),
})

/**
 * Shape for the footer button bar in the calendar panel.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarFooterButtonBarShape = z.object({
  defaultState: calendarFooterButtonBarStateShape.prefault({}),
  hover: calendarFooterButtonBarStateShape.prefault({}),
  focus: calendarFooterButtonBarStateShape.prefault({}),
})

/**
 * Default tokens for the footer button bar.
 */
export const calendarFooterButtonBarDefaults = {
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

    todayButton: calendarPanelButtonDefaults,
    clearButton: calendarPanelButtonDefaults,
  },
}
