import type { CssRule } from './mapper.types';

/**
 * Declarative list of CSS rules that cannot be expressed as PrimeNG preset
 * tokens.  Each `CssDeclaration` produces a single CSS declaration line.
 *
 * Declarations with `from` are only included when the resolved theme has a
 * value at that dot-path (keeping the output lean).
 *
 * Declarations with a static `value` are always included — use these for
 * structural requirements that don't come from a theme token (e.g. `overflow:
 * hidden` needed to clip border-radius on a table container).
 *
 * ### Extending this list
 * To add CSS for a new unmappable property: add a new `CssRule` entry (or
 * extend an existing one's `declarations` array).  No changes to mapper.ts.
 */
export const CSS_RULES: CssRule[] = [
  // ─── Table root container ─────────────────────────────────────────────────
  {
    selector: '.p-datatable',
    declarations: [
      {
        property: 'background',
        from: 'usages.table.base.bg',
      },
      {
        property: 'border-color',
        from: 'usages.table.base.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.table.base.border.width',
      },
      {
        property: 'border-style',
        from: 'usages.table.base.border.style',
      },
      {
        property: 'border-radius',
        from: 'usages.table.base.border.radius',
      },
      {
        property: 'box-shadow',
        from: 'usages.table.base.shadow',
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
        from: 'usages.table.base.borderCollapse',
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
        from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.border.width.top',
      },
      {
        property: 'border-right-width',
        from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.border.width.right',
      },
      {
        property: 'border-bottom-width',
        from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.border.width.bottom',
      },
      {
        property: 'border-left-width',
        from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.border.width.left',
      },
    ],
  },

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

  // ─── Paginator ────────────────────────────────────────────────────────────
  {
    selector: '.p-datatable .p-paginator',
    declarations: [
      {
        property: 'background',
        from: 'usages.table.base.bg',
      },
      {
        property: 'border-top',
        value: 'none',
      },
    ],
  },
];
