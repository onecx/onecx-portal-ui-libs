import type { ThemePropertiesV2 } from '@onecx/integration-interface';

/**
 * Depth counter for recursive type traversal.
 * Each recursion step indexes into this tuple to decrement the counter.
 * When the counter reaches `never`, recursion stops.
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Distributively extracts string keys from all object members of a union type.
 * Non-object members (e.g. `string`, `number`) contribute `never`.
 */
type ObjKeys<T> = T extends object ? keyof T & string : never;

/**
 * Distributively indexes into object members of a union type.
 * For each object member of `T` that has key `K`, returns `T[K]`.
 */
type ObjIndex<T, K extends string> = T extends object
  ? K extends keyof T
    ? T[K]
    : never
  : never;

/**
 * Recursively generates all valid dot-notation paths through type `T`,
 * up to a maximum depth `D`. Handles:
 * - Optional properties (unwrapped via `NonNullable`)
 * - Union types (distributes over object members)
 * - Depth limiting to prevent infinite recursion (TS2589)
 *
 * @example
 * ```ts
 * type Example = { a?: { b: string; c: { d: number } } };
 * type P = Paths<Example>; // 'a' | 'a.b' | 'a.c' | 'a.c.d'
 * ```
 */
type Paths<T, D extends number = 12> = [D] extends [never]
  ? never
  : ObjKeys<NonNullable<T>> extends infer K
    ? K extends string
      ? K | `${K}.${Paths<ObjIndex<NonNullable<T>, K>, Prev[D]>}`
      : never
    : never;

/**
 * Source type for theme path generation.
 * Excludes `regionOverrides` (never referenced in mapping rules, and its 7×
 * repetition of the full schema would cause type computation explosion).
 */
type ThemePathSource = Required<Pick<ThemePropertiesV2, 'primitives' | 'usages'>>;

/**
 * Union of all valid dot-notation paths into `ThemePropertiesV2` (primitives + usages).
 * Used to constrain `MappingRule.from` and `CssDeclaration.from` so that typos
 * in theme paths are caught at compile time.
 */
export type ThemePath = Paths<ThemePathSource>;
