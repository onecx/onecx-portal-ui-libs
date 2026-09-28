import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const headerRules: MappingRule[] = [
  // ─── Header row ───────────────────────────────────────────────────────────
  {
    from: 'usages.dataTable.header.defaultState.background',
    to: 'components.datatable.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.defaultState.color',
    to: 'components.datatable.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.defaultState.border.color',
    to: 'components.datatable.header.borderColor',
    transform: toColorString,
  },
  // borderWidth is only written when it is a plain string; object form
  // ({ top, right, bottom, left }) is handled via CSS rules instead.
  {
    from: 'usages.dataTable.header.defaultState.border.width',
    to: 'components.datatable.header.borderWidth',
    transform: (v) => (typeof v === 'string' ? v : undefined),
  },
  // PrimeNG's header token takes a single padding value; the vertical axis is
  // handled by the companion CSS rules (padding-top / padding-bottom).
  {
    from: 'usages.dataTable.header.defaultState.paddingX',
    to: 'components.datatable.header.padding',
  },

  // ─── Header cells ─────────────────────────────────────────────────────────
  {
    from: 'usages.dataTable.header.defaultState.background',
    to: 'components.datatable.headerCell.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.defaultState.color',
    to: 'components.datatable.headerCell.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.defaultState.border.color',
    to: 'components.datatable.headerCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.defaultState.paddingX',
    to: 'components.datatable.headerCell.padding',
  },
  {
    from: 'usages.dataTable.columnTitle.font.weight',
    to: 'components.datatable.columnTitle.fontWeight',
  },
  // Hover state
  {
    from: 'usages.dataTable.header.hover.background',
    to: 'components.datatable.headerCell.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.hover.color',
    to: 'components.datatable.headerCell.hoverColor',
    transform: toColorString,
  },
  // Selected state
  {
    from: 'usages.dataTable.header.selected.background',
    to: 'components.datatable.headerCell.selectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.header.selected.color',
    to: 'components.datatable.headerCell.selectedColor',
    transform: toColorString,
  },
];
