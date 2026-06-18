import type { MappingRule } from '../mapper.types';
import { badgeMappingRules } from './usages/badge.rules';
import { datatableMappingRules } from './usages/datatable.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';

export const usageMappingRules: MappingRule[] = [
  ...badgeMappingRules,
  ...datatableMappingRules,
  ...tooltipMappingRules,
];
