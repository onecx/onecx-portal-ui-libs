import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const carouselMappingRules: MappingRule[] = [
  // ─── Content ──────────────────────────────────────────────────────────────
  {
    from: 'usages.carousel.content.gap',
    to: 'components.carousel.content.gap',
  },

  // ─── Indicator list ───────────────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.padding',
    to: 'components.carousel.indicatorList.padding',
  },
  {
    from: 'usages.carousel.indicator.gap',
    to: 'components.carousel.indicatorList.gap',
  },

  // ─── Indicator - default state ────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.styles.defaultState.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.background',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.indicator.styles.defaultState.width',
    to: 'components.carousel.indicator.width',
  },
  {
    from: 'usages.carousel.indicator.styles.defaultState.height',
    to: 'components.carousel.indicator.height',
  },
  {
    from: 'usages.carousel.indicator.styles.defaultState.border.radius',
    to: 'components.carousel.indicator.borderRadius',
  },

  // ─── Indicator - hover state ──────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.styles.state.hover.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.hoverBackground',
    transform: toColorString,
  },

  // ─── Indicator - active state ─────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.styles.state.active.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.activeBackground',
    transform: toColorString,
  },

  // ─── Indicator - focus state ──────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.styles.state.focus.focusRing.width',
    to: 'components.carousel.indicator.focusRing.width',
  },
  {
    from: 'usages.carousel.indicator.styles.state.focus.focusRing.style',
    to: 'components.carousel.indicator.focusRing.style',
  },
  {
    from: 'usages.carousel.indicator.styles.state.focus.focusRing.color',
    to: 'components.carousel.colorScheme.{mode}.indicator.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.indicator.styles.state.focus.focusRing.offset',
    to: 'components.carousel.indicator.focusRing.offset',
  },
];
