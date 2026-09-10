import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

/**
 * Shape of a single state block for calendar navigation selectors. No named severities exist for
 * this node, so tokens sit directly here instead of behind a `defaultSeverity` wrapper.
 */
const calendarNavigationSelectorStateShape = z.object({
  padding: withRef(z.string()).optional(),
  font: font.pick({ weight: true, size: true }).optional(),
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
})

/**
 * Shape for navigation selector buttons in the calendar header panel.
 * Static token (focusRing) sits at the root; the default token path lives under
 * `defaultVariant.defaultState`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarNavigationSelectorShape = z.object({
  focusRing: borderWithShadow.optional(),

  defaultVariant: z.object({
    defaultState: calendarNavigationSelectorStateShape.prefault({}),
    hover: calendarNavigationSelectorStateShape.prefault({}),
    focus: calendarNavigationSelectorStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for the navigation selector.
 */
export const calendarNavigationSelectorDefaults = {
  focusRing: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    shadow: '{{primitives.shadow.none}}',
    radius: '{{primitives.radius.md}}',
  },
  defaultVariant: {
    defaultState: {
      padding: '{{primitives.space.sm}}',
      font: {
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
      },
      border: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.md}}',
      },
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    },
    hover: {
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    },
    focus: {
      border: {
        color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
        width: '{{primitives.border.width.md}}',
      },
    },
  },
}
