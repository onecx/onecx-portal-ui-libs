import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const navbuttonRules: MappingRule[] = [
  // ─── Navigation buttons
  {
    from: 'usages.tabs.navButtons.defaultState.background',
    to: 'components.tabs.navButton.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButtons.defaultState.color',
    to: 'components.tabs.navButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButtons.defaultState.width',
    to: 'components.tabs.navButton.width',
  },
  {
    from: 'usages.tabs.navButtons.hover.color',
    to: 'components.tabs.navButton.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButtons.defaultState.focusRing.width',
    to: 'components.tabs.navButton.focusRing.width',
  },
  {
    from: 'usages.tabs.navButtons.defaultState.focusRing.style',
    to: 'components.tabs.navButton.focusRing.style',
  },
  {
    from: 'usages.tabs.navButtons.defaultState.focusRing.color',
    to: 'components.tabs.navButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButtons.defaultState.focusRing.offset',
    to: 'components.tabs.navButton.focusRing.offset',
  },
  {
    from: 'usages.tabs.navButtons.defaultState.focusRing.shadow',
    to: 'components.tabs.navButton.focusRing.shadow',
  },
];
