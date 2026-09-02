import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const dataViewMappingRules: MappingRule[] = [
  // DataView root mappings
  {
    from: 'usages.interactiveDataView.dataView.border.radius',
    to: 'components.dataview.root.borderRadius',
  },
  // DataView content mappings
  {
    from: 'usages.interactiveDataView.dataView.dataViewContent.border.color',
    to: 'components.dataview.content.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.interactiveDataView.dataView.dataViewContent.border.width',
    to: 'components.dataview.content.borderWidth',
  },
  {
    from: 'usages.interactiveDataView.dataView.dataViewContent.paddingX',
    to: 'components.dataview.content.padding',
  },
]
