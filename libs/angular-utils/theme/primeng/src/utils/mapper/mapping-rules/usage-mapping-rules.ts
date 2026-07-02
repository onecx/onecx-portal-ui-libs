import type { MappingRule } from '../mapper.types';
import { datatableMappingRules } from './usages/datatable.rules';
import { dialogMappingRules } from './usages/dialog.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { diagramMappingRules } from './usages/diagram.rules';
import { carouselMappingRules } from './usages/carousel.rules';

export const usageMappingRules: MappingRule[] = [
  ...datatableMappingRules,
  ...tooltipMappingRules,  
  ...dialogMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
  ...diagramMappingRules,
];
