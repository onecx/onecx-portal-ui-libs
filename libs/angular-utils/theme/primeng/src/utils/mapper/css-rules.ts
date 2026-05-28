import type { CssRule } from './mapper.types';
import { usageCssRules } from './css-rules/usage-css-rules';

/**
 * Declarative list of CSS rules that cannot be expressed as PrimeNG preset
 * tokens.  Each `CssDeclaration` produces a single CSS declaration line.
 *
 * Declarations with `from` are only included when the resolved theme has a
 * value at that dot-path (keeping the output lean).
 *
 * Declarations with a static `value` are always included — use these for
 * structural requirements that don't come from a theme token (e.g. `overflow:
 * hidden` needed to clip border-radius on a table container).
 *
 * ### Extending this list
 * To add CSS for a new unmappable property: add a new `CssRule` entry to the
 * appropriate leaf file under `css-rules/`.  No changes to mapper.ts.
 */
export const CSS_RULES: CssRule[] = [
  ...usageCssRules,
];
