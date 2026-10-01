/**
 * This file defines the schema for textarea theming. It, by default, uses primitives for default
 * values but allows overriding any of them with custom values.
 *
 * Shape/defaults are separated: `textareaShape` is a pure (all-optional) shape, `textareaDefaults`
 * is a plain defaults tree, and `textarea` applies the defaults via `applyDefaultsRecursive`. The
 * leaf tokens sit directly on each state — the node declares no named severities, so there is no
 * `defaultSeverity` wrapper. The full baseline token set sits on `defaultVariant.defaultState`, and
 * the `filled` variant is a partial override (only its differing tokens are filled; the rest resolve
 * via the runtime fallback from `defaultVariant`).
 *
 * A textarea renders a single `.p-textarea` element — it has no themable children. It models two
 * variants: `defaultVariant` (the outlined baseline, full token set) and `filled` (a custom variant
 * that overrides the per-state background/color/placeholderColor and the per-state border color; its
 * static tokens and the base border resolve via the runtime fallback). The 5 canonical color
 * variants are intentionally not modeled (the CSS mapper references no `usages.textarea.primary.*`
 * etc.).
 */
import * as z from 'zod'
import { bg, borderWithShadow, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

// ------------------------------------------------------------------
// SHAPE — pure, all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * Workspace settings for the textarea — boolean flags plus the variant selector. No defaults;
 * PrimeNG decides. Kept as a root-level sibling of the variant slots (carried over from the legacy
 * schema).
 */
export const textareaSettings = z
  .object({
    autoResizeX: withRef(z.boolean()).optional(),
    autoResizeY: withRef(z.boolean()).optional(),
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    fluid: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'textareaSettings' })

/** A named size (sm/md/lg) of the textarea: font size plus its two-axis padding. */
export const textareaSize = z
  .object({
    font: font.pick({ size: true }).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'textareaSize' })

/**
 * Leaf-token state block (the full baseline set; every key optional). The textarea declares no
 * named severities, so there is no `defaultSeverity` wrapper — static tokens (font, border,
 * transitionDuration, focusRing, sm, md, lg, cursor) and the per-state tokens (background, color,
 * placeholderColor) all live directly on the state.
 */
const textareaStateShape = z.object({
  font: font.omit({ family: true, size: true }).optional(),
  border: borderWithShadow.optional(),
  transitionDuration: withRef(z.number()).optional(),
  focusRing: borderWithShadow.optional(),
  sm: textareaSize.optional(),
  md: textareaSize.optional(),
  lg: textareaSize.optional(),
  cursor: withRef(z.string()).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  placeholderColor: color.optional(),
})

/** A single variant: defaultState plus the named states. */
const textareaVariantShape = z.object({
  defaultState: textareaStateShape.prefault({}),
  hover: textareaStateShape.prefault({}),
  focus: textareaStateShape.prefault({}),
  disabled: textareaStateShape.prefault({}),
  invalid: textareaStateShape.prefault({}),
})

/**
 * Pure textarea shape: the outlined baseline (`defaultVariant`) and the `filled` custom variant.
 * No flat-root token keys — every token lives under a state.
 */
export const textareaShape = z.object({
  settings: textareaSettings.optional(),
  defaultVariant: textareaVariantShape.prefault({}),
  filled: textareaVariantShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS — plain objects mirroring the shape; only keys that should have
// a default are present (the rest resolve via the runtime fallback).
// ------------------------------------------------------------------

/** Full mandatory baseline token set on `defaultVariant.defaultState` (no severity wrapper). */
const baselineStateTokens = {
  font: {
    weight: '{{primitives.font.weight}}',
    lineHeight: '{{primitives.font.lineHeight}}',
    letterSpacing: '{{primitives.font.letterSpacing}}',
    style: '{{primitives.font.style}}',
  },
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },
  transitionDuration: '{{primitives.transition.duration}}',
  focusRing: {
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },
  sm: {
    font: { size: '{{primitives.font.size}}' },
    paddingX: '{{primitives.space.xs}}',
    paddingY: '{{primitives.space.xs}}',
  },
  md: {
    font: { size: '{{primitives.font.size}}' },
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
  },
  lg: {
    font: { size: '{{primitives.font.size}}' },
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
  },
  cursor: 'pointer',
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  placeholderColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
}

/**
 * Defaulted tokens for a named state of the outlined baseline variant. Per-state defaults are
 * intentionally minimal: a token is carried only when it (a) visibly differs from `defaultState`
 * for that state and (b) is consumed by the CSS mapper — everything else resolves via the runtime
 * fallback from `defaultState`. No `border.style` per state — only the border *color* changes
 * across states (the style is inherited from `defaultState`).
 */
const outlinedStateTokens = {
  // Hover does not repaint the background; only the border darkens (mapper reads `hover.border.color`).
  hover: {
    border: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}' },
  },
  focus: {
    border: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}' },
  },
  // Disabled is dimmed: background + text lighten, and the border follows (mapper reads
  // `disabled.background` / `disabled.color` / `disabled.border.color`).
  disabled: {
    background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    border: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}' },
  },
  // Invalid does not repaint the background or the typed text — only the border turns red and the
  // placeholder tints (mapper reads `invalid.border.color` / `invalid.placeholderColor`).
  invalid: {
    border: { color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}' },
    placeholderColor: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
  },
}

/**
 * The `filled` variant's baseline (defaultState) — its full token set, the partial override of
 * `defaultVariant` from which the filled named states fall back. The primitives tree expresses
 * `defaultState` directly under the variant slot (no `state` segment).
 */
const filledBaselineTokens = {
  background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
  placeholderColor: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
}

/** A filled named state's background (mapper reads `filled.<state>.background`). */
const filledBackgroundToken = (state: 'hover' | 'focus' | 'disabled') =>
  `{{primitives.variant.primary.state.${state}.defaultSeverity.bg}}`

/** A filled named state's contrast (text/placeholder) color — used for the dimmed `disabled` state and the tinted `invalid` placeholder. */
const filledContrastToken = (state: 'disabled' | 'invalid') =>
  `{{primitives.variant.primary.state.${state}.defaultSeverity.contrast}}`

/** A filled named state's border color — the filled states follow the same border-color shift as the outlined variant (mapper reads `filled.<state>.border.color`). */
const filledBorderColorToken = (state: 'hover' | 'focus' | 'disabled' | 'invalid') =>
  `{{primitives.variant.primary.state.${state}.defaultSeverity.border.color}}`

export const textareaDefaults = {
  defaultVariant: {
    defaultState: baselineStateTokens,
    hover: outlinedStateTokens.hover,
    focus: outlinedStateTokens.focus,
    disabled: outlinedStateTokens.disabled,
    invalid: outlinedStateTokens.invalid,
  },
  // Partial override of defaultVariant. Per named state, only the tokens that visibly differ
  // are carried (the rest resolve via the runtime fallback): hover/focus repaint the background and
  // the border, disabled dims background + text + border, invalid tints the placeholder + border.
  filled: {
    defaultState: filledBaselineTokens,
    hover: { background: filledBackgroundToken('hover'), border: { color: filledBorderColorToken('hover') } },
    focus: { background: filledBackgroundToken('focus'), border: { color: filledBorderColorToken('focus') } },
    disabled: {
      background: filledBackgroundToken('disabled'),
      color: filledContrastToken('disabled'),
      border: { color: filledBorderColorToken('disabled') },
    },
    invalid: {
      placeholderColor: filledContrastToken('invalid'),
      border: { color: filledBorderColorToken('invalid') },
    },
  },
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const textarea = applyDefaultsRecursive(textareaShape, textareaDefaults).register(themeSchemaRegistry, {
  id: 'textarea',
})
