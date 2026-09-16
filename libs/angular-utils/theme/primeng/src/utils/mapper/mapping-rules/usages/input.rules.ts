import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

// Restructured input token paths:
// usages.input.{defaultVariant|filled}.{state}.defaultSeverity.{tokens}
const INPUT = 'usages.input'
const D = `${INPUT}.defaultVariant.defaultState.defaultSeverity`
const HOVER = `${INPUT}.defaultVariant.hover.defaultSeverity`
const FOCUS = `${INPUT}.defaultVariant.focus.defaultSeverity`
const DISABLED = `${INPUT}.defaultVariant.disabled.defaultSeverity`
const INVALID = `${INPUT}.defaultVariant.invalid.defaultSeverity`
const FILLED = `${INPUT}.filled.defaultState.defaultSeverity`
const FILLED_HOVER = `${INPUT}.filled.hover.defaultSeverity`
const FILLED_FOCUS = `${INPUT}.filled.focus.defaultSeverity`
const FOCUS_RING = `${FOCUS}.focusRing`

export const inputMappingRules: MappingRule[] = [
  {
    from: `${D}.background`,
    to: 'components.inputtext.root.background',
    transform: toColorString,
  },
  {
    from: `${D}.color`,
    to: 'components.inputtext.root.color',
    transform: toColorString,
  },
  {
    from: `${DISABLED}.background`,
    to: 'components.inputtext.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: `${DISABLED}.color`,
    to: 'components.inputtext.root.disabledColor',
    transform: toColorString,
  },

  {
    from: `${FILLED}.background`,
    to: 'components.inputtext.root.filledBackground',
    transform: toColorString,
  },
  {
    from: `${FILLED_HOVER}.background`,
    to: 'components.inputtext.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: `${FILLED_FOCUS}.background`,
    to: 'components.inputtext.root.filledFocusBackground',
    transform: toColorString,
  },

  {
    from: `${D}.border.color`,
    to: 'components.inputtext.root.borderColor',
    transform: toColorString,
  },
  {
    from: `${HOVER}.border.color`,
    to: 'components.inputtext.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: `${FOCUS}.border.color`,
    to: 'components.inputtext.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: `${INVALID}.border.color`,
    to: 'components.inputtext.root.invalidBorderColor',
    transform: toColorString,
  },

  {
    from: `${FOCUS_RING}.width`,
    to: 'components.inputtext.root.focusRing.width',
  },
  {
    from: `${FOCUS_RING}.style`,
    to: 'components.inputtext.root.focusRing.style',
  },
  {
    from: `${FOCUS_RING}.color`,
    to: 'components.inputtext.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: `${FOCUS_RING}.offset`,
    to: 'components.inputtext.root.focusRing.offset',
  },
  {
    from: `${FOCUS_RING}.shadow`,
    to: 'components.inputtext.root.focusRing.shadow',
  },

  {
    from: `${D}.placeholder.color`,
    to: 'components.inputtext.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: `${INVALID}.placeholder.color`,
    to: 'components.inputtext.root.invalidPlaceholderColor',
    transform: toColorString,
  },

  {
    from: `${D}.border.shadow`,
    to: 'components.inputtext.root.shadow',
  },
  {
    from: `${D}.padding.x`,
    to: 'components.inputtext.root.paddingX',
  },
  {
    from: `${D}.padding.y`,
    to: 'components.inputtext.root.paddingY',
  },
  {
    from: `${D}.border.radius`,
    to: 'components.inputtext.root.borderRadius',
  },

  {
    from: `${D}.transitionDuration`,
    to: 'components.inputtext.root.transitionDuration',
  },

  {
    from: `${D}.sm.fontSize`,
    to: 'components.inputtext.root.sm.fontSize',
  },
  {
    from: `${D}.sm.padding.x`,
    to: 'components.inputtext.root.sm.paddingX',
  },
  {
    from: `${D}.sm.padding.y`,
    to: 'components.inputtext.root.sm.paddingY',
  },
  {
    from: `${D}.lg.fontSize`,
    to: 'components.inputtext.root.lg.fontSize',
  },
  {
    from: `${D}.lg.padding.x`,
    to: 'components.inputtext.root.lg.paddingX',
  },
  {
    from: `${D}.lg.padding.y`,
    to: 'components.inputtext.root.lg.paddingY',
  },
]
