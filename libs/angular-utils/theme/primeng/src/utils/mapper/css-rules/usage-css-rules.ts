import type { CssRule } from '../mapper.types';
import { datatableCssRules } from './usages/datatable.rules';
import { dialogCssRules } from './usages/dialog.rules';

export const usageCssRules: CssRule[] = [
  ...datatableCssRules,
  ...dialogCssRules,
];
