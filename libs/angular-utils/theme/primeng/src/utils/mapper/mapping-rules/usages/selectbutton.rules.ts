import type { MappingRule } from '../../mapper.types'

export const selectbuttonMappingRules: MappingRule[] = [
  // Container border radius
  {
    from: 'usages.selectbutton.borderRadius',
    to: 'components.selectbutton.root.borderRadius',
  },
]
