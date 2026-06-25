import type { ThemePropertiesV2 } from '@onecx/integration-interface';
import type { ComponentsDesignTokens } from '@primeuix/themes/types';

// ─── Shared Utilities ─────────────────────────────────────────────────────────

/**
 * Depth counter for recursive type traversal.
 * Each recursion step indexes into this tuple to decrement the counter.
 * When the counter reaches `never`, recursion stops.
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Removes index signatures from a type, keeping only explicitly declared keys.
 * Necessary because `ComponentsDesignTokens` has `[key: PropertyKey]: ...`
 * which would otherwise make any string a valid key.
 */
type RemoveIndex<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: T[K];
};

/**
 * Distributively extracts string keys from all object members of a union type.
 * Non-object members (e.g. `string`, `number`, functions) contribute `never`.
 */
type ObjKeys<T> = T extends (...args: unknown[]) => unknown
  ? never
  : T extends object
    ? keyof T & string
    : never;

/**
 * Distributively indexes into object members of a union type.
 * For each object member of `T` that has key `K`, returns `T[K]`.
 */
type ObjIndex<T, K extends string> = T extends object
  ? K extends keyof T
    ? T[K]
    : never
  : never;

// ─── Theme Paths (from) ──────────────────────────────────────────────────────

/**
 * Recursively generates all valid dot-notation paths through type `T`,
 * up to a maximum depth `D`.
 *
 * Leaf-only: a path is emitted only when traversal reaches a non-object
 * value (string, number, boolean). Intermediate object paths are NOT
 * emitted. This is correct for theme `from` paths, which always reference
 * a CSS value, never a sub-tree — and it shrinks the resulting union by
 * an order of magnitude vs. emitting every node.
 *
 * Handles:
 * - Optional properties (unwrapped via `NonNullable`)
 * - Union types (distributes over object members)
 * - Depth limiting to prevent infinite recursion (TS2589)
 *
 * @example
 * ```ts
 * type Example = { a?: { b: string; c: { d: number } } };
 * type P = LeafPaths<Example>; // 'a.b' | 'a.c.d'
 * ```
 */
type LeafPaths<T, D extends number = 11> = [D] extends [never]
  ? never
  : T extends (...args: unknown[]) => unknown
    ? never
    : T extends object
      ? {
          [K in keyof T & string]: NonNullable<T[K]> extends infer V
            ? V extends (...args: unknown[]) => unknown
              ? K
              : V extends object
                ? `${K}.${LeafPaths<V, Prev[D]>}`
                : K
            : never;
        }[keyof T & string]
      : never;

/**
 * Source type for theme path generation.
 * Excludes `regionOverrides` (never referenced in mapping rules, and its 7×
 * repetition of the full schema would cause type computation explosion).
 */
type RequiredThemeV2 = Required<ThemePropertiesV2>;
type Primitives = RequiredThemeV2['primitives'];
type Usages = NonNullable<RequiredThemeV2['usages']>;

/**
 * Union of all valid dot-notation paths to leaf values in `ThemePropertiesV2`
 * (`primitives` + `usages` subtrees).
 *
 * Built by concatenating fixed top-level prefixes with `LeafPaths` of each
 * subtree. Computing each subtree independently keeps every `LeafPaths`
 * instantiation small enough to stay within TS's instantiation budget.
 *
 * Constrains `MappingRule.from` / `CssDeclaration.from` so typos are caught
 * at compile time. Depth covers the deepest real path:
 * `usages.table.row.defaultState.even.defaultState.cell.defaultState.border.width.top`.
 */
export type ThemePath =
  | `primitives.${LeafPaths<NonNullable<Primitives>>}`
  | `usages.dialog.${LeafPaths<NonNullable<Usages['dialog']>>}`
  | `usages.region.${LeafPaths<NonNullable<Usages['region']>>}`
  | `usages.table.${LeafPaths<NonNullable<Usages['table']>>}`
  | `usages.tooltip.${LeafPaths<NonNullable<Usages['tooltip']>>}`
  | `usages.carousel.${LeafPaths<NonNullable<Usages['carousel']>>}`;

// ─── Preset Paths (to) ───────────────────────────────────────────────────────

/**
 * Keys on component token types (from `DesignTokens<T>`) that are NOT valid
 * token paths — they hold CSS strings or extension records.
 */
type PresetExcluded = 'css' | 'extend';

/**
 * Expands `'light'` and `'dark'` keys to also include `'{mode}'` — matching
 * the mapper's `{mode}` placeholder convention that expands to both modes.
 */
type ModeAlias<K extends string> = K extends 'light' | 'dark' ? K | '{mode}' : K;

/**
 * Recursively generates all valid dot-notation paths through a PrimeNG preset type.
 * Similar to `Paths` but with:
 * - `{mode}` alias support for `light`/`dark` keys
 * - Exclusion of non-token keys (`css`, `extend`)
 * - Index signature stripping via `RemoveIndex`
 */
type PresetPaths<T, D extends number = 10> = [D] extends [never]
  ? never
  : Exclude<ObjKeys<RemoveIndex<NonNullable<T>>>, PresetExcluded> extends infer K
    ? K extends string
      ? ModeAlias<K> | `${ModeAlias<K>}.${PresetPaths<ObjIndex<NonNullable<T>, K>, Prev[D]>}`
      : never
    : never;

/**
 * All valid dot-notation paths into the PrimeNG `components` section.
 * Fully validated against `ComponentsDesignTokens` from `@primeuix/themes/types`.
 * Handles the `{mode}` placeholder in `colorScheme.{mode}.X` paths.
 */
type ComponentPaths = `components.${PresetPaths<RemoveIndex<ComponentsDesignTokens>>}`;

/**
 * Unconstrained paths for the `semantic` section of a PrimeNG preset.
 * Not validated because projects use custom base themes whose semantic tokens
 * are not captured by any single published type definition.
 */
type SemanticPaths = `semantic.${string}`;

/**
 * Union of all valid PrimeNG preset dot-paths for `MappingRule.to`.
 *
 * - **Component paths** (`components.*`): Strictly validated against the typed
 *   `ComponentsDesignTokens` from `@primeuix/themes/types`. Supports `{mode}`
 *   as an alias for `light`/`dark` in `colorScheme` paths.
 * - **Semantic paths** (`semantic.*`): Unconstrained — accepts any sub-path
 *   because projects use custom base themes.
 */
export type PresetPath = ComponentPaths | SemanticPaths;
