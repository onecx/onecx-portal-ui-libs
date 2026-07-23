import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const textareaMappingRules: MappingRule[] = [
  // Colors (using colorScheme.{mode})
  {
    from: 'usages.textarea.background',
    to: 'components.textarea.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.disabledBackground',
    to: 'components.textarea.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filledBackground',
    to: 'components.textarea.colorScheme.{mode}.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filledHoverBackground',
    to: 'components.textarea.colorScheme.{mode}.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.filledFocusBackground',
    to: 'components.textarea.colorScheme.{mode}.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.borderColor',
    to: 'components.textarea.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.hoverBorderColor',
    to: 'components.textarea.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.focusBorderColor',
    to: 'components.textarea.colorScheme.{mode}.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.invalidBorderColor',
    to: 'components.textarea.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.color',
    to: 'components.textarea.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.disabledColor',
    to: 'components.textarea.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.placeholderColor',
    to: 'components.textarea.colorScheme.{mode}.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.textarea.invalidPlaceholderColor',
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
    from: 'usages.textarea.shadow',
    to: 'components.textarea.root.shadow',
  },
  {
    from: 'usages.textarea.paddingX',
    to: 'components.textarea.root.paddingX',
  },
  {
    from: 'usages.textarea.paddingY',
    to: 'components.textarea.root.paddingY',
  },
  {
    from: 'usages.textarea.borderRadius',
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
    from: 'usages.textarea.sm.fontSize',
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
    from: 'usages.textarea.lg.fontSize',
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
];
