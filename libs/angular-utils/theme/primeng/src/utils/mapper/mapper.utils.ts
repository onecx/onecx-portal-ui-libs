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
  if (segments.length === 0 || segments.includes('__proto__')) return;
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
 * cssVar('usages.dataTable.base.background') // 'var(--onecx-theme-usages-data-table-base-background)'
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

// The global-font reference syntax, mirroring resolve-refs.ts so a reference that the
// resolver left unresolved (its target path did not exist) can still be recognised here.
const REF_RE = /^\{\{([\w.]+)\}\}$/;

/**
 * The canonical named leaf each independent global font scale selects for a scalar
 * consumer. `family` and `style` are scalar (no named leaf) and so are absent here —
 * they can never be reduced from an object.
 */
const CANONICAL_LEAF_BY_PROPERTY: Record<string, string> = {
  size: 'md',
  lineHeight: 'md',
  weight: 'normal',
  letterSpacing: 'normal',
};

/**
 * Returns true when `from` is a scalar-typography consumption boundary — a font property
 * the mapper turns into a PrimeNG preset token or a CSS `var()`. These are the only paths
 * where a scale object or a dangling reference must be reduced to a single scalar (or
 * dropped), so output never emits a scale object or an unresolved reference as a
 * typography value.
 *
 * Matches `*.font.<prop>` and the camelCase shorthand `fontSize` / `fontWeight`. It
 * intentionally does NOT match same-named non-typography tokens such as `focusRing.style`,
 * `icon.size`, `badge.dot.size`, or `...mobileButton...size`, so ordinary object
 * references keep their existing behavior.
 */
export function isScalarTypographyPath(from: string): boolean {
  const segments = from.split('.');
  const last = segments[segments.length - 1];
  const prev = segments[segments.length - 2];
  return prev === 'font' || last === 'fontSize' || last === 'fontWeight';
}

/**
 * Resolves a scalar-typography consumption boundary to a single CSS string, or
 * `undefined` when no usable scalar exists. Callers treat `undefined` as "emit nothing and
 * let CSS inheritance / the existing fallback take over" — the mapper must never write a
 * scale object or a raw reference as a scalar typography value, and must not synthesize a
 * distinct value a theme did not actually supply.
 *
 * `resolved` is the fully `resolveThemeRefs`-resolved theme. The interpretation applied
 * independently to each scaled property:
 *
 * | resolved value at `from`                 | result |
 * | --- | --- |
 * | plain scalar string                      | the string, unchanged |
 * | a scale object (whole-property ref)      | its canonical entry (size/lineHeight → `md`, weight/letterSpacing → `normal`); `undefined` when that entry is absent |
 * | dangling ref to the canonical leaf of a legacy scalar | the legacy scalar (canonical baseline) |
 * | any other dangling ref (non-canonical leaf, or missing token) | `undefined` — preserve fallback, never synthesize |
 *
 * A reference that reaches here as a string was left unresolved by the resolver, so the
 * only compatibility still to provide is the legacy-scalar fallback for a canonical
 * reference.
 */
export function resolveScalarTypography(
  resolved: unknown,
  from: string
): string | undefined {
  const raw = getByPath(resolved, from);
  if (raw === undefined || raw === null) return undefined;

  if (typeof raw === 'string') {
    const ref = raw.match(REF_RE);
    if (!ref) return raw; // plain scalar — pass through unchanged

    const target = ref[1]; // e.g. "primitives.font.size.md"
    const segments = target.split('.');
    const leaf = segments[segments.length - 1]; // requested named leaf
    const property = segments[segments.length - 2]; // scale property, e.g. "size"
    const parent = getByPath(resolved, segments.slice(0, -1).join('.'));

    // Legacy-scalar fallback: a canonical reference against a scalar (non-scale) global
    // font property resolves to that scalar. A non-canonical leaf (e.g. `sm`) against a
    // scalar is unavailable — we do not invent a small/large value.
    if (typeof parent === 'string' && CANONICAL_LEAF_BY_PROPERTY[property] === leaf) {
      return parent;
    }
    return undefined;
  }

  if (typeof raw === 'object') {
    // A whole-property reference that resolved to a scale object: reduce it to the
    // canonical scalar entry. Never emit the object itself, and never pick a non-canonical
    // entry for a bare reference.
    const leaf = CANONICAL_LEAF_BY_PROPERTY[terminalSegment(from)];
    if (!leaf) return undefined; // family/style are scalar and cannot be objects
    const value = (raw as Record<string, unknown>)[leaf];
    return typeof value === 'string' ? value : undefined;
  }

  return undefined;
}

/** Returns the last segment of a dot-path, or `undefined` for an empty path. */
function terminalSegment(from: string): string | undefined {
  const segments = from.split('.');
  return segments.length === 0 ? undefined : segments[segments.length - 1];
}
