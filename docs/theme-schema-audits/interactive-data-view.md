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
|- selectButton: generic, Option 1, extends selectbutton
|- filterView: generic container
|  |- Root tokens: border, background, color, gap, paddingX, paddingY
|  |- settings: filterViewEnabled, filterViewDisplayMode, maxDisplayedChips
|  |- chip: specific child
|  `- dataTable: generic, Option 1, extends dataTable
|- dataListGridSorting: specific composite
|  |- Root tokens: border, background, color, space
|  |- floatLabel: specific child
|  |- dropdown: generic, Option 2, independent minimal token set
|  `- button: specific child
|- customGroupColumnSelector: generic, Option 1, extends customGroupColumnSelector
`- dataView: standalone data-view usage
   |- dataListGrid: generic, Option 1
   |  |- itemCard
   |  `- itemRow
   `- dataTable: generic, Option 1
```

The header/content DOM wrappers, flex wrappers, popover, command buttons, and projected templates are implementation or layout details and are not schema nodes.

## Gap List

- `selectButton` was missing from the assembled interactive-data-view schema.
- `filterView.chip` was missing from the filter-view schema.
- `filterView.dataTable` was missing from the filter-view schema.
- `customGroupColumnSelector` was missing from the assembled interactive-data-view schema.
- `dataListGrid`, `dataListGridSorting`, and their existing children were already nested under the interactive-data-view composition after relocation.
- Several legacy child schemas still use direct Zod defaults rather than the newer shape/default separation convention. Existing standalone usage contracts were preserved while assembling the confirmed tree.

## Default Values

The confirmed defaults retain the existing baseline values:

- The root and filter-view containers use primitive default border, background, contrast, spacing, and padding references.
- Root settings use the existing empty-result, sorting, layout, paginator, page-size, selection, and checkbox-position defaults.
- `selectButton`, `filterView.dataTable`, and `customGroupColumnSelector` reuse the complete defaults from their standalone usages.
- `filterView.chip` reuses the existing filter-chip defaults.
- `dataListGridSorting` retains its root, float-label, and button defaults; its independent dropdown has no baked defaults.
- `dataView` retains its standalone dataview defaults, including `dataListGrid` and `dataTable`.
- No additional named variant defaults were added.

## Changes Applied

- Added `selectButton` and `customGroupColumnSelector` to `interactiveDataView`.
- Added `chip` and `dataTable` to `filterView`.
- Refactored `filterViewChip`, `customGroupColumnSelector`, and `customGroupColumnSelectorSkeleton` to shape/default exports.
- Removed the implementation-specific `filterViewChipRemoveIconButton` schema and folded no separate remove-button node into the chip contract.
- Refactored `dataListGrid`, `itemCard`, and `itemRow` to shape/default exports and exposed the contracts through the interactive-data-view wrappers.
- Preserved the flattened interactive-data-view structure without header/content wrapper nodes.
- Kept `dataListGrid` and `dataListGridSorting` under the interactive-data-view schema directory.
- Replaced legacy per-child and facade specs with one top-level `interactive-data-view.spec.ts`.
- Added a full `parse({})` snapshot and shape/default parity assertion.

## Testing

The legacy interactive-data-view, data-list-grid, and data-list-grid-sorting specs were replaced by:

- `schema/interactive-data-view/interactive-data-view.spec.ts`
- `schema/interactive-data-view/__snapshots__/interactive-data-view.spec.ts.snap`

The new spec contains exactly three tests: parse success, full default snapshot, and shape/default parity. The focused Jest run passes all three tests. Integration-interface lint also passes.

The full integration-interface suite is the final verification target after snapshot regeneration.
