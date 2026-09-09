/**
 * Build-time introspection of the Theme V2 Zod schema for per-leaf axis metadata.
 *
 * The Theme V2 schema mixes four structurally indistinguishable kinds of plain-object
 * nodes — named color **variants**, interaction **states**, **severities**, and
 * **child**-component compositions. Each node is classified with an `axis` marker in
 * `themeSchemaRegistry` (see `schema/registry.ts`). This module walks the full `theme`
 * schema and derives, for every leaf token, the variant / state / severity names that
 * apply to it and the ordered chain of axis-group and child boundaries the leaf passes
 * through.
 *
 * This is a build-time utility that introspects the schema; it carries no schema shape of
 * its own and is kept out of `schema/` so it does not read as a theme token schema.
 *
 * Usage example:
 * ```ts
 * import { themeAxisMetadata } from '@onecx/integration-interface'
 *
 * themeAxisMetadata['v2.primitives.variant.primary.state.hover.severity.success.bg.color']
 * // => {
 * //      leafPath: 'v2.primitives.variant.primary.state.hover.severity.success.bg.color',
 * //      variants: ['primary'],
 * //      states: ['hover'],
 * //      severities: ['success'],
 * //      groups: [
 * //        { kind: 'severity', memberName: 'success', groupPath: 'v2.primitives.variant.primary.state.hover.severity' },
 * //        { kind: 'state', memberName: 'hover', groupPath: 'v2.primitives.variant.primary.state' },
 * //        { kind: 'variant', memberName: 'primary', groupPath: 'v2.primitives.variant' },
 * //      ],
 * //    }
 * ```
 */

import * as z from 'zod'
import { themeSchemaRegistry } from '../schema/registry'
import { theme } from '../current-themes.schema'

/** The four classifying axis kinds a schema node can be. */
export type AxisKind = 'variant' | 'state' | 'severity' | 'child'

/** A single axis-group or child boundary crossed on a leaf's path. */
export interface AxisGroupInfo {
  /** The kind of the boundary node. */
  kind: AxisKind
  /** The key selected under the boundary container on this leaf's path. */
  memberName: string
  /** The dot-joined path from the schema root to the boundary container node itself. */
  groupPath: string
}

/** The derived metadata for a single leaf token. */
export interface LeafAxisMetadata {
  /** The dot-joined path from the schema root to the leaf. */
  leafPath: string
  /** The applicable named-variant keys, outermost-first. */
  variants: string[]
  /** The applicable named-state keys, outermost-first. */
  states: string[]
  /** The applicable named-severity keys, outermost-first. */
  severities: string[]
  /** The ordered (innermost-first) chain of axis-group and child boundaries crossed. */
  groups: AxisGroupInfo[]
}

/** Zod v4 internal type discriminator for a schema node. */
function getDefType(schema: z.ZodTypeAny): string {
  return (schema as unknown as { _zod: { def: { type: string } } })._zod.def.type
}

/** Zod v4 internal wrapper (optional/default/prefault/nonoptional/readonly) inner type. */
function getInnerType(schema: z.ZodTypeAny): z.ZodTypeAny {
  return (schema as unknown as { _zod: { def: { innerType: z.ZodTypeAny } } })._zod.def.innerType
}

/** Zod v4 internal union member schemas. */
function getUnionOptions(schema: z.ZodTypeAny): z.ZodTypeAny[] {
  return (schema as unknown as { _zod: { def: { options: z.ZodTypeAny[] } } })._zod.def.options
}

/** Object shape map for a Zod object node. */
function getObjectShape(schema: z.ZodTypeAny): Record<string, z.ZodTypeAny> {
  return (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape
}

/** Wrapper node types that transparently hide their inner schema. */
const WRAPPER_TYPES = new Set(['optional', 'default', 'prefault', 'nonoptional', 'readonly'])

/** Walks a chain of wrapper nodes down to the innermost concrete schema. */
function unwrapWrapperChain(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema
  while (WRAPPER_TYPES.has(getDefType(current))) {
    current = getInnerType(current)
  }
  return current
}

/**
 * For a `withRef`-style union, selects the first member that is not a registered
 * `themeRef` string so the walker resolves to the concrete value schema. When the first
 * such member is an object container (e.g. the `bg`/`color` objects) the walker descends
 * into it; when it is a scalar `withRef(z.string())` union the walker records a leaf.
 * Returns the input unchanged when no non-ref member exists.
 */
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

/** Resolves a schema node past wrappers and theme-ref unions to its concrete form. */
function resolveSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  return unwrapThemeRefUnion(unwrapWrapperChain(schema))
}

/**
 * A leaf is a terminal token — a scalar (string/number/boolean), an enum, an array, or a
 * union (e.g. a `withRef` scalar union that resolved to a scalar). Enum and array values
 * (e.g. `sortDirection`, `layout`, `pageSizes`) are leaf tokens too, so they must be
 * captured here; otherwise consumers cannot build complete per-leaf fallback metadata.
 */
function isLeaf(schema: z.ZodTypeAny): boolean {
  const type = getDefType(schema)
  return type === 'string' || type === 'number' || type === 'boolean' || type === 'enum' || type === 'array' || type === 'union'
}

function makeGroup(kind: AxisKind, memberName: string, path: string[]): AxisGroupInfo {
  return { kind, memberName, groupPath: path.join('.') }
}

function walk(
  schema: z.ZodTypeAny,
  path: string[],
  groups: AxisGroupInfo[],
  variants: string[],
  states: string[],
  severities: string[],
  out: Record<string, LeafAxisMetadata>
): void {
  // Skip shape values that are not Zod schemas (e.g. raw constants added via
  // `.extend({ width: '1rem' })`); they are baked-in values, not themable tokens,
  // so they carry no axis metadata and have no `_zod` def to introspect.
  if (schema === null || schema === undefined || typeof schema !== 'object' || !('_zod' in schema)) {
    return
  }

  const resolved = resolveSchema(schema)

  if (isLeaf(resolved)) {
    out[path.join('.')] = {
      leafPath: path.join('.'),
      variants: [...variants],
      states: [...states],
      severities: [...severities],
      groups: [...groups],
    }
    return
  }

  // Free-form containers (e.g. the legacy `v1` record) are not leaf tokens and have no
  // enumerable shape — stop without recording an entry.
  if (getDefType(resolved) !== 'object') {
    return
  }

  const registryEntry = themeSchemaRegistry.get(resolved)
  const axis = registryEntry !== undefined ? registryEntry.axis : 'none'
  const shape = getObjectShape(resolved)

  for (const [key, childSchema] of Object.entries(shape)) {
    const childPath = [...path, key]
    switch (axis) {
      case 'variant':
        walk(childSchema, childPath, [makeGroup('variant', key, path), ...groups], [...variants, key], states, severities, out)
        break
      case 'state':
        walk(childSchema, childPath, [makeGroup('state', key, path), ...groups], variants, [...states, key], severities, out)
        break
      case 'severity':
        walk(childSchema, childPath, [makeGroup('severity', key, path), ...groups], variants, states, [...severities, key], out)
        break
      case 'child':
        walk(childSchema, childPath, [makeGroup('child', key, path), ...groups], variants, states, severities, out)
        break
      default:
        walk(childSchema, childPath, groups, variants, states, severities, out)
        break
    }
  }
}

/**
 * Walks a Theme V2 Zod schema and derives, per leaf token, the applicable variant, state,
 * and severity names and the ordered (innermost-first) chain of axis-group and child
 * boundaries the leaf passes through.
 *
 * @param schema - The schema to introspect (typically the top-level `theme` schema).
 * @returns A map from dot-joined leaf path to its {@link LeafAxisMetadata}.
 */
export function introspectThemeAxisMetadata(schema: z.ZodTypeAny): Record<string, LeafAxisMetadata> {
  const out: Record<string, LeafAxisMetadata> = {}
  walk(schema, [], [], [], [], [], out)
  return out
}

/**
 * Precomputed, tenant-independent per-leaf axis metadata derived from the Zod theme schema
 * shape at module-load time. Contains no tenant or theme instance values. This is the
 * contract the Shell runtime expands into CSS fallback chains, tracked under parent issue 545.
 */
export const themeAxisMetadata: Record<string, LeafAxisMetadata> = introspectThemeAxisMetadata(theme)
