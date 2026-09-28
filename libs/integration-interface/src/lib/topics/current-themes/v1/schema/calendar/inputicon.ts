import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'

/**
 * Shape of a single state block for calendar input icons (leaf tokens). No named severities
 * exist for this node, so tokens sit directly here instead of behind a `defaultSeverity`
 * wrapper.
 */
const calendarIconStateShape = z.object({
  padding: withRef(z.string()).optional(),
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  color: color.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
})

/**
 * Shape of the calendar input icon variant slot (states).
 */
const calendarIconVariantShape = z.object({
  defaultState: calendarIconStateShape.prefault({}),
  hover: calendarIconStateShape.prefault({}),
  focus: calendarIconStateShape.prefault({}),
  disabled: calendarIconStateShape.prefault({}),
  invalid: calendarIconStateShape.prefault({}),
  active: calendarIconStateShape.prefault({}),
})

/**
 * Shape for icon styles used in the calendar input field.
 * Static tokens (focusRing) sit at the root; the default token path lives under
 * `defaultVariant.defaultState.defaultSeverity`.
 * All keys are optional — defaults are applied at the calendar schema level.
 */
export const calendarIconShape = z.object({
  focusRing: borderWithShadow.optional(),

  defaultVariant: calendarIconVariantShape.prefault({}),
})

/**
 * Default tokens for the calendar input icon.
 * The full token set sits on the default path; named states carry only the
 * tokens that differ from `defaultState`.
 */
export const calendarIconDefaults = {
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
      padding: '{{primitives.space.md}}',
      width: '2.5rem',
      height: '2.5rem',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    },
    hover: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
    focus: {
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    },
    disabled: {
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    },
    invalid: {
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
    },
  },
}
