import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { panelMenuSettingsShape } from './settings'
import { panelMenuPanelShape, panelMenuPanelDefaults } from './panel'
import { panelMenuHeaderShape, panelMenuHeaderDefaults } from './header'
import { panelMenuItemShape, panelMenuItemDefaults } from './item'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * Variant content shape (used by defaultVariant).
 * The 5 canonical color variants are intentionally not modeled (the CSS mapper
 * references no `usages.panelmenu.primary.*` etc.).
 */
const panelMenuVariantContentShape = z.object({
  panel: panelMenuPanelShape.prefault({}),
  header: panelMenuHeaderShape.prefault({}),
  item: panelMenuItemShape.prefault({}),
})

const panelMenuShape = z.object({
  settings: panelMenuSettingsShape.optional(),

  defaultVariant: panelMenuVariantContentShape.prefault({}),

  gap: withRef(z.string()).optional(),
  transitionDuration: withRef(z.number()).optional(),
})

/**
 * Concrete input type for the panelmenu usage.
 *
 * The runtime schema is built through `applyDefaultsRecursive`, whose return
 * type is the loose `z.ZodObject<Record<string, z.ZodTypeAny>>` — exporting the
 * inferred shape directly exceeds the compiler's serialization limit (TS7056).
 * This hand-written alias mirrors the shape's leaves (delegating the deep
 * sub-trees to each component's own `z.input`) so `ThemePath` generation in the
 * mapper can reference a concrete type instead of the loose record.
 */
export type PanelMenuShapeInput = {
  settings?: z.input<typeof panelMenuSettingsShape>
  defaultVariant?: {
    panel?: z.input<typeof panelMenuPanelShape>
    header?: z.input<typeof panelMenuHeaderShape>
    item?: z.input<typeof panelMenuItemShape>
  }
  gap?: string
  transitionDuration?: number | string
}

// ------------------------------------------------------------------
// DEFAULTS — composed from per-component defaults
// ------------------------------------------------------------------

const variantContentDefaults = {
  panel: panelMenuPanelDefaults,
  header: panelMenuHeaderDefaults,
  item: panelMenuItemDefaults,
}

/**
 * Default tokens for the panelmenu component.
 *
 * Exported so tests can assert the resolved schema output against this exact
 * source object instead of duplicating literal token values.
 */
export const panelMenuDefaults = {
  gap: '{{primitives.space.sm}}',
  transitionDuration: '{{primitives.transition.duration}}',

  defaultVariant: variantContentDefaults,
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

/**
 * PanelMenu schema: shape with defaults applied.
 * Only keys present in `panelMenuDefaults` get `.default()`.
 * All other keys stay optional (filled by fallback mechanism).
 */
export const panelmenu = applyDefaultsRecursive(panelMenuShape, panelMenuDefaults).register(themeSchemaRegistry, {
  id: 'panelmenu',
})

// Backward-compatible facade for consumers that import `PanelMenuSchema.schema`
export class PanelMenuSchema {
  static readonly schema = panelmenu
}
