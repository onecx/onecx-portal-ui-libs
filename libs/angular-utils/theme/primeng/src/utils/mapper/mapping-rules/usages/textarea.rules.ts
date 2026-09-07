import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const textareaMappingRules: MappingRule[] = [
  // Colors (using colorScheme.{mode})
  {
    from: 'usages.textarea.background',
    to: 'components.textarea.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.disabled.background',
    to: 'components.textarea.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filled.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filled.hover.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filled.focus.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.hover.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.focus.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.invalid.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.color',
    to: 'components.textarea.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.disabled.color',
    to: 'components.textarea.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.invalid.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.focusRing.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },

  // Dimensions & Shapes & Durations
  {
    from: 'usages.textarea.border.shadow',
    to: 'components.textarea.root.shadow',
  },
  // NOTE: base padding is defined per-size in the theme (sm/md/lg); map the
  // default-size (`md`) variant to the root padding tokens.
  {
    from: 'usages.textarea.md.paddingX',
    to: 'components.textarea.root.paddingX',
  },
  {
    from: 'usages.textarea.md.paddingY',
    to: 'components.textarea.root.paddingY',
  },
  {
    from: 'usages.textarea.border.radius',
    to: 'components.textarea.root.borderRadius',
  },
  {
    from: 'usages.textarea.transitionDuration',
    to: 'components.textarea.root.transitionDuration',
  },

  // Focus Ring (non-color properties)
  {
    from: 'usages.textarea.focusRing.width',
    to: 'components.textarea.root.focusRing.width',
  },
  {
    from: 'usages.textarea.focusRing.style',
    to: 'components.textarea.root.focusRing.style',
  },
  {
    from: 'usages.textarea.focusRing.offset',
    to: 'components.textarea.root.focusRing.offset',
  },
  {
    from: 'usages.textarea.focusRing.shadow',
    to: 'components.textarea.root.focusRing.shadow',
  },

  // sm Size Variant
  {
    from: 'usages.textarea.sm.font.size',
    to: 'components.textarea.root.sm.fontSize',
  },
  {
    from: 'usages.textarea.sm.paddingX',
    to: 'components.textarea.root.sm.paddingX',
  },
  {
    from: 'usages.textarea.sm.paddingY',
    to: 'components.textarea.root.sm.paddingY',
  },

  // lg Size Variant
  {
    from: 'usages.textarea.lg.font.size',
    to: 'components.textarea.root.lg.fontSize',
  },
  {
    from: 'usages.textarea.lg.paddingX',
    to: 'components.textarea.root.lg.paddingX',
  },
  {
    from: 'usages.textarea.lg.paddingY',
    to: 'components.textarea.root.lg.paddingY',
  },
]
