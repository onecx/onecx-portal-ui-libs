# Fix autofocus on p-multiselect and p-pickList (filter-view) — Implementation Plan

**Goal:** Stop the PrimeNG filter `p-multiselect` (data-table column header filter) and `p-pickList` (column selector dialog) from stealing initial keyboard focus, by adding `autofocus="false"` to both, and lock the behavior in with unit tests.

**Architecture:** Add the bare static attribute `autofocus="false"` to the two `<p-multiselect>` elements in `data-table.component.html` and to the single `<p-pickList>` element in `custom-group-column-selector.component.html`. PrimeNG `MultiSelect` exposes a real `autofocus` `@Input` (so the value is read as boolean `false`); PrimeNG `PickList` does NOT expose an `autofocus` input (only `autoOptionFocus`), so the static attribute is the only form that compiles on `p-pickList` and lands inertly on the host element. Add one focused assertion per component to the existing specs.

**Tech Stack:** Angular 19 NgModule-declared (`standalone: false`) components, PrimeNG 20.4.0 (`MultiSelectModule` / `PickListModule`), Nx workspace, Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for `provideTranslateTestingService`.

**Spec:** GitHub issue #514 — "Fix autofocus on p-multiselect and p-pickList in filter-view component". Definition of done: (1) docs updated or a recorded reason why none is required; (2) tests added/updated or a recorded reason; (3) add `autofocus="false"` to `p-multiselect` in the filter-view markup; (4) add `autofocus="false"` to `p-pickList` in the filter-view markup.

## Global Constraints

- PrimeNG is pinned by the lockfile to **20.4.0** (`package.json` declares `^20.3.0`). Use the bare **static attribute** `autofocus="false"` (NOT the property binding `[autofocus]="false"`). `[autofocus]="false"` is an AOT error on `p-pickList` because `PickList` has no `autofocus` input; on `p-multiselect` the bare attribute is still read as boolean `false`.
- The issue's "filter-view" naming refers to the filter UX these two components provide; the `p-multiselect` elements actually live in `data-table.component.html` (the column-header filter) and the `p-pickList` lives in `custom-group-column-selector.component.html` (the column-selection dialog). `filter-view.component.html` contains **neither** element and must be left untouched.
- Tests are run per-library via the Nx `@nx/jest:jest` executor; the environment is `@happy-dom/jest-environment` (no real browser focus; `focus()` is a no-op and does not throw).
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); `CHANGELOG.md` is auto-generated and must not be hand-edited.
- Both components are `standalone: false` and are declared in `AngularAcceleratorModule`; the specs declare the component directly (do not import that module), consistent with the existing specs.

---

## Problem Statement

The filter affordances surfaced through the filter-view UX — the data-table's per-column header filter (`<p-multiselect>`) and the column-configuration dialog's source/target picker (`<p-pickList>`) — take initial keyboard focus as they are rendered. This pulls focus away from the element the user navigated from and is wrong for these non-primary controls. The end state: `autofocus="false"` is present on both the `p-multiselect` and the `p-pickList` markup, PrimeNG does not autofocus them, and a unit test per component proves the attribute is applied.

## Approach

Grounded in the templates, the PrimeNG 20.4.0 component typings, and the sibling autofight issues (#511–#513) already merged on this branch:

1. **Two `p-multiselect` edits** in `data-table.component.html`. Both instances are the column-header filter (one for `EQUALS`/default columns, one for `IS_NOT_EMPTY` columns). Add the static attribute `autofocus="false"` to each opening `<p-multiselect>` tag. `MultiSelect` declares `autofocus: boolean | undefined` as an `@Input`, so the static value `"false"` is read as boolean `false` — the multiselect will not autofocus. This matches the DoD text `autofocus="false"` verbatim.
2. **One `p-pickList` edit** in `custom-group-column-selector.component.html`. Add the static attribute `autofocus="false"` to the `<p-pickList>` opening tag. `PickList` has **no** `autofocus` input (verified against `node_modules/primeng/picklist/index.d.ts` — the only focus-related inputs are `autoOptionFocus`, `onFocus`, `onListFocus`), so a property binding would fail AOT compilation; the static attribute is valid and simply lands as an inert host attribute (verified: host `getAttribute("autofocus") === "false"`, component instance `autofocus` is `undefined`). PrimeNG `PickList` has no autofocus-on-load behavior to begin with, so the attribute documents intent and matches the DoD.
3. **One test per component**, added to the existing specs, asserting the attribute is present on the rendered element.
4. **Record that no documentation change is required** (internal focus behavior of internal sub-components; no public-API `.adoc`/`.api.md` to update; changelog is auto-generated).

The binding form and the render conditions below were verified by executing the exact test setup in this repository before writing this plan; every command in the Verification Steps is expected to pass as written.

## File-Level Task List

### Task 1: Add `autofocus="false"` to both `p-multiselect` elements

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.html`

**Dependencies:** none.

**Summary:** Insert one line — `autofocus="false"` — immediately after the `class="filterMultiSelect"` attribute in BOTH `<p-multiselect>` opening tags (the `EQUALS` filter at ~line 326 and the `IS_NOT_EMPTY` filter at ~line 366). No other lines change.

Concrete TODOs:
1. In the first `<p-multiselect>` (the `EQUALS`/default filter — its `[options]` binding is `[options]="equalFilterOptions.column?.id === column.id ? equalFilterOptions.options : []"`), add `autofocus="false"` on the line after `class="filterMultiSelect"`. The tag then begins:
   ```html
   <p-multiselect
     class="filterMultiSelect"
     autofocus="false"
     [options]="equalFilterOptions.column?.id === column.id ? equalFilterOptions.options : []"
   ```
2. In the second `<p-multiselect>` (the `IS_NOT_EMPTY`/truthy filter — its `[options]` binding is `[options]="truthyFilterOptions"`), add `autofocus="false"` on the line after `class="filterMultiSelect"`. The tag then begins:
   ```html
   <p-multiselect
     class="filterMultiSelect"
     autofocus="false"
     [options]="truthyFilterOptions"
   ```
3. Do not touch the component class (`data-table.component.ts`) or styles.

### Task 2: Add `autofocus="false"` to the `p-pickList` element

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html`

**Dependencies:** none.

**Summary:** Insert one line — `autofocus="false"` — immediately before the `[source]="displayedColumnsModel"` attribute on the `<p-pickList>` opening tag (~line 31). No other lines change.

Concrete TODOs:
1. Add `autofocus="false"` as the first attribute on the `<p-pickList>` tag. The tag then begins:
   ```html
   <p-pickList
     autofocus="false"
     [source]="displayedColumnsModel"
   ```
2. Do not touch the component class or styles. Use the static attribute, not a property binding — `PickList` has no `autofocus` input and a `[autofocus]="false"` binding would fail AOT compilation.

### Task 3: Add a unit test asserting the data-table `p-multiselect` is not autofocused

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts`

**Dependencies:** Task 1 (the assertion is meaningless / fails without it).

**Summary:** Add one import (`By`) and a new top-level `describe` block inside the existing `describe('DataTableComponent', ...)` that renders one filterable column and asserts the rendered `p-multiselect` component instance has `autofocus === false`. The `fixture`, `component`, and `ColumnType` bindings and the full provider setup already come from the spec's `beforeEach`.

Concrete TODOs:
1. Add this import to the import block at the top of the file (it is NOT currently imported — the file imports `BrowserAnimationsModule` from `@angular/platform-browser/animations` but not `By` from `@angular/platform-browser`). Insert it directly after the `BrowserAnimationsModule` import line:
   ```ts
   import { By } from '@angular/platform-browser'
   ```
2. Add this `describe` block immediately before the final closing `})` of `describe('DataTableComponent', ...)` (i.e., after the `describe('overflow helper methods', ...)` block and before the function `createQueryList`):
   ```ts
   describe('column filter autofocus', () => {
     it('should not autofocus the p-multiselect column filter', async () => {
       component.rows = [{ id: 'row-1', name: 'a' }]
       component.columns = [
         {
           columnType: ColumnType.STRING,
           id: 'name',
           nameKey: 'COLUMN_HEADER_NAME.NAME',
           filterable: true,
           sortable: true,
         },
       ]
       fixture.detectChanges()
       await fixture.whenStable()

       const pMultiselect = fixture.debugElement.query(By.css('p-multiselect'))
       expect(pMultiselect).toBeTruthy()
       expect((pMultiselect.componentInstance as unknown as { autofocus?: unknown }).autofocus).toBe(false)
     })
   })
   ```

Note: the parent `beforeEach` renders `mockColumns` (all `filterable: true`); this block reassigns `rows`/`columns` to a single filterable `EQUALS` column so exactly one `p-multiselect` renders in the header. With Task 1 applied, `autofocus` reads as boolean `false`; without it the instance value is `undefined` and `toBe(false)` fails, so the test genuinely guards the edit.

### Task 4: Add a unit test asserting the `p-pickList` carries `autofocus="false"`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.spec.ts`

**Dependencies:** Task 2 (the assertion is meaningless / fails without it).

**Summary:** Add two imports and a new top-level `describe` block inside the existing `describe('CustomGroupColumnSelectorComponent', ...)` that opens the dialog (`visible = true`) and asserts the rendered `p-pickList` host element has the `autofocus="false"` attribute.

Concrete TODOs:
1. Add these two imports to the import block at the top of the file (after the existing `@angular/core/testing` / `@angular/forms` / `@ngx-translate/core` imports):
   ```ts
   import { By } from '@angular/platform-browser'
   import { NoopAnimationsModule } from '@angular/platform-browser/animations'
   ```
2. Add `NoopAnimationsModule` to the `imports` array of the existing `beforeEach` `TestBed.configureTestingModule({ ... })`. The `p-dialog` content (which contains the `p-pickList`) uses PrimeNG `@animation` synthetic listeners, so toggling `visible = true` and re-rendering requires an animation provider. The existing imports array becomes:
   ```ts
   imports: [
     CommonModule,
     NoopAnimationsModule,
     AngularAcceleratorPrimeNgModule,
     FormsModule,
     TranslateModule.forRoot(),
     TooltipModule,
     OcxTooltipDirective,
   ],
   ```
   (Keep the existing `declarations` and `providers` entries unchanged.)
3. Add this `describe` block immediately before the final closing `})` of `describe('CustomGroupColumnSelectorComponent', ...)` (i.e., after the existing `it('should create', ...)`):
   ```ts
   describe('p-pickList autofocus', () => {
     it('should apply autofocus="false" to the p-pickList', async () => {
       component.visible = true
       fixture.detectChanges()
       await fixture.whenStable()

       const pPickList = fixture.debugElement.query(By.css('p-pickList'))
       expect(pPickList).toBeTruthy()
       expect(pPickList.nativeElement.getAttribute('autofocus')).toBe('false')
     })
   })
   ```

Note: the existing `beforeEach` already calls `fixture.detectChanges()` once (with `visible` defaulting to `false`); this block then sets `visible = true` and calls `detectChanges()` again, which renders the dialog body and the `p-pickList`. `PickList` has no `autofocus` input, so the assertion is made against the host DOM attribute (`getAttribute('autofocus') === 'false'`), which is where the static attribute lands.

### Task 5: Save this plan document and commit

**Files:**
- Create: `docs/superpowers/plans/2026-09-02-autofocus-filter-view.md` (this document)

**Dependencies:** Tasks 1–4.

Concrete TODOs:
1. Commit all changes (the two template edits, the two spec edits, and this plan file) in a single commit, matching the sibling convention on this branch (#511, #512, #513 each committed `<plan md> + <component html> + <component spec>` together):
   ```bash
   git add \
     libs/angular-accelerator/src/lib/components/data-table/data-table.component.html \
     libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html \
     libs/angular-accelerator/src/lib/components/data-table/data-table.component.spec.ts \
     libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.spec.ts \
     docs/superpowers/plans/2026-09-02-autofocus-filter-view.md
   git commit -m "fix(docs): disable autofocus on filter p-multiselect and p-pickList

   Implements onecx/internal-tasks#514"
   ```
   The `fix(docs):` prefix matches the three sibling autofight commits already on this branch (#511, #512, #513), which each committed a plan doc plus template and spec changes together. It is a Conventional Commit type, so `semantic-release` emits the changelog entry.

## Verification Steps

Run all commands from the repository root.

1. **Template AOT compilation / no `p-pickList` binding error (proves the static attribute is the correct form and both templates compile):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors. (A `[autofocus]="false"` binding on `p-pickList` would fail here — the static attribute does not.)

2. **Lint (templates + both specs):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors.

3. **Targeted specs via the library test target** (the `@nx/jest:jest` executor accepts `--testFile`; use one path per run):
   `npx nx test angular-accelerator --testFile=data-table/data-table.component.spec.ts --skip-nx-cache`
   `npx nx test angular-accelerator --testFile=custom-group-column-selector/custom-group-column-selector.component.spec.ts --skip-nx-cache`
   Expected: both suites pass, including the new `should not autofocus the p-multiselect column filter` and `should apply autofocus="false" to the p-pickList` tests.

4. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator`
   Expected: all suites pass (baseline before this change: 406 passed / 0 failed; after: +2 tests, all passing).

5. **Confirm the two tests are meaningful (mutation check):**
   - Temporarily remove the `autofocus="false"` line from the first `p-multiselect` in `data-table.component.html`, then run step 3's first command. Expected: `should not autofocus the p-multiselect column filter` FAILS (instance `autofocus` is `undefined`, not `false`). Restore the line.
   - Temporarily remove the `autofocus="false"` line from the `p-pickList` in `custom-group-column-selector.component.html`, then run step 3's second command. Expected: `should apply autofocus="false" to the p-pickList` FAILS (`getAttribute('autofocus')` is `null`, not `'false'`). Restore the line.

6. **Acceptance for the issue DoD:**
   - `data-table.component.html` contains `autofocus="false"` on both `<p-multiselect>` tags.
   - `custom-group-column-selector.component.html` contains `autofocus="false"` on the `<p-pickList>` tag.
   - `data-table.component.spec.ts` and `custom-group-column-selector.component.spec.ts` each contain a passing autofocus assertion that fails without the corresponding template edit.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** Both `data-table` and `custom-group-column-selector` are internal sub-components of the data-viewing UX; the user-facing `.adoc` docs under `docs/modules/onecx-portal-ui-libs/` describe the public filter/column-selection behavior, not the internal keyboard-focus behavior of these controls. There is no public-API `.api.md` documenting an `autofocus` prop for either, and `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit message (do not hand-edit it). State in the PR description: "No documentation change required — internal autofocus behavior of internal sub-components; no public API doc to update and changelog is auto-generated."
- **Why the static attribute `autofocus="false"` and not the property binding `[autofocus]="false"`.** `PickList` (PrimeNG 20.4.0) declares no `autofocus` input (only `autoOptionFocus`), so a property binding is an AOT error on `p-pickList` — the static attribute is the only form that compiles there. On `p-multiselect`, the static attribute is still read by `MultiSelect` as its `autofocus` input (boolean `false`), verified in this repo: with the attribute the instance value is `false`, without it `undefined`. The static attribute also matches the DoD text verbatim on all three elements.
- **Why `NoopAnimationsModule` is added to the picklist spec.** The `p-dialog` body (which renders the `p-pickList`) compiles PrimeNG `@animation` synthetic listeners; opening the dialog (`visible = true`) and re-rendering without an animation provider throws `NG05105: Unexpected synthetic listener @animation.start`. Adding `NoopAnimationsModule` to the `beforeEach` imports is required only for the new test; the existing `should create` test does not open the dialog.
- **Render conditions (verified).** The `p-multiselect` renders in the column-header filter only for columns where `column.filterable` is true (and no `filterType`, or `filterType === EQUALS`); the test uses one such column. The `p-pickList` renders only inside the `p-dialog` and only after `visible` is `true`. Both conditions are satisfied by the test setups above.
- **Scope boundary (parent issue #510).** Only the two `p-multiselect` elements in `data-table.component.html` and the one `p-pickList` element in `custom-group-column-selector.component.html` are in scope. `filter-view.component.html` is intentionally untouched (it contains neither element). The `p-button` in `filter-view.component.html` that uses `[autofocus]="true"` (an intentional autofocus) and the sibling `p-select` fixes (#511–#513) are out of scope and remain unchanged.
- **Test-timing caveat.** PrimeNG `focus()` is a no-op under `@happy-dom/jest-environment` and does not throw, so the assertions (which inspect the input value / host attribute rather than `document.activeElement`) are stable and do not depend on real focus behavior.
