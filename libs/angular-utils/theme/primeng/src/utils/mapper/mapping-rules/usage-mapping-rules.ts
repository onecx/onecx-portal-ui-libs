import type { MappingRule } from '../mapper.types';
import { badgeMappingRules } from './usages/badge.rules';
import { datatableMappingRules } from './usages/datatable.rules';
import { dialogMappingRules } from './usages/dialog.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { fieldsetMappingRules } from './usages/fieldset.rules';
import { diagramMappingRules } from './usages/diagram.rules';
import { carouselMappingRules } from './usages/carousel.rules';
import { dropdownMappingRules } from './usages/dropdown.rules';
import { textareaMappingRules } from './usages/textarea.rules';

export const usageMappingRules: MappingRule[] = [
  ...badgeMappingRules,
  ...datatableMappingRules,
  ...dialogMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
  ...fieldsetMappingRules,
  ...diagramMappingRules,
  ...dropdownMappingRules,
  ...textareaMappingRules,
];
