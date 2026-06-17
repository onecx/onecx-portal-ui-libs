import type { CssRule } from '../mapper.types';
import { datatableCssRules } from './usages/datatable.rules';
import { diagramCssRules } from './usages/diagram.rules';

export const usageCssRules: CssRule[] = [
  ...datatableCssRules,
  ...diagramCssRules
];
