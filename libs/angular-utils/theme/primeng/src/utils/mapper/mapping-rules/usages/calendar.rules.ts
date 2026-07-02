import type { MappingRule } from '../../mapper.types';
import { baseRules } from './calendar/base.rules';
import { headerRules } from './calendar/header.rules';
import { dropdownRules } from './calendar/dropdown.rules';
import { navigationRules } from './calendar/navigation.rules';
import { calendarRules } from './calendar/calendar.rules';
import { controlsRules } from './calendar/controls.rules';

export const calendarMappingRules: MappingRule[] = [
  ...baseRules,
  ...headerRules,
  ...dropdownRules,
  ...calendarRules,
  ...controlsRules,
  ...navigationRules,
];
