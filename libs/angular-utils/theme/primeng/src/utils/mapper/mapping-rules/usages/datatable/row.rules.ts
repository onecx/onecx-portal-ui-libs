import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const rowRules: MappingRule[] = [
  // ─── Body rows (even = primary row background) ────────────────────────────
  {
    from: 'usages.dataTable.row.even.defaultState.background',
    to: 'components.datatable.row.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.row.even.defaultState.color',
    to: 'components.datatable.row.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.row.even.hover.background',
    to: 'components.datatable.row.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.row.even.hover.color',
    to: 'components.datatable.row.hoverColor',
    transform: toColorString,
  },

  // ─── Body cells ───────────────────────────────────────────────────────────
  {
    from: 'usages.dataTable.row.cell.defaultState.border.color',
    to: 'components.datatable.bodyCell.borderColor',
    transform: toColorString,
  },
  // PrimeNG's bodyCell token takes a single padding value; the vertical axis
  // is handled by the companion CSS rules (padding-top / padding-bottom).
  {
    from: 'usages.dataTable.row.cell.defaultState.paddingX',
    to: 'components.datatable.bodyCell.padding',
  },

  // ─── Striped rows (odd rows = stripedBackground) ──────────────────────────
  {
    from: 'usages.dataTable.row.odd.defaultState.background',
    to: 'components.datatable.colorScheme.{mode}.row.stripedBackground',
    transform: toColorString,
  },
];
