/**
 * Resolves theme references in the format {{path.to.value}} to actual values
 * by looking up the dot-path against the theme object itself.
 *
 * Handles:
 * - Nested references (a ref pointing to another ref)
 * - Circular reference detection (throws on cycles)
 * - References to objects (returns the entire subtree, recursively resolved)
 *
 * Copied from theme-schema/resolve-refs.ts.
 */

const REF_PATTERN = /^\{\{([\w.]+)\}\}$/;
const MAX_DEPTH = 20;

function getByPath(obj: unknown, path: string): unknown {
  let current: unknown = obj;
  for (const segment of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function resolveValue(
  value: string,
  root: unknown,
  visited: Set<string>
): unknown {
  const match = value.match(REF_PATTERN);
  if (!match) return value;

  const path = match[1];
  if (visited.has(path)) {
    throw new Error(
      `Circular theme reference detected: {{${path}}} (chain: ${[...visited].join(' -> ')} -> ${path})`
    );
  }
  if (visited.size >= MAX_DEPTH) {
    throw new Error(
      `Theme reference depth exceeded ${MAX_DEPTH}: ${[...visited].join(' -> ')} -> ${path}`
    );
  }

  visited.add(path);
  const resolved = getByPath(root, path);
  if (resolved === undefined) return value; // unresolvable ref — keep as-is
  return resolveNode(resolved, root, visited);
}

function resolveNode(
  node: unknown,
  root: unknown,
  visited: Set<string>
): unknown {
  if (typeof node === 'string') {
    return resolveValue(node, root, new Set(visited));
  }

  if (Array.isArray(node)) {
    return node.map((item) => resolveNode(item, root, new Set(visited)));
  }

  if (node != null && typeof node === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(node)) {
      result[key] = resolveNode(val, root, new Set(visited));
    }
    return result;
  }

  return node;
}

/**
 * Takes a theme object and returns a new object with all `{{path.to.value}}`
 * references replaced by the actual values they point to.
 *
 * @example
 * ```ts
 * const theme = {
 *   primitives: { font: { family: 'Inter' } },
 *   usages: { region: { font: { family: '{{primitives.font.family}}' } } },
 * };
 * const resolved = resolveThemeRefs(theme);
 * // resolved.usages.region.font.family === 'Inter'
 * ```
 */
export function resolveThemeRefs<T>(theme: T): T {
  return resolveNode(theme, theme, new Set()) as T;
}
