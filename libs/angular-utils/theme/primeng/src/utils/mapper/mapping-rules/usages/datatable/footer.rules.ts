import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const footerRules: MappingRule[] = [
  // ─── Footer row ───────────────────────────────────────────────────────────
  {
    from: 'usages.dataTable.footer.defaultState.background',
    to: 'components.datatable.footer.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.defaultState.color',
    to: 'components.datatable.footer.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.defaultState.border.color',
    to: 'components.datatable.footer.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.defaultState.border.width',
    to: 'components.datatable.footer.borderWidth',
    transform: (v) => (typeof v === 'string' ? v : undefined),
  },
  // PrimeNG's footer token takes a single padding value; the vertical axis is
  // handled by the companion CSS rules (padding-top / padding-bottom).
  {
    from: 'usages.dataTable.footer.defaultState.paddingX',
    to: 'components.datatable.footer.padding',
  },

  // ─── Footer cells ─────────────────────────────────────────────────────────
  {
    from: 'usages.dataTable.footer.cell.defaultState.background',
    to: 'components.datatable.footerCell.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.cell.defaultState.color',
    to: 'components.datatable.footerCell.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.cell.defaultState.border.color',
    to: 'components.datatable.footerCell.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.footer.cell.defaultState.paddingX',
    to: 'components.datatable.footerCell.padding',
  },
];
