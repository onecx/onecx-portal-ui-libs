import type { CssRule } from '../mapper.types';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';
import { dialogCssRules } from './usages/dialog.rules';
import { tabsCssRules } from './usages/tabs.rules';

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...datatableCssRules,
  ...dialogCssRules,
  ...tabsCssRules,
];
