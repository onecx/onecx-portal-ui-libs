# Autofocus on data-list-grid-sorting p-select — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the sorting-dropdown `p-select` in `data-list-grid-sorting` from taking keyboard focus when it renders, by setting its PrimeNG `autofocus` input to `false`, and lock that in with a unit test.

**Architecture:** Add the static `autofocus="false"` attribute to the `<p-select>` host in `data-list-grid-sorting.component.html`, matching the already-merged sibling fix in `column-group-selection` (issue #511). Add one new unit spec to `data-list-grid-sorting.component.spec.ts` that renders the component and asserts the `p-select`'s `autofocus` input is `false`, mirroring `column-group-selection.component.spec.ts` verbatim in technique.

**Tech Stack:** Angular 19 non-standalone (NgModule-declared) component, PrimeNG 20.4.0 (`p-select` / `p-floatLabel`), Nx workspace (`@nx/jest` executor), Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for the translate testing service.

**Spec:** GitHub issue #513 — "Fix autofocus on p-select in data-list-grid-sorting component". Definition of done: (1) docs updated or a recorded reason why none is needed; (2) tests added/updated or a recorded reason; (3) add `autofocus="false"` to the `p-select` in `data-list-grid-sorting.component.html`.

## Global Constraints

- PrimeNG version is pinned by the lockfile to **20.4.0** (`package.json` declares `^20.3.0`). Use the lowercase `autofocus` input on the `p-select`. The repo's own on-disk precedent for this exact fix uses the static attribute `autofocus="false"` (`libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html:5`).
- The DoD requires `autofocus="false"` (disable autofocus). PrimeNG's `Select` autofocuses its input on view init by default; setting the `autofocus` input to `false` turns that off. Do NOT add `[autofocus]="true"`.
- The `<p-select>` in `data-list-grid-sorting.component.html` is rendered unconditionally (no `@if` guard), so the spec needs **no** `columns` input to make the element appear.
- Tests run per-library via the Nx `@nx/jest:jest` executor (project name `angular-accelerator`); the test environment is `@happy-dom/jest-environment` (no real browser focus).
- `DataListGridSortingComponent` is `standalone: false`, declared and exported in `libs/angular-accelerator/src/lib/angular-accelerator.module.ts`; specs in this library declare the component directly (`declarations: [...]`) rather than importing that module — the existing `data-list-grid-sorting.component.spec.ts` already does this.
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); `CHANGELOG.md` is auto-generated and must not be hand-edited.

---

## Problem Statement

The sorting-dropdown (`<p-select id="dataListGridSortingDropdown">`) inside `ocx-data-list-grid-sorting` — an internal child of `ocx-interactive-data-view` — grabs keyboard focus when it renders because PrimeNG's `Select` component autofocuses its input by default. In a data grid this steals focus from the grid on render, breaking keyboard navigation. The end state: the `p-select` does **not** autofocus on render (`autofocus` input set to `false`), and a unit test proves the `autofocus` input is bound to `false`.

## Approach

Grounded in the template, the on-disk sibling fix, and the repo's conventions:

1. `data-list-grid-sorting.component.html` (lines 3–10) declares a `<p-select>` that binds `id`, `inputId`, `ngModel`, `options`, `onChange`, and `ariaLabel` but sets no `autofocus`. PrimeNG `Select` therefore autofocuses on view init. Add the static `autofocus="false"` attribute to the `<p-select>` opening tag — exactly how the already-merged sibling `column-group-selection.component.html:5` disables it. The PrimeNG `Select` `autofocus` input uses a `booleanAttribute` transform, so the static `autofocus="false"` string is coerced to the boolean `false`.
2. `data-list-grid-sorting.component.spec.ts` currently has only a `should create` test. Add a second test, `should NOT autofocus the data list grid sorting p-select when rendered`, modeled on `column-group-selection.component.spec.ts` (lines 35–54): render the component, query the `p-select` host via `fixture.debugElement.query(By.css('p-select'))`, cast its `componentInstance` to `Select` (imported from `primeng/select`), and assert `select.autofocus === false`. Because the `p-select` here is unconditional (no `@if`), no `columns` fixture data is required.
3. Record that no documentation change is required (internal focus behavior of an internal sub-component; no public API doc to update; changelog is auto-generated).

## File-Level Task List

### Task 1: Add `autofocus="false"` to the `p-select`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.html:3-10`

**Interfaces:**
- Consumes: PrimeNG 20.x `Select` `autofocus` input (`boolean`, `booleanAttribute`-transformed), provided by `SelectModule` which `AngularAcceleratorPrimeNgModule` exports (`libs/angular-accelerator/src/lib/angular-accelerator-primeng.module.ts`).
- Produces: the `<p-select>` host renders with the `autofocus` input bound to `false`; PrimeNG does not focus the dropdown input on view init.

**Dependencies:** none.

**Concrete TODOs:**
- [ ] Insert the single line `autofocus="false"` into the `<p-select>` opening tag.
- [ ] Verify the template is well-formed (balanced tag, no lint errors).
- [ ] Commit.

- [ ] **Step 1: Add the `autofocus="false"` attribute to the `<p-select>`**

Edit `libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.html`. Insert the line `autofocus="false"` immediately after the `id="dataListGridSortingDropdown"` line so the `p-select` opening tag reads exactly:

```html
    <p-select
      id="dataListGridSortingDropdown"
      autofocus="false"
      inputId="dataListGridSortingDropdownInput"
      [(ngModel)]="selectedSortingOption"
      [options]="dropdownOptions"
      (onChange)="selectSorting($event)"
      [ariaLabel]="('OCX_LIST_GRID_SORT.DROPDOWN.ARIA_LABEL' | translate)"
    >
```

No other lines in this file change. The `<ng-template>` children, the `</p-select>` close (line 14–15), the `p-floatLabel`, the `<label>`, and the `p-button` are all untouched. The component class (`.ts`) and styles (`.scss`) are untouched.

- [ ] **Step 2: Verify the template is well-formed**

Run: `npx nx lint angular-accelerator`
Expected: exit 0, no new lint errors; the `p-select` tag still parses (balanced `<p-select ...>` ... `</p-select>`).

- [ ] **Step 3: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.html
git commit -m "fix: disable autofocus on data list grid sorting p-select"
```

### Task 2: Add the unit spec asserting the `p-select` does not autofocus

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.spec.ts`

**Interfaces:**
- Consumes: `DataListGridSortingComponent` (`./data-list-grid-sorting.component`), `AngularAcceleratorPrimeNgModule` (`../../angular-accelerator-primeng.module`, provides `SelectModule`), `provideTranslateTestingService` from `@onecx/angular-testing`, and PrimeNG `Select` (`primeng/select`) for typing the host component instance.
- Produces: a passing Jest suite proving (a) the component creates and (b) the rendered `p-select` host has `autofocus === false`.

**Dependencies:** Task 1 (the assertion only passes once the `autofocus="false"` attribute is present).

**Concrete TODOs:**
- [ ] Add the `By` and `Select` imports.
- [ ] Add the new `should NOT autofocus ...` test.
- [ ] Run the spec and confirm both tests pass.
- [ ] Confirm the test is meaningful by temporarily removing the attribute (red), then restore (green).
- [ ] Commit.

- [ ] **Step 1: Add the two new imports**

In `libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.spec.ts`, add `By` from `@angular/platform-browser` and `Select` from `primeng/select`. The import block becomes exactly:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { Select } from 'primeng/select'
```

The existing `beforeEach`, the `declarations`/`imports`/`providers` setup, and the existing `should create` test are all unchanged. (The spec's `beforeEach` already imports `TooltipModule` and `OcxTooltipDirective` because the `p-button` uses the tooltip directive; keep them.)

- [ ] **Step 2: Add the failing test**

Add the following test as the second `it(...)` inside the `describe('DataListGridSortingComponent', ...)` block, immediately after the existing `should create` test:

```ts
  it('should NOT autofocus the data list grid sorting p-select when rendered', () => {
    // The <p-select> renders unconditionally (no @if guard), so no columns input
    // is required for the host element to be present.
    fixture.detectChanges()

    // PrimeNG's Select exposes autofocus as an @Input (NOT a host DOM attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the Select component instance.
    const pSelect = fixture.debugElement.query(By.css('p-select'))
    expect(pSelect).toBeTruthy()
    const select = pSelect.componentInstance as Select
    expect(select.autofocus).toBe(false)
  })
```

Full resulting spec file content:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { Select } from 'primeng/select'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), TooltipModule, OcxTooltipDirective],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should NOT autofocus the data list grid sorting p-select when rendered', () => {
    // The <p-select> renders unconditionally (no @if guard), so no columns input
    // is required for the host element to be present.
    fixture.detectChanges()

    // PrimeNG's Select exposes autofocus as an @Input (NOT a host DOM attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the Select component instance.
    const pSelect = fixture.debugElement.query(By.css('p-select'))
    expect(pSelect).toBeTruthy()
    const select = pSelect.componentInstance as Select
    expect(select.autofocus).toBe(false)
  })
})
```

- [ ] **Step 3: Run the spec and confirm both tests pass**

Run: `npx nx test angular-accelerator --testPathPattern=data-list-grid-sorting.component.spec.ts`
Expected: `Tests: 2 passed, 2 total` — `should create` and `should NOT autofocus the data list grid sorting p-select when rendered`.

- [ ] **Step 4: Confirm the test is meaningful by temporarily removing the attribute**

Temporarily delete the `autofocus="false"` line added in Task 1, then re-run:
`npx nx test angular-accelerator --testPathPattern=data-list-grid-sorting.component.spec.ts`
Expected: the `should NOT autofocus ...` test FAILS (`expected true to be false`), proving the test guards the fix. Then restore the `autofocus="false"` line and re-run to confirm green.

- [ ] **Step 5: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-list-grid-sorting/data-list-grid-sorting.component.spec.ts
git commit -m "test: assert data list grid sorting p-select does not autofocus"
```

## Verification Steps

Run from the repository root (`/tmp/github-runner-onecx-2/onecx-ai-workflows/onecx-ai-workflows/hybrid-orchestrator-work/.tmp-hybrid/repo-1/target-repo`):

1. **Targeted test (both tests green):**
   `npx nx test angular-accelerator --testPathPattern=data-list-grid-sorting.component.spec.ts`
   Expected: `Tests: 2 passed, 2 total`.

2. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator`
   Expected: `Tests:` summary shows no failures.

3. **Lint (template + modified spec):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors.

4. **Library build (template AOT type-check / compilation):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors (confirms `autofocus` is a valid `p-select` input and the template still compiles).

5. **Acceptance for the issue DoD:**
   - `data-list-grid-sorting.component.html` contains `autofocus="false"` on the `<p-select>` (the DoD's literal requirement).
   - `data-list-grid-sorting.component.spec.ts` contains the new autofocus assertion, it is green, and it fails (red) when the attribute is removed.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** `data-list-grid-sorting` is an internal sub-component rendered by `ocx-interactive-data-view` (see `interactive-data-view.component.html`); the public-facing docs live at `docs/modules/onecx-portal-ui-libs/pages/components/interactive-data-view/` and describe user-facing data-view/column behavior, not the internal keyboard-focus behavior of this child. There is no dedicated `.adoc` or public `.api.md` file for `data-list-grid-sorting`, and `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit messages (do not hand-edit it). Action: state in the PR description "No documentation change required — internal focus behavior of an internal sub-component; no public API doc to update and changelog is auto-generated."
- **Test — added (DoD item 2).** New spec test added to `data-list-grid-sorting.component.spec.ts`; satisfies the "tests added/updated" item.
- **Why `autofocus="false"` (static attribute) matches the DoD and the on-disk sibling:** the DoD explicitly says add `autofocus="false"`. The already-merged sibling `column-group-selection.component.html:5` uses the identical static attribute `autofocus="false"` and its spec (`column-group-selection.component.spec.ts:53`) asserts `expect(select.autofocus).toBe(false)`. PrimeNG's `Select` `autofocus` input is `booleanAttribute`-transformed, so the static `autofocus="false"` string coerces to boolean `false` — exactly what the spec asserts. (This differs from a *previous* draft plan for the sibling that used `[autofocus]="true"`; the reviewed/merged on-disk result — and the DoD for #513 — is `autofocus="false"`, which is what this plan implements.)
- **Why the assertion reads `componentInstance as Select` (not a DOM `getAttribute`):** `autofocus` on `p-select` is a PrimeNG `@Input`, not a native host attribute; querying the host's `componentInstance` and reading its `autofocus` property is the correct, deterministic assertion. This is copied verbatim from the proven `column-group-selection.component.spec.ts`.
- **No `columns` fixture data needed (unlike the sibling):** in `data-list-grid-sorting` the `<p-select>` is not wrapped in an `@if` guard, so it renders on the first `detectChanges()` with the default empty `columns = []`. `ngOnInit` iterates an empty array and `emitComponentStateChange()` simply emits to an (unsubscribed) `EventEmitter`, which is a no-op in the test.
- **Scope boundary (parent issue #510):** only the `p-select` in `data-list-grid-sorting.component.html` is in scope. Other `p-select` usages in the repo (e.g. `column-group-selection` — already fixed in #511) are out of scope and intentionally untouched.
- **Follow-up (out of scope for this change):** a Storybook story does not exist for `data-list-grid-sorting`. Not required to satisfy this issue's DoD; tracked only as a potential follow-up.
