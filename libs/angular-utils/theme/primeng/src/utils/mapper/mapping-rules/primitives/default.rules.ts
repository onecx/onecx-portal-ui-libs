import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const defaultRules: MappingRule[] = [
  {
    from: 'primitives.default.default.default.bg',
    to: 'semantic.colorScheme.{mode}.content.background',
    transform: toColorString,
  },
  {
    from: 'primitives.default.default.default.contrast',
    to: 'semantic.colorScheme.{mode}.content.color',
    transform: toColorString,
  },
  {
    from: 'primitives.default.state.hover.default.bg',
    to: 'semantic.colorScheme.{mode}.content.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'primitives.default.state.hover.default.contrast',
    to: 'semantic.colorScheme.{mode}.content.hoverColor',
    transform: toColorString,
  },
  {
    from: 'primitives.default.default.default.border.default.color',
    to: 'semantic.colorScheme.{mode}.content.borderColor',
    transform: toColorString,
  },
];
