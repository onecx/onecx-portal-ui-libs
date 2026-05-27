import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const variantRules: MappingRule[] = [
  {
    from: 'primitives.variant.primary.defaultState.defaultVariant.bg',
    to: 'semantic.primary.color',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.primary.defaultState.defaultVariant.contrast',
    to: 'semantic.primary.contrastColor',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.primary.state.hover.defaultVariant.bg',
    to: 'semantic.colorScheme.{mode}.primary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.secondary.defaultState.defaultVariant.bg',
    to: 'semantic.colorScheme.{mode}.secondary.color',
    transform: toColorString,
  },
  {
    from: 'primitives.variant.secondary.defaultState.defaultVariant.contrast',
    to: 'semantic.colorScheme.{mode}.secondary.contrastColor',
    transform: toColorString,
  },
];
