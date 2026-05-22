import type { MappingRule } from '../../mapper.types';
import { defaultRules } from './datatable/default.rules';
import { headerRules } from './datatable/header.rules';
import { rowRules } from './datatable/row.rules';
import { footerRules } from './datatable/footer.rules';

export const datatableMappingRules: MappingRule[] = [
  ...defaultRules,
  ...headerRules,
  ...rowRules,
  ...footerRules,
];
