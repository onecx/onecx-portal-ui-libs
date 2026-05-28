import type { MappingRule } from '../../mapper.types';
import { baseRules } from './datatable/base.rules';
import { headerRules } from './datatable/header.rules';
import { rowRules } from './datatable/row.rules';
import { footerRules } from './datatable/footer.rules';

export const datatableMappingRules: MappingRule[] = [
  ...baseRules,
  ...headerRules,
  ...rowRules,
  ...footerRules,
];
