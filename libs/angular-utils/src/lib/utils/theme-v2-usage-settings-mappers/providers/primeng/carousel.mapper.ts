import { ThemeUsageSettings } from '@onecx/integration-interface'
import { defineUsageSettingsMapper, asBoolean, asEnum, asNumber } from '../../helpers'

/**
 * Component input defaults derived from the `carousel` theme usage settings, applied to PrimeNG
 * Carousel instances by CarouselComponentSettingsService when the corresponding input isn't
 * explicitly set.
 *
 * This shape is kept in sync by convention with the PrimeNG Carousel input declarations. Since the
 * interface is a pure type with no runtime shape, a spec asserts the mapper's target keys stay a
 * subset of the inputs Carousel actually declares to catch drift early.
 */
export interface PrimeNgCarouselInputDefaults {
  orientation?: 'horizontal' | 'vertical'
  showIndicators?: boolean
  showNavigators?: boolean
  circular?: boolean
  autoplayInterval?: number
}

export const mapPrimeNgCarouselSettings = defineUsageSettingsMapper<
  ThemeUsageSettings<'carousel'>,
  PrimeNgCarouselInputDefaults
>({
  orientation: {
    from: 'orientation',
    transform: asEnum(['horizontal', 'vertical'] as const),
  },
  showIndicators: {
    from: 'showIndicators',
    transform: asBoolean,
  },
  showNavigators: {
    from: 'showNavigators',
    transform: asBoolean,
  },
  circular: {
    from: 'circular',
    transform: asBoolean,
  },
  autoplayInterval: {
    from: 'autoplayInterval',
    transform: asNumber,
  },
})