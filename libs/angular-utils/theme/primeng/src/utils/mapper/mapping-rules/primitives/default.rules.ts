import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const defaultRules: MappingRule[] = [
  {
    from: 'primitives.defaultVariant.defaultState.defaultSeverity.bg',
    to: 'semantic.colorScheme.{mode}.content.background',
    transform: toColorString,
  },
  {
    from: 'primitives.defaultVariant.defaultState.defaultSeverity.contrast',
    to: 'semantic.colorScheme.{mode}.content.color',
    transform: toColorString,
  },
  {
    from: 'primitives.defaultVariant.state.hover.defaultSeverity.bg',
    to: 'semantic.colorScheme.{mode}.content.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'primitives.defaultVariant.state.hover.defaultSeverity.contrast',
    to: 'semantic.colorScheme.{mode}.content.hoverColor',
    transform: toColorString,
  },
  {
    from: 'primitives.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'semantic.colorScheme.{mode}.content.borderColor',
    transform: toColorString,
  },
]
