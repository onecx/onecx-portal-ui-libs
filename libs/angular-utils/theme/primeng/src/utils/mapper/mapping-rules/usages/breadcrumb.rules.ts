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
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.hover.defaultSeverity.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.breadcrumb.item.borderRadius',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.gap',
    to: 'components.breadcrumb.item.gap',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.icon.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.hover.defaultSeverity.icon.color',
    to: 'components.breadcrumb.colorScheme.{mode}.item.icon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.icon.size',
    to: 'components.breadcrumb.item.icon',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.focusRing.width',
    to: 'components.breadcrumb.item.focusRing.width',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.focusRing.style',
    to: 'components.breadcrumb.item.focusRing.style',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.focusRing.color',
    to: 'components.breadcrumb.item.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.focusRing.offset',
    to: 'components.breadcrumb.item.focusRing.offset',
  },
  {
    from: 'usages.breadcrumb.item.defaultVariant.defaultState.defaultSeverity.focusRing.shadow',
    to: 'components.breadcrumb.item.focusRing.shadow',
  },
  {
    from: 'usages.breadcrumb.separator.color',
    to: 'components.breadcrumb.separator.color',
    transform: toColorString,
  },
]
