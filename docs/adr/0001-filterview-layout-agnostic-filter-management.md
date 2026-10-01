# ADR 0001: Layout-agnostic filter management in FilterView

- Status: Accepted
- Date: 2026-09-30
- Issue: https://github.com/onecx/internal-tasks/issues/827

## Context

`FilterViewComponent` (`ocx-filter-view`) has always been a **view/remove** surface for the
data-view filters. It renders the active filters as chips (chips mode) or in a manageable table
(button mode), and it can remove filters or reset them all. It could **not add** new filters.

In the table layout the only way to add a filter was the table's own native per-column filter row,
which is specific to the table layout and does not exist for the list and grid layouts. As a result,
in list and grid layouts there was no way to add a filter at all, and in the table layout the
FilterView and the table's filter row were disconnected affordances for the same shared filter
state.

The shared filter state lives in `DataViewStateService` (the single instance provided by
`ocx-interactive-data-view` and shared by the data-view, the data-table and the FilterView). Both
the display of existing filters and the table's native filter row already read/write
`stateService.filters`, so adding a filter is a write to the same shared signal no matter which
affordance performs it.

## Decision

Extend `FilterViewComponent` so it can **add** a filter directly, in every layout:

1. **Affordance.** A new "Add filter" button is shown wherever the FilterView is visible, gated by
   whether at least one **displayed, filterable** column exists (`canAddFilter`):
   - in **chips mode**, a dashed inline pill in the chip row;
   - in **button mode**, a button in the header of the manage panel.
   In both cases the button is present only when `canAddFilter()` is true, and the manage button is
   enabled when `filters.length === 0 && !canAddFilter()` is false so the panel (and therefore the
   in-panel add path) can be opened when there is at least one displayed filterable column.

2. **Interaction.** Clicking the button opens a dialog via `PortalDialogService`
   (`FilterViewAddFilterDialogComponent`). The user picks a column and then picks a value from the
   **distinct values that already exist in the loaded data**. There is deliberately **no free-text
   value input** (out of scope): values are always selected from the existing data.

3. **Columns offered.** The dialog's column picker offers the **displayed** columns
   (`stateService.columns()`), further limited to those marked `filterable`. This is *distinct*
   from the existing filter display, which sources from `stateService.availableColumns` so that
   filters on now-hidden columns remain visible and removable. Both source sets coexist:
   - *displayed* columns (`columns()`) → what you can **add** a filter to;
   - *available* columns (`availableColumns`) → what you can **see/manage** existing filters for.

4. **Values offered.** For the chosen column the dialog lists the distinct values found in
   `stateService.data()` using the same derivation the table's native per-column filter row uses.
   This derivation is factored out of the data-table into a shared utility,
   `buildFilterColumnOptions(column, rows, filters, translateService, locale)`, so the dialog and
   the table stay consistent. The two supported filter types are respected:
   - `EQUALS` (value equality): distinct raw values, with DATE columns deduped by timestamp and
     labelled via `formatDate`, and `TRANSLATION_KEY` columns labelled through the translate
     service; already-selected values are kept visible.
   - `IS_NOT_EMPTY` (truthy): a fixed "yes / no" choice (the column's emptiness, not a data value).

5. **Result handling.** On confirming the dialog, the chosen `{ columnId, value, filterType }` is
   appended to `stateService.filters` (deduped by `columnId` + `value`). Because this is the same
   shared signal the table's native filter row writes to, both affordances coexist and stay in sync
   automatically. The table's native per-column filter row is left **unchanged**.

6. **Default behaviour.** `disableFilterView` keeps its default of `true` (the FilterView is hidden
   unless enabled), so this feature only surfaces where the FilterView is already enabled.

### Alternatives considered

- **Free-text value input** in the dialog — rejected (out of scope; the issue specifies picking from
  existing distinct values, which keeps filters meaningful against loaded data and avoids
  type/format ambiguity).
- **Inline in-panel form** instead of a dialog — rejected (does not generalise to chips mode, which
  has no panel; a `PortalDialogService` dialog works from either affordance and reuses the
  existing dialog button/disable machinery).
- **Re-using the table's filter row** for all layouts — rejected (the table's filter row is a
  table-specific view and does not exist for list/grid layouts).

## Consequences

- **Positive.** Adding a filter works in every layout, and the two add affordances (dialog and the
  table's native row) target one shared state, so they never diverge.
- **Positive.** Distinct-value derivation is shared (`buildFilterColumnOptions`), so the dialog and
  the table's filter row produce identical option sets for the same data.
- **Note.** The add path is limited to *displayed, filterable* columns; a filter on a column that
  was added while visible but later hidden stays visible/removable via the existing display (which
  still reads `availableColumns`).
- **Note.** The add-filter dialog component is internal (declared, not exported) and is only opened
  through `PortalDialogService`; consumers interact with it via the FilterView's public button.
- **Testing.** The primary test seam is `InteractiveDataViewHarness.getFilterView()` reaching
  `FilterViewHarness` (which exposes `getAddFilterButton`, `getPanelAddFilterButton` and the
  add-filter dialog locators); component-level tests cover `filterableColumns`, `canAddFilter`,
  `onFilterAdded` and `deriveColumnFilterOptions`.
