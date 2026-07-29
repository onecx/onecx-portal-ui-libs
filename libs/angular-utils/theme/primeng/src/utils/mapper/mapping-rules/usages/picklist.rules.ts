import type { MappingRule } from '../../mapper.types'

export const picklistMappingRules: MappingRule[] = [
  {
    from: 'usages.picklist.gap',
    to: 'components.picklist.root.gap',
  },
  {
    from: 'usages.picklist.transferControlButtons.gap',
    to: 'components.picklist.controls.gap',
  },
]
