import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const menuMappingRules: MappingRule[] = [
  {
    from: 'usages.menu.background.color',
    to: 'components.menu.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.menu.border.color',
    to: 'components.menu.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menu.color',
    to: 'components.menu.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.menu.border.radius',
    to: 'components.menu.root.borderRadius',
  },
  {
    from: 'usages.menu.border.shadow',
    to: 'components.menu.root.shadow',
  },
  {
    from: 'usages.menu.transition.duration',
    to: 'components.menu.root.transitionDuration',
  },
  {
    from: 'usages.menu.padding',
    to: 'components.menu.list.padding',
  },
  {
    from: 'usages.menu.gap',
    to: 'components.menu.list.gap',
  },
  {
    from: 'usages.menu.item.focus.background.color',
    to: 'components.menu.colorScheme.{mode}.item.focusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menu.item.color',
    to: 'components.menu.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.menu.item.focus.color',
    to: 'components.menu.colorScheme.{mode}.item.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menu.item.padding',
    to: 'components.menu.item.padding',
  },
  {
    from: 'usages.menu.item.border.radius',
    to: 'components.menu.item.borderRadius',
  },
  {
    from: 'usages.menu.item.gap',
    to: 'components.menu.item.gap',
  },
  {
    from: 'usages.menu.item.icon.color',
    to: 'components.menu.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menu.item.icon.focus.color',
    to: 'components.menu.colorScheme.{mode}.item.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menu.item.icon.size',
    to: 'components.menu.item.icon',
  },
  {
    from: 'usages.menu.submenuLabel.padding',
    to: 'components.menu.submenuLabel.padding',
  },
  {
    from: 'usages.menu.submenuLabel.font.weight',
    to: 'components.menu.submenuLabel.fontWeight',
  },  
  {
    from: 'usages.menu.submenuLabel.background.color',
    to: 'components.menu.colorScheme.{mode}.submenuLabel.background',
    transform: toColorString,
  },
  {
    from: 'usages.menu.submenuLabel.color',
    to: 'components.menu.colorScheme.{mode}.submenuLabel.color',
    transform: toColorString,
  },
  {
    from: 'usages.menu.submenuIcon.size',
    to: 'components.menubar.submenu.icon.size',
  },
  {
    from: 'usages.menu.submenuIcon.color',
    to: 'components.menubar.submenu.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menu.submenuIcon.focus.color',
    to: 'components.menubar.submenu.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menu.separator.border.color',
    to: 'components.menu.separator.borderColor',
    transform: toColorString,
  },
]