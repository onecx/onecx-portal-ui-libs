import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const variantRules: MappingRule[] = [
  {
    from: 'primitives.variant.primary.defaultState.defaultSeverity.bg',
    to: 'semantic.primary.color',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.primary.defaultState.defaultSeverity.contrast',
    to: 'semantic.primary.contrastColor',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.primary.state.hover.defaultSeverity.bg',
    to: 'semantic.colorScheme.{mode}.primary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.secondary.defaultState.defaultSeverity.bg',
    to: 'semantic.colorScheme.{mode}.secondary.color',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.secondary.defaultState.defaultSeverity.contrast',
    to: 'semantic.colorScheme.{mode}.secondary.contrastColor',
    transform: toColorString,
  },
]
