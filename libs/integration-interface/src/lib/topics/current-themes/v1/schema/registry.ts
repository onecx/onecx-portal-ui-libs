import * as z from 'zod'

// Local registry used to assign ids to theme schemas without polluting
// `z.globalRegistry`. The global registry throws on duplicate ids, which
// breaks when the integration-interface module is loaded more than once
// in the same realm (e.g. via Module Federation with `singleton: false`).

// Local registry that assigns each theme schema an `id` and an optional `axis` marker consumed
// by the build-time axis introspection (see axis-metadata.ts). `axis` classifies a node's keys:
// `variant` / `state` / `severity` mark the named-member containers, `child` marks a
// component-composition sub-schema, and `setting` marks a settings sub-schema. A node with no
// `axis` is a structural pass-through wrapper. The optional `child` flag marks a node as a
// child boundary so the parent's walker re-roots classification of its own keys by its own `axis`.
export const themeSchemaRegistry = z.registry<{
  id: string
  axis?: 'variant' | 'state' | 'severity' | 'child' | 'setting'
  child?: boolean
}>()
