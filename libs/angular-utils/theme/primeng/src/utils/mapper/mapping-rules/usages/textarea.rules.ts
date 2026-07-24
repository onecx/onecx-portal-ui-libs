import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const textareaMappingRules: MappingRule[] = [
  // Colors (using colorScheme.{mode})
  {
    from: 'usages.textarea.defaultVariant.defaultState.background',
    to: 'components.textarea.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.disabled.background',
    to: 'components.textarea.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filled.defaultState.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filled.state.hover.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.variant.filled.state.focus.background',
    to: 'components.textarea.colorScheme.{mode}.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.border',
    to: 'components.textarea.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.hover.border',
    to: 'components.textarea.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.border',
    to: 'components.textarea.colorScheme.{mode}.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.invalid.border',
    to: 'components.textarea.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.color',
    to: 'components.textarea.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.disabled.color',
    to: 'components.textarea.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.invalid.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.focusRing.color',
    to: 'components.textarea.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },

  // Dimensions & Shapes & Durations
  {
    from: 'usages.textarea.defaultVariant.defaultState.shadow',
    to: 'components.textarea.root.shadow',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.paddingX',
    to: 'components.textarea.root.paddingX',
  },
  {
    from: 'usages.textarea.defaultVariant.defaultState.paddingY',
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
    from: 'usages.textarea.defaultVariant.state.focus.focusRing.width',
    to: 'components.textarea.root.focusRing.width',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.focusRing.style',
    to: 'components.textarea.root.focusRing.style',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.focusRing.offset',
    to: 'components.textarea.root.focusRing.offset',
  },
  {
    from: 'usages.textarea.defaultVariant.state.focus.focusRing.shadow',
    to: 'components.textarea.root.focusRing.shadow',
  },

  // sm Size Variant
  {
    from: 'usages.textarea.defaultVariant.defaultState.sm.font',
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
    from: 'usages.textarea.defaultVariant.defaultState.lg.fontSize',
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
];
