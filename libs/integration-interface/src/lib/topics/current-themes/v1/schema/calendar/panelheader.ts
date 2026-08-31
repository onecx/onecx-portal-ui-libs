import * as z from 'zod'
import { bg, color, font, withRef } from '../primitives'
import { calendarNavigationSelectorShape, calendarNavigationSelectorDefaults } from './navigationselector'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'

/**
 * Shape of the month/year title display (`.p-datepicker-title`) in the panel
 * header. It is a static text element (no own variant/state tree), so its
 * tokens sit flat — analogous to `today` and `timeSeparator`.
 */
export const calendarYearMonthNavShape = z.object({
  gap: withRef(z.string()).optional(),
  font: font.pick({ weight: true, size: true }).optional(),
  color: color.optional(),
})

/**
 * Shape of a single state block of the calendar panel header.
 * The header's children (title, selectors, nav button) sit inside the state block (they depend
 * on the header's state). No named severities exist for this node, so tokens sit directly here
 * instead of behind a `defaultSeverity` wrapper.
 */
const calendarPanelHeaderStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  margin: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),

  yearMonthNav: calendarYearMonthNavShape.prefault({}),
  selectMonth: calendarNavigationSelectorShape.prefault({}),
  selectYear: calendarNavigationSelectorShape.prefault({}),
  navButton: calendarPanelButtonShape.prefault({}),
})

/**
 * Shape for the calendar panel header.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarPanelHeaderShape = z.object({
  defaultVariant: z
    .object({
      defaultState: calendarPanelHeaderStateShape.prefault({}),
      hover: calendarPanelHeaderStateShape.prefault({}),
      focus: calendarPanelHeaderStateShape.prefault({}),
    })
    .prefault({}),
})

/**
 * Default tokens for the calendar panel header.
 */
export const calendarPanelHeaderDefaults = {
  defaultVariant: {
    defaultState: {
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      padding: '{{primitives.space.md}}',
      margin: '{{primitives.space.md}}',
      gap: '{{primitives.space.sm}}',

      yearMonthNav: {
        gap: '{{primitives.space.sm}}',
        font: {
          weight: '{{primitives.font.weight}}',
          size: '{{primitives.font.size}}',
        },
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      },
      selectMonth: calendarNavigationSelectorDefaults,
      selectYear: calendarNavigationSelectorDefaults,
      navButton: calendarPanelButtonDefaults,
    },
  },
}
