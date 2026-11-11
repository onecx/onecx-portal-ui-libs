import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Carousel settings shape.
 *
 * Component-level (non-token) settings, mapped to PrimeNG Carousel inputs by
 * `mapPrimeNgCarouselSettings`. Kept plain-optional (no inline defaults) so that,
 * like every other audited component, `settings` only carries values the theme
 * author explicitly sets; PrimeNG's own built-in input defaults otherwise apply.
 */
export const carouselSettingsShape = z.object({
  orientation: withRef(z.enum(['horizontal', 'vertical'])).optional(),
  showIndicators: withRef(z.boolean()).optional(),
  showNavigators: withRef(z.boolean()).optional(),
  circular: withRef(z.boolean()).optional(),
  autoplayInterval: withRef(z.number()).optional(),
})
