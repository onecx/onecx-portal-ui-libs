import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const rowRules: MappingRule[] = [
  // ─── Body rows (even = primary row background) ────────────────────────────
  {
    from: 'usages.table.row.defaultState.even.defaultState.bg',
    to: 'components.datatable.row.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.row.defaultState.even.defaultState.contrast',
    to: 'components.datatable.row.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.row.defaultState.even.state.hover.bg',
    to: 'components.datatable.row.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.table.row.defaultState.even.state.hover.contrast',
    to: 'components.datatable.row.hoverColor',
    transform: toColorString,
  },

  // ─── Body cells ───────────────────────────────────────────────────────────
  {
    from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.border.color',
    to: 'components.datatable.bodyCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.row.defaultState.even.defaultState.cell.defaultState.padding',
    to: 'components.datatable.bodyCell.padding',
  },

  // ─── Striped rows (odd rows = stripedBackground) ──────────────────────────
  {
    from: 'usages.table.row.defaultState.odd.defaultState.bg',
    to: 'components.datatable.colorScheme.{mode}.row.stripedBackground',
    transform: toColorString,
  },
];
