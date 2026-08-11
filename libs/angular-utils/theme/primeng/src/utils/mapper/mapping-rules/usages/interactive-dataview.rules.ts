import type { MappingRule } from '../../mapper.types'
import { customGroupColumnSelectorMappingRules } from './interactive-dataview/custom-group-column-selector.rules'
import { dataTableMappingRules } from './interactive-dataview/data-table.rules'
import { dataListGridSortingMappingRules } from './interactive-dataview/data-list-grid-sorting.rules'
import { dataViewMappingRules } from './interactive-dataview/data-view.rules'
import { filterViewMappingRules } from './interactive-dataview/filter-view.rules'

export const interactiveDataViewMappingRules: MappingRule[] = [
  ...filterViewMappingRules,
  ...dataTableMappingRules,
  ...dataListGridSortingMappingRules,
  ...dataViewMappingRules,
  ...customGroupColumnSelectorMappingRules,
]
