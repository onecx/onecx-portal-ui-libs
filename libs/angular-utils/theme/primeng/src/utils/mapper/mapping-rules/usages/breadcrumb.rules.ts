import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const breadcrumbRules: MappingRule[] = [
  {
    from: 'usages.breadcrumb.padding',
    to: 'components.breadcrumb.root.padding',
  },
  {
    from: 'usages.breadcrumb.background.color',
    to: 'components.breadcrumb.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.gap',
    to: 'components.breadcrumb.root.gap',
  },
  {
    from: 'usages.breadcrumb.transition.duration',
    to: 'components.breadcrumb.root.transitionDuration',
  },
  {
    from: 'usages.breadcrumb.item.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.hover.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.border.radius',
    to: 'components.breadcrumb.item.borderRadius',
  },
  {
    from: 'usages.breadcrumb.item.gap',
    to: 'components.breadcrumb.item.gap',
  },
  {
    from: 'usages.breadcrumb.item.icon.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.icon.hover.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.icon.size',
    to: 'components.breadcrumb.item.icon',
  },
  {
    from: 'usages.breadcrumb.item.focusRing.width',
    to: 'components.breadcrumb.item.focusRing.width',
  },
  {
    from: 'usages.breadcrumb.item.focusRing.style',
    to: 'components.breadcrumb.item.focusRing.style',
  },
  {
    from: 'usages.breadcrumb.item.focusRing.color',
    to: 'components.breadcrumb.item.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.focusRing.offset',
    to: 'components.breadcrumb.item.focusRing.offset',
  },
  {
    from: 'usages.breadcrumb.item.focusRing.shadow',
    to: 'components.breadcrumb.item.focusRing.shadow',
  },
  {
    from: 'usages.breadcrumb.separator.color',
    to: 'components.breadcrumb.separator.color',
    transform: toColorString,
  },
]
