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
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { buttonColorVariantDefaults, buttonColorVariantShape } from './color-variant'

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
