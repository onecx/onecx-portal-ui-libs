import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const inputMappingRules: MappingRule[] = [
  {
    from: 'usages.input.background',
    to: 'components.inputtext.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.input.color',
    to: 'components.inputtext.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.disabled.background',
    to: 'components.inputtext.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.disabled.color',
    to: 'components.inputtext.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.filled.background',
    to: 'components.inputtext.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.filled.hover.background',
    to: 'components.inputtext.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.filled.focus.background',
    to: 'components.inputtext.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.input.border.color',
    to: 'components.inputtext.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.hover.border.color',
    to: 'components.inputtext.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.focus.border.color',
    to: 'components.inputtext.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.invalid.border.color',
    to: 'components.inputtext.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.focus.ring.width',
    to: 'components.inputtext.root.focusRing.width',
  },
  {
    from: 'usages.input.focus.ring.style',
    to: 'components.inputtext.root.focusRing.style',
  },
  {
    from: 'usages.input.focus.ring.color',
    to: 'components.inputtext.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.input.focus.ring.offset',
    to: 'components.inputtext.root.focusRing.offset',
  },
  {
    from: 'usages.input.focus.ring.shadow',
    to: 'components.inputtext.root.focusRing.shadow',
  },
  {
    from: 'usages.input.placeholder.color',
    to: 'components.inputtext.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.invalid.placeholder.color',
    to: 'components.inputtext.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.input.shadow',
    to: 'components.inputtext.root.shadow',
  },
  {
    from: 'usages.input.padding.x',
    to: 'components.inputtext.root.paddingX',
  },
  {
    from: 'usages.input.padding.y',
    to: 'components.inputtext.root.paddingY',
  },
  {
    from: 'usages.input.borderRadius',
    to: 'components.inputtext.root.borderRadius',
  },
  {
    from: 'usages.input.transitionDuration',
    to: 'components.inputtext.root.transitionDuration',
  },
  {
    from: 'usages.input.sm.fontSize',
    to: 'components.inputtext.root.sm.fontSize',
  },
  {
    from: 'usages.input.sm.padding.x',
    to: 'components.inputtext.root.sm.paddingX',
  },
  {
    from: 'usages.input.sm.padding.y',
    to: 'components.inputtext.root.sm.paddingY',
  },
  {
    from: 'usages.input.lg.fontSize',
    to: 'components.inputtext.root.lg.fontSize',
  },
  {
    from: 'usages.input.lg.padding.x',
    to: 'components.inputtext.root.lg.paddingX',
  },
  {
    from: 'usages.input.lg.padding.y',
    to: 'components.inputtext.root.lg.paddingY',
  },
];
