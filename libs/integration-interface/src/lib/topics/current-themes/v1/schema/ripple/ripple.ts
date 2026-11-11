/**
 * This file defines the schema for ripple theming.
 *
 * Ripple is a PrimeNG directive (`[pRipple]`) that appends a single `.p-ink`
 * element to its host — a circle that scales up and fades out on mousedown.
 * The only themable element is that ink circle (`ink`); the host element is
 * owned by the parent component's own schema. `settings` carries the
 * directive's behavioral options (no visual box of their own).
 */
import * as z from 'zod'
import { bg, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

// Behavioral directive options — not a themed visual element, so it keeps its
// own literal defaults (same pattern as tooltip.settings / ripple's legacy form).
export const rippleSettings = z
  .object({
    disabled: withRef(z.boolean()).default(false),
    unbounded: withRef(z.boolean()).default(false),
    centered: withRef(z.boolean()).default(false),
    radius: withRef(z.number()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'rippleSettings' })

// The `.p-ink` circle — the sole visual element the ripple directive renders.
const rippleInkShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  // Base opacity of the ink before it fades to 0 via the keyframe animation.
  // (The scale factor it animates to is PrimeNG's internal `@keyframes ripple`
  // target and has no PrimeNG preset token, so it is intentionally not themable.)
  opacity: withRef(z.number()).optional(),
})

// 1. Pure shape — all keys optional, no defaults. Ripple's root is an aggregator
// with no variant/state/severity of its own, so the ink node and settings sit flat.
export const rippleShape = z.object({
  ink: (rippleInkShape as typeof rippleInkShape).prefault({}),
  settings: (rippleSettings as typeof rippleSettings).optional(),
})

// 2. Defaults tree — mirrors the shape. Ink carries the mandatory baseline set.
export const rippleInkDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  opacity: 1,
}

export const rippleDefaults = {
  ink: rippleInkDefaults,
}

export const ripple = applyDefaultsRecursive(rippleShape, rippleDefaults).register(themeSchemaRegistry, {
  id: 'ripple',
})
