import type { MappingRule } from '../../mapper.types'
import { dataListGridMappingRules } from './interactive-dataview/data-list-grid.rules'

export const interactiveDataViewMappingRules: MappingRule[] = [
  ...dataListGridMappingRules,
]
