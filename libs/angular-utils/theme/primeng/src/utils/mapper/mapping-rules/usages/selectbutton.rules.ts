import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const selectbuttonMappingRules: MappingRule[] = [
  { from: 'usages.selectbutton.border.radius', to: 'components.selectbutton.root.borderRadius' },
  {
    from: 'usages.selectbutton.invalid.border.color',
    to: 'components.selectbutton.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
]
