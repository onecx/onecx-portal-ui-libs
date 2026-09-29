/**
 * Maps a Theme V2 CSS variable name to its nearest single-step fallback variable.
 *
 * A concrete leaf's relaxed-axis structure (see {@link ./axis-metadata.ts deriveLeafAxisMetadata})
 * is what this module consumes to pick the one less-specific variable the leaf falls back to: the
 * same variable with a single non-default axis reset to its default. The leaf's own scope is
 * scanned first and a parent scope is reached only once every axis of the current scope is already
 * at its default.
 */

import {
  AXES_OUTER_TO_INNER,
  DEFAULT_KEY,
  DEFAULT_SEGMENTS,
  FALLBACK_ORDER_DEFAULT,
  deriveLeafAxisMetadata,
  type Entry,
  type RelaxedAxisKind,
  type Scope,
} from './axis-metadata'
import { theme } from '../current-themes.schema'

/** The CSS custom-property prefix every Theme V2 variable carries. */
export const THEME_VAR_PREFIX = '--onecx-theme-'

/** The default order in which non-default relaxed axes are relaxed. */
export const fallbackOrder: RelaxedAxisKind[] = FALLBACK_ORDER_DEFAULT

function toLeafPath(varName: string): string | undefined {
  if (!varName.startsWith(THEME_VAR_PREFIX)) {
    return undefined
  }
  const relative = varName.slice(THEME_VAR_PREFIX.length)
  if (relative.length === 0) {
    return undefined
  }
  return `v2.${relative.replace(/-/g, '.')}`
}

function toVarName(leafPath: string): string {
  return THEME_VAR_PREFIX + (leafPath.startsWith('v2.') ? leafPath.slice('v2.'.length) : leafPath).replace(/\./g, '-')
}

function isDefaultEntry(entry: Entry): boolean {
  return entry.segments.length === 1 && entry.segments[0] === DEFAULT_KEY[entry.kind]
}

function firstRelaxableKind(scope: Scope, order: RelaxedAxisKind[]): RelaxedAxisKind | undefined {
  return order.find((kind) => scope.entries.some((entry) => entry.kind === kind && !isDefaultEntry(entry)))
}

function relaxAxis(leafPath: string, scope: Scope, kind: RelaxedAxisKind): string {
  const segments = leafPath.split('.')
  let offset = scope.scopePath.split('.').length
  for (const axis of AXES_OUTER_TO_INNER) {
    const entry = scope.entries.find((e) => e.kind === axis)
    if (entry === undefined) {
      continue
    }
    if (axis === kind) {
      segments.splice(offset, entry.segments.length, ...DEFAULT_SEGMENTS[kind])
      return toVarName(segments.join('.'))
    }
    offset += entry.segments.length
  }
  return leafPath
}

function buildNearestFallback(leafPath: string, scopes: Scope[], order: RelaxedAxisKind[]): string | undefined {
  for (const scope of scopes) {
    const kind = firstRelaxableKind(scope, order)
    if (kind !== undefined) {
      return relaxAxis(leafPath, scope, kind)
    }
  }
  return undefined
}

/**
 * Resolves the nearest single-step fallback variable for a theme CSS variable.
 *
 * Converts the variable name to its leaf path, derives the leaf's relaxed-axis structure on
 * demand, and returns the single less-specific variable with its first non-default axis (in
 * `order`) reset to its default. The leaf's own scope is scanned first; a parent scope is reached
 * only once every axis of the current scope is already at its default. The result is emitted with
 * the same {@link THEME_VAR_PREFIX} dash encoding, and is `undefined` when nothing can be relaxed
 * (the leaf is already fully default, or is not a known leaf).
 *
 * @param varName - The theme variable name, e.g.
 *   `--onecx-theme-primitives-variant-primary-state-hover-severity-success-border-color`.
 * @param order - The axis relaxation order. Defaults to {@link fallbackOrder}.
 */
export function resolveLeafFallback(varName: string, order: RelaxedAxisKind[] = fallbackOrder): string | undefined {
  const leafPath = toLeafPath(varName)
  if (leafPath === undefined) {
    return undefined
  }
  const metadata = deriveLeafAxisMetadata(theme, leafPath)
  if (metadata === undefined || metadata.scopes.length === 0) {
    return undefined
  }
  return buildNearestFallback(leafPath, metadata.scopes, order)
}
