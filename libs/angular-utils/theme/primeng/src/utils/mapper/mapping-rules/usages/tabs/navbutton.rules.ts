import type { MappingRule } from '../../../mapper.types';

export const navbuttonRules: MappingRule[] = [
  // ─── Navigation buttons focus ring (inherited from tab-level focusRing) ────
  // Note: navButtons schema only exposes icon tokens (nextIcon, prevIcon) as
  // glyph references. Nav button background/color/hover/width/shadow have no
  // matching theme tokens in the v1 schema and are handled via CSS rules.
  {
    from: 'usages.tabs.tab.focusRing.width',
    to: 'components.tabs.navButton.focusRing.width',
  },
  {
    from: 'usages.tabs.tab.focusRing.shadow',
    to: 'components.tabs.navButton.focusRing.shadow',
  },
  {
    from: 'usages.tabs.tab.focusRing.offset',
    to: 'components.tabs.navButton.focusRing.offset',
  },
];
