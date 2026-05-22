import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const headerRules: MappingRule[] = [
  // ─── Header row ───────────────────────────────────────────────────────────
  {
    from: 'usages.table.header.default.bg',
    to: 'components.datatable.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.contrast',
    to: 'components.datatable.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.border.color',
    to: 'components.datatable.header.borderColor',
    transform: toColorString,
  },
  // borderWidth is only written when it is a plain string; object form
  // ({ top, right, bottom, left }) is handled via CSS rules instead.
  {
    from: 'usages.table.header.default.border.width',
    to: 'components.datatable.header.borderWidth',
    transform: (v) => (typeof v === 'string' ? v : undefined),
  },
  {
    from: 'usages.table.header.default.padding',
    to: 'components.datatable.header.padding',
  },

  // ─── Header cells ─────────────────────────────────────────────────────────
  {
    from: 'usages.table.header.default.cell.default.bg',
    to: 'components.datatable.headerCell.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.cell.default.contrast',
    to: 'components.datatable.headerCell.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.cell.default.border.color',
    to: 'components.datatable.headerCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.cell.default.padding',
    to: 'components.datatable.headerCell.padding',
  },
  {
    from: 'usages.table.header.default.cell.default.font.weight',
    to: 'components.datatable.columnTitle.fontWeight',
  },
  // Hover state
  {
    from: 'usages.table.header.default.cell.state.hover.bg',
    to: 'components.datatable.headerCell.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.cell.state.hover.contrast',
    to: 'components.datatable.headerCell.hoverColor',
    transform: toColorString,
  },
  // Selected state
  {
    from: 'usages.table.header.default.cell.state.selected.bg',
    to: 'components.datatable.headerCell.selectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.table.header.default.cell.state.selected.contrast',
    to: 'components.datatable.headerCell.selectedColor',
    transform: toColorString,
  },
];
