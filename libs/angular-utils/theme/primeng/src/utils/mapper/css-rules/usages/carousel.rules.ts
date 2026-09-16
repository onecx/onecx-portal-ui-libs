import type { CssRule } from '../../mapper.types';

export const carouselCssRules: CssRule[] = [
  // ─── Carousel root container ──────────────────────────────────────────────
  {
    selector: '.p-carousel',
    declarations: [
      {
        property: 'background',
        from: 'usages.carousel.container.bg',
      },
      {
        property: 'color',
        from: 'usages.carousel.container.contrast',
      },
      {
        property: 'padding',
        from: 'usages.carousel.container.padding',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.container.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.container.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.container.border.style',
      },
      {
        property: 'border-radius',
        from: 'usages.carousel.container.border.radius',
      },
    ],
  },

  // ─── Indicator - default state ────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-button',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.indicator.contrast',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.indicator.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.indicator.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.indicator.border.style',
      },
    ],
  },

  // ─── Indicator - hover state ──────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-button:hover',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.indicator.hover.contrast',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.indicator.hover.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.indicator.hover.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.indicator.hover.border.style',
      },
    ],
  },

  // ─── Indicator - active state ─────────────────────────────────────────────
  {
    selector: '.p-carousel .p-carousel-indicator-active .p-carousel-indicator-button',
    declarations: [
      {
        property: 'color',
        from: 'usages.carousel.indicator.active.contrast',
      },
      {
        property: 'border-color',
        from: 'usages.carousel.indicator.active.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.carousel.indicator.active.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.carousel.indicator.active.border.style',
      },
    ],
  },

  // ─── Navigation buttons ───────────────────────────────────────────────────
  {
    selector:
      '.p-carousel .p-carousel-prev-button,' +
      '\n.p-carousel .p-carousel-next-button',
    declarations: [
      {
        property: 'padding',
        from: 'usages.carousel.navigationButton.padding',
      },
    ],
  },
];
