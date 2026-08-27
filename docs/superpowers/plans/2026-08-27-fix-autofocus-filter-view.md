# Fix Autofocus on p-multiselect and p-pickList in Filter-View Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `autofocus="false"` to `p-multiselect` and `p-pickList` components used within the filter-view component to prevent unwanted autofocus behavior when the filter panel opens.

**Architecture:** The filter-view component uses a p-popover panel containing an ocx-data-table. The data-table component contains p-multiselect components for column header filtering. The p-pickList is used in custom-group-column-selector which is a separate component used alongside filter-view in interactive-data-view. We need to add `autofocus="false"` to these PrimeNG components to prevent focus issues.

**Tech Stack:** Angular 20, PrimeNG 20, TypeScript, Jest, Nx monorepo

**Spec:** GitHub Issue #514 - Fix autofocus on p-multiselect and p-pickList in filter-view component

## Global Constraints

- Follow Angular best practices: standalone components, signals, OnPush change detection
- Use PrimeFlex/Tailwind utility classes over custom CSS
- All user-facing strings must be translatable with ngx-translate
- New code: 100% test coverage (statements, lines, functions, branches)
- Run lint, test, and build tasks via VS Code tasks (not direct commands)
- Use `inject()` over constructor injection
- Prefer `input()`/`output()` signals over `@Input()`/`@Output()`

---

### Task 1: Add autofocus="false" to p-multiselect components in data-table.component.html

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.html:363-436`

**Interfaces:**
- Consumes: Existing p-multiselect components in columnHeaderFilter template
- Produces: p-multiselect components with autofocus="false" attribute

- [ ] **Step 1: Add autofocus="false" to first p-multiselect (EQUALS filter type)**

```html
<!-- Line ~363: First p-multiselect for EQUALS filter -->
<p-multiselect
  class="filterMultiSelect"
  [options]="equalFilterOptions.column?.id === column.id ? equalFilterOptions.options : []"
  [ngModel]="currentEqualSelectedFilters() || []"
  [showToggleAll]="true"
  [emptyFilterMessage]="'OCX_DATA_TABLE.EMPTY_FILTER_MESSAGE' | translate"
  [displaySelectedLabel]="false"
  [resetFilterOnHide]="true"
  (onChange)="onMultiselectFilterChange(column, $event)"
  placeholder=" "
  appendTo="body"
  filterBy="toFilterBy"
  (onFocus)="onFilterChosen(column)"
  [title]="'OCX_DATA_TABLE.FILTER_TITLE' | translate"
  [ariaLabel]="'OCX_DATA_TABLE.COLUMN_FILTER_ARIA_LABEL' | translate"
  [filterPlaceHolder]="'OCX_DATA_TABLE.COLUMN_FILTER_PLACEHOLDER' | translate"
  [ariaFilterLabel]="
    'OCX_DATA_TABLE.FILTER_ARIA_LABEL' | translate : { column: column.nameKey | translate }
  "
  autofocus="false"
>
```

- [ ] **Step 2: Add autofocus="false" to second p-multiselect (IS_NOT_EMPTY filter type)**

```html
<!-- Line ~407: Second p-multiselect for IS_NOT_EMPTY filter -->
<p-multiselect
  class="filterMultiSelect"
  [options]="[
    { key: 'OCX_DATA_TABLE.FILTER_YES', value: true },
    { key: 'OCX_DATA_TABLE.FILTER_NO', value: false }
  ]"
  [ngModel]="currentTruthySelectedFilters() || []"
  [showToggleAll]="true"
  [emptyFilterMessage]="'OCX_DATA_TABLE.EMPTY_FILTER_MESSAGE' | translate"
  [displaySelectedLabel]="false"
  [resetFilterOnHide]="true"
  (onChange)="onMultiselectFilterChange(column, $event)"
  placeholder=" "
  appendTo="body"
  (onFocus)="onFilterChosen(column)"
  [title]="'OCX_DATA_TABLE.FILTER_TITLE' | translate"
  [ariaLabel]="'OCX_DATA_TABLE.COLUMN_FILTER_ARIA_LABEL' | translate"
  [ariaFilterLabel]="
    'OCX_DATA_TABLE.FILTER_ARIA_LABEL' | translate : { column: column.nameKey | translate }
  "
  autofocus="false"
>
```

- [ ] **Step 3: Run lint to verify changes**

Run: `nx affected:lint --project=angular-accelerator`
Expected: PASS with no errors

- [ ] **Step 4: Run tests for data-table component**

Run: `nx test angular-accelerator -- --testPathPattern="data-table.component.spec.ts"`
Expected: All tests pass

---

### Task 2: Add autofocus="false" to p-pickList in custom-group-column-selector.component.html

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html:31-54`

**Interfaces:**
- Consumes: Existing p-pickList component
- Produces: p-pickList component with autofocus="false" attribute

- [ ] **Step 1: Add autofocus="false" to p-pickList**

```html
<!-- Line ~31: p-pickList component -->
<p-pickList
  [source]="displayedColumnsModel()"
  [target]="hiddenColumnsModel()"
  [sourceHeader]="resolvedActiveColumnsLabel"
  [targetHeader]="resolvedInactiveColumnsLabel"
  [sourceAriaLabel]="resolvedActiveColumnsLabel"
  [targetAriaLabel]="resolvedInactiveColumnsLabel"
  [dragdrop]="true"
  [responsive]="false"
  [sourceStyle]="{ height: '300px' }"
  [targetStyle]="{ height: '300px' }"
  [upButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.UP' | translate)"
  [topButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.TOP' | translate)"
  [downButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.DOWN' | translate)"
  [bottomButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.BOTTOM' | translate)"
  [rightButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.RIGHT' | translate)"
  [allRightButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.ALL_RIGHT' | translate)"
  [leftButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.LEFT' | translate)"
  [allLeftButtonAriaLabel]="('OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABELS.ALL_LEFT' | translate)"
  autofocus="false"
>
```

- [ ] **Step 2: Run lint to verify changes**

Run: `nx affected:lint --project=angular-accelerator`
Expected: PASS with no errors

- [ ] **Step 3: Run tests for custom-group-column-selector component**

Run: `nx test angular-accelerator -- --testPathPattern="custom-group-column-selector.component.spec.ts"`
Expected: All tests pass

---

### Task 3: Review and potentially adjust autofocus on p-button in filter-view.component.html

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/filter-view/filter-view.component.html:115-117`

**Interfaces:**
- Consumes: Existing p-button with pAutoFocus and [autofocus]="true"
- Produces: Adjusted focus behavior if needed

- [ ] **Step 1: Review the p-button autofocus in filter-view panel**

The filter-view.component.html has a p-button with both `pAutoFocus` and `[autofocus]="true"` at line 115-117 inside the popover panel. This button (Reset Filters) is intended to receive focus when the panel opens. This is likely intentional for accessibility (focus trap). No change needed here unless testing reveals issues.

- [ ] **Step 2: Verify filter-view component tests still pass**

Run: `nx test angular-accelerator -- --testPathPattern="filter-view.component.spec.ts"`
Expected: All tests pass

---

### Task 4: Run full test suite and build verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run all angular-accelerator tests**

Run: `nx test angular-accelerator`
Expected: All tests pass with good coverage

- [ ] **Step 2: Run lint on affected projects**

Run: `nx affected:lint`
Expected: PASS with no errors

- [ ] **Step 3: Build angular-accelerator library**

Run: `nx build angular-accelerator`
Expected: Build succeeds

- [ ] **Step 4: Check test coverage report**

Verify coverage meets 100% for new/modified code paths

---

### Task 5: Update documentation if needed

**Files:**
- Check: `libs/angular-accelerator/README.md` or component docs

- [ ] **Step 1: Verify if any documentation updates are required**

The issue states: "Documentation is updated according to the affected repository's conventions, or the issue records why no documentation change is required."

Since this is a simple attribute addition to prevent autofocus behavior (a bug fix), and doesn't change the public API or component interface, no documentation update is likely needed. Record this in the issue.

---

## Notes

- The issue's Definition of Done mentions adding autofocus="false" to p-multiselect and p-pickList in "filter-view.component.html", but these components don't exist directly in that file. The p-multiselect components are in data-table.component.html (used by filter-view's popover), and p-pickList is in custom-group-column-selector.component.html (used alongside filter-view in interactive-data-view). This plan addresses the actual locations.
- The p-button with autofocus in filter-view's popover panel is intentional for accessibility (focus trap pattern) and should remain as-is.
- PrimeNG's autofocus attribute defaults to false, but explicitly setting it ensures consistent behavior across versions.
- All changes are backward-compatible and don't affect component APIs.

## Verification Steps

1. Run `nx affected:lint` - should pass with no errors
2. Run `nx test angular-accelerator` - all tests should pass
3. Run `nx build angular-accelerator` - build should succeed
4. Verify coverage report shows 100% for modified lines
5. Manually test filter-view popover opens without unwanted focus on multiselect dropdowns