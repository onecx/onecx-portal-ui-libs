import type { CssRule } from '../../../mapper.types';

export const headerRules: CssRule[] = [
  // ─── Header cell typography ───────────────────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-thead > tr > th',
    declarations: [
      {
        property: 'font-size',
        from: 'usages.dataTable.header.defaultState.font.size',
      },
      {
        property: 'font-weight',
        from: 'usages.dataTable.header.defaultState.font.weight',
      },
      {
        property: 'font-family',
        from: 'usages.dataTable.header.defaultState.font.family',
      },
      {
        property: 'line-height',
        from: 'usages.dataTable.header.defaultState.font.lineHeight',
      },
      {
        property: 'letter-spacing',
        from: 'usages.dataTable.header.defaultState.font.letterSpacing',
      },
    ],
  },

  // ─── Header cell border widths (per-side) ─────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-thead > tr > th',
    declarations: [
      {
        property: 'border-top-width',
        from: 'usages.dataTable.header.defaultState.border.width.top',
      },
      {
        property: 'border-right-width',
        from: 'usages.dataTable.header.defaultState.border.width.right',
      },
      {
        property: 'border-bottom-width',
        from: 'usages.dataTable.header.defaultState.border.width.bottom',
      },
      {
        property: 'border-left-width',
        from: 'usages.dataTable.header.defaultState.border.width.left',
      },
    ],
  },
];
