import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const baseRules: MappingRule[] = [
  {
    from: 'usages.dataTable.base.border.color',
    to: 'components.datatable.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataTable.base.border.color',
    to: 'components.datatable.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
];
