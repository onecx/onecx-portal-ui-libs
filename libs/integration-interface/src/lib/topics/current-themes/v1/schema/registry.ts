import * as z from 'zod'

// Local registry used to assign ids to theme schemas without polluting
// `z.globalRegistry`. The global registry throws on duplicate ids, which
// breaks when the integration-interface module is loaded more than once
// in the same realm (e.g. via Module Federation with `singleton: false`).
export const themeSchemaRegistry = z.registry<{ id: string }>()
