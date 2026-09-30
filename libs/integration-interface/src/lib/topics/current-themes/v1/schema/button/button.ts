/**
 * This file defines the schema for button theming.
 *
 * Shape/defaults are separated: `buttonShape` is a pure (all-optional) shape, `buttonDefaults`
 * is a plain defaults tree, and `button` applies the defaults via `applyDefaultsRecursive`.
 *
 * The button has no children (its icon/label are plain content, not themable sub-components).
 * It models three color variants — `defaultVariant`, `primary`, `secondary` — each built from
 * the shared `buttonColorVariantShape`/`buttonColorVariantDefaults` factory (see
 * `./color-variant.ts`) so their token *shape* is identical while every default *value* is
 * genuinely distinct per variant (each references its own `primitives.<variant>...` paths).
 *
 * Every state-bearing node (a color variant's own root, and each shape variant) follows the
 * `defaultState`/named-state axis, and every severity-bearing node follows the
 * `defaultSeverity`/named-severity axis — no `state`/`severity` wrapper keys are used in the
 * usage schema itself (those are primitives-only conventions).
 */
import * as z from 'zod'
import { badgeShape } from '../badge'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import {
  buttonColorVariantDefaults,
  buttonColorVariantShape,
} from './color-variant'
import { buttonIconOnlyShape } from './icon-only'
import { lgButtonShape, mdButtonShape, smButtonShape } from './sizes'
import { buttonStatefulShape } from './stateful'

// ------------------------------------------------------------------
// SHAPE — pure, all keys optional, no defaults baked in
// ------------------------------------------------------------------

export const buttonShape: z.ZodObject<Record<string, z.ZodTypeAny>> = z
  .object({
    defaultVariant: buttonColorVariantShape.prefault({}),
    primary: buttonColorVariantShape.prefault({}),
    secondary: buttonColorVariantShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonShape' })

// ------------------------------------------------------------------
// CONCRETE INPUT TYPE — hand-written for `UsagesInput` / `ThemePath`
// ------------------------------------------------------------------
//
// `button` is built via `applyDefaultsRecursive`, whose return type is the loose
// `z.ZodObject<Record<string, z.ZodTypeAny>>` — and exporting the inferred
// `buttonShape` directly exceeds the compiler's serialization limit (TS7056). So
// `z.input<typeof button>` exposes no concrete keys and `LeafPaths` cannot generate
// any `usages.button.*` path, collapsing the `usages.button` arm of `ThemePath` and
// breaking every button mapping/css rule `from:` path.
//
// This hand-written alias mirrors `buttonShape`'s leaves, delegating the deep stateful
// sub-trees to each concrete sub-shape's `z.input` (mirroring `CalendarShapeInput` /
// `PanelMenuShapeInput`) so `ThemePath` generation can reference a concrete type.

type ButtonColorVariantInput = {
  defaultVariant?: z.input<typeof buttonStatefulShape>
  rounded?: z.input<typeof buttonStatefulShape>
  raised?: z.input<typeof buttonStatefulShape>
  text?: z.input<typeof buttonStatefulShape>
  textRaised?: z.input<typeof buttonStatefulShape>
  outlined?: z.input<typeof buttonStatefulShape>
  iconOnly?: z.input<typeof buttonIconOnlyShape>
  sm?: z.input<typeof smButtonShape>
  md?: z.input<typeof mdButtonShape>
  lg?: z.input<typeof lgButtonShape>
  badge?: z.input<typeof badgeShape>
}

/** Concrete input type for the button usage (see the note above). */
export type ButtonShapeInput = {
  defaultVariant?: ButtonColorVariantInput
  primary?: ButtonColorVariantInput
  secondary?: ButtonColorVariantInput
}

// ------------------------------------------------------------------
// DEFAULTS — plain object mirroring the shape; only keys that should have a
// default are present (the rest resolve via the runtime fallback).
// ------------------------------------------------------------------

export const buttonDefaults = {
  defaultVariant: buttonColorVariantDefaults('defaultVariant'),
  primary: buttonColorVariantDefaults('variant.primary'),
  secondary: buttonColorVariantDefaults('variant.secondary'),
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const button = applyDefaultsRecursive(buttonShape, buttonDefaults).register(themeSchemaRegistry, {
  id: 'button',
})

/** @deprecated kept for backward compatibility — import `button` directly instead. */
export class ButtonSchema {
  static readonly schema = button
}
