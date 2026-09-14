# Badge Theme Schema Audit

## Scope

- Component: `badge`
- Source schema: [libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.ts](../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.ts)
- Spec coverage: [libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.spec.ts](../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.spec.ts)
- Mapper coverage: [libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/badge.rules.ts](../../libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/badge.rules.ts)

## Canonical Baseline Context

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary` (badge only needs `defaultVariant` plus the actual named variants it uses)
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

## Confirmed Structure

Badge is a flat top-level usage with no nested visual children. The actual themable structure is limited to the root token set, the dot sub-element, and the named size/severity variants consumed by the mapper.

- `settings` — retained as configuration-only metadata with no default values
- `dot` — specific leaf token set, `size`
- `font` — root text token set
- `border` — root border token set
- `padding` — root spacing token
- `minWidth` — root size token
- `height` — root size token
- `sm`, `lg`, `xl` — named size overrides
- `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `contrast` — named color variants

## Gap List

- The legacy schema was not structured as a pure shape/defaults split; the defaults were baked into the Zod schema directly.
- The actual badge tree itself was already correct: flat root tokens and named variants are the proper model for the mapper.
- The main implementation gap was structural: the schema needed to be split into `badgeShape` + `badgeDefaults` and applied via `applyDefaultsRecursive` without changing the badge tree semantics.

## Default-Value Audit

### Root baseline

- `font.size` -> `{{primitives.font.size}}`
- `font.weight` -> `{{primitives.font.weight}}`
- `border.color` -> `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}`
- `border.style` -> `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}`
- `border.width` -> `{{primitives.border.width.none}}`
- `border.offset` -> `{{primitives.border.offset.none}}`
- `border.radius` -> `{{primitives.radius.full}}`
- `padding` -> `{{primitives.space.sm}}`
- `minWidth` -> `1.5rem`
- `height` -> `1.5rem`

### Dot

- `dot.size` -> `0.5rem`

### Named size variants

- `sm.fontSize` -> `{{primitives.font.size}}`
- `sm.minWidth` -> `1.25rem`
- `sm.height` -> `1.25rem`
- `lg.fontSize` -> `{{primitives.font.size}}`
- `lg.minWidth` -> `1.75rem`
- `lg.height` -> `1.75rem`
- `xl.fontSize` -> `{{primitives.font.size}}`
- `xl.minWidth` -> `2rem`
- `xl.height` -> `2rem`

### Named color variants

- `primary.background` -> `{{primitives.variant.primary.defaultState.defaultSeverity.bg}}`
- `primary.color` -> `{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}`
- `secondary.background` -> `{{primitives.variant.secondary.defaultState.defaultSeverity.bg}}`
- `secondary.color` -> `{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}`
- `success.background` -> `{{primitives.variant.primary.defaultState.severity.success.bg}}`
- `success.color` -> `{{primitives.variant.primary.defaultState.severity.success.contrast}}`
- `info.background` -> `{{primitives.variant.primary.defaultState.severity.info.bg}}`
- `info.color` -> `{{primitives.variant.primary.defaultState.severity.info.contrast}}`
- `warning.background` -> `{{primitives.variant.primary.defaultState.severity.warning.bg}}`
- `warning.color` -> `{{primitives.variant.primary.defaultState.severity.warning.contrast}}`
- `danger.background` -> `{{primitives.variant.primary.defaultState.severity.danger.bg}}`
- `danger.color` -> `{{primitives.variant.primary.defaultState.severity.danger.contrast}}`
- `contrast.background` -> `{{primitives.variant.primary.defaultState.severity.contrast.bg}}`
- `contrast.color` -> `{{primitives.variant.primary.defaultState.severity.contrast.contrast}}`

## Changes Applied

- Refactored the badge schema to the modern shape/defaults split used by the theme schema collection.
- Kept the badge tree intentionally flat, matching the mapper and the actual PrimeNG badge structure.
- Added a top-level snapshot-based spec that locks in the exact parsed defaults and shape/defaults parity.

## Testing

- The legacy badge spec was replaced by the required single top-level snapshot suite in [libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.spec.ts](../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.spec.ts).
- Snapshot file: [libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/badge.spec.ts.snap](../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/badge.spec.ts.snap)
- Verification command: `cd /home/mollendo/projects/OneCX/onecx-portal-ui-libs && npx nx test integration-interface --runInBand --testPathPattern=badge.spec.ts`
- Result: badge schema tests pass and the snapshot is checked in.
