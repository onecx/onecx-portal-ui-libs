import * as z from 'zod'
import { bg, border, withRef } from '../primitives'

/**
 * Shape for an individual carousel item (`.p-carousel-item`).
 * No states of its own — a single flat token group (specific child of the
 * carousel's `defaultVariant`), analogous to the carousel's container.
 * All keys are optional — defaults are applied at the carousel schema level.
 *
 * PrimeNG's carousel preset has no token group for the item element itself —
 * its width/flex-basis is computed at runtime from `numVisible`/
 * `responsiveOptions` and must not be themed — so these tokens are mapped via
 * a `CssRule` targeting `.p-carousel-item` rather than a preset `MappingRule`.
 */
export const carouselItemShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
  padding: withRef(z.string()).optional(),
})

/**
 * Default tokens for an individual carousel item.
 * `border.width` defaults to `none` and `padding` to `0` so the item stays
 * visually flush/transparent (matching the previously unthemed markup) until
 * explicitly overridden.
 */
export const carouselItemDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
  },
  padding: '0',
}
