import { AxisGroupMetadata, AxisKind, DEFAULT_FALLBACK_ORDER, LeafAxisMetadata } from './axis.model';

export interface Combo {
  variant: string;
  state: string;
  severity: string;
}

/**
 * Builds the CSS custom property name for a path of name segments under a prefix.
 *
 * @param prefix - The CSS variable prefix (for example `onecx-theme-input`).
 * @param path - The ordered name segments of the combination.
 * @returns The custom property name, prefixed with `--`.
 */
export function cssVariableName(prefix: string, path: string[]): string {
  return `--${prefix}-${path.join('-')}`;
}

/**
 * Enumerates every variant/state/severity combination of a single axis group.
 *
 * @param group - The axis group whose combinations to produce.
 * @returns One {@link Combo} per variant/state/severity triple.
 */
export function cartesianCombos(group: AxisGroupMetadata): Combo[] {
  const combos: Combo[] = [];
  for (const variant of group.variants) {
    for (const state of group.states) {
      for (const severity of group.severities) {
        combos.push({ variant, state, severity });
      }
    }
  }
  return combos;
}

function defaultOf(group: AxisGroupMetadata, axis: 'variant' | 'state' | 'severity'): string {
  if (axis === 'variant') {
    return group.defaultVariant;
  }
  if (axis === 'state') {
    return group.defaultState;
  }
  return group.defaultSeverity;
}

/**
 * Returns the parent (next less-specific) combination within a single axis group by
 * relaxing the first axis in `relaxOrder` whose current value differs from that
 * axis's default.
 *
 * @param combo - The combination to relax.
 * @param group - The axis group the combination belongs to.
 * @param relaxOrder - The configured axis priority order.
 * @returns The relaxed combination, or `undefined` when the combination is already
 *   fully relaxed (equal to its base combination).
 */
export function parentCombo(combo: Combo, group: AxisGroupMetadata, relaxOrder: AxisKind[]): Combo | undefined {
  for (const axis of relaxOrder) {
    if (axis === 'child') {
      continue;
    }
    const current = combo[axis];
    const def = defaultOf(group, axis);
    if (current !== def) {
      return { ...combo, [axis]: def };
    }
  }
  return undefined;
}

/**
 * Returns the parent of a full combination spanning one or more axis groups. The
 * innermost group (last in `groups`) is relaxed first; only when a group is already
 * fully relaxed does relaxation proceed to the next-outer group.
 *
 * @param groups - The axis groups outermost first.
 * @param combos - The current value per group, aligned with `groups`.
 * @param relaxOrder - The configured axis priority order.
 * @returns The full combination with the first relaxable group relaxed, or
 *   `undefined` when every group is fully relaxed.
 */
export function parentOfFullCombo(
  groups: AxisGroupMetadata[],
  combos: Combo[],
  relaxOrder: AxisKind[],
): Combo[] | undefined {
  for (let g = groups.length - 1; g >= 0; g--) {
    const parent = parentCombo(combos[g], groups[g], relaxOrder);
    if (parent) {
      return combos.map((combo, index) => (index === g ? parent : combo));
    }
  }
  return undefined;
}

/**
 * Reduces a single {@link Combo} to its path name segments.
 *
 * @param combo - The combination to reduce.
 * @returns The `[variant, state, severity]` name segments.
 */
export function comboPathSegment(combo: Combo): string[] {
  return [combo.variant, combo.state, combo.severity];
}

function fullCombosCartesian(groups: AxisGroupMetadata[]): Combo[][] {
  let result: Combo[][] = [[]];
  for (const group of groups) {
    const next: Combo[][] = [];
    for (const partial of result) {
      for (const combo of cartesianCombos(group)) {
        next.push([...partial, combo]);
      }
    }
    result = next;
  }
  return result;
}

function pathFor(fullCombo: Combo[], leafFieldName: string): string[] {
  const segments = fullCombo.flatMap(comboPathSegment);
  return [...segments, leafFieldName];
}

/**
 * Builds the merged CSS-variable map for a single terminal token field. Each
 * combination is emitted with its real configured value when one exists, otherwise
 * with a `var(--parent)` reference to its next less-specific combination. A fully
 * relaxed base combination with no real value emits no entry, so the browser's or
 * PrimeNG's own default styling applies.
 *
 * @param leaf - The per-leaf axis metadata for the token.
 * @param realValues - Map of CSS variable name to the tenant's explicit value.
 * @param cssPrefix - The CSS variable name prefix.
 * @param fallbackOrder - The axis relaxation order (defaults to
 *   `['state', 'variant', 'severity']`).
 * @returns The merged map of CSS variable name to value or `var()` reference.
 */
export function buildFallbackChain(
  leaf: LeafAxisMetadata,
  realValues: Map<string, string>,
  cssPrefix: string,
  fallbackOrder: AxisKind[] = DEFAULT_FALLBACK_ORDER,
): Map<string, string> {
  const result = new Map<string, string>();
  const leafFieldName = leaf.path[leaf.path.length - 1];

  for (const fullCombo of fullCombosCartesian(leaf.groups)) {
    const path = pathFor(fullCombo, leafFieldName);
    const varName = cssVariableName(cssPrefix, path);
    const real = realValues.get(varName);

    if (real !== undefined) {
      result.set(varName, real);
      continue;
    }

    const parent = parentOfFullCombo(leaf.groups, fullCombo, fallbackOrder);
    if (parent) {
      const parentPath = pathFor(parent, leafFieldName);
      result.set(varName, `var(${cssVariableName(cssPrefix, parentPath)})`);
    }
  }

  return result;
}

/**
 * Builds the merged CSS-variable map for every supplied terminal token field,
 * combining each field's {@link buildFallbackChain} output into one map.
 *
 * @param leaves - The per-leaf axis metadata for the token fields to merge.
 * @param realValues - Map of CSS variable name to the tenant's explicit value.
 * @param cssPrefix - The CSS variable name prefix.
 * @param fallbackOrder - The axis relaxation order (defaults to
 *   `['state', 'variant', 'severity']`).
 * @returns The single merged map of CSS variable name to value or `var()` reference.
 * @throws When two fields compute different values for the same CSS variable name.
 */
export function buildFallbackChainForLeaves(
  leaves: LeafAxisMetadata[],
  realValues: Map<string, string>,
  cssPrefix: string,
  fallbackOrder: AxisKind[] = DEFAULT_FALLBACK_ORDER,
): Map<string, string> {
  const merged = new Map<string, string>();

  for (const leaf of leaves) {
    for (const [key, value] of buildFallbackChain(leaf, realValues, cssPrefix, fallbackOrder)) {
      const existing = merged.get(key);
      if (existing !== undefined && existing !== value) {
        throw new Error(`Fallback chain collision for CSS variable "${key}"`);
      }
      merged.set(key, value);
    }
  }

  return merged;
}
