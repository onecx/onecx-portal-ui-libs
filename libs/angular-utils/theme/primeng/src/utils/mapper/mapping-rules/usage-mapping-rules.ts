import type { MappingRule } from '../mapper.types';
import { calendarMappingRules } from './usages/calendar.rules';
import { datatableMappingRules } from './usages/datatable.rules';
import { dialogMappingRules } from './usages/dialog.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { carouselMappingRules } from './usages/carousel.rules';

export const usageMappingRules: MappingRule[] = [
  ...calendarMappingRules,
  ...datatableMappingRules,
  ...dialogMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
];
