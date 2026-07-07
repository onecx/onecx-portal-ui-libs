import type { CssRule } from '../mapper.types';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';
import { fieldsetCssRules } from './usages/fieldset.rules';
import { diagramCssRules } from './usages/diagram.rules';
import { dialogCssRules } from './usages/dialog.rules';
import { dropdownCssRules } from './usages/dropdown.rules';

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...datatableCssRules,
  ...fieldsetCssRules,
  ...diagramCssRules,
  ...dialogCssRules,
  ...dropdownCssRules,
];
