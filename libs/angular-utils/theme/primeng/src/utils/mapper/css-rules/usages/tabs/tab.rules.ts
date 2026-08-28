import type { CssRule } from '../../../mapper.types';

export const tabRules: CssRule[] = [
  // ─── Tab hover state ────────────────────────────────────────────────────
  {
    selector: '.p-tab:not(.p-disabled):hover',
    declarations: [
      { property: 'cursor', from: 'usages.tabs.tab.hover.cursor' },
    ],
  },

  // ─── Tab focus state ──────────────────────────────────────────────────
  {
    selector: '.p-tab:not(.p-disabled):focus-visible',
    declarations: [
      { property: 'background', from: 'usages.tabs.tab.focus.background' },
      { property: 'border-color', from: 'usages.tabs.tab.focus.border.color' },
      { property: 'color', from: 'usages.tabs.tab.focus.color' },
    ],
  },

  // ─── Tab disabled state ───────────────────────────────────────────────
  {
    selector: '.p-tab.p-disabled, .p-tab[aria-disabled="true"]',
    declarations: [
      { property: 'background', from: 'usages.tabs.tab.disabled.background' },
      { property: 'color', from: 'usages.tabs.tab.disabled.color' },
      { property: 'cursor', from: 'usages.tabs.tab.disabled.cursor' },
    ],
  },

  // ─── Active bar ───────────────────────────────────────────────────────
  {
    selector: '.p-tablist-active-bar',
    declarations: [
      {
        property: 'transition-duration',
        from: 'usages.tabs.tab.activeBar.transition.duration',
      },
    ],
  },
];