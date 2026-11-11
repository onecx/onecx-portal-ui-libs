import type { CssRule } from '../../mapper.types'

export const carouselCssRules: CssRule[] = [
  // ─── Carousel root container ──────────────────────────────────────────────
  {
    selector: '.p-carousel',
    declarations: [
      {
        property: 'background',
        from: 'usages.carousel.defaultVariant.container.background',
      },
      {
        property: 'color',
        from: 'usages.carousel.defaultVariant.container.color',
      },
      {
        property: 'padding',
        from: 'usages.carousel.defaultVariant.container.padding',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.defaultVariant.container.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.defaultVariant.container.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.defaultVariant.container.border.style',
      },
      {
        property: 'border-radius',
        from: 'usages.carousel.defaultVariant.container.border.radius',
      },
    ],
  },

  // ─── Indicator - default state ────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-button',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.color',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.border.style',
      },
    ],
  },

  // ─── Indicator - hover state ──────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-button:hover',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.hover.color',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.hover.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.hover.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.hover.border.style',
      },
    ],
  },

  // ─── Indicator - active state ─────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-active .p-carousel-indicator-button',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.active.color',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.active.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.active.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.defaultVariant.indicator.defaultVariant.active.border.style',
      },
    ],
  },

  // ─── Navigation buttons ───────────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-prev-button,' + '\n.p-carousel .p-carousel-next-button',
    declarations: [
      {
        property: 'padding',
        from: 'usages.carousel.defaultVariant.navigationButton.padding',
      },
    ],
  },

  // ─── Item ──────────────────────────────────────────────────────────────────
  // No PrimeNG preset equivalent — `.p-carousel-item`'s width/flex-basis is
  // computed at runtime from `numVisible`/`responsiveOptions` and must not be
  // themed, so only the visual (non-layout) properties are exposed here.
  {
    selector: '.p-carousel .p-carousel-item',
    declarations: [
      {
        property: 'background',
        from: 'usages.carousel.defaultVariant.item.background',
      },
      {
        property: 'padding-inline',
        from: 'usages.carousel.defaultVariant.item.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.carousel.defaultVariant.item.paddingY',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.defaultVariant.item.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.defaultVariant.item.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.defaultVariant.item.border.style',
      },
      {
        property: 'border-radius',
        from: 'usages.carousel.defaultVariant.item.border.radius',
      },
    ],
  },
]
