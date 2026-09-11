import { Carousel } from 'primeng/carousel'
import { mapPrimeNgCarouselSettings } from './carousel.mapper'

describe('mapPrimeNgCarouselSettings', () => {
  it('should only map settings to keys the Carousel component declares as inputs', () => {
    // `PrimeNgCarouselInputDefaults` is a pure type with no runtime shape, so key drift would
    // otherwise go unnoticed. Checking the mapper's target keys against the input names Carousel
    // actually declares keeps them in sync when either side is renamed.
    const declaredInputNames = Object.keys((Carousel as { ɵcmp?: { inputs?: Record<string, unknown> } }).ɵcmp?.inputs ?? {})
    const missing = mapPrimeNgCarouselSettings.targetKeys.filter((key) => !declaredInputNames.includes(key))

    expect(missing).toEqual([])
  })

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

})