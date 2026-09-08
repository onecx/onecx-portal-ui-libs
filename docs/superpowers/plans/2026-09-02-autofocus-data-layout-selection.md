# Autofocus on data-layout-selection p-selectbutton — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the layout-toggle `p-selectbutton` in `data-layout-selection` from taking keyboard focus when it renders, by setting its PrimeNG `autofocus` input to `false`, and lock that in with a unit test.

**Architecture:** Add the static `autofocus="false"` attribute to the `<p-selectbutton>` host in `data-layout-selection.component.html`, matching the already-merged sibling fixes for the same PrimeNG `p-selectbutton`/`p-select` pattern (e.g. `diagram.component.html:11`, `custom-group-column-selector.component.html:70`). Upgrade the minimal `data-layout-selection.component.spec.ts` TestBed so it can actually render the `p-selectbutton` (it is behind an `@if (viewingLayouts.length > 1)` guard, so the spec must supply `supportedViewLayouts` and re-run `ngOnInit`), then add one new spec that asserts the rendered `p-selectbutton`'s `autofocus` input is `false`, mirroring `diagram.component.spec.ts:154-165` in technique.

**Tech Stack:** Angular 19 non-standalone (NgModule-declared) component, PrimeNG 20.4.0 (`p-selectbutton` / `p-tooltip`), Nx workspace (`@nx/jest` executor), Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for the translate testing service.

**Spec:** GitHub issue #517 — "Fix autofocus on p-selectbutton in data-layout-selection component". Definition of done: (1) docs updated or a recorded reason why none is needed; (2) tests added/updated or a recorded reason; (3) add `autofocus="false"` to the `p-selectbutton` in `data-layout-selection.component.html`.

## Global Constraints

- PrimeNG version is pinned by the lockfile to **20.4.0** (`package.json` declares `^20.3.0`). Use the lowercase `autofocus` input on the `p-selectbutton`. The repo's own on-disk precedent for this exact fix uses the static attribute `autofocus="false"` (`libs/angular-accelerator/src/lib/components/diagram/diagram.component.html:11`, `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html:70`).
- The DoD requires `autofocus="false"` (disable autofocus). PrimeNG's `SelectButton` autofocuses its first button on view init by default; setting the `autofocus` input to `false` turns that off. Do NOT add `[autofocus]="true"`.
- The `<p-selectbutton>` in `data-layout-selection.component.html` is rendered **conditionally** — it is inside `@if (viewingLayouts.length > 1) { ... }` (template line 2). `viewingLayouts` is populated in `ngOnInit` from the `@Input() supportedViewLayouts` field. The spec must supply at least two supported layouts and re-run `ngOnInit` before `detectChanges()` so the `p-selectbutton` host actually exists in the DOM for the assertion.
- `DataLayoutSelectionComponent` is `standalone: false`, declared and exported in `libs/angular-accelerator/src/lib/angular-accelerator.module.ts`. Specs in this library declare the component directly (`declarations: [...]`) and import `AngularAcceleratorPrimeNgModule` (which exports `SelectButtonModule`) — matching `diagram.component.spec.ts` and `custom-group-column-selector.component.spec.ts`.
- `autofocus` on `p-selectbutton` is a PrimeNG `@Input` (NOT a native host DOM attribute) with a `booleanAttribute` transform. The correct assertion reads the host's `componentInstance.autofocus` and expects the boolean `false` — this is copied verbatim from `diagram.component.spec.ts:164`. Do NOT assert `nativeElement.getAttribute('autofocus')` (that is the `p-pickList` pattern in `custom-group-column-selector.component.spec.ts:49` and does not apply to `p-selectbutton`).
- Tests run per-library via the Nx `@nx/jest:jest` executor (project name `angular-accelerator`); the test environment is `@happy-dom/jest-environment` (no real browser focus).
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); `CHANGELOG.md` is auto-generated and must not be hand-edited.

---

## Problem Statement

The layout-toggle (`<p-selectbutton>`) inside `ocx-data-layout-selection` — an internal child of `ocx-interactive-data-view` — grabs keyboard focus on the first toggle button when it renders because PrimeNG's `SelectButton` component autofocuses by default. In a data grid this steals focus from the grid on render, breaking keyboard navigation and screen-reader flow. The end state: the `p-selectbutton` does **not** autofocus on render (`autofocus` input set to `false`), and a unit test proves the `autofocus` input is bound to `false`.

## Approach

Grounded in the template, the on-disk sibling fixes, and the repo's conventions:

1. `data-layout-selection.component.html` (lines 3–13) declares a `<p-selectbutton>` that binds `options`, `ngModel`, `optionLabel`, and `onChange` but sets no `autofocus`. PrimeNG `SelectButton` therefore autofocuses on view init. Add the static `autofocus="false"` attribute to the `<p-selectbutton>` opening tag — exactly how the already-merged sibling `diagram.component.html:11` (also a `p-selectbutton`) and `custom-group-column-selector.component.html:70` disable it. PrimeNG's `SelectButton` `autofocus` input uses a `booleanAttribute` transform, so the static `autofocus="false"` string is coerced to the boolean `false`.
2. `data-layout-selection.component.spec.ts` currently has only a `should create` test and a **minimal** TestBed (`declarations` only, no `imports`). It passes today only because the template renders nothing (no `supportedViewLayouts` → empty `viewingLayouts` → the `@if` guard is false, so the `p-selectbutton`, the `translate` pipe, and the `ocxTooltip` directive are never instantiated). To assert on the `p-selectbutton` we must make it render: upgrade the `beforeEach` to import `FormsModule`, `TranslateModule.forRoot()`, `TooltipModule`, `OcxTooltipDirective`, `NoopAnimationsModule`, and `AngularAcceleratorPrimeNgModule` (exporting `SelectButtonModule`), and add `provideTranslateTestingService({})`. Then add one new test, `should apply autofocus="false" to the data view layout p-selectbutton`, that sets `supportedViewLayouts` to three layouts, re-runs `ngOnInit` to repopulate `viewingLayouts`, calls `detectChanges()`, queries the single `p-selectbutton` host via `By.css('p-selectbutton')`, and asserts `componentInstance.autofocus === false` — mirroring `diagram.component.spec.ts:154-165`.
3. Record that no documentation change is required (internal focus behavior of an internal sub-component; no public API doc to update; changelog is auto-generated).

## File-Level Task List

### Task 1: Add `autofocus="false"` to the `p-selectbutton`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.html:3-13`

**Interfaces:**
- Consumes: PrimeNG 20.x `SelectButton` `autofocus` input (`boolean`, `booleanAttribute`-transformed), provided by `SelectButtonModule` which `AngularAcceleratorPrimeNgModule` imports and exports (`libs/angular-accelerator/src/lib/angular-accelerator-primeng.module.ts:34,47,58,71`).
- Produces: the `<p-selectbutton>` host renders with the `autofocus` input bound to `false`; PrimeNG does not focus the first toggle button on view init.

**Dependencies:** none.

**Concrete TODOs:**
- [ ] Insert the single line `autofocus="false"` into the `<p-selectbutton>` opening tag.
- [ ] Verify the template is well-formed (balanced tag, no lint errors).
- [ ] Commit.

- [ ] **Step 1: Add the `autofocus="false"` attribute to the `<p-selectbutton>`**

Edit `libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.html`. Insert the line `autofocus="false"` immediately after the `optionLabel="id"` line so the `p-selectbutton` opening tag reads exactly:

```html
  @if (viewingLayouts.length > 1) {
    <p-selectbutton
      [options]="viewingLayouts"
      [(ngModel)]="selectedViewLayout"
      optionLabel="id"
      autofocus="false"
      (onChange)="onDataViewLayoutChange($event.value)"
      >
      <ng-template #item let-item>
        <i [class]="item.icon" [ocxTooltip]="item.tooltipKey | translate" tooltipPosition="top"></i>
        <label style="display: none" id="{{item.id}}">{{item.labelKey | translate}}</label>
      </ng-template>
    </p-selectbutton>
  }
```

No other lines in this file change. The `<ng-template>` children, the `</p-selectbutton>` close, the wrapping `@if`, and the outer `<div class="flex ...">` are all untouched. The component class (`.ts`) and styles (`.scss`) are untouched. Do **not** add a `name` attribute — the DoD only requires `autofocus="false"`, and there is exactly one `p-selectbutton` in this template (unlike `diagram`, which has a `name` to disambiguate).

- [ ] **Step 2: Verify the template is well-formed**

Run: `npx nx lint angular-accelerator`
Expected: exit 0, no new lint errors; the `p-selectbutton` tag still parses (balanced `<p-selectbutton ...>` ... `</p-selectbutton>`).

- [ ] **Step 3: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.html
git commit -m "fix: disable autofocus on data layout selection p-selectbutton"
```

### Task 2: Add the unit spec asserting the `p-selectbutton` does not autofocus

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.spec.ts`

**Interfaces:**
- Consumes: `DataLayoutSelectionComponent` (`./data-layout-selection.component`), `AngularAcceleratorPrimeNgModule` (`../../angular-accelerator-primeng.module`, exports `SelectButtonModule`), `provideTranslateTestingService` from `@onecx/angular-testing`, `OcxTooltipDirective` (`../../directives/tooltip.directive`), PrimeNG `TooltipModule` (`primeng/tooltip`), `FormsModule` (`@angular/forms`, for `ngModel`), `TranslateModule.forRoot()` (`@ngx-translate/core`, for the `translate` pipe), `NoopAnimationsModule` (`@angular/platform-browser/animations`), and `By` (`@angular/platform-browser`, for the host query).
- Produces: a passing Jest suite proving (a) the component creates and (b) the rendered `p-selectbutton` host has `autofocus === false`.

**Dependencies:** Task 1 (the `autofocus === false` assertion only passes once the `autofocus="false"` attribute is present).

**Concrete TODOs:**
- [ ] Add the new imports (`By`, `FormsModule`, `TranslateModule`, `provideTranslateTestingService`, `AngularAcceleratorPrimeNgModule`, `TooltipModule`, `OcxTooltipDirective`, `NoopAnimationsModule`).
- [ ] Upgrade the `beforeEach` TestBed config with the `imports` and `providers` arrays so the `p-selectbutton` can render.
- [ ] Add the new `should apply autofocus="false" ...` test.
- [ ] Run the spec and confirm both tests pass.
- [ ] Confirm the test is meaningful by temporarily removing the attribute (red), then restore (green).
- [ ] Commit.

- [ ] **Step 1: Rewrite the spec file with the upgraded TestBed and the new test**

Replace the entire content of `libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.spec.ts` with exactly:

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { TooltipModule } from 'primeng/tooltip'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      imports: [NoopAnimationsModule, FormsModule, AngularAcceleratorPrimeNgModule, TranslateModule.forRoot(), TooltipModule, OcxTooltipDirective],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should apply autofocus="false" to the data view layout p-selectbutton', async () => {
    // The <p-selectbutton> only renders when viewingLayouts.length > 1, and
    // viewingLayouts is populated in ngOnInit from supportedViewLayouts. Supply
    // three supported layouts and re-run ngOnInit so the host element exists.
    component.supportedViewLayouts = ['list', 'grid', 'table']
    component.ngOnInit()
    fixture.detectChanges()
    await fixture.whenStable()

    // PrimeNG's SelectButton exposes autofocus as an @Input (NOT a host attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the SelectButton component instance.
    const pSelectButton = fixture.debugElement.query(By.css('p-selectbutton'))
    expect(pSelectButton).toBeTruthy()
    expect((pSelectButton.componentInstance as unknown as { autofocus?: unknown }).autofocus).toBe(false)
  })
})
```

Rationale for the diff from the original file:
- The original `beforeEach` had **no** `imports`/`providers`. It is replaced with the import set above (identical shape to `diagram.component.spec.ts:46` and `custom-group-column-selector.component.spec.ts:20-29`) so the conditionally-rendered `p-selectbutton`, its `ngModel`, the `translate` pipe, and the `ocxTooltip` directive all resolve. `provideTranslateTestingService({})` is the lighter variant used by `custom-group-column-selector.component.spec.ts:29` (this component makes no HTTP calls, so the HTTP providers from `diagram.component.spec.ts` are omitted).
- The new test sets `supportedViewLayouts` (a plain public `@Input()` field on the component, `data-layout-selection.component.ts:51`) then calls `component.ngOnInit()` again because `viewingLayouts` is computed in `ngOnInit` (`data-layout-selection.component.ts:66-67`), not in a setter/`ngOnChanges` (which is why this differs from the `diagram` spec). Re-calling `ngOnInit` is safe: it only reassigns `viewingLayouts` and emits to an unsubscribed `EventEmitter`.
- The assertion is copied verbatim in technique from `diagram.component.spec.ts:162-164` (query host, cast `componentInstance` inline to `{ autofocus?: unknown }`, expect boolean `false`). No `SelectButton` type import is needed, and no `name` CSS filter is needed because there is a single `p-selectbutton`.

- [ ] **Step 2: Run the spec and confirm both tests pass**

Run: `npx nx test angular-accelerator --testPathPattern=data-layout-selection.component.spec.ts`
Expected: `Tests: 2 passed, 2 total` — `should create` and `should apply autofocus="false" to the data view layout p-selectbutton`.

- [ ] **Step 3: Confirm the test is meaningful by temporarily removing the attribute**

Temporarily delete the `autofocus="false"` line added in Task 1, then re-run:
`npx nx test angular-accelerator --testPathPattern=data-layout-selection.component.spec.ts`
Expected: the `should apply autofocus="false" ...` test FAILS (`expected true to be false`), proving the test guards the fix. Then restore the `autofocus="false"` line and re-run to confirm green.

- [ ] **Step 4: Commit**

```bash
git add libs/angular-accelerator/src/lib/components/data-layout-selection/data-layout-selection.component.spec.ts
git commit -m "test: assert data layout selection p-selectbutton does not autofocus"
```

## Verification Steps

Run from the repository root (`/tmp/github-runner-onecx-2/onecx-ai-workflows/onecx-ai-workflows/hybrid-orchestrator-work/.tmp-hybrid/repo-1/target-repo`):

1. **Targeted test (both tests green):**
   `npx nx test angular-accelerator --testPathPattern=data-layout-selection.component.spec.ts`
   Expected: `Tests: 2 passed, 2 total`.

2. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator`
   Expected: `Test Suites: ... passed` and `Tests: ... passed` with 0 failures (baseline before this change is `Tests: 410 passed` across the affected suites; the new spec adds one test).

3. **Lint (template + modified spec):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors.

4. **Library build (template AOT type-check / compilation):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors (confirms `autofocus` is a valid `p-selectbutton` input and the template still compiles).

5. **Acceptance for the issue DoD:**
   - `data-layout-selection.component.html` contains `autofocus="false"` on the `<p-selectbutton>` (the DoD's literal requirement).
   - `data-layout-selection.component.spec.ts` contains the new autofocus assertion, it is green, and it fails (red) when the attribute is removed.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** `data-layout-selection` is an internal sub-component rendered by `ocx-interactive-data-view` (see `libs/angular-accelerator/src/lib/components/interactive-data-view/interactive-data-view.component.html`); the public-facing docs describe user-facing data-view/layout behavior, not the internal keyboard-focus behavior of this child. There is no dedicated `.adoc` or public `.api.md` file for `data-layout-selection`, and `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit messages (do not hand-edit it). Action: state in the PR description "No documentation change required — internal focus behavior of an internal sub-component; no public API doc to update and changelog is auto-generated."
- **Test — added (DoD item 2).** New spec test added to `data-layout-selection.component.spec.ts` (plus the minimal TestBed upgrade needed to render the guarded `p-selectbutton`); satisfies the "tests added/updated" item.
- **Why `autofocus="false"` (static attribute) matches the DoD and the on-disk siblings:** the DoD explicitly says add `autofocus="false"`. The already-merged siblings `diagram.component.html:11` and `custom-group-column-selector.component.html:70` use the identical static attribute on `p-selectbutton`, and `diagram.component.spec.ts:164` asserts `expect((pSelectButton.componentInstance as ...).autofocus).toBe(false)`. PrimeNG's `SelectButton` `autofocus` input is `booleanAttribute`-transformed, so the static `autofocus="false"` string coerces to boolean `false` — exactly what the spec asserts.
- **Why the assertion reads `componentInstance as { autofocus?: unknown }` (not a DOM `getAttribute`):** `autofocus` on `p-selectbutton` is a PrimeNG `@Input`, not a native host attribute. Querying the host's `componentInstance` and reading its `autofocus` property is the correct, deterministic assertion — copied verbatim from `diagram.component.spec.ts:164`. (The `nativeElement.getAttribute('autofocus')` pattern at `custom-group-column-selector.component.spec.ts:49` is for `p-pickList`, a different PrimeNG component, and must NOT be used here.)
- **Why the spec must re-run `ngOnInit`:** `DataLayoutSelectionComponent` computes `viewingLayouts` in `ngOnInit` from the `@Input() supportedViewLayouts` field (a plain field, not a `@Input` setter, and the component does not implement `ngOnChanges`). The shared `beforeEach` already runs `ngOnInit` once with the default empty `supportedViewLayouts`, so the new test sets `supportedViewLayouts` to `['list', 'grid', 'table']` and calls `component.ngOnInit()` again to repopulate `viewingLayouts` (3 items > 1) before `detectChanges()`. Re-invoking `ngOnInit` is safe (idempotent reassignment + emit to an unsubscribed `EventEmitter`).
- **Scope boundary (parent issue #510):** only the `p-selectbutton` in `data-layout-selection.component.html` is in scope. The other `p-selectbutton` usages in the repo (`diagram`, `custom-group-column-selector`) are already fixed and are out of scope and intentionally untouched.
- **Follow-up (out of scope for this change):** the `DataLayoutSelectionHarness` in `libs/angular-accelerator/testing/data-layout-selection.harness.ts` uses `PToggleButtonHarness` locators and does not assert on `autofocus`; no harness change is required for this issue.
