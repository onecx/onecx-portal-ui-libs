import type { MappingRule } from '../mapper.types';
import { buttonMappingRules } from './usages/button.rules';
import { badgeMappingRules } from './usages/badge.rules';
import { datatableMappingRules } from './usages/datatable.rules';
import { dialogMappingRules } from './usages/dialog.rules';
import { tooltipMappingRules } from './usages/tooltip.rules';
import { fieldsetMappingRules } from './usages/fieldset.rules';
import { diagramMappingRules } from './usages/diagram.rules';
import { carouselMappingRules } from './usages/carousel.rules';
import { dropdownMappingRules } from './usages/dropdown.rules';

export const usageMappingRules: MappingRule[] = [
  ...buttonMappingRules,
  ...badgeMappingRules,
  ...datatableMappingRules,
  ...tooltipMappingRules,
  ...dialogMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
  ...fieldsetMappingRules,
  ...diagramMappingRules,
  ...dropdownMappingRules,
];
