import type { MappingRule } from '../mapper.types';
import { buttonMappingRules } from './usages/button.rules';
import { datatableMappingRules } from './usages/datatable.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { carouselMappingRules } from './usages/carousel.rules';

export const usageMappingRules: MappingRule[] = [
  ...buttonMappingRules,
  ...datatableMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
];
