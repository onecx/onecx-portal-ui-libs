import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const breadcrumbRules: MappingRule[] = [
  {
    from: 'usages.breadcrumb.defaultVariant.padding',
    to: 'components.breadcrumb.root.padding',
  },
  {
    from: 'usages.breadcrumb.defaultVariant.background.color',
    to: 'components.breadcrumb.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.defaultVariant.gap',
    to: 'components.breadcrumb.root.gap',
  },
  {
    from: 'usages.breadcrumb.defaultVariant.transition.duration',
    to: 'components.breadcrumb.root.transitionDuration',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.hover.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.border.radius',
    to: 'components.breadcrumb.item.borderRadius',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.gap',
    to: 'components.breadcrumb.item.gap',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.icon.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.hover.icon.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.icon.size',
    to: 'components.breadcrumb.item.icon',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.focusRing.width',
    to: 'components.breadcrumb.item.focusRing.width',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.focusRing.style',
    to: 'components.breadcrumb.item.focusRing.style',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.focusRing.color',
    to: 'components.breadcrumb.item.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.focusRing.offset',
    to: 'components.breadcrumb.item.focusRing.offset',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.focusRing.shadow',
    to: 'components.breadcrumb.item.focusRing.shadow',
  },
  {
    from: 'usages.breadcrumb.separator.defaultVariant.color',
    to: 'components.breadcrumb.separator.color',
    transform: toColorString,
  },
]
