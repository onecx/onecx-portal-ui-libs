# Skeleton Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only a flat standalone usage was confirmed for `skeleton`; no named variants or states were added.

## Confirmed Structure

```text
skeleton
|- border.radius
|- background
`- animationBackground
```

The skeleton is generic and standalone. It is not a child of `interactiveDataView` or `customGroupColumnSelector`.

## Gap List

- The existing skeleton token set lived as `customGroupColumnSelector.skeleton`.
- No standalone top-level `usages.skeleton` key existed.

## Default Values

- `border.radius` defaults to the primitive none radius.
- `background` and `animationBackground` use the baseline default variant background.

## Changes Applied

- Moved `skeleton` to `schema/skeleton/skeleton.ts` with a top-level `schema/skeleton.ts` facade.
- Registered `skeleton` as a top-level usage.
- Removed `skeleton` from `customGroupColumnSelector`.
- Deleted the old custom-group-column-selector skeleton schema file.

## Testing

Added `schema/skeleton/skeleton.spec.ts` and generated `schema/skeleton/__snapshots__/skeleton.spec.ts.snap`. Test/spec files were intentionally added after the structural implementation, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.