import type { MappingRule } from '../mapper.types';
import { datatableMappingRules } from './usages/datatable.rules';
import { dialogMappingRules } from './usages/dialog.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';

export const usageMappingRules: MappingRule[] = [
  ...datatableMappingRules,
  ...dialogMappingRules,
  ...tooltipMappingRules,
];
