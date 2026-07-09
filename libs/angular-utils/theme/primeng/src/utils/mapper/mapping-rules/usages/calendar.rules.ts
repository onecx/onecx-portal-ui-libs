import type { MappingRule } from '../../mapper.types';
import { baseRules } from './calendar/base.rules';
import { headerRules } from './calendar/header.rules';
import { navigationRules } from './calendar/navigation.rules';
import { calendarRules } from './calendar/calendar.rules';
import { controlsRules } from './calendar/controls.rules';

export const calendarMappingRules: MappingRule[] = [
  ...baseRules,
  ...headerRules,
  ...calendarRules,
  ...controlsRules,
  ...navigationRules,
];
