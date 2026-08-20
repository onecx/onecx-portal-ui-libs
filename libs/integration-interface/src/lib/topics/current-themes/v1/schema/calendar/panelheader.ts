import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { calendarNavigationSelectorShape, calendarNavigationSelectorDefaults } from './navigationselector'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'

/**
 * Shape of a single severity block of the calendar panel header.
 * The header's children (selectors, nav button) sit inside the state block
 * (they depend on the header's state).
 */
const calendarPanelHeaderSeverityShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),

  selectMonth: calendarNavigationSelectorShape.prefault({}),
  selectYear: calendarNavigationSelectorShape.prefault({}),
  navButton: calendarPanelButtonShape.prefault({}),
})

/**
 * Shape of a single state block of the calendar panel header (default severity only).
 */
const calendarPanelHeaderStateShape = z.object({
  defaultSeverity: calendarPanelHeaderSeverityShape.prefault({}),
})

/**
 * Shape for the calendar panel header.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarPanelHeaderShape = z.object({
  defaultVariant: z.object({
    defaultState: calendarPanelHeaderStateShape.prefault({}),
    hover: calendarPanelHeaderStateShape.prefault({}),
    focus: calendarPanelHeaderStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for the calendar panel header.
 */
export const calendarPanelHeaderDefaults = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.md}}',
        margin: '{{primitives.space.md}}',
        gap: '{{primitives.space.sm}}',

        selectMonth: calendarNavigationSelectorDefaults,
        selectYear: calendarNavigationSelectorDefaults,
        navButton: calendarPanelButtonDefaults,
      },
    },
  },
}
