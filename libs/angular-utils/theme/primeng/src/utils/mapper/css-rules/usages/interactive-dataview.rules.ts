import type { CssRule } from '../../mapper.types'
import { filterViewRules } from './interactive-dataview/filter-view.rules'
import { headerRules } from './interactive-dataview/header.rules'

export const interactiveDataViewCssRules: CssRule[] = [
  ...headerRules,
  ...filterViewRules,
]
