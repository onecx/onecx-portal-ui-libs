import type { MappingRule } from '../../mapper.types'

export const panelmenuMappingRules: MappingRule[] = [
  // Root level
  {
    from: 'usages.panelmenu.gap',
    to: 'components.panelmenu.root.gap',
  },

  // Panel
  {
    from: 'usages.panelmenu.border.width',
    to: 'components.panelmenu.panel.borderWidth',
  },
  {
    from: 'usages.panelmenu.border.radius',
    to: 'components.panelmenu.panel.borderRadius',
  },

  // Item
  {
    from: 'usages.panelmenu.content.item.gap',
    to: 'components.panelmenu.item.gap',
  },
  {
    from: 'usages.panelmenu.content.item.border.radius',
    to: 'components.panelmenu.item.borderRadius',
  },
]
