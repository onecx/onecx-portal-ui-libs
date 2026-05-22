import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const footerRules: MappingRule[] = [
  // ─── Footer row ───────────────────────────────────────────────────────────
  {
    from: 'usages.table.footer.default.bg',
    to: 'components.datatable.footer.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.contrast',
    to: 'components.datatable.footer.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.border.color',
    to: 'components.datatable.footer.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.border.width',
    to: 'components.datatable.footer.borderWidth',
    transform: (v) => (typeof v === 'string' ? v : undefined),
  },
  {
    from: 'usages.table.footer.default.padding',
    to: 'components.datatable.footer.padding',
  },

  // ─── Footer cells ─────────────────────────────────────────────────────────
  {
    from: 'usages.table.footer.default.cell.default.bg',
    to: 'components.datatable.footerCell.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.cell.default.contrast',
    to: 'components.datatable.footerCell.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.cell.default.border.color',
    to: 'components.datatable.footerCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.default.cell.default.padding',
    to: 'components.datatable.footerCell.padding',
  },
];
