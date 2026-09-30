import type { CssRule } from '../../mapper.types'
import { customGroupColumnSelectorRules } from './interactive-dataview/custom-group-column-selector.rules'
import { dataListGridRules } from './interactive-dataview/data-list-grid.rules'
import { dataListGridSortingRules } from './interactive-dataview/data-list-grid-sorting.rules'
import { filterViewRules } from './interactive-dataview/filter-view.rules'
import { headerRules } from './interactive-dataview/header.rules'

export const interactiveDataViewCssRules: CssRule[] = [
  ...headerRules,
  ...filterViewRules,
  ...dataListGridRules,
  ...dataListGridSortingRules,
  ...customGroupColumnSelectorRules,
]
