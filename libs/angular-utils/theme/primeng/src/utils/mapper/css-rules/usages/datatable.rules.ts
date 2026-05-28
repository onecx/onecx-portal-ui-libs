import type { CssRule } from '../../mapper.types';
import { baseRules } from './datatable/base.rules';
import { headerRules } from './datatable/header.rules';
import { footerRules } from './datatable/footer.rules';

export const datatableCssRules: CssRule[] = [
  ...baseRules,
  ...headerRules,
  ...footerRules,
];
