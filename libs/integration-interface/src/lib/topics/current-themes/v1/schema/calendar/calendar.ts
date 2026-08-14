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
 * Variant content shape (used by defaultVariant and all 5 named variants).
 */
const calendarVariantContentShape = z.object({
  input: calendarInputShape.prefault({}),
  panel: calendarPanelShape.prefault({}),
  calendarIconButton: calendarPanelButtonShape.prefault({}),
})

const calendarShape = z.object({
  settings: calendarSettingsShape.optional(),

  defaultVariant: calendarVariantContentShape.prefault({}),
  primary: calendarVariantContentShape.prefault({}),
  secondary: calendarVariantContentShape.prefault({}),
  tertiary: calendarVariantContentShape.prefault({}),
  quaternary: calendarVariantContentShape.prefault({}),
  quinary: calendarVariantContentShape.prefault({}),

  transitionDuration: withRef(z.number()).optional(),
})

// ------------------------------------------------------------------
// DEFAULTS — composed from per-component defaults
// ------------------------------------------------------------------

/**
 * Variant content defaults shared by all variants.
 *
 * Every variant (`defaultVariant`, `primary`, `secondary`, ...) gets the same
 * defaults here so they resolve to a value out of the box. Override any key at
 * the variant level when providing theme values — only the keys you specify
 * will differ.
 */
const variantContentDefaults = {
  input: calendarInputDefaults,
  panel: calendarPanelDefaults,
  calendarIconButton: calendarPanelButtonDefaults,
}

/**
 * Default tokens for the calendar component.
 *
 * Assembled from per-component defaults exports. All variants get the same
 * defaults so you can set custom values on any variant level independently.
 */
const calendarDefaults = {
  transitionDuration: '{{primitives.transition.duration}}',

  defaultVariant: variantContentDefaults,
  primary: variantContentDefaults,
  secondary: variantContentDefaults,
  tertiary: variantContentDefaults,
  quaternary: variantContentDefaults,
  quinary: variantContentDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

/**
 * Calendar schema: shape with defaults applied.
 * Only keys present in `calendarDefaults` get `.default()`.
 * All other keys stay optional (filled by fallback mechanism).
 */
export const calendar = applyDefaultsRecursive(calendarShape, calendarDefaults).register(
  themeSchemaRegistry,
  { id: 'calendar' },
)

// Backward-compatible facade for consumers that import `CalendarSchema.schema`
export class CalendarSchema {
  static readonly schema = calendar
}
