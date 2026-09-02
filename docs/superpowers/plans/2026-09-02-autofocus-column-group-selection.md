# Autofocus on column-group-selection p-select — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the group-selection `p-select` in `column-group-selection` take keyboard focus when it renders, and lock that behavior in with a unit test.

**Architecture:** Add the PrimeNG Select `autofocus` input (as the property binding `[autofocus]="true"`, matching the repo's existing PrimeNG-autofocus convention) to the `<p-select>` host in the component template. Add a new unit spec for the component (none exists today) that renders the dropdown and asserts the host `p-select` carries the autofocus flag.

**Tech Stack:** Angular 19 (standalone-false, NgModule-declared) component, PrimeNG 20.4.0 (`p-select` / `p-floatlabel`), Nx workspace, Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for the translate testing service.

**Spec:** GitHub issue #511 — "Fix autofocus on p-select in column-group-selection component". Definition of done: (1) docs updated or a recorded reason why none is needed; (2) tests added/updated or a recorded reason; (3) add `autofocus` to the `p-select` in `column-group-selection.component.html`.

## Global Constraints

- PrimeNG version is pinned by the lockfile to **20.4.0** (`package.json` declares `^20.3.0`). Use the lowercase `autofocus` input name; the repo's only existing PrimeNG-component autofocus uses lowercase `autofocus` (`libs/angular-accelerator/src/lib/components/filter-view/filter-view.component.html:111` uses `[autofocus]="true"`; `.../dialog-footer.component.html:33` uses a bare `autofocus`).
- The `p-select` is rendered only when `allGroupKeys$` is non-empty (guarded by `@if ((allGroupKeys$ | async)?.length)`), so any test that inspects the `p-select` must supply `columns` with `predefinedGroupKeys`.
- Tests are run per-library via the Nx `@nx/jest:jest` executor; the test environment is `@happy-dom/jest-environment` (no real browser focus).
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); the `CHANGELOG.md` is auto-generated and must not be hand-edited.
- `ColumnGroupSelectionComponent` is `standalone: false`, declared and exported in `libs/angular-accelerator/src/lib/angular-accelerator.module.ts`; specs in this library declare the component directly rather than importing that module.

---

## Problem Statement

The group-selector dropdown (`<p-select>`) inside `ocx-column-group-selection` — an internal child of `ocx-interactive-data-view` (see `interactive-data-view.component.html:159`) — does not receive keyboard focus when it is rendered. Users navigating to the data view via keyboard land without focus placed on the group selector, so they must tab to reach it. The end state: the `p-select` autofocuses on render, and a unit test proves the `autofocus` input is bound to the host.

## Approach

Grounded in the template and the repo's own conventions:

1. The `p-select` in `column-group-selection.component.html` (lines 3–15) currently binds `inputId`, `id`, `options`, `placeholder`, `ngModel`, and `ariaLabel` — but has no autofocus. Add the PrimeNG Select `autofocus` input as the property binding `[autofocus]="true"`, matching how the repo already autofocuses a PrimeNG component in `filter-view.component.html:111`. PrimeNG's `SelectBase` focuses the dropdown input on view init when `autofocus` is `true`, which is the desired keyboard UX.
2. The component has a public test harness (`testing/column-group-selection.harness.ts`) but **no spec file**. Add `column-group-selection.component.spec.ts`, modeled on the sibling specs (`custom-group-column-selector.component.spec.ts`, `data-list-grid-sorting.component.spec.ts`), that (a) asserts the component creates, and (b) supplies columns that make the `@if` render the `p-select`, then asserts the host `p-select` carries the autofocus flag.
3. Record that no documentation change is required (internal focus behavior of an internal sub-component; no public API doc to update; changelog is auto-generated).

## File-Level Task List

### Task 1: Add `autofocus` to the `p-select`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html:3-15`

**Interfaces:**
- Consumes: PrimeNG 20.x `Select` `autofocus` input (`boolean`, default `false`), imported via `SelectModule` which `AngularAcceleratorPrimeNgModule` exports (`libs/angular-accelerator/src/lib/angular-accelerator-primeng.module.ts:54`).
- Produces: the `<p-select>` host renders with the `autofocus` input bound to `true`; PrimeNG focuses the dropdown input on view init.

- [ ] **Step 1: Add the `[autofocus]="true"` binding to the `<p-select>`**

Edit `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html`. Insert the line `[autofocus]="true"` immediately after the `class="p-inputwrapper-filled"` attribute so the `p-select` opening tag reads exactly:

```html
<p-select
  class="p-inputwrapper-filled"
  [autofocus]="true"
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

- [ ] **Step 2: Verify the template is well-formed**

Run: `npx nx lint angular-accelerator`
Expected: no new lint errors; the `p-select` tag still parses (balanced `<p-select ...>` ... `</p-select>`).

- [ ] **Step 3: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html
git commit -m "fix: autofocus group selection p-select in column-group-selection"
```

### Task 2: Add the unit spec asserting the `p-select` is autofocused

**Files:**
- Create: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts`

**Interfaces:**
- Consumes: `ColumnGroupSelectionComponent` (`./column-group-selection.component`), `AngularAcceleratorPrimeNgModule` (`../../angular-accelerator-primeng.module`, provides `SelectModule` + `FloatLabelModule`), `provideTranslateTestingService` from `@onecx/angular-testing`, `DataTableColumn` (`../../model/data-table-column.model`) and `ColumnType` (`../../model/column-type.model`).
- Produces: a passing Jest suite proving (a) the component creates and (b) the rendered `p-select` host has `autofocus === true`.

- [ ] **Step 1: Write the failing spec**

Create `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts` with exactly this content:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { ColumnType } from '../../model/column-type.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { ColumnGroupSelectionComponent } from './column-group-selection.component'

describe('ColumnGroupSelectionComponent', () => {
  let component: ColumnGroupSelectionComponent
  let fixture: ComponentFixture<ColumnGroupSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnGroupSelectionComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
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

  it('should autofocus the group selection p-select when rendered', () => {
    const column: DataTableColumn = {
      columnType: ColumnType.STRING,
      nameKey: 'GROUP_A_COLUMN',
      id: 'col-1',
      predefinedGroupKeys: ['GROUP_A'],
    }
    component.columns = [column]
    fixture.detectChanges()

    const pSelect = fixture.nativeElement.querySelector('p-select') as HTMLElement
    expect(pSelect).toBeTruthy()
    // [autofocus]="true" is a property binding: Angular sets the host DOM property to true.
    expect((pSelect as unknown as { autofocus?: boolean }).autofocus).toBe(true)
  })
})
```

Notes on the setup (so this reads as-is):
- `declarations: [ColumnGroupSelectionComponent]` mirrors the sibling specs because the component is `standalone: false` and declared in `AngularAcceleratorModule` (not imported here, consistent with `data-list-grid-sorting.component.spec.ts`).
- The template uses `[(ngModel)]` (needs `FormsModule`) and `| translate` (needs `TranslateModule.forRoot()` + `provideTranslateTestingService({})`). The template does **not** use the tooltip directive, so `TooltipModule` / `OcxTooltipDirective` are intentionally omitted.
- The second test sets `columns` to a column with `predefinedGroupKeys: ['GROUP_A']` so that `allGroupKeys$` (computed in `ngOnInit`) emits a non-empty array and the `@if ((allGroupKeys$ | async)?.length)` guard renders the `p-select`. Without this, `querySelector('p-select')` would return `null`.
- `provideTranslateTestingService({})` makes `| translate` resolve to the key string, which is non-null; the `@if` guard depends only on `allGroupKeys$`, not on translated text.

- [ ] **Step 2: Run the spec and confirm the autofocus assertion passes (it depends on Task 1)**

Run: `npx nx test angular-accelerator --testPathPattern=column-group-selection.component.spec.ts`
Expected: 2 tests pass — `should create` and `should autofocus the group selection p-select when rendered`. The second asserts `autofocus === true`, which only holds because Task 1 added the `[autofocus]="true"` binding.

- [ ] **Step 3: Confirm the test is meaningful by temporarily removing the binding**

Temporarily delete the `[autofocus]="true"` line added in Task 1, then run the same command.
Expected: the `should autofocus ...` test FAILS (`expected undefined to be true`), proving the test guards the fix. Then restore the `[autofocus]="true"` line and re-run to green.

- [ ] **Step 4: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts
git commit -m "test: assert group selection p-select autofocuses on render"
```

## Verification Steps

Run from the repository root (`/tmp/github-runner-onecx-2/onecx-ai-workflows/onecx-ai-workflows/hybrid-orchestrator-work/.tmp-hybrid/repo-1/target-repo`):

1. **Targeted test (both new tests green):**
   `npx nx test angular-accelerator --testPathPattern=column-group-selection.component.spec.ts`
   Expected: `Tests: 2 passed, 2 total`.

2. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator`
   Expected: `Tests:` summary shows no failures.

3. **Lint (template + new spec):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors.

4. **Library build (template type-check / compilation):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors (confirms `[autofocus]` is a valid `p-select` input and the template still compiles).

5. **Acceptance for the issue DoD:**
   - `column-group-selection.component.html` contains `[autofocus]="true"` on the `<p-select>`.
   - `column-group-selection.component.spec.ts` exists and its autofocus assertion is green and fails without the binding.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** `column-group-selection` is an internal sub-component (rendered by `ocx-interactive-data-view`, which owns the public-facing docs at `docs/modules/onecx-portal-ui-libs/pages/components/interactive-data-view/`). The existing `.adoc` component docs describe user-facing `predefinedGroupKeys` behavior, not the internal keyboard-focus behavior of this child; there is no public-API `.api.md` file for this library, and the `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit message (do not hand-edit it). Action: state in the PR description "No documentation change required — internal autofocus behavior of an internal sub-component; no public API doc to update and changelog is auto-generated."
- **Test — added (DoD item 2).** New spec `column-group-selection.component.spec.ts` added; satisfies the "tests added/updated" item.
- **Why `[autofocus]="true"` (property binding), not a bare `autofocus` attribute:** it matches the repo's existing PrimeNG-component convention (`filter-view.component.html:111` uses `[autofocus]="true"` on a `p-button`; the bare `autofocus` at `dialog-footer.component.html:33` is on a native `<button>`, not a PrimeNG component). A property binding also sets a deterministic `true` the test can assert.
- **Why not the `pAutoFocus` directive:** `filter-view` pairs `pAutoFocus` with `[autofocus]="true"`, but `@PrimeNGAutoFocus` comes from `AutoFocusModule`, which is **not** imported by `AngularAcceleratorPrimeNgModule`. The Select's native `autofocus` input is the correct, module-independent mechanism, so only the single `autofocus` input is added (matching the singular "Add ___ to p-select" in the DoD).
- **Scope boundary (parent issue #510):** only the `p-select` in `column-group-selection.component.html` is in scope. The other four `p-select` usages in the repo (`custom-group-column-selector`, `data-list-grid-sorting`, `data-layout-selection`, `diagram`) are out of scope and intentionally untouched.
- **Test-timing caveat:** the `p-select` renders only after `allGroupKeys$` emits non-empty; the spec supplies `columns` with `predefinedGroupKeys` before the first `detectChanges()` for this reason. If `PrimeNG`'s focus call on a happy-dom node ever throws in the future, wrap the assertion target selection in `fixture.detectChanges()` and confirm `document.body` is unaffected — but happy-dom `focus()` is a no-op and does not throw as of this environment.
- **Follow-up (optional, out of scope for this change):** a Storybook story does not exist for `column-group-selection` (siblings `custom-group-column-selector` has one). Not required to satisfy this issue's DoD; tracked only as a potential follow-up.
