import type { CssRule } from '../../../mapper.types';

export const baseRules: CssRule[] = [
  // ─── Table root container ─────────────────────────────────────────────────
  {
    selector: '.p-datatable',
    declarations: [
      {
        property: 'background',
        from: 'usages.dataTable.base.background',
      },
      {
        property: 'border-color',
        from: 'usages.dataTable.base.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.dataTable.base.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.dataTable.base.border.style',
      },
      {
        property: 'border-radius',
        from: 'usages.dataTable.base.border.radius',
      },
      {
        property: 'box-shadow',
        from: 'usages.dataTable.base.shadow',
      },
      {
        // Required for border-radius to clip child elements (header, rows).
        property: 'overflow',
        value: 'hidden',
      },
      // Region-level font applied to the whole table
      {
        property: 'font-family',
        from: 'usages.region.font.family',
      },
      {
        property: 'font-size',
        from: 'usages.region.font.size',
      },
      {
        property: 'font-weight',
        from: 'usages.region.font.weight',
      },
      {
        property: 'line-height',
        from: 'usages.region.font.lineHeight',
      },
      {
        property: 'letter-spacing',
        from: 'usages.region.font.letterSpacing',
      },
    ],
  },

  // ─── Table layout ─────────────────────────────────────────────────────────
  {
    selector: '.p-datatable .p-datatable-table',
    declarations: [
      {
        property: 'border-collapse',
        from: 'usages.dataTable.base.borderCollapse',
      },
    ],
  },

  // ─── Per-side border widths on header and body cells ─────────────────────
  // PrimeNG's headerCell / bodyCell borderWidth tokens only accept a single
  // string.  When the theme defines an object { top, right, bottom, left },
  // emit per-side properties via CSS instead.
  {
    selector:
      '.p-datatable .p-datatable-thead > tr > th,' +
      '\n.p-datatable .p-datatable-tbody > tr > td',
    declarations: [
      {
        property: 'border-top-width',
        from: 'usages.dataTable.row.cell.defaultState.border.width.top',
      },
      {
        property: 'border-right-width',
        from: 'usages.dataTable.row.cell.defaultState.border.width.right',
      },
      {
        property: 'border-bottom-width',
        from: 'usages.dataTable.row.cell.defaultState.border.width.bottom',
      },
      {
        property: 'border-left-width',
        from: 'usages.dataTable.row.cell.defaultState.border.width.left',
      },
    ],
  },

  // ─── Paginator ────────────────────────────────────────────────────────────
  {
    selector: '.p-datatable .p-paginator',
    declarations: [
      {
        property: 'background',
        from: 'usages.dataTable.base.background',
      },
      {
        property: 'border-top',
        value: 'none',
      },
    ],
  },
];
