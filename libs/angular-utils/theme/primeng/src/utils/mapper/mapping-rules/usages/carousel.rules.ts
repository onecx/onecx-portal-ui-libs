import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const carouselMappingRules: MappingRule[] = [
  // ─── Transition ───────────────────────────────────────────────────────────
  {
    from: 'usages.carousel.transition.duration',
    to: 'components.carousel.root.transitionDuration',
  },

  // ─── Content ──────────────────────────────────────────────────────────────
  {
    from: 'usages.carousel.content.gap',
    to: 'components.carousel.content.gap',
  },

  // NOTE: PrimeNG exposes `indicatorList.padding`/`indicatorList.gap`, but the
  // OneCX v1 carousel schema has no source token for them (the indicator object
  // carries no `padding`/`gap`), so they are intentionally not mapped here.

  // ─── Indicator - default state ────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.background',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.indicator.width',
    to: 'components.carousel.indicator.width',
  },
  {
    from: 'usages.carousel.indicator.height',
    to: 'components.carousel.indicator.height',
  },
  {
    from: 'usages.carousel.indicator.border.radius',
    to: 'components.carousel.indicator.borderRadius',
  },

  // ─── Indicator - hover state ──────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.hover.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.hoverBackground',
    transform: toColorString,
  },

  // ─── Indicator - active state ─────────────────────────────────────────────
  {
    from: 'usages.carousel.indicator.active.bg',
    to: 'components.carousel.colorScheme.{mode}.indicator.activeBackground',
    transform: toColorString,
  },

  // ─── Indicator - focus ring (variant-level, not nested in focus state) ───
  {
    from: 'usages.carousel.indicator.focusRing.width',
    to: 'components.carousel.indicator.focusRing.width',
  },
  {
    from: 'usages.carousel.indicator.focusRing.style',
    to: 'components.carousel.indicator.focusRing.style',
  },
  {
    from: 'usages.carousel.indicator.focusRing.color',
    to: 'components.carousel.colorScheme.{mode}.indicator.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.indicator.focusRing.offset',
    to: 'components.carousel.indicator.focusRing.offset',
  },
  {
    from: 'usages.carousel.indicator.focusRing.shadow',
    to: 'components.carousel.indicator.focusRing.shadow',
  },
];
