import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const dataviewMappingRules: MappingRule[] = [
  // Root
  {
    from: 'usages.dataview.border.color',
    to: 'components.dataview.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.border.width',
    to: 'components.dataview.root.borderWidth',
  },
  {
    from: 'usages.dataview.border.radius',
    to: 'components.dataview.root.borderRadius',
  },

  // Header
  {
    from: 'usages.dataview.header.background',
    to: 'components.dataview.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.header.color',
    to: 'components.dataview.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.header.border.color',
    to: 'components.dataview.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.header.border.width',
    to: 'components.dataview.header.borderWidth',
  },
  {
    from: 'usages.dataview.header.border.radius',
    to: 'components.dataview.header.borderRadius',
  },

  // Content
  {
    from: 'usages.dataview.content.background',
    to: 'components.dataview.content.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.content.color',
    to: 'components.dataview.content.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.content.border.color',
    to: 'components.dataview.content.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.content.border.width',
    to: 'components.dataview.content.borderWidth',
  },
  {
    from: 'usages.dataview.content.border.radius',
    to: 'components.dataview.content.borderRadius',
  },

  // Footer
  {
    from: 'usages.dataview.footer.background',
    to: 'components.dataview.footer.background',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.footer.color',
    to: 'components.dataview.footer.color',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.footer.border.color',
    to: 'components.dataview.footer.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.footer.border.width',
    to: 'components.dataview.footer.borderWidth',
  },
  {
    from: 'usages.dataview.footer.border.radius',
    to: 'components.dataview.footer.borderRadius',
  },

  // Paginator (shared schema; maps to the top/bottom paginator sections)
  {
    from: 'usages.dataview.header.paginator.border.color',
    to: 'components.dataview.paginatorTop.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.header.paginator.border.width',
    to: 'components.dataview.paginatorTop.borderWidth',
  },
  {
    from: 'usages.dataview.footer.paginator.border.color',
    to: 'components.dataview.paginatorBottom.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.dataview.footer.paginator.border.width',
    to: 'components.dataview.paginatorBottom.borderWidth',
  },
]
