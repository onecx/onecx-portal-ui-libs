import * as z from 'zod'

// Local registry used to assign ids to theme schemas without polluting
// `z.globalRegistry`. The global registry throws on duplicate ids, which
// breaks when the integration-interface module is loaded more than once
// in the same realm (e.g. via Module Federation with `singleton: false`).

/**
 * Classifies a schema group-container node as a repeating variant/state/severity axis or a named child-component boundary.
 */
export type SchemaNodeKind = 'variant' | 'state' | 'severity' | 'child'

export const themeSchemaRegistry = z.registry<{ id: string; kind?: SchemaNodeKind }>()
