import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const tabRules: MappingRule[] = [
  // ─── Tab default state ────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.background',
    to: 'components.tabs.tab.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.color',
    to: 'components.tabs.tab.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.border.width',
    to: 'components.tabs.tab.borderWidth',
  },
  {
    from: 'usages.tabs.tab.border.color',
    to: 'components.tabs.tab.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.paddingX',
    to: 'components.tabs.tab.padding',
  },
  {
    from: 'usages.tabs.tab.gap',
    to: 'components.tabs.tab.gap',
  },

  // ─── Tab hover state ──────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.hover.background',
    to: 'components.tabs.tab.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.hover.color',
    to: 'components.tabs.tab.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.hover.border.color',
    to: 'components.tabs.tab.hoverBorderColor',
    transform: toColorString,
  },

  // ─── Tab active state ─────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.active.background',
    to: 'components.tabs.tab.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.active.color',
    to: 'components.tabs.tab.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.active.border.color',
    to: 'components.tabs.tab.activeBorderColor',
    transform: toColorString,
  },

  // ─── Tab focus ring ────────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.focusRing.width',
    to: 'components.tabs.tab.focusRing.width',
  },
  {
    from: 'usages.tabs.tab.focusRing.shadow',
    to: 'components.tabs.tab.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tab.focusRing.offset',
    to: 'components.tabs.tab.focusRing.offset',
  },

  // ─── Active bar ───────────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.activeBar.background',
    to: 'components.tabs.activeBar.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.activeBar.height',
    to: 'components.tabs.activeBar.height',
  },
  // NOTE: the theme exposes `activeBar.position` (a direction: top/bottom/left/right)
  // and `activeBar.positionOffset` (a distance from the edge). PrimeNG only models a
  // `bottom` distance, so the offset maps here; the direction itself is not expressible
  // as a preset token (would need a CSS rule to support top/left/right placement).
  {
    from: 'usages.tabs.tab.activeBar.positionOffset',
    to: 'components.tabs.activeBar.bottom',
  },
];