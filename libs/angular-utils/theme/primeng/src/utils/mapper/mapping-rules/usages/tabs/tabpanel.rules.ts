import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const tabpanelRules: MappingRule[] = [
  // ─── Tabpanel ─────────────────────────────────────────────────────────────
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
    from: 'usages.tabs.tabpanel.paddingX',
    to: 'components.tabs.tabpanel.padding',
  },

  // ─── Tabpanel focus ring (inherited from tab-level focusRing) ─────────────
  {
    from: 'usages.tabs.tab.focusRing.width',
    to: 'components.tabs.tabpanel.focusRing.width',
  },
  {
    from: 'usages.tabs.tab.focusRing.shadow',
    to: 'components.tabs.tabpanel.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tab.focusRing.offset',
    to: 'components.tabs.tabpanel.focusRing.offset',
  },
];