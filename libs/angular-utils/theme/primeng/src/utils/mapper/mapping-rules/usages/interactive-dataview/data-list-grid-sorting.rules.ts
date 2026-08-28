import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const dataListGridSortingMappingRules: MappingRule[] = [
  // FloatLabel mappings
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.color',
    to: 'components.floatlabel.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.focus.color',
    to: 'components.floatlabel.root.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.color',
    to: 'components.floatlabel.root.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.font.weight',
    to: 'components.floatlabel.root.fontWeight',
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.font.size',
    to: 'components.floatlabel.root.active.fontSize',
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.font.weight',
    to: 'components.floatlabel.root.active.fontWeight',
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.border.radius',
    to: 'components.floatlabel.on.borderRadius',
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.background',
    to: 'components.floatlabel.on.active.background',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.dataListGridSorting.floatLabel.active.paddingY',
    to: 'components.floatlabel.on.active.padding',
  },
]
