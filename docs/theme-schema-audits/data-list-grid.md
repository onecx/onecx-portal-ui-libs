# Data List Grid Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only a flat standalone usage was confirmed for `dataListGrid`; no named variants or severities were added.

## Confirmed Structure

```text
dataListGrid
|- border, background, color, gap, justifyContent
|- itemCard: specific child with hover and focus state tokens
`- itemRow: specific child with hover and focus state tokens
```

The data list grid is generic and standalone. It is not nested under `interactiveDataView.dataView`.

## Gap List

- `dataListGrid` existed under `interactiveDataView.dataView`.
- No standalone top-level `usages.dataListGrid` key existed.
- CSS rules referenced `usages.interactiveDataView.dataView.dataListGrid.*`.

## Default Values

- Root border, background, color, gap, and justify-content defaults are retained from the existing data-list-grid schema.
- `itemCard` and `itemRow` keep their existing baseline, hover, and focus defaults.

## Changes Applied

- Moved `dataListGrid` to `schema/data-list-grid/data-list-grid.ts` with a top-level `schema/data-list-grid.ts` facade.
- Removed `dataListGrid` from `interactiveDataView.dataView`.
- Moved CSS rules to standalone data-list-grid mapper ownership and use `usages.dataListGrid.border.*`.
- Registered `dataListGrid` in the top-level `usages` schema and mapper path type union.

## Testing

Added `schema/data-list-grid/data-list-grid.spec.ts` and generated `schema/data-list-grid/__snapshots__/data-list-grid.spec.ts.snap`. The interactive-data-view snapshot was also regenerated after removing the nested copy. Test/spec files were intentionally added after the structural implementation, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.