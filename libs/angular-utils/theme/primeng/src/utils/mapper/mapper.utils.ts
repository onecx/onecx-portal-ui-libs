/**
 * Reads a value from a nested object by dot-separated path.
 * Returns `undefined` if any segment along the path is missing.
 */
export function getByPath(obj: unknown, path: string): unknown {
  let current: unknown = obj;
  for (const segment of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * Writes a value into a nested object at the given dot-separated path,
 * creating intermediate objects as needed.
 */
export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const segments = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[segments[segments.length - 1]] = value;
}

/**
 * Converts a dot-path to a CSS custom property name using the
 * `--onecx-theme-` prefix. Dots are replaced with hyphens.
 *
 * @example
 * cssVar('usages.table.base.bg') // 'var(--onecx-theme-usages-table-base-bg)'
 */
export function cssVar(path: string): string {
  return `var(--onecx-theme-${path.replace(/\./g, '-')})`;
}

/**
 * Returns true when `v` is a `{ light: string; dark: string }` color object.
 */
export function isLightDark(v: unknown): v is { light: string; dark: string } {
  return (
    v != null &&
    typeof v === 'object' &&
    'light' in (v as object) &&
    'dark' in (v as object) &&
    !Array.isArray(v)
  );
}

/**
 * Normalises a theme value that should represent a CSS color string to an
 * actual string.  Handles:
 * - Plain strings (returned as-is).
 * - `{ light, dark }` objects (returns the `light` value; callers that need
 *   both modes should check `isLightDark` and handle modes individually).
 * - `{ color, ... }` bg-objects (returns the `color` property).
 *
 * Returns `undefined` if normalisation yields no usable string.
 */
export function normalizeToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (isLightDark(value)) return value.light;
  if (
    value != null &&
    typeof value === 'object' &&
    'color' in (value as object)
  ) {
    return normalizeToString((value as Record<string, unknown>)['color']);
  }
  return undefined;
}

/**
 * Coerces any bg/color-like value to a plain CSS string.
 * Used for token positions that PrimeNG expects to receive a string.
 */
export const toColorString = (v: unknown): unknown =>
  normalizeToString(v) ?? v;
