# Disable autofocus on column-group-selection p-select — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the group-selection `<p-select>` in the `column-group-selection` component NOT grab keyboard focus on render, and lock that behavior in with a unit test.

**Architecture:** Change the PrimeNG `Select` `autofocus` input on the `<p-select>` from the property binding `[autofocus]="true"` (added by the prior #511 change) to the static attribute `autofocus="false"`. PrimeNG declares the `autofocus` input with a `booleanAttribute` transform, so the static string `"false"` is coerced to the boolean `false`. Update the existing spec's assertion from `toBe(true)` to `toBe(false)` to pin the new behavior.

**Tech Stack:** Angular 20 (component is `standalone: false`, NgModule-declared), PrimeNG 20.3.15 (`p-select` / `p-floatlabel`), Nx workspace, Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for the translate testing service.

**Spec:** GitHub issue #512 — "Fix autofocus on p-select in column-group-selection component". Definition of done: (1) docs updated or a recorded reason why none is needed; (2) tests added/updated or a recorded reason; (3) add `autofocus="false"` to the `p-select` in `column-group-selection.component.html`.

## Global Constraints

- PrimeNG `Select` `autofocus` input is declared with `transformFunction: booleanAttribute` (verified in `node_modules/primeng/fesm2022/primeng-select.mjs`). Angular's `booleanAttribute` (verified in `node_modules/@angular/core/fesm2022/core.mjs:3878`) is `value => typeof value === 'boolean' ? value : value != null && value !== 'false'`. Therefore the static string attribute `autofocus="false"` → `booleanAttribute('false')` → **`false`**, while the current `[autofocus]="true"` → `booleanAttribute(true)` → `true`. The test must therefore assert the boolean `false`.
- The `<p-select>` renders only when `allGroupKeys$` is non-empty (guarded by `@if ((allGroupKeys$ | async)?.length)` in the template), so any test inspecting the `<p-select>` must supply `columns` with `predefinedGroupKeys`.
- Scope boundary (parent issue #510): ONLY the `<p-select>` in `column-group-selection.component.html` is in scope. Do NOT touch the other PrimeNG `autofocus` usages: `filter-view.component.html:111` (`[autofocus]="true"` on a `p-button`) and `dialog-footer.component.html:33` (bare `autofocus` on a native `<button>`).
- Tests run per-library via the Nx `@nx/jest:jest` executor, but that executor does NOT honor `--testPathPattern` (it runs the whole library suite). To run only this spec, invoke Jest directly with the plural flag `--testPathPatterns`.
- `ColumnGroupSelectionComponent` is `standalone: false`, declared in `libs/angular-accelerator/src/lib/angular-accelerator.module.ts`; the spec declares the component directly and does not import that module.
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); `CHANGELOG.md` is auto-generated and must not be hand-edited.
- Code style (`.prettierrc`): no semicolons, single quotes. The single template edit and the spec edits preserve this style and require no Prettier reformat.

---

## Problem Statement

The group-selector dropdown (`<p-select>`) inside `ocx-column-group-selection` — an internal child of `ocx-interactive-data-view` — currently grabs keyboard focus on render because it carries `[autofocus]="true"` (introduced by the #511 change). That autofocus is undesirable: focusing an internal dropdown on mount is disruptive (it can fight the host view's own focus management and is unwanted behavior for a filter/selector control). The end state: the `p-select` does **not** autofocus when rendered — its `autofocus` input is `false` — and a unit test proves the `autofocus` input is bound to `false`.

## Approach

Grounded in the template, the existing spec, and PrimeNG/Angular runtime semantics:

1. The `<p-select>` in `column-group-selection.component.html` (line 5) currently has `[autofocus]="true"`. Replace that property binding with the static attribute `autofocus="false"`. Because PrimeNG's `autofocus` input uses the `booleanAttribute` transform, the literal string `"false"` becomes the boolean `false`, which is exactly what the DoD's `autofocus="false"` requires and what PrimeNG needs to suppress focus-on-load (its template binds `[pAutoFocus]="autofocus"` on the focusable input).
2. The existing spec `column-group-selection.component.spec.ts` already renders the `p-select` and asserts `select.autofocus` is `toBe(true)`. Update that assertion (and its test name + explanatory comment) to `toBe(false)` so the suite pins the new no-autofocus behavior. The assertion reads `autofocus` off the `Select` component instance (via `By.css('p-select')` + `componentInstance`), which is correct because `autofocus` is a PrimeNG `@Input`, not a host DOM attribute.
3. Record that no documentation change is required (internal focus behavior of an internal sub-component; no public-API `.api.md` for this library; `CHANGELOG.md` is auto-generated).

## File-Level Task List

### Task 1: Change the `p-select` `autofocus` to `false` and pin it with the spec

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html:5`
- Modify: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts:35-52`
- Test: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts`

**Interfaces:**
- Consumes: PrimeNG 20.3.15 `Select` `autofocus` input (`boolean | undefined`, default `false`, `booleanAttribute` transform), imported via `SelectModule` which `AngularAcceleratorPrimeNgModule` declares and exports (`libs/angular-accelerator/src/lib/angular-accelerator-primeng.module.ts:30,54`). The spec's existing imports — `CommonModule`, `AngularAcceleratorPrimeNgModule`, `FormsModule`, `TranslateModule.forRoot()`, `provideTranslateTestingService`, `By`, `ColumnType`, `DataTableColumn`, `Select` — are all already present and reused.
- Produces: the rendered `<p-select>` host has `Select.autofocus === false`; the spec's autofocus test asserts that and fails if the template reverts to `[autofocus]="true"`.

**Steps (TDD):**

- [ ] **Step 1: Write the failing test (update the spec assertion to `false`)**

Edit `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts`. Replace the second test (lines 35–53) so it asserts `autofocus` is `false`. The full `describe` block becomes exactly:

```ts
describe('ColumnGroupSelectionComponent', () => {
  let component: ColumnGroupSelectionComponent
  let fixture: ComponentFixture<ColumnGroupSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnGroupSelectionComponent],
      // CommonModule provides the AsyncPipe used by the template's `(allGroupKeys$ | async)`.
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnGroupSelectionComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    component.columns = []
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should NOT autofocus the group selection p-select when rendered', () => {
    // Supply a column with predefinedGroupKeys so allGroupKeys$ emits non-empty
    // and the @if guard renders the <p-select>.
    const column: DataTableColumn = {
      columnType: ColumnType.STRING,
      nameKey: 'GROUP_A_COLUMN',
      id: 'col-1',
      predefinedGroupKeys: ['GROUP_A'],
    }
    component.columns = [column]
    fixture.detectChanges()

    // PrimeNG's Select exposes `autofocus` as an @Input (NOT a host attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the Select component instance.
    const pSelect = fixture.debugElement.query(By.css('p-select'))
    expect(pSelect).toBeTruthy()
    const select = pSelect.componentInstance as Select
    expect(select.autofocus).toBe(false)
  })
})
```

The only functional change from the current file is `expect(select.autofocus).toBe(true)` → `expect(select.autofocus).toBe(false)`; the test name and the two-line comment are updated to match. All imports and the `should create` test are unchanged.

- [ ] **Step 2: Run the spec and confirm it now FAILS**

Run (from the repository root):
```bash
npx jest --config libs/angular-accelerator/jest.config.ts --testPathPatterns="column-group-selection.component.spec"
```
Expected: the `should NOT autofocus ...` test FAILS with `expect(received).toBe(expected)` where `received` is `true` and `expected` is `false`. This proves the test guards the change (the template still has `[autofocus]="true"` at this point). The `should create` test still passes.

- [ ] **Step 3: Implement the template change**

Edit `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html`. On line 5, replace `[autofocus]="true"` with the static attribute `autofocus="false"`. The `<p-select>` opening tag becomes exactly:

```html
<p-select
  class="p-inputwrapper-filled"
  autofocus="false"
  inputId="columnGroupSelectionDropdown"
  id="columnGroupSelectionDropdownElement"
  (onChange)="changeGroupSelection($event)"
  [options]="(allGroupKeys$ | async) || []"
  [placeholder]="placeholderKey | translate"
  [(ngModel)]="selectedGroupKey"
  [ariaLabel]="'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ARIA_LABEL' | translate"
  >
  <ng-template let-item #item> {{ item ? (item | translate) : ''}} </ng-template>
  <ng-template let-item #selectedItem> {{ item ? (item | translate) : ''}} </ng-template>
</p-select>
```

No other lines change. The component class (`.ts`) and styles (`.scss`) are untouched.

- [ ] **Step 4: Run the spec and confirm it now PASSES**

Run (from the repository root):
```bash
npx jest --config libs/angular-accelerator/jest.config.ts --testPathPatterns="column-group-selection.component.spec"
```
Expected: `PASS` — `Tests: 2 passed, 2 total` (`should create` and `should NOT autofocus the group selection p-select when rendered`).

- [ ] **Step 5: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts
git commit -m "fix: disable autofocus on p-select in column-group-selection (#512)"
```

## Verification Steps

Run from the repository root (`/tmp/github-runner-onecx-2/onecx-ai-workflows/onecx-ai-workflows/hybrid-orchestrator-work/.tmp-hybrid/repo-1/target-repo`):

1. **Targeted spec (both tests green):**
   `npx jest --config libs/angular-accelerator/jest.config.ts --testPathPatterns="column-group-selection.component.spec"`
   Expected: `Test Suites: 1 passed, 1 total` and `Tests: 2 passed, 2 total`.

2. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator --skip-nx-cache`
   Expected: `Test Suites:` summary shows all passing (baseline before this change is 26 suites / 405 tests passing; the count is unchanged because only one assertion value flips). No failures.

3. **Lint (template + spec):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors. (The `autofocus="false"` attribute and the spec text introduce no lint rule violations; the repo's existing PrimeNG `autofocus` usages use the same lowercase attribute name.)

4. **Library build (template type-check / AOT compilation):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors. This confirms `autofocus="false"` is a valid `p-select` input and the template still compiles.

5. **Acceptance for the issue DoD:**
   - `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html` contains `autofocus="false"` on the `<p-select>` (and no longer `[autofocus]="true"`).
   - `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts` asserts `expect(select.autofocus).toBe(false)` and is green; reverting the template to `[autofocus]="true"` makes it fail (verified in Step 2 of Task 1).
   - The other PrimeNG `autofocus` usages are untouched: `filter-view.component.html:111` still has `[autofocus]="true"` and `dialog-footer.component.html:33` still has a bare `autofocus`.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** `column-group-selection` is an internal sub-component (rendered by `ocx-interactive-data-view`, which owns the public-facing docs under `docs/modules/onecx-portal-ui-libs/pages/components/`). There is no component-specific `.adoc` that documents the internal keyboard-focus behavior of this child (the only references are `docs/.../migrate-to-v6.adoc:145` listing the component name, and `CHANGELOG.md:827` for an unrelated prior id change). There is no public-API `.api.md` file for this library, and `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit message (do not hand-edit it). Action: state in the PR description "No documentation change required — internal focus behavior of an internal sub-component; no public API doc to update and changelog is auto-generated."
- **Test — updated (DoD item 2).** The existing spec's autofocus assertion is updated from `toBe(true)` to `toBe(false)` and its name adjusted; satisfies the "tests added/updated" item. No new spec file is needed — the spec already exists from #511.
- **Why `autofocus="false"` (static string attribute), not `[autofocus]="false"` (property binding):** both produce `Select.autofocus === false` under the `booleanAttribute` transform. The static attribute is used because it is the exact form the DoD requests ("add `autofocus=\"false\"`"), and `booleanAttribute('false')` deterministically yields the boolean `false` that PrimeNG's internal `[pAutoFocus]="autofocus"` and the test both rely on.
- **Why assert on the component instance, not the DOM host:** PrimeNG `Select` exposes `autofocus` as an `@Input` (declared in its `ɵcmp` inputs), not as a host attribute, so the `<p-select>` host element does not carry an `autofocus` DOM attribute. The spec reads `fixture.debugElement.query(By.css('p-select')).componentInstance.autofocus`. This is the same approach the spec already used for `true` and is unchanged.
- **Scope boundary (parent issue #510):** only the `<p-select>` in `column-group-selection.component.html` is in scope. The other PrimeNG `autofocus` usages in the repo (`filter-view.component.html:111`, `dialog-footer.component.html:33`) and the other `p-select` usages are intentionally untouched.
- **Test-isolation note:** the Nx `@nx/jest:jest` executor runs the entire library suite regardless of `--testPathPattern`; use `npx jest --config libs/angular-accelerator/jest.config.ts --testPathPatterns="<pattern>"` (plural flag; Jest in this repo is v29+, where `--testPathPattern` was renamed) to run a single spec.
- **`@happy-dom` focus behavior:** `@happy-dom` `focus()` is a no-op and does not throw, so rendering the `p-select` with `autofocus` `false` (and previously `true`) is safe in the test environment; no extra guarding is required.
