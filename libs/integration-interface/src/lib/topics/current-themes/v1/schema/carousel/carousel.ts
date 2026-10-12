import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { carouselSettingsShape } from './settings'
import { carouselContainerShape, carouselContainerDefaults } from './container'
import { carouselContentShape, carouselContentDefaults } from './content'
import { carouselNavigationButtonShape, carouselNavigationButtonDefaults } from './navigationbutton'
import { carouselIndicatorShape, carouselIndicatorDefaults } from './indicator'
import { carouselItemShape, carouselItemDefaults } from './item'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

/**
 * Variant content shape (used by the carousel's `defaultVariant`).
 * The 5 canonical color variants are intentionally not modeled (the CSS mapper
 * references no `usages.carousel.primary.*` etc.) — matching the decision on
 * the calendar's variant content.
 */
const carouselVariantContentShape = z.object({
  container: carouselContainerShape.prefault({}),
  content: carouselContentShape.prefault({}),
  navigationButton: carouselNavigationButtonShape.prefault({}),
  indicator: carouselIndicatorShape.prefault({}),
  item: carouselItemShape.prefault({}),
})

export const carouselShape = z.object({
  settings: carouselSettingsShape.optional(),

  defaultVariant: carouselVariantContentShape.prefault({}),

  transitionDuration: withRef(z.number()).optional(),
})

/**
 * Concrete input type for the carousel usage.
 *
 * The runtime schema is built through `applyDefaultsRecursive`, whose return
 * type is the loose `z.ZodObject<Record<string, z.ZodTypeAny>>` — exporting the
 * inferred shape directly would exceed the compiler's serialization limit
 * (TS7056). This hand-written alias mirrors the shape's leaves (delegating the
 * deep sub-trees to each child's own `z.input`) so `ThemePath` generation in the
 * mapper can reference a concrete type instead of the loose record.
 */
export type CarouselShapeInput = {
  settings?: z.input<typeof carouselSettingsShape>
  defaultVariant?: {
    container?: z.input<typeof carouselContainerShape>
    content?: z.input<typeof carouselContentShape>
    navigationButton?: z.input<typeof carouselNavigationButtonShape>
    indicator?: z.input<typeof carouselIndicatorShape>
    item?: z.input<typeof carouselItemShape>
  }
  transitionDuration?: number | string
}

// ------------------------------------------------------------------
// DEFAULTS — composed from per-component defaults
// ------------------------------------------------------------------

/**
 * Default tokens for the carousel component.
 *
 * `defaultVariant` carries the defaults tree — it *is* the default (and the only
 * variant modeled). Assembled from the per-child defaults exports.
 *
 * Exported so tests can assert the resolved schema output against this exact
 * source object instead of duplicating literal token values.
 */
export const carouselDefaults = {
  transitionDuration: '{{primitives.transition.duration}}',

  defaultVariant: {
    container: carouselContainerDefaults,
    content: carouselContentDefaults,
    navigationButton: carouselNavigationButtonDefaults,
    indicator: carouselIndicatorDefaults,
    item: carouselItemDefaults,
  },
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

/**
 * Carousel schema: shape with defaults applied.
 * Only keys present in `carouselDefaults` get `.default()`.
 * All other keys stay optional (filled by the fallback mechanism).
 */
export const carousel = applyDefaultsRecursive(carouselShape, carouselDefaults).register(themeSchemaRegistry, {
  id: 'carousel',
})

// Backward-compatible facade for consumers that import `CarouselSchema.schema`
export class CarouselSchema {
  static readonly schema = carousel
}
