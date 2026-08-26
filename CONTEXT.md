# OneCX Portal UI Libraries - Context & Glossary

This document provides context and a glossary of key terms for the OneCX Portal UI Libraries monorepo.

## Project Overview

The OneCX Portal UI Libraries is an Nx monorepo containing Angular libraries for the OneCX portal platform. Key libraries include:

- **angular-accelerator**: Core UI components (interactive data views, column selectors, data tables, layouts, filtering, sorting)
- **angular-auth**: Authentication and authorization utilities
- **angular-utils**: Shared utilities, directives, pipes, and testing helpers
- **angular-remote-components**: Module Federation support for micro-frontends
- **angular-testing**: Testing utilities and harnesses
- **ngrx-accelerator**: NgRx state management patterns and utilities

## Key Technologies

- **Angular 20** with standalone components, signals, and modern control flow
- **NgRx** for reactive state management
- **PrimeNG 20** for UI component library
- **Jest** for unit and integration testing
- **Nx** for monorepo management
- **ngx-translate** for internationalization
- **Module Federation** for micro-frontend architecture

---

## Glossary

### Available Columns
The complete set of columns that *could* be displayed in a data view. These are defined by the parent component and passed to the `InteractiveDataViewComponent` via the `columns` input. They represent all possible data fields available for display, regardless of whether they are currently shown to the user.

**Related Components:**
- `InteractiveDataViewComponent` (input: `columns`)
- `DataViewStateService` (signal: `availableColumns`)
- `CustomGroupColumnSelectorComponent` (input: `columns`)

**Key Points:**
- Defined by the application/integration layer
- Immutable from the user's perspective (user cannot add/remove available columns)
- Used as the source list for the Column Picker dialog

---

### Displayed Columns
The subset of **Available Columns** that are currently visible/active in the data view. These columns are rendered in the table, list, or grid layout. The displayed columns are controlled via:
- `displayedColumnKeys` model input (string array of column IDs)
- Column Picker dialog (`CustomGroupColumnSelectorComponent`)
- Column Group Selection component

**Related Components:**
- `InteractiveDataViewComponent` (computed signal: `displayedColumns`, model: `displayedColumnKeys`)
- `DataViewStateService` (signal: `displayedColumns`)
- `CustomGroupColumnSelectorComponent` (model: `displayedColumns`, signal: `displayedColumnsModel`)

**Key Points:**
- Subset of Available Columns
- Order matters - reflects user's preferred column ordering
- Can be empty (but triggers console warning for sort dropdown)
- Persisted via `displayedColumnKeysChange` output
- Determines which fields appear in the Sort dropdown

---

### Column Picker
The user-facing dialog (implemented as `CustomGroupColumnSelectorComponent`) that allows end-users to customize which columns are displayed and their order. It presents a dual-list interface (pick list) with:
- **Available Columns** (hidden columns) - left side
- **Displayed Columns** (active columns) - right side, reorderable

**Related Components:**
- `CustomGroupColumnSelectorComponent` (main dialog component)
- `InteractiveDataViewComponent` (opens dialog via `onOpenCustomGroupColumnSelectionDialogClick`)
- `DataViewStateService` (provides available columns, tracks action column config)

**Key Points:**
- Accessed via a button in the data view toolbar
- Save button is **disabled** when Displayed Columns is empty (prevents saving empty column set)
- Cancel button closes dialog without applying changes
- Emits `columnSelectionChanged` with `activeColumns` on save
- Also manages action column configuration (frozen, position left/right)
- Integrates with internationalization (ngx-translate) for all labels

---

### Sort Dropdown
A UI control in the data view toolbar that allows users to select a column to sort by and the sort direction (ascending/descending/none). The sort dropdown is **bound to Displayed Columns** - it only shows columns that are currently displayed.

**Related Components:**
- `DataListGridSortingComponent` (sort dropdown UI)
- `InteractiveDataViewComponent` (provides displayed columns via `displayedColumns` computed signal)
- `DataViewStateService` (manages `sortColumn` and `sortDirection` signals)

**Key Points:**
- Options = Displayed Columns that have `sortable: true`
- Becomes empty when Displayed Columns is empty (known issue #543)
- Console warning emitted when Displayed Columns becomes empty post-initialization
- Sort state persisted via `sortColumn`/`sortDirection` signals

---

### Column Group Selection
A feature allowing users to switch between predefined column groups (e.g., "Basic View", "Detailed View", "Admin View"). Each group defines a predefined set of displayed columns.

**Related Components:**
- `ColumnGroupSelectionComponent` (group selector UI)
- `InteractiveDataViewComponent` (handles `onColumnGroupSelectionChange`)
- `DataViewStateService` (tracks `activeColumnGroupKey`)

**Key Points:**
- Groups defined via `predefinedGroupKeys` on column definitions
- `defaultGroupKey` input sets initial group
- `customGroupKey` represents user-customized column selection
- Layout changes can clear invalid group selections

---

### Data View State Service
Centralized state management service (`DataViewStateService`) using Angular signals for the interactive data view. Manages all view-related state including:
- Layout (grid/list/table)
- Available/Displayed columns
- Sorting, filtering, pagination
- Selection, expanded rows
- Action column configuration
- Active column group key

**Key Points:**
- Provided at component level (can be shared via Module Federation)
- All state exposed as signals for reactive UI
- Effects in components sync inputs/outputs with service signals

---

### Interactive Data View
The main composite component (`InteractiveDataViewComponent`) that orchestrates the data display experience. It combines:
- Data display (table/list/grid via `DataViewComponent`)
- Column picker (`CustomGroupColumnSelectorComponent`)
- Column group selection (`ColumnGroupSelectionComponent`)
- Layout selection (`DataLayoutSelectionComponent`)
- Sorting (`DataListGridSortingComponent`)
- Filtering (`FilterViewComponent`)
- Pagination

**Key Points:**
- Standalone-compatible (uses `standalone: false` for Module Federation)
- Outputs `componentStateChanged` for external state synchronization
- Supports custom templates via `PrimeTemplate` content projection
- Slot-based extension for column group selection (`onecx-column-group-selection`)

---

### Module Federation
Micro-frontend architecture pattern used to compose the OneCX portal from independently deployable Angular applications. The UI libraries are designed to be shared dependencies across micro-frontends.

**Key Points:**
- Shared dependencies: Angular, PrimeNG, NgRx, RxJS, ngx-translate
- Components exposed via Module Federation remotes
- `SlotService` enables dynamic component loading
- Libraries versioned and published independently

---

## Issue #543 Fix Summary

**Problem**: Sort dropdown loses options when Displayed Columns is empty.

**Solution Implemented**:
1. **Save Guard** (`CustomGroupColumnSelectorComponent`): Save button disabled when `displayedColumnsModel` is empty (`hasActiveColumns` computed signal). Prevents user from saving empty column set via Column Picker.
2. **Diagnostic Warning** (`InteractiveDataViewComponent`): Console warning emitted when Displayed Columns transitions from non-empty to empty *after* initial resolution. Helps integrators detect misconfiguration.
3. **Preserved Behavior**: 
   - Cancel still works with empty columns
   - External `displayedColumnKeys` input still accepts `[]`
   - Sort dropdown naturally binds to `displayedColumns` (empty = no sort options)
   - Initial empty state (intentional) does not warn

**Tests Added**:
- `hasActiveColumns` computed property tests
- Save guard integration tests
- Console warning behavior tests (initial empty, transitions, multiple transitions, picker, group selection)
- Render/sort binding verification with empty columns