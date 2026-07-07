import { ThemeUsageSettings } from '@onecx/integration-interface'
import { defineUsageSettingsMapper, asBoolean, asEnum, asNumber } from '../../helpers'

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

export const primeNgCarouselSettingsMapper = mapPrimeNgCarouselSettings