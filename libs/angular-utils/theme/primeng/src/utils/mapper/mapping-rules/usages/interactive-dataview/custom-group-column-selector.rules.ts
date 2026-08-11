import type { MappingRule } from '../../../mapper.types'

export const customGroupColumnSelectorMappingRules: MappingRule[] = [
  // Skeleton mappings
  {
    from: 'usages.interactiveDataView.customGroupColumnSelector.skeleton.border.radius',
    to: 'components.skeleton.root.borderRadius',
  },
  {
    from: 'usages.interactiveDataView.customGroupColumnSelector.skeleton.background',
    to: 'components.skeleton.root.background',
  },
  {
    from: 'usages.interactiveDataView.customGroupColumnSelector.skeleton.animationBackground',
    to: 'components.skeleton.root.animationBackground',
  },
]
