import type { MappingRule } from '../mapper.types';
import { defaultRules } from './primitives/default.rules';
import { variantRules } from './primitives/variant.rules';
import { focusRingRules } from './primitives/focus-ring.rules';
import { radiusRules } from './primitives/radius.rules';

export const primitiveMappingRules: MappingRule[] = [
  ...defaultRules,
  ...variantRules,
  ...focusRingRules,
  ...radiusRules,
];
