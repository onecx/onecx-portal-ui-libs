import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const inputTextMappingRules: MappingRule[] = [
  {
    from: 'usages.inputText.background',
    to: 'components.inputtext.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.color',
    to: 'components.inputtext.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.disabled.background',
    to: 'components.inputtext.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.disabled.color',
    to: 'components.inputtext.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.filled.background',
    to: 'components.inputtext.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.filled.hover.background',
    to: 'components.inputtext.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.filled.focus.background',
    to: 'components.inputtext.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.border.color',
    to: 'components.inputtext.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.hover.border.color',
    to: 'components.inputtext.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.focus.border.color',
    to: 'components.inputtext.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.invalid.border.color',
    to: 'components.inputtext.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.focus.ring.width',
    to: 'components.inputtext.root.focusRing.width',
  },
  {
    from: 'usages.inputText.focus.ring.style',
    to: 'components.inputtext.root.focusRing.style',
  },
  {
    from: 'usages.inputText.focus.ring.color',
    to: 'components.inputtext.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.focus.ring.offset',
    to: 'components.inputtext.root.focusRing.offset',
  },
  {
    from: 'usages.inputText.focus.ring.shadow',
    to: 'components.inputtext.root.focusRing.shadow',
  },
  {
    from: 'usages.inputText.placeholder.color',
    to: 'components.inputtext.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.invalid.placeholder.color',
    to: 'components.inputtext.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.inputText.shadow',
    to: 'components.inputtext.root.shadow',
  },
  {
    from: 'usages.inputText.padding.x',
    to: 'components.inputtext.root.paddingX',
  },
  {
    from: 'usages.inputText.padding.y',
    to: 'components.inputtext.root.paddingY',
  },
  {
    from: 'usages.inputText.borderRadius',
    to: 'components.inputtext.root.borderRadius',
  },
  {
    from: 'usages.inputText.transitionDuration',
    to: 'components.inputtext.root.transitionDuration',
  },
  {
    from: 'usages.inputText.sm.fontSize',
    to: 'components.inputtext.root.sm.fontSize',
  },
  {
    from: 'usages.inputText.sm.padding.x',
    to: 'components.inputtext.root.sm.paddingX',
  },
  {
    from: 'usages.inputText.sm.padding.y',
    to: 'components.inputtext.root.sm.paddingY',
  },
  {
    from: 'usages.inputText.lg.fontSize',
    to: 'components.inputtext.root.lg.fontSize',
  },
  {
    from: 'usages.inputText.lg.padding.x',
    to: 'components.inputtext.root.lg.paddingX',
  },
  {
    from: 'usages.inputText.lg.padding.y',
    to: 'components.inputtext.root.lg.paddingY',
  },
];
