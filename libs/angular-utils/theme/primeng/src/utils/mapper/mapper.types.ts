import type { Preset } from '@primeuix/themes/types';
import type { PresetPath, ThemePath } from './theme-path.types';

export type { Preset };

/**
 * A single token-level mapping from a resolved theme dot-path to a PrimeNG preset dot-path.
 *
 * - `from` is read from the fully resolved theme object (after `resolveThemeRefs`).
 *   Constrained to `ThemePath` so that only valid paths into the theme schema
 *   are accepted at compile time.
 * - `to` is written into the plain preset object that the mapper builds.
 *   May contain the literal `{mode}` segment, which the mapper expands to both
 *   `'light'` and `'dark'`. When the source value is a `{ light, dark }` color
 *   object the mapper writes the respective variant to each mode; otherwise the
 *   same value is written to both.
 * - `transform` is applied to the resolved value before it is written to the
 *   preset. Use it for shape normalisation (e.g. coercing a bg-object to its
 *   `.color` string).
 */
export interface MappingRule {
  from: ThemePath;
  to: PresetPath;
  transform?: (value: unknown) => unknown;
}

/**
 * A single CSS declaration inside a `CssRule`.
 *
 * Either `from` or `value` must be provided:
 *  - `from`  — a dot-path in the theme used to derive the CSS variable name
 *              (`var(--onecx-theme-{path-as-dashes})`). The declaration is only
 *              emitted when the resolved theme actually has a value at that path.
 *  - `value` — a static/literal CSS value that is always emitted (for structural
 *              rules that don't come from a theme token).
 */
export interface CssDeclaration {
  /** CSS property name, e.g. 'border-radius'. */
  property: string;
  /**
   * Dot-path in the theme whose variable name (`--onecx-theme-{dashes}`) is
   * used as the CSS value.  Omit when `value` is provided instead.
   * Constrained to `ThemePath` for compile-time validation.
   */
  from?: ThemePath;
  /**
   * Literal CSS value, always emitted.  Omit when `from` is provided instead.
   */
  value?: string;
}

/**
 * A complete CSS rule (selector + declarations) to be included in the CSS
 * string output for styles that cannot be expressed as PrimeNG preset tokens.
 *
 * The selector block is only emitted when at least one declaration has a value
 * to contribute (i.e. its `from` path exists in the resolved theme, or it has
 * a static `value`).
 */
export interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}
