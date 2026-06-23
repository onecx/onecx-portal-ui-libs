import type { CssRule } from '../mapper.types';
import { buttonCssRules } from './usages/button.rules';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';

export const usageCssRules: CssRule[] = [
  ...buttonCssRules,
  ...carouselCssRules,
  ...datatableCssRules,
];
