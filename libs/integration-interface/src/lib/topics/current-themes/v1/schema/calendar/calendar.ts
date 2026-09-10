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
