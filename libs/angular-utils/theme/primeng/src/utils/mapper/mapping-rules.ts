import type { MappingRule } from './mapper.types';
import { primitiveMappingRules } from './mapping-rules/primitive-mapping-rules';
import { usageMappingRules } from './mapping-rules/usage-mapping-rules';

/**
 * Declarative table of OneCX theme dot-paths → PrimeNG preset dot-paths.
 *
 * Rules are evaluated in order. The mapper skips a rule when the source path
 * yields `undefined` in the resolved theme.
 *
 * ### `{mode}` placeholder
 * When `to` contains `{mode}`, the mapper expands it to both `'light'` and
 * `'dark'`. If the resolved value is a `{ light, dark }` colour object the
 * mapper writes `.light` to the light path and `.dark` to the dark path.
 * Otherwise (plain string / number) the same value is written to both paths.
 *
 * ### Extending this table
 * To map a new theme property, add a single `{ from, to }` entry to the
 * appropriate leaf file under `mapping-rules/`.
 * No changes to mapper.ts are needed for the common case.
 */
export const MAPPING_RULES: MappingRule[] = [
  ...primitiveMappingRules,
  ...usageMappingRules,
];
