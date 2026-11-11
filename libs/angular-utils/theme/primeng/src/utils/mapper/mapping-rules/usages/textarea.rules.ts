import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

// The textarea usage schema is nested (`defaultVariant`/`filled` -> named state -> token) and
// declares no named severities, so the `from` paths below have no `defaultSeverity` segment and
// the baseline tokens sit under `defaultVariant.defaultState`. (Matches the `input` mapping
// rules, which follow the same restructure — but with the severity segment.)

export const textareaMappingRules: MappingRule[] = [
  // Colors (using colorScheme.{mode})
  {
    from: 'usages.textarea.defaultVariant.defaultState.background',
    to: 'components.textarea.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.disabled.background',
    to: 'components.textarea.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filled.defaultState.background',
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
    from: 'usages.textarea.defaultVariant.defaultState.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.hover.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.focus.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.invalid.border.color',
    to: 'components.textarea.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.color',
    to: 'components.textarea.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.disabled.color',
    to: 'components.textarea.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.invalid.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.focusRing.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },

  // Dimensions & Shapes & Durations
  {
    from: 'usages.textarea.defaultVariant.defaultState.border.shadow',
    to: 'components.textarea.root.shadow',
  },
  // NOTE: base padding is defined per-size in the theme (sm/md/lg); map the
  // default-size (`md`) variant to the root padding tokens.
  {
    from: 'usages.textarea.defaultVariant.defaultState.md.paddingX',
    to: 'components.textarea.root.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.md.paddingY',
    to: 'components.textarea.root.paddingY',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.border.radius',
    to: 'components.textarea.root.borderRadius',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.transitionDuration',
    to: 'components.textarea.root.transitionDuration',
  },

  // Focus Ring (non-color properties)
  {
    from: 'usages.textarea.defaultVariant.defaultState.focusRing.width',
    to: 'components.textarea.root.focusRing.width',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.focusRing.style',
    to: 'components.textarea.root.focusRing.style',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.focusRing.offset',
    to: 'components.textarea.root.focusRing.offset',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.focusRing.shadow',
    to: 'components.textarea.root.focusRing.shadow',
  },

  // sm Size Variant
  {
    from: 'usages.textarea.defaultVariant.defaultState.sm.font.size',
    to: 'components.textarea.root.sm.fontSize',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.sm.paddingX',
    to: 'components.textarea.root.sm.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.sm.paddingY',
    to: 'components.textarea.root.sm.paddingY',
  },

  // lg Size Variant
  {
    from: 'usages.textarea.defaultVariant.defaultState.lg.font.size',
    to: 'components.textarea.root.lg.fontSize',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.lg.paddingX',
    to: 'components.textarea.root.lg.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.lg.paddingY',
    to: 'components.textarea.root.lg.paddingY',
  },
]
