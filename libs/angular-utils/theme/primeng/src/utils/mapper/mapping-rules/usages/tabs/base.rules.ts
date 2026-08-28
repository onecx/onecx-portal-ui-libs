import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const baseRules: MappingRule[] = [
  // ─── Root ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tab.activeBar.transition.duration',
    to: 'components.tabs.root.transitionDuration',
  },

  // ─── Tablist ──────────────────────────────────────────────────────────────
  {
    from: 'usages.tabs.tablist.background',
    to: 'components.tabs.tablist.background',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.tablist.border.width',
    to: 'components.tabs.tablist.borderWidth',
  },
  {
    from: 'usages.tabs.tablist.border.color',
    to: 'components.tabs.tablist.borderColor',
    transform: toColorString,
  },
];