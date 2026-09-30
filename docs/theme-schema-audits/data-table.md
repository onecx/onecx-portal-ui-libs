# Data Table Schema Audit

**Date:** 2026-09-28
**Schema files:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/data-table/`
**Replaces:** the legacy `table` usage (`schema/table.ts`) and the pre-audit `data-table/`
subcomponent group. `dataTable` is the audited, restructured merge of both.

## Context

`table.ts` was the original usage for PrimeNG `DataTable`; `data-table/` was a WIP refactor of
the same component (consumed only by `interactive-data-view/data-view.ts`). The audit reconciled
the two: the new tree (background/color, `paddingX`/`paddingY`, `columnTitle`, `focusRing`,
`verticalAlign`/`truncate`) was kept, and the tokens the refactor had **dropped** from `table.ts`
were re-added (see *Gaps Applied*). Both previous versions were then removed.

## Confirmed Structure

```text
dataTable
├── settings                 [stateless; component behavior]
├── base                     [stateless; the table container]
├── columnTitle              [stateless; column-header title text]
├── header                   [state-bearing]
│   ├── defaultState         → cell tokens + sortIcons + filterIcons
│   ├── hover / active / selected / focus  [background, color, border]
│   └── focusRing            [at node root, never inside a state]
├── row                      [state-bearing]
│   ├── defaultState         → row cell tokens (background..height)
│   ├── cell                 [full cell: defaultState + hover/active/selected/focus]
│   ├── odd / even           [state-bearing: defaultState + cell + hover/active/selected]
│   ├── hover / active / selected  [background, color, border]
│   └── focusRing            [at node root]
└── footer                   [state-bearing]
    ├── defaultState         → row cell tokens (background..height)
    ├── cell                 [full cell]
    ├── hover / active / selected / focus  [background, color, border]
    └── focusRing            [at node root]
```

- No severity level is declared anywhere (neither schema had one), so **no `defaultSeverity`
  wrapper** is present.
- The root is a **pure aggregator** (no own visual tokens) and the mapper references no
  `usages.dataTable.*.primary.*`, so the 5 canonical **color variants are not modeled**.
- `focusRing` always sits at the node root, never inside a state object.
- Every state-bearing node wraps its baseline tokens in `defaultState`; named states are flat
  siblings holding only the tokens that differ (background/color/border).

## Gaps Applied

Tokens present in `table.ts` but missing from the `data-table/` refactor, re-added on the audited
tree:

- **Sort-control icons** — old `table.ts` had a full `sort` tree (`ascending`/`descending`/
  `default`, each `{size, color, backgroundColor}` + icon string + per-state color overrides).
  Rebuilt as `header.defaultState.sortIcons` with the shared `icon` primitive, an `icon` base
  block plus the `ascendingIcon`/`descendingIcon`/`defaultIcon` name strings, and
  `hover`/`active`/`focus` color-only state deltas.
- **Filter-control icons** — old `on`/`off` tree. Rebuilt as `header.defaultState.filterIcons`
  with the shared `icon` primitive, `onIcon`/`offIcon` name strings, and state color deltas.
- **`active` state on cells** — the new cell had only `hover`/`selected`/`focus`. `active` was
  added to every `cell` node.
- **`active` state on rows** — the new row had only `hover`/`selected`. `active` was added to
  `row`, `odd`, and `even`.

The old `table.ts` `backgroundColor` on icons was not carried over: the shared `icon` primitive
has no `backgroundColor` leaf, and the `data-table/` refactor (and the mapper) do not consume it.

## Default Values

| Node | Baseline defaults (`defaultState`) | State deltas |
| --- | --- | --- |
| `settings` | `checkboxColumnPosition=start`, `actionColumnPosition=end`, `actionColumnSticky=false` | none |
| `base` | surface bg/contrast, border, `paddingX/Y=space.md`, font, `textAlign=left`, `borderCollapse=separate`, `shadow=none` | none |
| `columnTitle.font` | `weight` ref | none |
| `header.defaultState` | row cell tokens (bg/contrast/border/padding/font/textAlign/`height=2.5rem`) + `sortIcons` + `filterIcons` | hover/active/selected/focus: bg/contrast/border |
| `header.focusRing` | `borderWithShadow` defaults (color/style refs, rest `none`) | focus only, not modeled |
| `row.defaultState` | row cell tokens + `height=2.5rem` | hover/active/selected: bg/contrast/border |
| `row.cell` (+ `odd.cell`, `even.cell`, `footer.cell`) | cell tokens incl. `verticalAlign=middle`, `truncate=false` | hover/active/selected/focus: bg/contrast/border |
| `row.odd` / `row.even` | row cell tokens + cell | hover/active/selected: bg/contrast/border |
| `row.focusRing` | `borderWithShadow` defaults | — |
| `footer.defaultState` | row cell tokens + `height=2.5rem` + cell | hover/active/selected/focus: bg/contrast/border |
| `footer.focusRing` | `borderWithShadow` defaults | — |

## Implementation

- Restructured the `data-table/` group to the shape/defaults separation pattern (as in
  `fieldset`/`panelmenu`): a single `data-table.ts` of pure `z.object()` shapes (all keys
  `.optional()`, nested nodes `.prefault({})`, **no `.default()`**) plus a plain
  `dataTableDefaults` object, combined via `applyDefaultsRecursive(dataTableShape,
  dataTableDefaults).register(themeSchemaRegistry, { id: 'dataTable' })`.
- Shared per-state token helpers live in `data-table-base-tokens.ts` (`defaultBorderTokens`,
  `stateBorderTokens(state)`, `fontTokens`, `focusRingShape = borderWithShadow`,
  `focusRingTokens`).
- Registered as the top-level `dataTable` usage in `current-themes.schema.ts`
  (`UsagesInput.dataTable?: z.input<typeof dataTableShape>` and the `usages.dataTable` entry),
  replacing the `table` entry.
- **Removed both previous versions:** `schema/table.ts` and the pre-audit `data-table/*`
  subcomponent modules (`data-table-styles`, `-row`, `-header-row`, `-footer-row`,
  `-cell-with-states`, `-icon-styles`, `-settings`, `-column-title`), plus the legacy
  top-level `schema/data-table.spec.ts` and `schema/data-table.ts` facade.
- `diagram.ts` previously imported `iconBaseStyles` from `table.ts`; it now uses the shared
  `icon` primitive from `primitives.ts` (the `usages.diagram.selectButton.icon.color` leaf the
  mapper reads is preserved).

## Testing

The legacy `data-table.spec.ts` was replaced with the single snapshot spec required by the audit
workflow (`schema/data-table/data-table.spec.ts`): empty parse, full resolved default-tree
snapshot, and `expectDefaultsMatchShape` parity. The snapshot
(`__snapshots__/data-table.spec.ts.snap`) is the source of truth and was generated, not
hand-edited.

`npx nx test integration-interface` → 424 passed (incl. the 3 new data-table tests);
`npx nx build integration-interface` → clean (regenerated
`dist/.../current-themes.schema.json` now exposes `usages.dataTable`, no `usages.table`).

## Follow-up (OUT OF SCOPE — not implemented here)

The **mapper** (`libs/angular-utils/theme/primeng/src/utils/mapper/`) still reads the old
`usages.table.*` paths and therefore no longer type-checks. This is a separate rework, deferred by
the audit scope ("mapper rework is explicitly out of scope"). Confirmed by building
`angular-utils` after this change:

- `theme-path.types.ts:103` — `` `usages.table.${LeafPaths<Usages['table']>}` `` →
  **TS2339** `Property 'table' does not exist on type 'UsagesInput'`. Must become
  `` `usages.dataTable.${LeafPaths<Usages['dataTable']>}` ``.
- That member removal collapses the whole `ThemePath` union, so the **61 `usages.table.*`
  `from` literals** in the DataTable mapping rules and CSS rules must be repointed to
  `usages.dataTable.*`, and their leaf structure reconciled with the new tree:
  - old `bg`/`contrast` → `background`/`color`; old `padding` → `paddingX`/`paddingY`;
    old `border.radius`/`offset` → `border.radius`/`offset` (unchanged); `border.width`
    (old `.defaultVariant`) → `border.width` (now `none`-defaulted).
  - old `cell.state.hover` → `cell.hover` (the `state` wrapper is gone — states are flat
    siblings); old `row.defaultState.even` → `row.even`; header sort/filter icons now live at
    `header.defaultState.sortIcons.*` / `filterIcons.*` (new icon primitive shape).
  - Files affected: `mapping-rules/usages/datatable/{base,header,row,footer}.rules.ts`,
    `css-rules/usages/datatable/{base,header,footer}.rules.ts`, and
    `css-rules/usages/interactive-dataview/data-table.rules.ts` (its
    `usages.interactiveDataView.dataView.dataTable.*` paths also become invalid once
    `ThemePath` is rebuilt).
  - `mapper.utils.ts:40` has a `cssVar('usages.table.base.bg')` comment example.
