import type { CssRule } from '../mapper.types';
import { badgeCssRules } from './usages/badge.rules';
import { carouselCssRules } from './usages/carousel.rules';
import { datatableCssRules } from './usages/datatable.rules';
import { fieldsetCssRules } from './usages/fieldset.rules';
import { diagramCssRules } from './usages/diagram.rules';
import { dialogCssRules } from './usages/dialog.rules';
import { menubarCssRules } from './usages/menubar.rules';
import { toggleswitchCssRules } from './usages/toggleswitch.rules';
import { tabsCssRules } from './usages/tabs.rules';
import { dropdownCssRules } from './usages/dropdown.rules';
import { textareaCssRules } from './usages/textarea.rules';

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...datatableCssRules,
  ...fieldsetCssRules,
  ...diagramCssRules,
  ...dialogCssRules,
  ...tabsCssRules,
  ...dropdownCssRules,
  ...badgeCssRules,
  ...menubarCssRules,
  ...toggleswitchCssRules,
  ...textareaCssRules,
];
