import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const tabsMappingRules: MappingRule[] = [
  {
    from: 'usages.tabs.transition.duration',
    to: 'components.tabs.root.transitionDuration',
  },
  {
    from: 'usages.tabs.tablist.border.width',
    to: 'components.tabs.tablist.borderWidth',
  },
  {
    from: 'usages.tabs.tablist.background',
    to: 'components.tabs.tablist.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.border.color',
    to: 'components.tabs.tablist.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.defaultState.background',
    to: 'components.tabs.tab.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.hover.background',
    to: 'components.tabs.tab.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.active.background',
    to: 'components.tabs.tab.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.border.width',
    to: 'components.tabs.tab.borderWidth',
  },
  {
    from: 'usages.tabs.tab.defaultState.borderColor',
    to: 'components.tabs.tab.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.hover.borderColor',
    to: 'components.tabs.tab.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.active.borderColor',
    to: 'components.tabs.tab.activeBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.defaultState.color',
    to: 'components.tabs.tab.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.hover.color',
    to: 'components.tabs.tab.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.active.color',
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
    from: 'usages.tabs.tab.state.focus.focusRing.width',
    to: 'components.tabs.tab.focusRing.width',
  },
  {
    from: 'usages.tabs.tab.state.focus.focusRing.style',
    to: 'components.tabs.tab.focusRing.style',
  },
  {
    from: 'usages.tabs.tab.state.focus.focusRing.color',
    to: 'components.tabs.tab.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tab.state.focus.focusRing.offset',
    to: 'components.tabs.tab.focusRing.offset',
  },
  {
    from: 'usages.tabs.tab.state.focus.focusRing.shadow',
    to: 'components.tabs.tab.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tabpanel.background',
    to: 'components.tabs.tabpanel.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tabpanel.color',
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
    from: 'usages.tabs.navButton.background',
    to: 'components.tabs.navButton.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButton.color',
    to: 'components.tabs.navButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButton.hoverColor',
    to: 'components.tabs.navButton.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButton.width',
    to: 'components.tabs.navButton.width',
  },
  {
    from: 'usages.tabs.navButton.focusRing.width',
    to: 'components.tabs.navButton.focusRing.width',
  },
  {
    from: 'usages.tabs.navButton.focusRing.style',
    to: 'components.tabs.navButton.focusRing.style',
  },
  {
    from: 'usages.tabs.navButton.focusRing.color',
    to: 'components.tabs.navButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButton.focusRing.offset',
    to: 'components.tabs.navButton.focusRing.offset',
  },
  {
    from: 'usages.tabs.navButton.focusRing.shadow',
    to: 'components.tabs.navButton.focusRing.shadow',
  },
  {
    from: 'usages.tabs.navButton.shadow',
    to: 'components.tabs.navButton.shadow',
  },
  {
    from: 'usages.tabs.activeBar.size',
    to: 'components.tabs.activeBar.height',
  },
  {
    from: 'usages.tabs.activeBar.bottom',
    to: 'components.tabs.activeBar.bottom',
  },
  {
    from: 'usages.tabs.activeBar.background',
    to: 'components.tabs.activeBar.background',
    transform: toColorString,
  },
];