/**
 * Derives the relaxed-axis fallback structure of a Theme V2 schema's leaf tokens.
 *
 * A leaf inside a relaxed-axis chain passes through a sequence of `variant` / `state` / `severity`
 * members. {@link deriveLeafAxisMetadata} recovers that structure for a single leaf by descending the
 * schema along its dot-joined path, and {@link introspectThemeAxisMetadata} does so for every leaf in
 * one full walk. The result is a set of fallback {@link Scope}s, each anchored at a variant root and
 * holding the leaf's relaxed-axis {@link Entry} members (innermost-first, relative-delta segments).
 *
 * Example — primitives (`variantWithStates` model, scope anchored at the `v2.primitives` root):
 * ```ts
 * deriveLeafAxisMetadata(theme, 'v2.primitives.variant.primary.state.hover.severity.success.bg.color')
 * // => {
 * //      scopes: [{
 * //        scopePath: 'v2.primitives',
 * //        entries: [                                  // innermost-first, relative deltas
 * //          { kind: 'severity', segments: ['severity', 'success'] },
 * //          { kind: 'state',    segments: ['state', 'hover'] },
 * //          { kind: 'variant',  segments: ['variant', 'primary'] },
 * //        ],
 * //      }],
 * //    }
 * ```
 *
 * Turning that structure into the nearest single-step fallback variable for a concrete variable
 * name is a separate concern — see {@link ./resolve-leaf-fallback.ts resolveLeafFallback}.
 */

import * as z from 'zod'
import { themeSchemaRegistry } from '../schema/registry'

/** The axis a schema node can be registered with. */
export type AxisKind = 'variant' | 'state' | 'severity' | 'child' | 'setting'

/** The axis kinds that participate in fallback relaxation. */
export type RelaxedAxisKind = 'variant' | 'state' | 'severity'

/** The baseline default slot name per relaxed axis, marking the "already at default" state. */
export const DEFAULT_SEGMENTS: Record<RelaxedAxisKind, string[]> = {
  variant: ['defaultVariant'],
  state: ['defaultState'],
  severity: ['defaultSeverity'],
}

/**
 * The relaxed axes in their layout order within a leaf path — outermost first. A scope's entries
 * are stored innermost-first (severity, state, variant), but their spans occupy the path in this
 * order, so locating a span by accumulating the spans before it means walking this order, not the
 * entry array.
 */
export const AXES_OUTER_TO_INNER: RelaxedAxisKind[] = ['variant', 'state', 'severity']

/** A relaxed-axis member a leaf crosses within one scope. */
export interface Entry {
  kind: RelaxedAxisKind
  /** The **relative** key-segment delta from the previous (outer) entry to this member — not a cumulative path. */
  segments: string[]
}

/** A fallback scope anchored at a variant root. */
export interface Scope {
  /** Dot-joined path from the schema root to the scope's anchor node. */
  scopePath: string
  /** The relaxed-axis entries, innermost-first (severity, state, variant). */
  entries: Entry[]
}

/**
 * The derived fallback metadata for a single leaf token. Keyed by its dot-joined path from the
 * schema root (the map key is the leaf path, so the path is not repeated as a field).
 */
export interface LeafFallbackMetadata {
  /** The innermost-first chain of fallback scopes the leaf passes through. */
  scopes: Scope[]
}

function getDefType(schema: z.ZodTypeAny): string {
  return (schema as unknown as { _zod: { def: { type: string } } })._zod.def.type
}

function getInnerType(schema: z.ZodTypeAny): z.ZodTypeAny {
  return (schema as unknown as { _zod: { def: { innerType: z.ZodTypeAny } } })._zod.def.innerType
}

function getUnionOptions(schema: z.ZodTypeAny): z.ZodTypeAny[] {
  return (schema as unknown as { _zod: { def: { options: z.ZodTypeAny[] } } })._zod.def.options
}

function getObjectShape(schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> {
  return (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape
}

const WRAPPER_TYPES = new Set(['optional', 'default', 'prefault', 'nonoptional', 'readonly'])

function unwrapWrapperChain(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema
  while (WRAPPER_TYPES.has(getDefType(current))) {
    current = getInnerType(current)
  }
  return current
}

function unwrapThemeRefUnion(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (getDefType(schema) !== 'union') {
    return schema
  }
  const options = getUnionOptions(schema).map(unwrapWrapperChain)
  const nonRefOption = options.find((option) => {
    const meta = themeSchemaRegistry.get(option)
    return !(getDefType(option) === 'string' && meta !== undefined && meta.id === 'themeRef')
  })
  return nonRefOption !== undefined ? nonRefOption : schema
}

function resolveSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  return unwrapThemeRefUnion(unwrapWrapperChain(schema))
}

function isRawConstant(value: unknown): boolean {
  return value === null || value === undefined || typeof value !== 'object' || !('_zod' in value)
}

function isLeaf(schema: z.ZodTypeAny): boolean {
  const type = getDefType(schema)
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    type === 'enum' ||
    type === 'array' ||
    type === 'union'
  )
}

function getAxisAndChildFlag(schema: z.ZodTypeAny): { axis: string | undefined; child: boolean } {
  const entry = themeSchemaRegistry.get(schema)
  return { axis: entry !== undefined ? entry.axis : undefined, child: entry !== undefined && entry.child === true }
}

function isChildBoundary(childSchema: z.ZodTypeAny): boolean {
  if (isRawConstant(childSchema)) {
    return false
  }
  return getAxisAndChildFlag(resolveSchema(childSchema)).child
}

export const DEFAULT_KEY: Record<RelaxedAxisKind, string> = {
  variant: DEFAULT_SEGMENTS.variant[0],
  state: DEFAULT_SEGMENTS.state[0],
  severity: DEFAULT_SEGMENTS.severity[0],
}

function classifyKey(kind: string | undefined, key: string): RelaxedAxisKind | null {
  if (kind === 'variant' || kind === 'state' || kind === 'severity') {
    return kind
  }
  if (key === DEFAULT_KEY.variant) {
    return 'variant'
  }
  if (key === DEFAULT_KEY.state) {
    return 'state'
  }
  if (key === DEFAULT_KEY.severity) {
    return 'severity'
  }
  return null
}

function isVariantRoot(childSchema: z.ZodTypeAny): boolean {
  if (isRawConstant(childSchema)) {
    return false
  }
  const resolved = resolveSchema(childSchema)
  return getDefType(resolved) === 'object' && DEFAULT_KEY.variant in getObjectShape(resolved)
}

/**
 * The relaxed-axis scopes accumulated so far, plus how deep the innermost scope's anchor sits in
 * the caller's path array. The path is owned by the caller as a stable array and read by index, so
 * the state tracks only an offset into it — the prefix is never copied.
 */
interface WalkState {
  scopes: Scope[]
  anchorDepth: number
}

function joinPath(path: string[]): string {
  return path.join('.')
}

function recordMember(
  scopes: Scope[],
  kind: RelaxedAxisKind,
  path: string[],
  depth: number,
  anchorDepth: number
): Scope[] {
  const scope = scopes[0]
  if (!scope) {
    return scopes
  }
  const segments = path.slice(anchorDepth, depth + 1)
  const newScope: Scope = { scopePath: scope.scopePath, entries: [{ kind, segments }, ...scope.entries] }
  return [newScope, ...scopes.slice(1)]
}

function openScope(walkState: WalkState, path: string[], depth: number): WalkState {
  return {
    scopes: [{ scopePath: path.slice(0, depth + 1).join('.'), entries: [] }, ...walkState.scopes],
    anchorDepth: depth + 1,
  }
}

function advanceWalkState(
  axis: string | undefined,
  key: string,
  child: z.ZodTypeAny,
  path: string[],
  depth: number,
  walkState: WalkState
): WalkState {
  if (isChildBoundary(child)) {
    return openScope(walkState, path, depth)
  }
  const kind = classifyKey(axis, key)
  if (kind !== null) {
    return {
      scopes: recordMember(walkState.scopes, kind, path, depth, walkState.anchorDepth),
      anchorDepth: depth + 1,
    }
  }
  if (isVariantRoot(child)) {
    return openScope(walkState, path, depth)
  }
  return walkState
}

function toLeafMetadata(walkState: WalkState): LeafFallbackMetadata | undefined {
  const scopes = walkState.scopes
    .filter((scope) => scope.entries.length > 0)
    .map((scope) => ({
      scopePath: scope.scopePath,
      entries: scope.entries.map((entry) => ({ kind: entry.kind, segments: [...entry.segments] })),
    }))
  return scopes.length > 0 ? { scopes } : undefined
}

function walk(
  schema: z.ZodTypeAny,
  path: string[],
  walkState: WalkState,
  out: Record<string, LeafFallbackMetadata>
): void {
  if (isRawConstant(schema)) {
    return
  }

  const resolved = resolveSchema(schema)
  const depth = path.length - 1

  if (isLeaf(resolved)) {
    const metadata = toLeafMetadata(walkState)
    if (metadata !== undefined) {
      out[joinPath(path)] = metadata
    }
    return
  }

  if (getDefType(resolved) !== 'object') {
    return
  }

  const { axis } = getAxisAndChildFlag(resolved)
  for (const [key, child] of Object.entries(getObjectShape(resolved))) {
    path.push(key)
    walk(child, path, advanceWalkState(axis, key, child, path, depth + 1, walkState), out)
    path.pop()
  }
}

/**
 * Walks a Theme V2 Zod schema and returns, per leaf token inside a relaxed-axis chain, its
 * ordered (innermost-first) fallback scopes and entries.
 *
 * @param schema - The schema to introspect (typically the top-level `theme` schema).
 */
export function introspectThemeAxisMetadata(schema: z.ZodTypeAny): Record<string, LeafFallbackMetadata> {
  const out: Record<string, LeafFallbackMetadata> = {}
  walk(schema, [], { scopes: [], anchorDepth: 0 }, out)
  return out
}

/**
 * Validates the contiguity invariant of a leaf's relaxed-axis entries: within a scope, a
 * severity entry implies a state entry (a severity member is always nested under a state).
 * Scoped to the given leaf-path prefixes so it can validate a subset of a metadata map.
 *
 * @param metadata - The per-leaf fallback metadata map (e.g. {@link introspectThemeAxisMetadata} output).
 * @param scopePrefixes - The leaf-path prefixes whose leaves must satisfy contiguity.
 * @throws An `Error` naming the first non-contiguous leaf, if any.
 */
export function assertAxisContiguity(metadata: Record<string, LeafFallbackMetadata>, scopePrefixes: string[]): void {
  const inScope = (leafPath: string): boolean =>
    scopePrefixes.some((prefix) => leafPath === prefix || leafPath.startsWith(`${prefix}.`))
  for (const [leafPath, entry] of Object.entries(metadata)) {
    if (!inScope(leafPath)) {
      continue
    }
    for (const scope of entry.scopes) {
      const kinds = new Set(scope.entries.map((e) => e.kind))
      if (kinds.has('severity') && !kinds.has('state')) {
        throw new Error(
          `Axis contiguity violated (severity without state) at leaf "${leafPath}", scope "${scope.scopePath}".`
        )
      }
    }
  }
}

function resolveChild(
  node: z.ZodTypeAny,
  segment: string
): { resolved: z.ZodTypeAny; child: z.ZodTypeAny } | undefined {
  if (isRawConstant(node)) {
    return undefined
  }
  const resolved = resolveSchema(node)
  if (getDefType(resolved) !== 'object') {
    return undefined
  }
  const child = getObjectShape(resolved)[segment]
  return child === undefined ? undefined : { resolved, child }
}

function descendNode(
  node: z.ZodTypeAny,
  key: string,
  child: z.ZodTypeAny,
  path: string[],
  depth: number,
  walkState: WalkState
): WalkState {
  const { axis } = getAxisAndChildFlag(node)
  return advanceWalkState(axis, key, child, path, depth, walkState)
}

/**
 * Derives the fallback metadata for a single leaf by descending the schema along its
 * dot-joined path — a targeted O(depth) walk that stops at the leaf, instead of the
 * {@link introspectThemeAxisMetadata} full-tree walk. Returns `undefined` when the path does not
 * resolve to a leaf with any relaxed-axis entries (a leaf with no fallback structure).
 *
 * @param schema - The schema to descend (typically the top-level `theme` schema).
 * @param leafPath - Dot-joined leaf path from the schema root, e.g.
 *   `v2.primitives.variant.primary.state.hover.severity.success.bg.color`.
 */
export function deriveLeafAxisMetadata(schema: z.ZodTypeAny, leafPath: string): LeafFallbackMetadata | undefined {
  const segments = leafPath.split('.')
  let current = schema
  let walkState: WalkState = { scopes: [], anchorDepth: 0 }

  for (let i = 0; i < segments.length; i++) {
    const node = resolveChild(current, segments[i])
    if (node === undefined) {
      return undefined
    }
    walkState = descendNode(node.resolved, segments[i], node.child, segments, i, walkState)
    current = node.child
  }

  return toLeafMetadata(walkState)
}
