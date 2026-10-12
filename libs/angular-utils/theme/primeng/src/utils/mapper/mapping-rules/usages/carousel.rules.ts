import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const carouselMappingRules: MappingRule[] = [
  // ─── Transition ───────────────────────────────────────────────────────────
  {
    from: 'usages.carousel.transitionDuration',
    to: 'components.carousel.root.transitionDuration',
  },

  // ─── Content ──────────────────────────────────────────────────────────────
  {
    from: 'usages.carousel.defaultVariant.content.gap',
    to: 'components.carousel.content.gap',
  },

  // NOTE: PrimeNG exposes `indicatorList.padding`/`indicatorList.gap`, but the
  // OneCX v1 carousel schema has no source token for them (the indicator object
  // carries no `padding`/`gap`), so they are intentionally not mapped here.

  // ─── Indicator - default state ────────────────────────────────────────────
  {
    from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.background',
    to: 'components.carousel.colorScheme.{mode}.indicator.background',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.width',
    to: 'components.carousel.indicator.width',
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.height',
    to: 'components.carousel.indicator.height',
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.border.radius',
    to: 'components.carousel.indicator.borderRadius',
  },

  // ─── Indicator - hover state ──────────────────────────────────────────────
  {
    from: 'usages.carousel.defaultVariant.indicator.defaultVariant.hover.background',
    to: 'components.carousel.colorScheme.{mode}.indicator.hoverBackground',
    transform: toColorString,
  },

  // ─── Indicator - active state ─────────────────────────────────────────────
  {
    from: 'usages.carousel.defaultVariant.indicator.defaultVariant.active.background',
    to: 'components.carousel.colorScheme.{mode}.indicator.activeBackground',
    transform: toColorString,
  },

  // ─── Indicator - focus ring (variant-level, not nested in a state) ───────
  {
    from: 'usages.carousel.defaultVariant.indicator.focusRing.width',
    to: 'components.carousel.indicator.focusRing.width',
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.focusRing.style',
    to: 'components.carousel.indicator.focusRing.style',
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.focusRing.color',
    to: 'components.carousel.colorScheme.{mode}.indicator.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.focusRing.offset',
    to: 'components.carousel.indicator.focusRing.offset',
  },
  {
    from: 'usages.carousel.defaultVariant.indicator.focusRing.shadow',
    to: 'components.carousel.indicator.focusRing.shadow',
  },
];
