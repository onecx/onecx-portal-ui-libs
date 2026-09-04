/**
 * Build-time schema introspection that derives, for every leaf token in the theme schema, the applicable
 * variant/state/severity axis names and the axis-group/child-boundary structure crossed to reach it.
 *
 * The result is a small, tenant-independent object containing no theme or tenant values — it is computed purely
 * from the Zod schema tree structure. It is the contract the Shell later expands into CSS fallback chains
 * (see internal-tasks issue #545).
 */
import * as z from 'zod'
import { themeSchemaRegistry, type SchemaNodeKind } from './registry'
import { theme } from '../current-themes.schema'

/**
 * A single axis-group or child-component boundary crossed on the path to a leaf token.
 * Carries no tenant or theme values and is derived purely from schema structure.
 */
export interface AxisGroupBoundary {
  /** The registered classification of the group-container node. */
  kind: SchemaNodeKind
  /** The registry id of the group-container schema node. */
  id: string
  /** The full sibling-name list of the axis group (empty for `child` boundaries). */
  siblingNames: string[]
  /** The specific child key chosen on this path (empty for `child` boundaries). */
  selected: string
}

/**
 * Per-leaf-token axis metadata. Carries no tenant or theme values and is derived purely from schema structure.
 */
export interface LeafAxisMetadata {
  /** Dot-notation path from the schema root to this leaf token. */
  path: string
  /** Variant names applicable on this leaf's path (deduplicated). */
  variants: string[]
  /** State names applicable on this leaf's path (deduplicated). */
  states: string[]
  /** Severity names applicable on this leaf's path (deduplicated). */
  severities: string[]
  /** Axis-group/child boundaries crossed to reach the leaf, innermost-first. */
  groups: AxisGroupBoundary[]
}

type ZodDef = {
  type: string
  innerType?: z.ZodType
  options?: z.ZodType[]
  shape?: Record<string, z.ZodType>
}

// The following helpers isolate the internal `_zod.def` dependency so a future Zod
// major-version upgrade requires changes only here. Each predicate also narrows the
// structural shape of the def, so the walk reads the relevant field without a
// non-null assertion.

/** Wrapper nodes always expose the schema they wrap. */
function isWrapperNode(def: ZodDef): def is ZodDef & { innerType: z.ZodType } {
  return def.type === 'optional' || def.type === 'default' || def.type === 'prefault' || def.type === 'nullable' || def.type === 'readonly'
}

/** A union node always exposes its options. */
function isUnionNode(def: ZodDef): def is ZodDef & { options: z.ZodType[] } {
  return def.type === 'union'
}

/** An object node always exposes its shape (possibly empty). */
function isObjectNode(def: ZodDef): def is ZodDef & { shape: Record<string, z.ZodType> } {
  return def.type === 'object'
}

/**
 * Returns the registry id of a schema when it is registered, or `undefined`.
 */
function registryId(schema: z.ZodType): string | undefined {
  return (themeSchemaRegistry.get(schema) as { id?: string } | undefined)?.id
}

function isThemeRefOption(schema: z.ZodType): boolean {
  return registryId(schema) === 'themeRef'
}

function defOf(schema: z.ZodType): ZodDef {
  return (schema as { _zod: { def: ZodDef } })._zod.def
}

function childPath(path: string, key: string): string {
  return path ? `${path}.${key}` : key
}

function buildLeafEntry(path: string, groupStack: AxisGroupBoundary[]): LeafAxisMetadata {
  const variants: string[] = []
  const states: string[] = []
  const severities: string[] = []
  for (const group of groupStack) {
    if (group.kind === 'variant') {
      variants.push(group.selected)
    } else if (group.kind === 'state') {
      states.push(group.selected)
    } else if (group.kind === 'severity') {
      severities.push(group.selected)
    }
  }
  return {
    path,
    variants: [...new Set(variants)],
    states: [...new Set(states)],
    severities: [...new Set(severities)],
    groups: [...groupStack].reverse(),
  }
}

function walk(
  schema: z.ZodType,
  path: string,
  groupStack: AxisGroupBoundary[],
  visited: Set<z.ZodType>,
  seenPaths: Set<string>,
  results: LeafAxisMetadata[]
): void {
  const def = defOf(schema)

  if (isWrapperNode(def)) {
    walk(def.innerType, path, groupStack, visited, seenPaths, results)
    return
  }

  if (isUnionNode(def)) {
    for (const option of def.options) {
      if (isThemeRefOption(option)) {
        continue
      }
      walk(option, path, groupStack, visited, seenPaths, results)
    }
    return
  }

  if (isObjectNode(def)) {
    if (visited.has(schema)) {
      return
    }

    const branchVisited = new Set(visited)
    branchVisited.add(schema)

    const keys = Object.keys(def.shape)
    const meta = themeSchemaRegistry.get(schema) as { id: string; kind: SchemaNodeKind | undefined } | undefined

    // Guarding on `meta?.kind` narrows `meta` to non-null inside each classified branch,
    // because a classified node is always registered with an id.
    if (meta?.kind === 'variant' || meta?.kind === 'state' || meta?.kind === 'severity') {
      for (const key of keys) {
        const childStack: AxisGroupBoundary[] = [
          ...groupStack,
          { kind: meta.kind, id: meta.id, siblingNames: keys, selected: key },
        ]
        walk(def.shape[key], childPath(path, key), childStack, branchVisited, seenPaths, results)
      }
    } else if (meta?.kind === 'child') {
      const shared: AxisGroupBoundary = { kind: 'child', id: meta.id, siblingNames: [], selected: '' }
      for (const key of keys) {
        walk(def.shape[key], childPath(path, key), [...groupStack, shared], branchVisited, seenPaths, results)
      }
    } else {
      for (const key of keys) {
        walk(def.shape[key], childPath(path, key), groupStack, branchVisited, seenPaths, results)
      }
    }
    return
  }

  // A scalar token wrapped in a union (e.g. `z.union([z.enum, z.literal])`) is reached once per
  // union branch, all at the same dot-path. Emit the token a single time.
  if (!seenPaths.has(path)) {
    seenPaths.add(path)
    results.push(buildLeafEntry(path, groupStack))
  }
}

/**
 * Performs a one-time build-time traversal of a theme schema, producing one `LeafAxisMetadata` entry per
 * leaf-token dot-path.
 */
export function deriveLeafAxisMetadata(rootSchema: z.ZodType): LeafAxisMetadata[] {
  const results: LeafAxisMetadata[] = []
  walk(rootSchema, '', [], new Set<z.ZodType>(), new Set<string>(), results)
  return results
}

/**
 * The per-leaf axis metadata for the full `theme` schema, computed once at module load. Exported from
 * `@onecx/integration-interface` as the contract the Shell expands into CSS fallback chains.
 */
export const themeAxisMetadata: LeafAxisMetadata[] = deriveLeafAxisMetadata(theme)
