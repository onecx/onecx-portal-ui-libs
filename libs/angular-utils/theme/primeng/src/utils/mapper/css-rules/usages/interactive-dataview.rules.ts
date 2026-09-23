import type { CssRule } from '../../mapper.types'
import { dataListGridRules } from './interactive-dataview/data-list-grid.rules'
import { filterViewRules } from './interactive-dataview/filter-view.rules'
import { headerRules } from './interactive-dataview/header.rules'

export const interactiveDataViewCssRules: CssRule[] = [
  ...headerRules,
  ...filterViewRules,
  ...dataListGridRules,
]
