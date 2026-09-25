# Interactive Data View Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only `defaultVariant` is required for this usage. No named component variants were confirmed.

## Confirmed Structure

All children have dependency `nothing`; the interactive-data-view root has no variant/state/severity hierarchy.

```text
interactiveDataView
|- Root tokens: border, background, color, gap, paddingX, paddingY
|- settings: behavioral configuration
|- filterView: container-specific child
|  |- Root tokens: border, background, color, gap, paddingX, paddingY
|  `- settings: filterViewEnabled, filterViewDisplayMode, maxDisplayedChips
`- dataListGridSorting: specific composite
   |- Root tokens: border, background, color, space
   |- gap, paddingX, paddingY
   `- button: specific child
```

The filter chip, skeleton, custom group column selector, and data list grid are now separate top-level usages. They are intentionally not nested under `interactiveDataView` or `filterView`.

The `dataTable` child was removed from both `filterView` and `dataView`, and the now-redundant `dataView` child (which only wrapped the standalone `dataview` usage) was removed from `interactiveDataView` entirely. Table theming is owned by the standalone `dataTable` and `dataview` usages rather than nested inside this component.

The `selectButton` child was removed from `interactiveDataView` — it is the standalone `selectbutton` usage and is not nested inside this component.

## Gap List

- `filterView.chip` existed as a filter-view-specific child but should be the standalone `chip` usage.
- `customGroupColumnSelector` existed under `interactiveDataView` but should be the standalone `customGroupColumnSelector` usage.
- `customGroupColumnSelector.skeleton` existed as a selector-specific child but should be the standalone `skeleton` usage.
- `dataView.dataListGrid` existed under `interactiveDataView` but should be the standalone `dataListGrid` usage.
- CSS rules still referenced `usages.interactiveDataView.dataView.dataListGrid.*` and needed to point at `usages.dataListGrid.*`.
- `dataListGridSorting` still carried `dropdown`, `floatLabel`, `space`, and root `color` tokens; it now uses `gap`, `paddingX`, and `paddingY` instead.
- `filterView.dataTable` existed as a nested `dataTable` child but should not be duplicated inside the interactive-data-view schema — the standalone `dataTable` usage owns table theming.
- `dataView.dataTable` existed as a nested `dataTable` child; once removed, `dataView` was only the standalone `dataview` usage re-wrapped, so it was removed from `interactiveDataView` entirely.

## Default Values

- The interactive-data-view root, settings, filter view, and data-list-grid sorting defaults are retained.
- The nested `dataTable` defaults (under both `filterView` and `dataView`) and the `dataView` defaults were removed; those values live in the standalone `dataTable` and `dataview` usage snapshots.
- The `selectButton` defaults were removed; they live in the standalone `selectbutton` usage snapshot.
- `dataListGridSorting` retains its border, background, and button defaults, and now adds `gap`, `paddingX`, and `paddingY` defaults.
- Defaults for `chip`, `customGroupColumnSelector`, `dataListGrid`, and `skeleton` moved to their standalone usage snapshots.
- No additional named variant defaults were added.

## Changes Applied

- Removed `chip` from `filterView`.
- Removed `customGroupColumnSelector` from `interactiveDataView`.
- Removed `skeleton` from `customGroupColumnSelector` and promoted it to `skeleton`.
- Removed `dataListGrid` from `interactiveDataView.dataView` and promoted it to `dataListGrid`.
- Moved the promoted usages into their own folders under `schema/` instead of leaving implementations inside `interactive-data-view`.
- Updated data-list-grid CSS rules to reference `usages.dataListGrid.*`.
- Removed data-list-grid CSS ownership from interactive-data-view mapper rules.
- Removed `dropdown`, `floatLabel`, `space`, and root `color` from `dataListGridSorting`; added `gap`, `paddingX`, and `paddingY`.
- Removed the `dataTable` child from `filterView` (shape + defaults) and from `dataView`.
- Removed the `dataView` child from `interactiveDataView` (shape + defaults) and deleted `schema/interactive-data-view/data-view.ts`; table/data-view theming is owned by the standalone `dataTable` and `dataview` usages.
- Removed the `selectButton` child from `interactiveDataView` (shape + defaults); it is owned by the standalone `selectbutton` usage.
- Registered the new top-level usages in the `usages` schema and mapper path type union.

## Testing

The top-level interactive-data-view spec remains `schema/interactive-data-view/interactive-data-view.spec.ts`; its snapshot was regenerated after the removals. Test/spec files were updated after the structural change, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.
