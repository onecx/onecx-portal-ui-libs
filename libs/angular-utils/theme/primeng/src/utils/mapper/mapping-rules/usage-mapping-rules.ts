import type { MappingRule } from '../mapper.types'
import { badgeMappingRules } from './usages/badge.rules'
import { calendarMappingRules } from './usages/calendar.rules'
import { datatableMappingRules } from './usages/datatable.rules'
import { dialogMappingRules } from './usages/dialog.rules'
import { menubarMappingRules } from './usages/menubar.rules'
import { tooltipMappingRules } from './usages/tooltip.rules'
import { fieldsetMappingRules } from './usages/fieldset.rules'
import { diagramMappingRules } from './usages/diagram.rules'
import { carouselMappingRules } from './usages/carousel.rules'
import { toggleswitchMappingRules } from './usages/toggleswitch.rules'
import { tabsMappingRules } from './usages/tabs.rules'
import { dropdownMappingRules } from './usages/dropdown.rules'
import { textareaMappingRules } from './usages/textarea.rules'
import { picklistMappingRules } from './usages/picklist.rules'
import { togglebuttonMappingRules } from './usages/togglebutton.rules'
import { accordionMappingRules } from './usages/accordion.rules'
import { inputMappingRules } from './usages/input.rules'

export const usageMappingRules: MappingRule[] = [
  ...badgeMappingRules,
  ...calendarMappingRules,
  ...datatableMappingRules,
  ...tooltipMappingRules,
  ...dialogMappingRules,
  ...menubarMappingRules,
  ...tooltipMappingRules,
  ...carouselMappingRules,
  ...toggleswitchMappingRules,
  ...tabsMappingRules,
  ...fieldsetMappingRules,
  ...diagramMappingRules,
  ...inputMappingRules,
  ...dropdownMappingRules,
  ...textareaMappingRules,
  ...picklistMappingRules,
  ...togglebuttonMappingRules,
  ...accordionMappingRules,
]
