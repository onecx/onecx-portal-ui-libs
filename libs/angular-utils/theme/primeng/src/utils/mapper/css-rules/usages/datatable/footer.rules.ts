import type { CssRule } from '../../../mapper.types';

export const footerRules: CssRule[] = [
  // ─── Footer cell typography and alignment ────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-tfoot > tr > td',
    declarations: [
      {
        property: 'font-size',
        from: 'usages.table.footer.defaultState.cell.defaultState.font.size',
      },
      {
        property: 'font-weight',
        from: 'usages.table.footer.defaultState.cell.defaultState.font.weight',
      },
      {
        property: 'font-family',
        from: 'usages.table.footer.defaultState.cell.defaultState.font.family',
      },
      {
        property: 'text-align',
        from: 'usages.table.footer.defaultState.cell.defaultState.textAlign',
      },
    ],
  },

  // ─── Footer cell border widths (per-side) ────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-tfoot > tr > td',
    declarations: [
      {
        property: 'border-top-width',
        from: 'usages.table.footer.defaultState.cell.defaultState.border.width.top',
      },
      {
        property: 'border-right-width',
        from: 'usages.table.footer.defaultState.cell.defaultState.border.width.right',
      },
      {
        property: 'border-bottom-width',
        from: 'usages.table.footer.defaultState.cell.defaultState.border.width.bottom',
      },
      {
        property: 'border-left-width',
        from: 'usages.table.footer.defaultState.cell.defaultState.border.width.left',
      },
    ],
  },
];
