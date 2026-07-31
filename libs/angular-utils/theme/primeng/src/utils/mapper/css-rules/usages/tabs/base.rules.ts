import type { CssRule } from '../../../mapper.types';

export const baseRules: CssRule[] = [
  // ─── Tablist viewport ───────────────────────────────────────────────────
  {
    selector: '.p-tablist-viewport',
    declarations: [
      {
        property: 'scroll-behavior',
        from: 'usages.tabs.viewport.scrollBehavior',
      },
      {
        property: 'overscroll-behavior',
        from: 'usages.tabs.viewport.overscrollBehavior',
      },
      {
        property: 'scrollbar-width',
        from: 'usages.tabs.viewport.scrollbarWidth',
      },
    ],
  },
  {
    selector: '.p-tablist-viewport::-webkit-scrollbar',
    declarations: [
      {
        property: 'display',
        from: 'usages.tabs.viewport.webkitScrollbarDisplay',
      },
    ],
  },
];