import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const footerRules: MappingRule[] = [
  // ─── Footer row ───────────────────────────────────────────────────────────
  {
    from: 'usages.table.footer.defaultState.bg',
    to: 'components.datatable.footer.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.contrast',
    to: 'components.datatable.footer.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.border.color',
    to: 'components.datatable.footer.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.border.width',
    to: 'components.datatable.footer.borderWidth',
    transform: (v) => (typeof v === 'string' ? v : undefined),
  },
  {
    from: 'usages.table.footer.defaultState.padding',
    to: 'components.datatable.footer.padding',
  },

  // ─── Footer cells ─────────────────────────────────────────────────────────
  {
    from: 'usages.table.footer.defaultState.cell.defaultState.bg',
    to: 'components.datatable.footerCell.background',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.cell.defaultState.contrast',
    to: 'components.datatable.footerCell.color',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.cell.defaultState.border.color',
    to: 'components.datatable.footerCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.footer.defaultState.cell.defaultState.padding',
    to: 'components.datatable.footerCell.padding',
  },
];
