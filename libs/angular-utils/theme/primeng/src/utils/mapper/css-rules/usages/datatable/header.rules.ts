import type { CssRule } from '../../../mapper.types';

export const headerRules: CssRule[] = [
  // ─── Header cell typography ───────────────────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-thead > tr > th',
    declarations: [
      {
        property: 'font-size',
        from: 'usages.table.header.defaultState.cell.defaultState.font.size',
      },
      {
        property: 'font-weight',
        from: 'usages.table.header.defaultState.cell.defaultState.font.weight',
      },
      {
        property: 'font-family',
        from: 'usages.table.header.defaultState.cell.defaultState.font.family',
      },
      {
        property: 'line-height',
        from: 'usages.table.header.defaultState.cell.defaultState.font.lineHeight',
      },
      {
        property: 'letter-spacing',
        from: 'usages.table.header.defaultState.cell.defaultState.font.letterSpacing',
      },
    ],
  },

  // ─── Header cell border widths (per-side) ─────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-thead > tr > th',
    declarations: [
      {
        property: 'border-top-width',
        from: 'usages.table.header.defaultState.cell.defaultState.border.width.top',
      },
      {
        property: 'border-right-width',
        from: 'usages.table.header.defaultState.cell.defaultState.border.width.right',
      },
      {
        property: 'border-bottom-width',
        from: 'usages.table.header.defaultState.cell.defaultState.border.width.bottom',
      },
      {
        property: 'border-left-width',
        from: 'usages.table.header.defaultState.cell.defaultState.border.width.left',
      },
    ],
  },
];
