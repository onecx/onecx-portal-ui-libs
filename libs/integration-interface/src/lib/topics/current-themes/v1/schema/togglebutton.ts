/**
 * Schema for the PrimeNG ToggleButton usage.
 */
import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

const togglebuttonSettingsShape = z.object({
  iconPos: withRef(z.enum(['left', 'right'])).optional(),
  size: withRef(z.enum(['small', 'large'])).optional(),
  allowEmpty: withRef(z.boolean()).optional(),
  fluid: withRef(z.boolean()).optional(),
})

// Background/color/border(color) tokens that vary per interaction state.
const togglebuttonStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
})

// Invalid only ever changes the border color.
const togglebuttonInvalidShape = z.object({
  border: border.pick({ color: true }).optional(),
})

const togglebuttonIconStateShape = z.object({
  color: color.optional(),
})

const togglebuttonIconStatesShape = z.object({
  defaultState: togglebuttonIconStateShape.prefault({}),
  hover: togglebuttonIconStateShape.prefault({}),
  disabled: togglebuttonIconStateShape.prefault({}),
})

// `checked` icon has no hover token — see the module-level note on hover.
const togglebuttonIconCheckedStatesShape = z.object({
  defaultState: togglebuttonIconStateShape.prefault({}),
  disabled: togglebuttonIconStateShape.prefault({}),
})

// Content is the inner wrapper span. Padding/radius are constant across
// variants; only `checked` swaps in a distinct background + shadow.
const togglebuttonContentShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.pick({ radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  shadow: withRef(z.string()).optional(),
})

const togglebuttonVariantShape = z.object({
  defaultState: togglebuttonStateShape.prefault({}),
  hover: togglebuttonStateShape.prefault({}),
  disabled: togglebuttonStateShape.prefault({}),
  invalid: togglebuttonInvalidShape.prefault({}),
  content: togglebuttonContentShape.prefault({}),
  icon: togglebuttonIconStatesShape.prefault({}),
})

// `checked` variant has no `hover` — see the module-level note.
const togglebuttonCheckedVariantShape = z.object({
  defaultState: togglebuttonStateShape.prefault({}),
  disabled: togglebuttonStateShape.prefault({}),
  invalid: togglebuttonInvalidShape.prefault({}),
  content: togglebuttonContentShape.prefault({}),
  icon: togglebuttonIconCheckedStatesShape.prefault({}),
})

const togglebuttonSizeShape = z.object({
  padding: withRef(z.string()).optional(),
  font: font.pick({ size: true }).optional(),
  content: z.object({ padding: withRef(z.string()).optional() }).prefault({}),
})

export const togglebuttonShape = z.object({
  settings: togglebuttonSettingsShape.optional(),

  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  font: font.pick({ size: true, weight: true }).optional(),
  transitionDuration: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),

  defaultVariant: togglebuttonVariantShape.prefault({}),
  checked: togglebuttonCheckedVariantShape.prefault({}),

  sm: togglebuttonSizeShape.prefault({}),
  lg: togglebuttonSizeShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS
// ------------------------------------------------------------------

// Shared by both `defaultVariant.disabled` and `checked.disabled` — PrimeNG
// applies a single `:disabled` rule regardless of checked state.
const disabledStateDefaults = {
  background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
  },
}

// Shared by both `defaultVariant.invalid` and `checked.invalid` — PrimeNG
// applies a single `.p-invalid` rule regardless of checked state.
const invalidStateDefaults = {
  border: {
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
  },
}

// Shared by both `defaultVariant.icon.disabled` and `checked.icon.disabled`.
const iconDisabledStateDefaults = {
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
}

const contentBaselineDefaults = {
  padding: '{{primitives.space.xs}}',
  border: {
    radius: '{{primitives.border.radius.sm}}',
  },
}

export const togglebuttonDefaults = {
  padding: '{{primitives.space.sm}}',
  gap: '{{primitives.space.xs}}',
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
  transitionDuration: '{{primitives.transition.duration}}',
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },

  defaultVariant: {
    defaultState: {
      background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.md}}',
      },
    },
    hover: {
      background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
    disabled: disabledStateDefaults,
    invalid: invalidStateDefaults,
    content: contentBaselineDefaults,
    icon: {
      defaultState: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      },
      hover: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      },
      disabled: iconDisabledStateDefaults,
    },
  },

  checked: {
    defaultState: {
      background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      },
    },
    disabled: disabledStateDefaults,
    invalid: invalidStateDefaults,
    content: {
      ...contentBaselineDefaults,
      background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
      shadow: '{{primitives.shadow.sm}}',
    },
    icon: {
      defaultState: {
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
      },
      disabled: iconDisabledStateDefaults,
    },
  },

  sm: {
    padding: '{{primitives.space.xs}}',
    font: { size: '{{primitives.font.size.sm}}' },
    content: { padding: '{{primitives.space.xxs}}' },
  },
  lg: {
    padding: '{{primitives.space.md}}',
    font: { size: '{{primitives.font.size.lg}}' },
    content: { padding: '{{primitives.space.sm}}' },
  },
}

export const togglebutton = applyDefaultsRecursive(togglebuttonShape, togglebuttonDefaults).register(
  themeSchemaRegistry,
  { id: 'togglebutton' }
)
