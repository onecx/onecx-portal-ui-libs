import type { MappingRule } from '../../mapper.types'

export const picklistMappingRules: MappingRule[] = [
  {
    from: 'usages.picklist.gap',
    to: 'components.picklist.root.gap',
  },
  {
    from: '',
    to: 'components.picklist.controls.gap',
  },
]
