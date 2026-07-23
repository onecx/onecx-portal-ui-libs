import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const focusRingRules: MappingRule[] = [
  {
    from: 'primitives.focusRing.color',
    to: 'semantic.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'primitives.focusRing.width',
    to: 'semantic.focusRing.width',
  },
  {
    from: 'primitives.focusRing.style',
    to: 'semantic.focusRing.style',
  },
  {
    from: 'primitives.focusRing.offset',
    to: 'semantic.focusRing.offset',
  },
  {
    from: 'primitives.focusRing.shadow',
    to: 'semantic.focusRing.shadow',
  },
];
