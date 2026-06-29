import type { CssRule } from '../mapper.types';
import { badgeCssRules } from './usages/badge.rules';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';
import { dialogCssRules } from './usages/dialog.rules';

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...datatableCssRules,
  ...dialogCssRules,
  ...badgeCssRules,
];
