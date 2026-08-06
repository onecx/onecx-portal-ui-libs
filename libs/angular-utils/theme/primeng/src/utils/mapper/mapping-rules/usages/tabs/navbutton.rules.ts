import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const navbuttonRules: MappingRule[] = [
  // ─── Navigation buttons icon ──────────────────────────────────────────────
  // Note: navButtons schema only exposes icon tokens (nextIcon, prevIcon).
  // Nav button background/color/hover/width/focusRing/shadow are handled via
  // CSS rules because there are no matching theme tokens in the v1 schema.
  {
    from: 'usages.tabs.navButtons.nextIcon.color',
    to: 'components.tabs.navButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.navButtons.prevIcon.color',
    to: 'components.tabs.navButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.tabs.focusRing.width',
    to: 'components.tabs.navButton.focusRing.width',
  },
  {
    from: 'usages.tabs.focusRing.shadow',
    to: 'components.tabs.navButton.focusRing.shadow',
  },
    {
    from: 'usages.tabs.focusRing.offset',
    to: 'components.tabs.navButton.focusRing.offset',
  },
];