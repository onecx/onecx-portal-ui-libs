import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const filterViewMappingRules: MappingRule[] = [
  // Chip mappings
  {
    from: 'usages.interactiveDataView.filterView.chip.border.radius',
    to: 'components.chip.root.borderRadius',
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.background',
    to: 'components.chip.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.color',
    to: 'components.chip.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.paddingX',
    to: 'components.chip.root.paddingX',
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.paddingY',
    to: 'components.chip.root.paddingY',
  },
  // Remove icon button mappings
  {
    from: 'usages.interactiveDataView.filterView.chip.removeIconButton.icon.size',
    to: 'components.chip.removeIcon.size',
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.removeIconButton.focusRing.width',
    to: 'components.chip.removeIcon.focusRing.width',
  },
  {
    from: 'usages.interactiveDataView.filterView.chip.removeIconButton.focusRing.offset',
    to: 'components.chip.removeIcon.focusRing.offset',
  },
]
