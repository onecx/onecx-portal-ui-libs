import type { MappingRule } from '../mapper.types';
import { datatableMappingRules } from './usages/datatable.rules';

export const usageMappingRules: MappingRule[] = [
  ...datatableMappingRules,
];
