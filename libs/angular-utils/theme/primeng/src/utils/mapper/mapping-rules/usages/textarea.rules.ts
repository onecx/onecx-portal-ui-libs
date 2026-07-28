import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const textareaMappingRules: MappingRule[] = [
  // Colors (using colorScheme.{mode})
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.background',
    to: 'components.textarea.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.disabled.defaultSeverity.background',
    to: 'components.textarea.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filledVariant.defaultState.defaultSeverity.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filledVariant.state.hover.defaultSeverity.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filledVariant.state.focus.defaultSeverity.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.hover.defaultSeverity.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.invalid.defaultSeverity.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.textarea.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.disabled.defaultSeverity.color',
    to: 'components.textarea.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.invalid.defaultSeverity.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.focusRing.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },

  // Dimensions & Shapes & Durations
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.shadow',
    to: 'components.textarea.root.shadow',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.paddingX',
    to: 'components.textarea.root.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.paddingY',
    to: 'components.textarea.root.paddingY',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.textarea.root.borderRadius',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.transitionDuration',
    to: 'components.textarea.root.transitionDuration',
  },

  // Focus Ring (non-color properties)
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.focusRing.width',
    to: 'components.textarea.root.focusRing.width',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.focusRing.style',
    to: 'components.textarea.root.focusRing.style',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.focusRing.offset',
    to: 'components.textarea.root.focusRing.offset',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.defaultSeverity.focusRing.shadow',
    to: 'components.textarea.root.focusRing.shadow',
  },

  // sm Size Variant
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.sm.font.size',
    to: 'components.textarea.root.sm.fontSize',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.sm.paddingX',
    to: 'components.textarea.root.sm.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.sm.paddingY',
    to: 'components.textarea.root.sm.paddingY',
  },

  // lg Size Variant
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.lg.font.size',
    to: 'components.textarea.root.lg.fontSize',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.lg.paddingX',
    to: 'components.textarea.root.lg.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.defaultSeverity.lg.paddingY',
    to: 'components.textarea.root.lg.paddingY',
  },
]
