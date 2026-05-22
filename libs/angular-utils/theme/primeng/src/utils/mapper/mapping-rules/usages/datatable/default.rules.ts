import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const defaultRules: MappingRule[] = [
  {
    from: 'usages.table.default.border.color',
    to: 'components.datatable.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.table.default.border.color',
    to: 'components.datatable.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
];
