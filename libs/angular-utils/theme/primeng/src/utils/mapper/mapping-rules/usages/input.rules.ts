import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const inputMappingRules: MappingRule[] = [
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.background',
    to: 'components.inputtext.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.inputtext.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.disabled.defaultSeverity.background',
    to: 'components.inputtext.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.disabled.defaultSeverity.color',
    to: 'components.inputtext.root.disabledColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.filled.defaultState.defaultSeverity.background',
    to: 'components.inputtext.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.filled.hover.defaultSeverity.background',
    to: 'components.inputtext.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.filled.focus.defaultSeverity.background',
    to: 'components.inputtext.root.filledFocusBackground',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.inputtext.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.hover.defaultSeverity.border.color',
    to: 'components.inputtext.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.focus.defaultSeverity.border.color',
    to: 'components.inputtext.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.invalid.defaultSeverity.border.color',
    to: 'components.inputtext.root.invalidBorderColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.focusRing.width',
    to: 'components.inputtext.root.focusRing.width',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.focusRing.style',
    to: 'components.inputtext.root.focusRing.style',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.focusRing.color',
    to: 'components.inputtext.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.focusRing.offset',
    to: 'components.inputtext.root.focusRing.offset',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.focusRing.shadow',
    to: 'components.inputtext.root.focusRing.shadow',
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.placeholder.color',
    to: 'components.inputtext.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.invalid.defaultSeverity.placeholder.color',
    to: 'components.inputtext.root.invalidPlaceholderColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.border.shadow',
    to: 'components.inputtext.root.shadow',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.x',
    to: 'components.inputtext.root.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.y',
    to: 'components.inputtext.root.paddingY',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.inputtext.root.borderRadius',
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.transitionDuration',
    to: 'components.inputtext.root.transitionDuration',
  },

  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.sm.fontSize',
    to: 'components.inputtext.root.sm.fontSize',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.sm.padding.x',
    to: 'components.inputtext.root.sm.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.sm.padding.y',
    to: 'components.inputtext.root.sm.paddingY',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.lg.fontSize',
    to: 'components.inputtext.root.lg.fontSize',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.lg.padding.x',
    to: 'components.inputtext.root.lg.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.defaultState.defaultSeverity.lg.padding.y',
    to: 'components.inputtext.root.lg.paddingY',
  },
]
