import type { CssRule } from '../mapper.types';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';
import { diagramCssRules } from './usages/diagram.rules';

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...datatableCssRules,
  ...diagramCssRules
];
