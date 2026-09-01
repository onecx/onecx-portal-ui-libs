import { mapPrimeNgCarouselSettings, primeNgCarouselSettingsMapper } from './carousel.mapper'

describe('mapPrimeNgCarouselSettings', () => {
  it('should map carousel usage settings to PrimeNG carousel input defaults', () => {
    expect(
      mapPrimeNgCarouselSettings({
        orientation: 'vertical',
        showIndicators: false,
        showNavigators: true,
        circular: true,
        autoplayInterval: 3000,
      })
    ).toEqual({
      orientation: 'vertical',
      showIndicators: false,
      showNavigators: true,
      circular: true,
      autoplayInterval: 3000,
    })
  })

  it('should ignore unresolved values that cannot be applied as direct inputs', () => {
    expect(
      mapPrimeNgCarouselSettings({
        orientation: '{{primitives.orientation}}',
        showIndicators: '{{primitives.boolean}}',
        autoplayInterval: '{{primitives.interval}}',
      } as never)
    ).toEqual({
      orientation: undefined,
      showIndicators: undefined,
      showNavigators: undefined,
      circular: undefined,
      autoplayInterval: undefined,
    })
  })

  it('should expose the same mapper through the provider registry alias', () => {
    expect(primeNgCarouselSettingsMapper).toBe(mapPrimeNgCarouselSettings)
  })
})