import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const inputMappingRules: MappingRule[] = [
  {
    from: 'usages.input.defaultVariant.defaultState.background',
    to: 'components.inputtext.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.defaultState.color',
    to: 'components.inputtext.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.disabled.background',
    to: 'components.inputtext.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.disabled.color',
    to: 'components.inputtext.root.disabledColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.variants.filled.defaultState.background',
    to: 'components.inputtext.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.variants.filled.hover.background',
    to: 'components.inputtext.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.variants.filled.focus.background',
    to: 'components.inputtext.root.filledFocusBackground',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.border.color',
    to: 'components.inputtext.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.hover.border.color',
    to: 'components.inputtext.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.focus.border.color',
    to: 'components.inputtext.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.invalid.border.color',
    to: 'components.inputtext.root.invalidBorderColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.focus.ring.width',
    to: 'components.inputtext.root.focusRing.width',
  },
  {
    from: 'usages.input.defaultVariant.focus.ring.style',
    to: 'components.inputtext.root.focusRing.style',
  },
  {
    from: 'usages.input.defaultVariant.focus.ring.color',
    to: 'components.inputtext.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.focus.ring.offset',
    to: 'components.inputtext.root.focusRing.offset',
  },
  {
    from: 'usages.input.defaultVariant.focus.ring.shadow',
    to: 'components.inputtext.root.focusRing.shadow',
  },

  {
    from: 'usages.input.defaultVariant.defaultState.placeholder.color',
    to: 'components.inputtext.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.defaultVariant.invalid.placeholder.color',
    to: 'components.inputtext.root.invalidPlaceholderColor',
    transform: toColorString,
  },

  {
    from: 'usages.input.defaultVariant.shadow',
    to: 'components.inputtext.root.shadow',
  },
  {
    from: 'usages.input.defaultVariant.padding.x',
    to: 'components.inputtext.root.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.padding.y',
    to: 'components.inputtext.root.paddingY',
  },
  {
    from: 'usages.input.defaultVariant.border.radius',
    to: 'components.inputtext.root.borderRadius',
  },

  {
    from: 'usages.input.settings.transition.duration',
    to: 'components.inputtext.root.transitionDuration',
  },

  {
    from: 'usages.input.defaultVariant.sizes.sm.fontSize',
    to: 'components.inputtext.root.sm.fontSize',
  },
  {
    from: 'usages.input.defaultVariant.sizes.sm.padding.x',
    to: 'components.inputtext.root.sm.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.sizes.sm.padding.y',
    to: 'components.inputtext.root.sm.paddingY',
  },
  {
    from: 'usages.input.defaultVariant.sizes.lg.fontSize',
    to: 'components.inputtext.root.lg.fontSize',
  },
  {
    from: 'usages.input.defaultVariant.sizes.lg.padding.x',
    to: 'components.inputtext.root.lg.paddingX',
  },
  {
    from: 'usages.input.defaultVariant.sizes.lg.padding.y',
    to: 'components.inputtext.root.lg.paddingY',
  }
]