import type { CssRule } from '../../mapper.types';
import { baseRules } from './tabs/base.rules';
import { tabRules } from './tabs/tab.rules';
import { navbuttonRules } from './tabs/navbutton.rules';

export const tabsCssRules: CssRule[] = [
  ...baseRules,
  ...tabRules,
  ...navbuttonRules,
];