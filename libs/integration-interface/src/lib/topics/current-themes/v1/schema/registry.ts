import * as z from 'zod'

// Local registry used to assign ids to theme schemas without polluting
// `z.globalRegistry`. The global registry throws on duplicate ids, which
// breaks when the integration-interface module is loaded more than once
// in the same realm (e.g. via Module Federation with `singleton: false`).

// Local registry used to assign an id and an axis marker to theme schemas without polluting z.globalRegistry.
// `axis` classifies a schema node for build-time axis introspection (see axis-metadata.ts): `variant` marks a named
// color-variant container such as `colorVariants`, `state` marks a named interaction-state container such as
// `stateVariants`, `severity` marks a named severity-level container such as `severityVariants`, `child` marks a
// component-composition or settings sub-schema nested inside a parent component, and `none` marks a structural
// pass-through wrapper that is not itself an axis-group or child boundary, such as `severityVariantGroup` or
// `variantWithStates`.
export const themeSchemaRegistry = z.registry<{ id: string; axis: 'variant' | 'state' | 'severity' | 'child' | 'none' }>()
