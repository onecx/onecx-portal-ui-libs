import type { MappingRule } from '../mapper.types';
import { datatableMappingRules } from './usages/datatable.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { fieldsetMappingRules } from './usages/fieldset.rules';

export const usageMappingRules: MappingRule[] = [
  ...datatableMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
  ...fieldsetMappingRules
];
