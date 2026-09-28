import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { calendarInputShape, calendarInputDefaults } from './input'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'
import { calendarPanelShape, calendarPanelDefaults } from './panel'
import { calendarSettingsShape } from './settings'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * Variant content shape (used by defaultVariant).
 * The 5 canonical color variants are intentionally not modeled (the CSS mapper
 * references no `usages.calendar.primary.*` etc.) — see the same decision on
 * the generic `input` usage.
 */
const calendarVariantContentShape = z.object({
  input: calendarInputShape.prefault({}),
  panel: calendarPanelShape.prefault({}),
  calendarIconButton: calendarPanelButtonShape.prefault({}),
})

const calendarShape = z.object({
  settings: calendarSettingsShape.optional(),

  defaultVariant: calendarVariantContentShape.prefault({}),

  transitionDuration: withRef(z.number()).optional(),
})

/**
 * Concrete input type for the calendar usage.
 *
 * The runtime schema is built through `applyDefaultsRecursive`, whose return
 * type is the loose `z.ZodObject<Record<string, z.ZodTypeAny>>` — exporting the
 * inferred shape directly exceeds the compiler's serialization limit (TS7056).
 * This hand-written alias mirrors the shape's leaves (delegating the deep
 * sub-trees to each component's own `z.input`) so `ThemePath` generation in the
 * mapper can reference a concrete type instead of the loose record.
 */
export type CalendarShapeInput = {
  settings?: z.input<typeof calendarSettingsShape>
  defaultVariant?: {
    input?: z.input<typeof calendarInputShape>
    panel?: z.input<typeof calendarPanelShape>
    calendarIconButton?: z.input<typeof calendarPanelButtonShape>
  }
  transitionDuration?: number | string
}

// ------------------------------------------------------------------
// DEFAULTS — composed from per-component defaults
// ------------------------------------------------------------------

/**
 * Variant content defaults for `defaultVariant`.
 */
const variantContentDefaults = {
  input: calendarInputDefaults,
  panel: calendarPanelDefaults,
  calendarIconButton: calendarPanelButtonDefaults,
}

/**
 * Default tokens for the calendar component.
 *
 * Assembled from per-component defaults exports. `defaultVariant` carries
 * the defaults tree — it *is* the default (and the only variant modeled).
 *
 * Exported so tests can assert the resolved schema output against this exact
 * source object instead of duplicating literal token values.
 */
export const calendarDefaults = {
  transitionDuration: '{{primitives.transition.duration}}',

  defaultVariant: variantContentDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

/**
 * Calendar schema: shape with defaults applied.
 * Only keys present in `calendarDefaults` get `.default()`.
 * All other keys stay optional (filled by fallback mechanism).
 */
export const calendar = applyDefaultsRecursive(calendarShape, calendarDefaults).register(themeSchemaRegistry, {
  id: 'calendar',
})

// Backward-compatible facade for consumers that import `CalendarSchema.schema`
export class CalendarSchema {
  static readonly schema = calendar
}
