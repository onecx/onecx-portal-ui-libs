# Custom Group Column Selector Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only a flat standalone usage was confirmed for `customGroupColumnSelector`; no named variants or severities were added.

## Confirmed Structure

```text
customGroupColumnSelector
|- background, color, paddingX, paddingY
`- button: independent minimal token set
   |- background, color
   |- hover: background, color
   |- active: background, color
   `- disabled: background, color
```

The skeleton is a separate standalone usage and is not a child of the selector.

## Gap List

- `customGroupColumnSelector` was nested under `interactiveDataView` instead of exposed as its own usage.
- `skeleton` was nested under `customGroupColumnSelector` but should be standalone.
- The selector was missing the requested `paddingX`, `paddingY`, and minimal `button` token set.
- `picklist`, `gap`, `font`, and `border` were removed from this usage.

## Default Values

- Existing background and color defaults are retained.
- `paddingX` and `paddingY` default to `{{primitives.space.sm}}`.
- Button baseline, hover, active, and disabled background/color defaults point at the corresponding default variant state tokens.

## Changes Applied

- Moved `customGroupColumnSelector` to `schema/custom-group-column-selector/custom-group-column-selector.ts` with a top-level `schema/custom-group-column-selector.ts` facade.
- Removed `customGroupColumnSelector` from `interactiveDataView`.
- Removed `skeleton` from the selector and promoted it to `skeleton`.
- Added selector `paddingX`, `paddingY`, and a minimal stateful `button` child.
- Removed selector `picklist`, `gap`, `font`, and `border` tokens.

## Testing

Added `schema/custom-group-column-selector/custom-group-column-selector.spec.ts` and generated `schema/custom-group-column-selector/__snapshots__/custom-group-column-selector.spec.ts.snap`. The interactive-data-view snapshot was also regenerated after removing the nested copy. Test/spec files were intentionally added after the structural implementation, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.