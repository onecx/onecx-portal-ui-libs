# Chip Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only a flat standalone usage was confirmed for `chip`; no named variants or severity overrides were added.

## Confirmed Structure

```text
chip
|- settings: unstyled, disabled, removable
|- border, focusRing, background, color, paddingX, paddingY, icon
|- hover: border, background, color, cursor
`- disabled: border, background, color, cursor
```

The chip is generic and standalone. It keeps the token set previously implemented as `filterViewChip`; `filterView` no longer has a chip child.

## Gap List

- The existing token set was filter-view-specific by name and location.
- `filterView` contained a `chip` child that should be removed.
- No standalone top-level `usages.chip` key existed.

## Default Values

- Baseline border, focus ring, background, color, padding, and icon defaults are copied from the previous filter-view chip schema.
- `hover` defines differing border, background, color, and cursor defaults.
- `disabled` defines differing border, background, color, and cursor defaults.

## Changes Applied

- Moved `chip` to `schema/chip/chip.ts` with a top-level `schema/chip.ts` facade.
- Registered `chip` as a top-level usage.
- Removed `chip` from `filterView`.
- Deleted the old filter-view-chip schema file.

## Testing

Added `schema/chip/chip.spec.ts` and generated `schema/chip/__snapshots__/chip.spec.ts.snap`. Test/spec files were intentionally added after the structural implementation, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.