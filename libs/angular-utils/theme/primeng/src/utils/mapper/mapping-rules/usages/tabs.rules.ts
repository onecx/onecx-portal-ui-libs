import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const tabsMappingRules: MappingRule[] = [
  {
    from: 'usages.tabs.tab.activeBar.transition.duration',
    to: 'components.tabs.root.transitionDuration',
  },
  {
    from: 'usages.tabs.tablist.border.width',
    to: 'components.tabs.tablist.borderWidth',
  },
  {
    from: 'usages.tabs.tablist.bg',
    to: 'components.tabs.tablist.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.border.color',
    to: 'components.tabs.tablist.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.bg',
    to: 'components.tabs.tab.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.hover.bg',
    to: 'components.tabs.tab.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.active.bg',
    to: 'components.tabs.tab.activeBackground',
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
    from: 'usages.tabs.tab.hover.border.color',
    to: 'components.tabs.tab.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.active.border.color',
    to: 'components.tabs.tab.activeBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.contrast',
    to: 'components.tabs.tab.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.hover.contrast',
    to: 'components.tabs.tab.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.active.contrast',
    to: 'components.tabs.tab.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.padding',
    to: 'components.tabs.tab.padding',
  },
  {
    from: 'usages.tabs.tab.font.weight',
    to: 'components.tabs.tab.fontWeight',
  },
  {
    from: 'usages.tabs.tab.margin',
    to: 'components.tabs.tab.margin',
  },
  {
    from: 'usages.tabs.tab.gap',
    to: 'components.tabs.tab.gap',
  },
  {
    from: 'usages.tabs.tab.focus.focusRing.width',
    to: 'components.tabs.tab.focusRing.width',
  },
  {
    from: 'usages.tabs.tab.focus.focusRing.style',
    to: 'components.tabs.tab.focusRing.style',
  },
  {
    from: 'usages.tabs.tab.focus.focusRing.color',
    to: 'components.tabs.tab.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.focus.focusRing.offset',
    to: 'components.tabs.tab.focusRing.offset',
  },
  {
    from: 'usages.tabs.tab.focus.focusRing.shadow',
    to: 'components.tabs.tab.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tabpanel.bg',
    to: 'components.tabs.tabpanel.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tabpanel.contrast',
    to: 'components.tabs.tabpanel.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tabpanel.padding',
    to: 'components.tabs.tabpanel.padding',
  },
  {
    from: 'usages.tabs.tabpanel.focusRing.width',
    to: 'components.tabs.tabpanel.focusRing.width',
  },
  {
    from: 'usages.tabs.tabpanel.focusRing.style',
    to: 'components.tabs.tabpanel.focusRing.style',
  },
  {
    from: 'usages.tabs.tabpanel.focusRing.color',
    to: 'components.tabs.tabpanel.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tabpanel.focusRing.offset',
    to: 'components.tabs.tabpanel.focusRing.offset',
  },
  {
    from: 'usages.tabs.tabpanel.focusRing.shadow',
    to: 'components.tabs.tabpanel.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.bg',
    to: 'components.tabs.navButton.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.contrast',
    to: 'components.tabs.navButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.hover.contrast',
    to: 'components.tabs.navButton.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.width',
    to: 'components.tabs.navButton.width',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.focusRing.width',
    to: 'components.tabs.navButton.focusRing.width',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.focusRing.style',
    to: 'components.tabs.navButton.focusRing.style',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.focusRing.color',
    to: 'components.tabs.navButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.focusRing.offset',
    to: 'components.tabs.navButton.focusRing.offset',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.focusRing.shadow',
    to: 'components.tabs.navButton.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tablist.leftNavButton.shadow',
    to: 'components.tabs.navButton.shadow',
  },
  {
    from: 'usages.tabs.tab.activeBar.size',
    to: 'components.tabs.activeBar.height',
  },
  {
    from: 'usages.tabs.tab.activeBar.bottom',
    to: 'components.tabs.activeBar.bottom',
  },
  {
    from: 'usages.tabs.tab.activeBar.bg',
    to: 'components.tabs.activeBar.background',
    transform: toColorString,
  },
];