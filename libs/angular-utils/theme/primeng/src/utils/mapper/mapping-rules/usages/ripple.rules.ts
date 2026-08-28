import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const rippleMappingRules: MappingRule[] = [
  {
    from: 'usages.ripple.background',
    to: 'components.ripple.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
];
