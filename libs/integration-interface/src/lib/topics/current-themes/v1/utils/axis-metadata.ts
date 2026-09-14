/**
 * Derives per-leaf fallback metadata from the Theme V2 Zod schema by walking it and recording,
 * for each leaf token inside a relaxed-axis chain, the ordered fallback **scopes** it passes
 * through and the ordered **entries** (one per relaxed-axis member) within each scope.
 *
 * Example — primitives (`variantWithStates` model, scope anchored at the `v2.primitives` root):
 * ```ts
 * themeAxisMetadata['v2.primitives.variant.primary.state.hover.severity.success.bg.color']
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
 * Example — usages (flattened model, scope anchored at the `v2.usages.input` root):
 * ```ts
 * themeAxisMetadata['v2.usages.input.filled.hover.defaultSeverity.background.color']
 * // => {
 * //      scopes: [{
 * //        scopePath: 'v2.usages.input',
 * //        entries: [
 * //          { kind: 'severity', segments: ['defaultSeverity'] },
 * //          { kind: 'state',    segments: ['hover'] },
 * //          { kind: 'variant',  segments: ['filled'] },
 * //        ],
 * //      }],
 * //    }
 * ```
 */

import * as z from 'zod'
import { themeSchemaRegistry } from '../schema/registry'
import { theme } from '../current-themes.schema'

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

// Wrapper nodes that transparently hide their inner schema.
const WRAPPER_TYPES = new Set(['optional', 'default', 'prefault', 'nonoptional', 'readonly'])

function unwrapWrapperChain(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema
  while (WRAPPER_TYPES.has(getDefType(current))) {
    current = getInnerType(current)
  }
  return current
}

// For a `withRef`-style union, resolves to the first non-`themeRef` member so the walker reaches
// the concrete value schema; returns the input unchanged when there is none.
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

// A raw (non-Zod) shape value, e.g. a baked-in constant added via `.extend({ width: '1rem' })`,
// which carries no `_zod` def and is not a themable token.
function isRawConstant(value: unknown): boolean {
  return value === null || value === undefined || typeof value !== 'object' || !('_zod' in value)
}

// A leaf is a terminal token: a scalar, an enum, an array, or a union.
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

const DEFAULT_KEY: Record<RelaxedAxisKind, string> = {
  variant: DEFAULT_SEGMENTS.variant[0],
  state: DEFAULT_SEGMENTS.state[0],
  severity: DEFAULT_SEGMENTS.severity[0],
}

// A key classifies as a relaxed-axis member when it sits under a relaxed container, or when its
// name is a baseline default slot (`defaultVariant` / `defaultState` / `defaultSeverity`), which
// identifies its axis even under a neutral container.
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

// A variant root is an object node that owns a `defaultVariant` key — the anchor for a fallback scope.
function isVariantRoot(childSchema: z.ZodTypeAny): boolean {
  if (isRawConstant(childSchema)) {
    return false
  }
  const resolved = resolveSchema(childSchema)
  return getDefType(resolved) === 'object' && DEFAULT_KEY.variant in getObjectShape(resolved)
}

// Per-branch fallback context, carried copy-on-write so sibling branches (which share an
// inherited context) cannot corrupt each other's entries or relative-delta base. `scopes` is
// innermost-first; `basePath` is the innermost scope's last recorded member (or its anchor),
// the anchor for the next member's relative `segments`.
interface WalkCtx {
  scopes: Scope[]
  basePath: string[]
}

function joinPath(path: string[]): string {
  return path.join('.')
}

// Records a relaxed-axis member as a new entry on the innermost scope, returning a fresh scopes
// array with the entry prepended. The copy is essential: siblings under the same container share
// the innermost scope, so mutating `entries` in place would let a later branch corrupt an
// earlier one.
function recordMember(scopes: Scope[], kind: RelaxedAxisKind, segments: string[]): Scope[] {
  const scope = scopes[0]
  if (!scope) {
    return scopes
  }
  const newScope: Scope = { scopePath: scope.scopePath, entries: [{ kind, segments: [...segments] }, ...scope.entries] }
  return [newScope, ...scopes.slice(1)]
}

// Opens a new inner scope anchored at a member, stacked on top of the enclosing scopes.
function openScope(ctx: WalkCtx, anchorPath: string[], anchorPathStr: string): WalkCtx {
  return { scopes: [{ scopePath: anchorPathStr, entries: [] }, ...ctx.scopes], basePath: anchorPath }
}

// The context to descend into for a member: a child boundary or variant root opens a new inner
// scope, a relaxed-axis member records an entry (delta from the enclosing base), and anything
// else passes the context through unchanged.
function descendContext(
  axis: string | undefined,
  key: string,
  childSchema: z.ZodTypeAny,
  memberPath: string[],
  memberPathStr: string,
  ctx: WalkCtx,
): WalkCtx {
  if (isChildBoundary(childSchema)) {
    return openScope(ctx, memberPath, memberPathStr)
  }
  const kind = classifyKey(axis, key)
  if (kind !== null) {
    return { scopes: recordMember(ctx.scopes, kind, memberPath.slice(ctx.basePath.length)), basePath: memberPath }
  }
  if (isVariantRoot(childSchema)) {
    return openScope(ctx, memberPath, memberPathStr)
  }
  return ctx
}

// Emits a leaf's metadata, but only if it crossed at least one relaxed-axis member (a scope with
// ≥1 entry). Static, setting-only, and `axis: 'child'`-only leaves are omitted, not emitted empty.
function emitLeaf(pathStr: string, ctx: WalkCtx, out: Record<string, LeafFallbackMetadata>): void {
  const scopes = ctx.scopes
    .filter((scope) => scope.entries.length > 0)
    .map((scope) => ({
      scopePath: scope.scopePath,
      entries: scope.entries.map((entry) => ({ kind: entry.kind, segments: [...entry.segments] })),
    }))
  if (scopes.length > 0) {
    out[pathStr] = { scopes }
  }
}

function walk(schema: z.ZodTypeAny, path: string[], ctx: WalkCtx, out: Record<string, LeafFallbackMetadata>): void {
  if (isRawConstant(schema)) {
    return
  }

  const resolved = resolveSchema(schema)
  const pathStr = joinPath(path)

  if (isLeaf(resolved)) {
    emitLeaf(pathStr, ctx, out)
    return
  }

  // Free-form containers (e.g. the legacy `v1` record) are not leaves and have no shape.
  if (getDefType(resolved) !== 'object') {
    return
  }

  // A node's own `axis` classifies the keys it OWNS; each key's child context is decided by
  // `descendContext` (boundary / relaxed member / variant root / pass-through).
  const { axis } = getAxisAndChildFlag(resolved)
  for (const [key, childSchema] of Object.entries(getObjectShape(resolved))) {
    const memberPath = [...path, key]
    walk(childSchema, memberPath, descendContext(axis, key, childSchema, memberPath, joinPath(memberPath), ctx), out)
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
  walk(schema, [], { scopes: [], basePath: [] }, out)
  return out
}

/**
 * Validates the contiguity invariant of a leaf's relaxed-axis entries: within a scope, a
 * severity entry implies a state entry (a severity member is always nested under a state).
 * Scoped to the given leaf-path prefixes so it can validate a subset of
 * {@link themeAxisMetadata}.
 *
 * @param metadata - The per-leaf fallback metadata map (typically {@link themeAxisMetadata}).
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
      // A severity member is always nested under a state, so a severity entry requires a state
      // entry. The reverse (state requiring variant) does NOT hold: structural subtrees such as
      // the `area`/`canvas` leaves model state + severity only, with no variant member.
      if (kinds.has('severity') && !kinds.has('state')) {
        throw new Error(
          `Axis contiguity violated (severity without state) at leaf "${leafPath}", scope "${scope.scopePath}".`
        )
      }
    }
  }
}

/**
 * Precomputed, tenant-independent per-leaf fallback metadata derived from the theme schema at
 * module-load time. Total at import (never throws); the {@link assertAxisContiguity} invariant
 * is enforced by the test suite for the `v2.primitives` and `v2.usages.input` subtrees.
 */
export const themeAxisMetadata: Record<string, LeafFallbackMetadata> = introspectThemeAxisMetadata(theme)
