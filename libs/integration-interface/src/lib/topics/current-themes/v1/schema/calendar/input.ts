import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'
import { calendarIconShape, calendarIconDefaults } from './inputicon'

/**
 * Shape of a single severity block for the calendar input (leaf tokens + icon).
 */
const calendarInputSeverityShape = z.object({
  padding: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
  font: font.pick({ family: true, size: true, weight: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  placeholderColor: color.optional(),
  icon: calendarIconShape.prefault({}),
})

/**
 * Shape of a single state block for the calendar input (default severity only).
 */
const calendarInputStateShape = z.object({
  defaultSeverity: calendarInputSeverityShape.prefault({}),
})

/**
 * Size variant shape for the calendar input (sm/lg).
 */
const calendarInputSizeShape = z.object({
  padding: withRef(z.string()).optional(),
  fontSize: withRef(z.string()).optional(),
})

/**
 * Shape for the input field in the calendar header panel.
 * Static tokens (sm/lg, focusRing) sit at the root; the default token path lives under
 * `defaultVariant.defaultState.defaultSeverity`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarInputShape = z.object({
  sm: calendarInputSizeShape.prefault({}),
  lg: calendarInputSizeShape.prefault({}),
  focusRing: borderWithShadow.optional(),

  defaultVariant: z.object({
    defaultState: calendarInputStateShape.prefault({}),
    hover: calendarInputStateShape.prefault({}),
    focus: calendarInputStateShape.prefault({}),
    disabled: calendarInputStateShape.prefault({}),
    invalid: calendarInputStateShape.prefault({}),
    active: calendarInputStateShape.prefault({}),
  }).prefault({}),
})

/**
 * Default tokens for the calendar input.
 * The full token set sits on the default path; named states carry only the
 * tokens that differ from `defaultState`.
 */
export const calendarInputDefaults = {
  sm: {
    padding: '{{primitives.space.sm}}',
    fontSize: '{{primitives.font.size}}',
  },
  lg: {
    padding: '{{primitives.space.lg}}',
    fontSize: '{{primitives.font.size}}',
  },
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    shadow: '{{primitives.shadow.none}}',
    radius: '{{primitives.radius.md}}',
  },
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        padding: '{{primitives.space.md}}',
        shadow: '{{primitives.shadow.md}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          radius: '{{primitives.border.radius.md}}',
          offset: '{{primitives.border.offset.none}}',
        },
        placeholderColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        icon: calendarIconDefaults,
      },
    },
    hover: {
      defaultSeverity: {
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      },
    },
    focus: {
      defaultSeverity: {
        border: {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
          width: '{{primitives.border.width.md}}',
        },
      },
    },
    disabled: {
      defaultSeverity: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
      },
    },
    invalid: {
      defaultSeverity: {
        border: {
          color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
        },
        color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
      },
    },
    active: {
      defaultSeverity: {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
      },
    },
  },
}
