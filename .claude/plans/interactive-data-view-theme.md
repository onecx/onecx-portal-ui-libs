# Plan: Interactive Data View Theme Usage

## Goal

Create a complete theme usage for the `ocx-interactive-data-view` component and all its sub-components: Zod schemas, mapper rules, CSS rules, and registration.

## Component Hierarchy (from template analysis)

```
ocx-interactive-data-view (parent)
├── ocx-filter-view
│   ├── p-chip (filter chips)
│   ├── p-button (reset/manage buttons)
│   └── p-popover (filter panel)
├── ocx-data-table (table layout mode)
├── ocx-data-list-grid-sorting (grid/list layout)
│   ├── p-floatLabel
│   └── p-select
├── ocx-data-view
│   ├── ocx-data-list-grid (grid/list layout)
│   │   └── p-dataView (PrimeNG)
│   └── ocx-data-table (table layout)
└── ocx-custom-group-column-selector
    ├── p-picklist
    └── p-skeleton (loading placeholders)
```

## Verification Against Component Templates

After reviewing each component's HTML, TS, and SCSS/CSS files, the provided tokens cover all themeable styling surfaces:

- **ocx-interactive-data-view**: Header has `border-bottom-1 surface-border` class + `p-3` padding. `border.color/width` and `space` tokens cover these. `headerStyleClass`/`contentStyleClass` inputs allow consumer customization.
- **ocx-filter-view**: Hardcoded focus styles in SCSS use CSS variables (`--primary-color`, `--chip-border-radius`). Tokens provide theme values for these. p-chip/p-popover tokens delegate to existing PrimeNG mappings.
- **ocx-data-table**: Currently has hardcoded SCSS values (`$clr-neutral-*`). New tokens replace them. p-multiselect styling is internal.
- **ocx-data-list-grid**: Uses hardcoded `var(--p-surface-200)` for dividers. New border tokens replace them. p-dataView tokens cover paginator/card styling.
- **ocx-data-list-grid-sorting**: Minimal SCSS; floatLabel tokens cover p-floatLabel states.
- **ocx-custom-group-column-selector**: Uses `var(--p-primary-color)` for picklist buttons; new tokens provide theme values. p-skeleton tokens cover loading placeholders.

**Potential gaps identified and addressed:**
- data-list-grid dividers use hardcoded colors → add `dataListGrid` border tokens (provided)
- p-skeleton appears in templates but has no existing mapper → add skeleton tokens to customGroupColumnSelector schema (provided)
- data-view component has both list/grid AND table modes → schema covers both via `dataListGrid` and `dataView` sub-objects

## Implementation

### Phase 1: Zod Schemas (integration-interface)

Create schema directories and files for all 6 sub-components, following the calendar/picklist/tabs pattern (class with static tokens, sub-schemas composed into parent).

**1. `schema/interactiveDataView.ts`** (single file, simple flat structure)
```typescript
import z from 'zod';
import { border, withRef, themeRef } from './primitives';
import { themeSchemaRegistry } from './registry';

export class InteractiveDataViewSchema {
  static readonly schema = z
    .object({
      border: border.pick({ color: true, width: true }).default({
        color: '{{primitives.border.defaultVariant.color}}',
        width: '{{primitives.border.defaultVariant.width}}',
      }),
      space: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'interactiveDataView' });
}

export const interactiveDataView = InteractiveDataViewSchema.schema;
```

**2. `schema/filterView/`** (directory with sub-schemas)
- `index.ts` — re-export: `export const filterView = FilterViewSchema.schema`
- `filterView.ts` — parent class with border/space tokens, composes chip + focusRing sub-schemas
- `chip.ts` — ChipSchema: borderRadius, background, color, paddingX, paddingY, removeIcon.size, removeFocusRing (color/width/offset)
- `focusRing.ts` — FocusRingSchema: borderColor, borderOffset, radius

**3. `schema/dataTable/`** (directory with sub-schemas)
- `index.ts` — re-export
- `dataTable.ts` — parent class with border/space tokens, composes headerCell + columnTitle
- `headerCell.ts` — HeaderCellSchema: background, hoverBackground, selectedBackground
- `columnTitle.ts` — ColumnTitleSchema: fontWeight

**4. `schema/dataListGridSorting/`** (directory with sub-schemas)
- `index.ts` — re-export
- `dataListGridSorting.ts` — parent class with border (color/width/radius) + space tokens, composes floatLabel
- `floatLabel.ts` — FloatLabelSchema: fontWeight, color, focusColor, activeColor, activeFontSize, activeFontWeight, borderRadius, activeBackground, activePadding

**5. `schema/dataView/`** (directory with sub-schemas)
- `index.ts` — re-export
- `dataView.ts` — parent class with border/space tokens, composes dataListGrid + dataViewContent
- `dataListGrid.ts` — DataListGridSchema: borderWidth, borderColor, fontSize, fontWeight, space
- `dataViewContent.ts` — DataViewContentSchema: borderColor, borderWidth, borderRadius, padding, content (background, color, borderColor, borderWidth, padding, borderRadius)

**6. `schema/customGroupColumnSelector/`** (directory with sub-schemas)
- `index.ts` — re-export
- `customGroupColumnSelector.ts` — parent class with border/space/fontSize/fontWeight tokens, composes picklist + skeleton
- `picklist.ts` — PicklistSchema: background, color, hoverColor
- `skeleton.ts` — SkeletonSchema: borderRadius, background, animationBackground

**7. Register in `current-themes.schema.ts`**
Add 6 imports and 6 entries to the `usages` z.object and `UsagesInput` type.

### Phase 2: Theme Path Types (mapper)

**8. `theme-path.types.ts`**
Add 6 new union members to `ThemePath`:
```typescript
| `usages.interactiveDataView.${LeafPaths<NonNullable<Usages['interactiveDataView']>>}`
| `usages.filterView.${LeafPaths<NonNullable<Usages['filterView']>>}`
| `usages.dataTable.${LeafPaths<NonNullable<Usages['dataTable']>>}`
| `usages.dataListGridSorting.${LeafPaths<NonNullable<Usages['dataListGridSorting']>>}`
| `usages.dataView.${LeafPaths<NonNullable<Usages['dataView']>>}`
| `usages.customGroupColumnSelector.${LeafPaths<NonNullable<Usages['customGroupColumnSelector']>>}`
```

### Phase 3: Mapping Rules (mapper)

Create `MappingRule[]` files for each of the 6 components, mapping theme tokens to PrimeNG preset paths where applicable. For custom OCX components (no PrimeNG equivalent), these may be empty arrays — the CSS rules handle them.

**9. `mapping-rules/usages/interactive-dataview.rules.ts`** — Empty array (parent component, no PrimeNG equivalent)

**10. `mapping-rules/usages/filter-view.rules.ts`** — Maps chip tokens to `components.chip.*` and focusRing tokens:
- `usages.filterView.chip.borderRadius` → `components.chip.root.borderRadius`
- `usages.filterView.chip.background` → `components.chip.root.background`
- `usages.filterView.chip.color` → `components.chip.root.color`
- `usages.filterView.chip.paddingX` → `components.chip.root.paddingX`
- `usages.filterView.chip.paddingY` → `components.chip.root.paddingY`

**11. `mapping-rules/usages/data-table.rules.ts`** — Empty array (dataTable tokens are for the OCX component's internal styling, not PrimeNG datatable — that's already covered by existing `datatable.rules.ts`)

**12. `mapping-rules/usages/data-list-grid-sorting.rules.ts`** — Maps floatLabel to `components.floatlabel.*` and select tokens where applicable:
- floatLabel tokens → `components.floatlabel.*` paths
- No direct PrimeNG mapping for custom styling; mostly handled by CSS rules

**13. `mapping-rules/usages/data-view.rules.ts`** — Maps dataViewContent tokens to `components.dataview.*`:
- `usages.dataView.dataView.borderRadius` → `components.dataview.content.borderRadius`
- `usages.dataView.dataView.padding` → `components.dataview.content.padding`
- etc.

**14. `mapping-rules/usages/custom-group-column-selector.rules.ts`** — Maps skeleton tokens to `components.skeleton.*`:
- `usages.customGroupColumnSelector.skeleton.borderRadius` → `components.skeleton.content.borderRadius`
- `usages.customGroupColumnSelector.skeleton.background` → `components.skeleton.content.background`

**15. Register all 6 in `usage-mapping-rules.ts`**

### Phase 4: CSS Rules (mapper)

Create CSS rule files for each component, then register in the composite.

**16. `css-rules/usages/interactive-dataview.rules.ts`**
```typescript
{
  selector: '.ocx-interactive-data-view-header',
  declarations: [
    { property: 'border-color', from: 'usages.interactiveDataView.border.color' },
    { property: 'border-width', from: 'usages.interactiveDataView.border.width' },
  ],
}
```

**17. `css-rules/usages/filter-view.rules.ts`**
```typescript
{
  selector: '.ocx-filter-view',
  declarations: [
    { property: 'border-color', from: 'usages.filterView.border.color' },
    { property: 'border-width', from: 'usages.filterView.border.width' },
    { property: '--ocx-filter-view-space', from: 'usages.filterView.space' },
  ],
}
// + chip focusRing CSS variable rules
```

**18. `css-rules/usages/data-table.rules.ts`** — CSS rules for OCX data-table header cells, column titles, border

**19. `css-rules/usages/data-list-grid-sorting.rules.ts`** — CSS rules for border, floatLabel styling

**20. `css-rules/usages/data-view.rules.ts`** — CSS rules for data-list-grid dividers, data-view content area

**21. `css-rules/usages/custom-group-column-selector.rules.ts`** — CSS rules for picklist colors, skeleton styling

**22. Register all 6 in `css-rules/usages/usage-css-rules.ts`**

### Phase 5: Tests

**23. Schema tests** — Follow the pattern of `calendar.spec.ts`, `tabs.spec.ts`, `picklist.spec.ts`:
- Validate that default values pass schema validation
- Test that ref strings are accepted
- Test required vs optional fields

## Files to Create (30+ files)

| Location | Files |
|----------|-------|
| `integration-interface/src/lib/topics/current-themes/v1/schema/` | `interactiveDataView.ts`, `filterView/` (3 files), `dataTable/` (4 files), `dataListGridSorting/` (3 files), `dataView/` (4 files), `customGroupColumnSelector/` (4 files) |
| `integration-interface/src/lib/topics/current-themes/v1/` | Updated `current-themes.schema.ts` |
| `theme/primeng/src/utils/mapper/` | Updated `theme-path.types.ts` |
| `theme/primeng/src/utils/mapper/mapping-rules/usages/` | `interactive-dataview.rules.ts`, `filter-view.rules.ts`, `data-table.rules.ts`, `data-list-grid-sorting.rules.ts`, `data-view.rules.ts`, `custom-group-column-selector.rules.ts` |
| `theme/primeng/src/utils/mapper/mapping-rules/` | Updated `usage-mapping-rules.ts` |
| `theme/primeng/src/utils/mapper/css-rules/usages/` | `interactive-dataview.rules.ts`, `filter-view.rules.ts`, `data-table.rules.ts`, `data-list-grid-sorting.rules.ts`, `data-view.rules.ts`, `custom-group-column-selector.rules.ts` |
| `theme/primeng/src/utils/mapper/css-rules/` | Updated `usage-css-rules.ts` |

## Notes

- All schemas use the class-with-static-tokens pattern (e.g., `CalendarSchema`)
- Default values reference primitives via `{{primitives...}}` refs
- Sub-schemas are `.prefault({})` for optional composition
- Top-level tokens use `.default(...)` for direct defaults
- Schema is `.register(themeSchemaRegistry, { id: '...' })` for JSON schema generation
- Mapping rules use `toColorString` transform for bg/color values
- CSS rules use `from` paths that resolve to `var(--onecx-theme-{dashes})` CSS variables
