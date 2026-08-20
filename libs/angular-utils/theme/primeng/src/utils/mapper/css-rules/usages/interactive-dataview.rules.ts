import type { CssRule } from '../../mapper.types'
import { customGroupColumnSelectorRules } from './interactive-dataview/custom-group-column-selector.rules'
import { dataTableRules } from './interactive-dataview/data-table.rules'
import { dataListGridRules } from './interactive-dataview/data-list-grid.rules'
import { dataListGridSortingRules } from './interactive-dataview/data-list-grid-sorting.rules'
import { dataViewRules } from './interactive-dataview/data-view.rules'
import { filterViewRules } from './interactive-dataview/filter-view.rules'
import { headerRules } from './interactive-dataview/header.rules'

export const interactiveDataViewCssRules: CssRule[] = [
  ...headerRules,
  ...filterViewRules,
  ...dataTableRules,
  ...dataListGridRules,
  ...dataListGridSortingRules,
  ...dataViewRules,
  ...customGroupColumnSelectorRules,
]
