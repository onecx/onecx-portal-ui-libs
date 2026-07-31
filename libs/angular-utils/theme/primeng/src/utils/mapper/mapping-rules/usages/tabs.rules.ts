import type { MappingRule } from '../../mapper.types';
import { baseRules } from './tabs/base.rules';
import { tabRules } from './tabs/tab.rules';
import { tabpanelRules } from './tabs/tabpanel.rules';
import { navbuttonRules } from './tabs/navbutton.rules';

export const tabsMappingRules: MappingRule[] = [
  ...baseRules,
  ...tabRules,
  ...tabpanelRules,
  ...navbuttonRules,
];