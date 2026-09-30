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

// Content is the inner wrapper span. Padding/radius are constant across
// states; only `selected` swaps in a distinct background + shadow.
const togglebuttonContentShape = z.object({
  padding: withRef(z.string()).optional(),
  border: border.pick({ radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  shadow: withRef(z.string()).optional(),
})

const togglebuttonIconShape = z.object({
  color: color.optional(),
})

// Background/color/border(color) tokens that vary per interaction state,
// plus the `content`/`icon` children nested inside their owning state —
// mirrors `dropdown`'s `triggerIcon`, which lives inside each state block
// (`defaultState.triggerIcon`, `hover.triggerIcon`, ...), not the reverse.
const togglebuttonStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  content: togglebuttonContentShape.prefault({}),
  icon: togglebuttonIconShape.prefault({}),
})

// Invalid only ever changes the border color — no content/icon token exists.
const togglebuttonInvalidShape = z.object({
  border: border.pick({ color: true }).optional(),
})

// `checked` maps onto the canonical `selected` state (see `primitives.ts`'s
// `variantWithStates.state.selected`) — a sibling of `hover`/`disabled`/
// `invalid`, not a separate variant. This also removes the need to duplicate
// `disabled`/`invalid` defaults across two variants: there is only ever one
// variant (`defaultVariant`), and `selected` is just another one of its states.
const togglebuttonVariantShape = z.object({
  defaultState: togglebuttonStateShape.prefault({}),
  hover: togglebuttonStateShape.prefault({}),
  disabled: togglebuttonStateShape.prefault({}),
  invalid: togglebuttonInvalidShape.prefault({}),
  selected: togglebuttonStateShape.prefault({}),
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

  sm: togglebuttonSizeShape.prefault({}),
  lg: togglebuttonSizeShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS
// ------------------------------------------------------------------

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
      content: {
        padding: '{{primitives.space.xs}}',
        border: {
          radius: '{{primitives.border.radius.sm}}',
        },
      },
      icon: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      },
    },
    hover: {
      background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      icon: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      },
    },
    disabled: {
      background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      },
      icon: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
      },
    },
    invalid: {
      border: {
        color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      },
    },
    selected: {
      background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      },
      content: {
        background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
        shadow: '{{primitives.shadow.sm}}',
      },
      icon: {
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
      },
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
