/**
 * This file defines the schema for input theming. It, by default, uses primitives for default
 * values but allows overriding any of them with custom values.
 *
 * Shape/defaults are separated: `inputShape` is a pure (all-optional) shape, `inputDefaults` is a
 * plain defaults tree, and `input` applies the defaults via `applyDefaultsRecursive`. Every state
 * block wraps its leaf tokens in `defaultSeverity`; the full baseline token set sits on
 * `defaultVariant.defaultState.defaultSeverity`, and the `filled` variant is a partial override
 * (only its differing tokens are filled; the rest resolve via the runtime fallback from
 * `defaultVariant`).
 */
import * as z from 'zod'
import { bg, borderWithShadow, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

// ------------------------------------------------------------------
// SHAPE — pure, all keys optional, no defaults baked in
// ------------------------------------------------------------------

/** Two-axis padding used by the input's baseline and its sm/lg size tokens. */
export const inputPadding = z.object({
  x: withRef(z.string()).optional(),
  y: withRef(z.string()).optional(),
})

/** A named size (sm/lg) of the input: font size plus its own two-axis padding. */
export const inputSize = z.object({
  fontSize: withRef(z.string()).optional(),
  padding: inputPadding.optional(),
})

const inputPlaceholder = z.object({
  color: color.optional(),
})

/**
 * Leaf-token severity block (the full baseline set; every key optional).
 * Static tokens (transitionDuration, font, padding, focusRing, sm, lg) and the
 * per-state tokens (background, color, border, placeholder) all live here.
 */
const inputSeverityShape = z.object({
  transitionDuration: withRef(z.string()).optional(),
  font: font.pick({ weight: true, size: true }).optional(),
  padding: inputPadding.optional(),
  focusRing: borderWithShadow.optional(),
  sm: inputSize.optional(),
  lg: inputSize.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
  placeholder: inputPlaceholder.optional(),
})

/** A single state block (default severity only). */
const inputStateShape = z.object({
  defaultSeverity: inputSeverityShape.prefault({}),
})

/** A single variant: defaultState plus the named states. */
const inputVariantShape = z.object({
  defaultState: inputStateShape.prefault({}),
  hover: inputStateShape.prefault({}),
  focus: inputStateShape.prefault({}),
  active: inputStateShape.prefault({}),
  disabled: inputStateShape.prefault({}),
  invalid: inputStateShape.prefault({}),
})

/**
 * Pure input shape: the outlined baseline (`defaultVariant`) and the `filled` custom variant.
 * The 5 canonical color variants are intentionally not modeled (the CSS mapper references no
 * `usages.input.primary.*` etc.). No flat-root tokens — every token lives under a state.
 */
export const inputShape = z.object({
  defaultVariant: inputVariantShape.prefault({}),
  filled: inputVariantShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS — plain objects mirroring the shape; only keys that should have
// a default are present (the rest resolve via the runtime fallback).
// ------------------------------------------------------------------

const defaultSeverityTokens = {
  transitionDuration: '{{primitives.transition.duration}}',
  font: {
    weight: '{{primitives.font.weight}}',
    size: '{{primitives.font.size}}',
  },
  padding: {
    x: '{{primitives.space.md}}',
    y: '{{primitives.space.sm}}',
  },
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },
  sm: {
    fontSize: '{{primitives.font.size}}',
    padding: {
      x: '{{primitives.space.sm}}',
      y: '{{primitives.space.xs}}',
    },
  },
  lg: {
    fontSize: '{{primitives.font.size}}',
    padding: {
      x: '{{primitives.space.lg}}',
      y: '{{primitives.space.md}}',
    },
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  },
}

const stateTokens = (state: 'hover' | 'focus' | 'disabled' | 'invalid') => ({
  background: `{{primitives.defaultVariant.state.${state}.defaultSeverity.bg}}`,
  color: `{{primitives.defaultVariant.state.${state}.defaultSeverity.contrast}}`,
  border: {
    color: `{{primitives.defaultVariant.state.${state}.defaultSeverity.border.color}}`,
    style: `{{primitives.defaultVariant.state.${state}.defaultSeverity.border.style}}`,
  },
  placeholder: {
    color: `{{primitives.defaultVariant.state.${state}.defaultSeverity.contrast}}`,
  },
})

const filledStateTokens = (state: 'defaultState' | 'hover' | 'focus' | 'disabled' | 'invalid') => ({
  background: `{{primitives.variant.primary.${state}.defaultSeverity.bg}}`,
  color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
  placeholder: {
    color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
  },
})

export const inputDefaults = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: defaultSeverityTokens,
    },
    hover: {
      defaultSeverity: stateTokens('hover'),
    },
    focus: {
      defaultSeverity: stateTokens('focus'),
    },
    active: {
      // A plain text input has no dedicated pressed look — the calendar input
      // supplies the meaningful panel-open background. Kept for completeness.
      defaultSeverity: {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
      },
    },
    disabled: {
      defaultSeverity: stateTokens('disabled'),
    },
    invalid: {
      defaultSeverity: stateTokens('invalid'),
    },
  },
  // Partial override of defaultVariant: only the tokens that actually differ
  // (background/color/placeholder). Static tokens + border resolve via fallback.
  filled: {
    defaultState: {
      defaultSeverity: filledStateTokens('defaultState'),
    },
    hover: {
      defaultSeverity: filledStateTokens('hover'),
    },
    focus: {
      defaultSeverity: filledStateTokens('focus'),
    },
    active: {
      defaultSeverity: {
        background: '{{primitives.variant.primary.state.active.defaultSeverity.bg}}',
      },
    },
    disabled: {
      defaultSeverity: filledStateTokens('disabled'),
    },
    invalid: {
      defaultSeverity: filledStateTokens('invalid'),
    },
  },
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const input = applyDefaultsRecursive(inputShape, inputDefaults).register(themeSchemaRegistry, {
  id: 'input',
})
