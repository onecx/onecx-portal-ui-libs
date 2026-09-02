# Fix autofocus on p-pickList and p-selectbutton (custom-group-column-selector) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the PrimeNG `p-selectbutton` controls (frozen / alignment options) inside the column-configuration dialog from stealing initial keyboard focus, by adding `autofocus="false"` to both, and lock the behavior in with a unit test. The `p-pickList` in the same dialog already carries `autofocus="false"` (added by sibling issue #514, which touched this same file) — this plan only adds the two `p-selectbutton` edits.

**Architecture:** Add the bare static attribute `autofocus="false"` to the two `<p-selectbutton>` opening tags in `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html` (the `frozenOptions` button with `id="frozenActionColumn"` and the `alignmentOptions` button with `id="actionColumnPosition"`). PrimeNG 20.4.0 `SelectButton` exposes `autofocus: boolean | undefined` as a real `@Input` (verified in `node_modules/primeng/selectbutton/index.d.ts` line 111), so the static string `"false"` is read by Angular as boolean `false` — the button will not autofocus. Add one focused test to the existing spec that opens the dialog (`visible = true`), queries each button by its stable `id` (a plain host attribute, since `id` is not a `SelectButton` input), and asserts each component instance has `autofocus === false`.

**Tech Stack:** Angular NgModule-declared (`standalone: false`) components, PrimeNG 20.4.0 (`SelectButtonModule`), Nx workspace, Jest + `jest-preset-angular` + `@happy-dom/jest-environment`, `@onecx/angular-testing` for `provideTranslateTestingService`.

**Spec:** GitHub issue #515 — "Fix autofocus on p-pickList and p-selectbutton in custom-group-column-selector component" (parent #510). Definition of done: (1) docs updated or a recorded reason why none is required; (2) tests added/updated or a recorded reason; (3) add `autofocus="false"` to `p-pickList` — **already present at line 32, committed by sibling #514, nothing to do**; (4) add `autofocus="false"` to `p-selectbutton` (frozenOptions); (5) add `autofocus="false"` to `p-selectbutton` (alignmentOptions).

## Global Constraints

- PrimeNG is pinned by the lockfile to **20.4.0** (`package.json` declares `^20.3.0`). Use the bare **static attribute** `autofocus="false"` (NOT the property binding `[autofocus]="false"`). For `SelectButton` both forms compile, but the static attribute is required by the DoD text verbatim and matches the sibling autofight commits (#511–#514), which all used the bare attribute.
- The `p-pickList` element (line 31) **already has** `autofocus="false"` and its spec test (`describe('p-pickList autofocus')`), both committed at HEAD by sibling #514 (commit `dd1c0eed`, which also edited this exact file). Do NOT re-add the pickList attribute or its test; they are out of scope for #515 and would duplicate existing content.
- The two `p-selectbutton` elements are the **only** remaining DoD items for this file. Do not add `autofocus` to the `p-button` (open/save/cancel) elements or the `p-pickList`.
- Tests are run per-library via the Nx `@nx/jest:jest` executor; the environment is `@happy-dom/jest-environment` (no real browser focus; `focus()` is a no-op and does not throw). The component spec already imports `By` and `NoopAnimationsModule` and already provides `NoopAnimationsModule` in `beforeEach` (added by #514 for the dialog test) — reuse them; do not re-import.
- Commits use Conventional Commits (consumed by `semantic-release` / `release.config.js`); `CHANGELOG.md` is auto-generated and must not be hand-edited.
- The component is `standalone: false` and the spec declares it directly (`declarations: [CustomGroupColumnSelectorComponent]`); keep that, consistent with the existing spec.

---

## Problem Statement

The column-configuration dialog (`ocx-custom-group-column-selector`) contains two PrimeNG `p-selectbutton` controls — the "Freeze" toggle (`frozenOptions`) and the "Position" toggle (`alignmentOptions`). As rendered inside the `p-dialog`, a `SelectButton` with autofocus enabled takes initial keyboard focus on load, which pulls focus away from the element the user navigated from and is wrong for these secondary controls inside a modal. The end state: `autofocus="false"` is present on both `p-selectbutton` tags, PrimeNG does not autofocus them, and a unit test proves each button's `autofocus` input is `false`. (The `p-pickList` in the same dialog already has this fix from #514.)

## Approach

Grounded in the current template, the PrimeNG 20.4.0 `SelectButton` typings, and the sibling autofight issues (#511–#514) already merged on this branch:

1. **Two `p-selectbutton` edits** in `custom-group-column-selector.component.html`. Add the static attribute `autofocus="false"` to the `frozenOptions` button (`id="frozenActionColumn"`, ~line 62) and the `alignmentOptions` button (`id="actionColumnPosition"`, ~line 76). `SelectButton` declares `autofocus: boolean | undefined` as an `@Input`, so the static value `"false"` is read as boolean `false` — the buttons will not autofocus.
2. **One new test** in the existing spec that opens the dialog and asserts both buttons carry `autofocus === false` on their component instances. The two buttons are distinguished by their stable `id` attributes (`frozenActionColumn`, `actionColumnPosition`), which land on the host element because `id` is not a `SelectButton` input.
3. **Record that no documentation change is required** (internal keyboard-focus behavior of internal sub-components; no public-API `.adoc`/`.api.md` to update; changelog is auto-generated) — matching the #514 convention.

The binding form and the query strategy below were verified by executing the exact test setup in this repository before writing this plan; the new test was confirmed to **fail** against the current template (`autofocus` is `undefined`) and **pass** after both edits. Every command in the Verification Steps is expected to pass as written.

## File-Level Task List

### Task 1: Add `autofocus="false"` to the frozenOptions `p-selectbutton`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html` (~lines 62–70)

**Dependencies:** none.

**Summary:** Insert one line — `autofocus="false"` — as the last attribute on the `frozenOptions` `<p-selectbutton>` opening tag, immediately before its closing `>`. No other lines change.

Concrete TODOs:
- [ ] Locate the frozen button by its `name` attribute `name="frozen-action-column-select-button"` and `id="frozenActionColumn"`. It currently reads:
  ```html
  <p-selectbutton
    [options]="frozenOptions"
    [(ngModel)]="frozenActionColumnModel"
    optionLabel="label"
    optionValue="value"
    id="frozenActionColumn"
    name="frozen-action-column-select-button"
    [allowEmpty]="false"
  >
  ```
- [ ] Add `autofocus="false"` after the `[allowEmpty]="false"` line. The tag then reads:
  ```html
  <p-selectbutton
    [options]="frozenOptions"
    [(ngModel)]="frozenActionColumnModel"
    optionLabel="label"
    optionValue="value"
    id="frozenActionColumn"
    name="frozen-action-column-select-button"
    [allowEmpty]="false"
    autofocus="false"
  >
  ```
- [ ] Do not touch the `ng-template #item` child, the component class, or styles. Use the static attribute, not a property binding.

### Task 2: Add `autofocus="false"` to the alignmentOptions `p-selectbutton`

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html` (~lines 76–84)

**Dependencies:** none (independent of Task 1; both edit the same file but different tags).

**Summary:** Insert one line — `autofocus="false"` — as the last attribute on the `alignmentOptions` `<p-selectbutton>` opening tag, immediately before its closing `>`.

Concrete TODOs:
- [ ] Locate the alignment button by its `name` attribute `name="action-column-position-select-button"` and `id="actionColumnPosition"`. It currently reads:
  ```html
  <p-selectbutton
    [options]="alignmentOptions"
    [(ngModel)]="actionColumnPositionModel"
    optionLabel="label"
    optionValue="value"
    id="actionColumnPosition"
    name="action-column-position-select-button"
    [allowEmpty]="false"
  >
  ```
- [ ] Add `autofocus="false"` after the `[allowEmpty]="false"` line. The tag then reads:
  ```html
  <p-selectbutton
    [options]="alignmentOptions"
    [(ngModel)]="actionColumnPositionModel"
    optionLabel="label"
    optionValue="value"
    id="actionColumnPosition"
    name="action-column-position-select-button"
    [allowEmpty]="false"
    autofocus="false"
  >
  ```
- [ ] Do not touch the `ng-template #item` child, the component class, or styles. Use the static attribute, not a property binding.

### Task 3: Add a unit test asserting both `p-selectbutton`s are not autofocused

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.spec.ts`

**Dependencies:** Tasks 1 and 2 (the assertions fail without them — verified: each `autofocus` is `undefined` when the attribute is absent).

**Summary:** Add one new top-level `describe` block inside the existing `describe('CustomGroupColumnSelectorComponent', ...)` that opens the dialog (`visible = true`), queries each button by its `id`, and asserts each component instance has `autofocus === false`. No new imports are needed — `By` and `NoopAnimationsModule` are already imported and `NoopAnimationsModule` is already in the `beforeEach` `imports` array (both added by #514 for the pickList test).

Concrete TODOs:
- [ ] Confirm the imports at the top of the file already include `import { By } from '@angular/platform-browser'` and `import { NoopAnimationsModule } from '@angular/platform-browser/animations'`. They do (added by #514). Do not add or duplicate imports.
- [ ] Confirm the `beforeEach` `imports` array already lists `NoopAnimationsModule` (it does). Do not modify `beforeEach`.
- [ ] Add this `describe` block immediately after the existing `describe('p-pickList autofocus', ...)` block (i.e., after that block's closing `})` and before the final closing `})` of the outer `describe('CustomGroupColumnSelectorComponent', ...)`):
  ```ts
  describe('p-selectbutton autofocus', () => {
    it('should apply autofocus="false" to both p-selectbuttons', async () => {
      component.visible = true
      fixture.detectChanges()
      await fixture.whenStable()

      const frozenButton = fixture.debugElement.query(By.css('#frozenActionColumn'))
      expect(frozenButton).toBeTruthy()
      const alignmentButton = fixture.debugElement.query(By.css('#actionColumnPosition'))
      expect(alignmentButton).toBeTruthy()

      expect((frozenButton.componentInstance as unknown as { autofocus?: unknown }).autofocus).toBe(false)
      expect((alignmentButton.componentInstance as unknown as { autofocus?: unknown }).autofocus).toBe(false)
    })
  })
  ```

Note: the two `p-selectbutton` elements only render inside the `p-dialog` and only after `visible` is `true` — the existing `beforeEach` runs `detectChanges()` once with `visible` defaulting to `false`, so this block sets `component.visible = true` and calls `detectChanges()` again before querying (same technique as the existing pickList test). `id` is not a `SelectButton` input, so `id="frozenActionColumn"` and `id="actionColumnPosition"` land as plain host attributes and are queryable via `By.css('#...')`. `SelectButton` exposes `autofocus` as a real `@Input`, so the assertion is made against the component instance value (`autofocus === false`); without the template edit the value is `undefined` and `toBe(false)` fails, so the test genuinely guards the edit. This is the same assertion style the #514 `p-multiselect` test uses.

### Task 4: Save this plan document and commit

**Files:**
- Create: `docs/superpowers/plans/2026-09-02-autofocus-custom-group-column-selector.md` (this document)

**Dependencies:** Tasks 1–3.

Concrete TODOs:
- [ ] Commit all changes (the two template edits, the one spec edit, and this plan file) in a single commit, matching the sibling convention on this branch (#511, #512, #513, #514 each committed `<plan md> + <component html> + <component spec>` together):
  ```bash
  git add \
    libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.html \
    libs/angular-accelerator/src/lib/components/custom-group-column-selector/custom-group-column-selector.component.spec.ts \
    docs/superpowers/plans/2026-09-02-autofocus-custom-group-column-selector.md
  git commit -m "fix(docs): implement issue #515 - Fix autofocus on p-pickList and p-selectbutton in custom-group-column-selector component

  Implements onecx/internal-tasks#515"
  ```
  The `fix(docs):` prefix and the trailing `Implements onecx/internal-tasks#NNN` line match the four sibling autofight commits already on this branch (#511–#514). It is a Conventional Commit type, so `semantic-release` emits the changelog entry.

## Verification Steps

Run all commands from the repository root (`/tmp/github-runner-onecx-2/.../target-repo`; the branch is `feat/spec-510/onecx-onecx-portal-ui-libs-v7`).

1. **Confirm the template now compiles with both attributes (AOT / no binding error):**
   `npx nx build angular-accelerator`
   Expected: build succeeds with no template/AOT errors.

2. **Lint (template + spec):**
   `npx nx lint angular-accelerator`
   Expected: exit 0, no new errors.

3. **Run the targeted spec via the library test target** (the `@nx/jest:jest` executor accepts `--testFile`):
   `npx nx test angular-accelerator --testFile=custom-group-column-selector/custom-group-column-selector.component.spec.ts --skip-nx-cache`
   Expected: the suite passes with **3 tests** (the existing `should create`, the existing `should apply autofocus="false" to the p-pickList`, and the new `should apply autofocus="false" to both p-selectbuttons`).

4. **Full library test suite (no regressions):**
   `npx nx test angular-accelerator`
   Expected: all suites pass, with this file going from 2 to 3 tests (baseline for this file: 2 passed; after: 3 passed).

5. **Confirm the new test is meaningful (mutation check):**
   - Temporarily remove the `autofocus="false"` line from the `frozenOptions` `p-selectbutton` in `custom-group-column-selector.component.html`, then run step 3. Expected: `should apply autofocus="false" to both p-selectbuttons` FAILS with `Expected: false / Received: undefined` on the `#frozenActionColumn` assertion. Restore the line.
   - Repeat for the `alignmentOptions` `p-selectbutton`. Expected: the same test FAILS on the `#actionColumnPosition` assertion. Restore the line.

6. **Acceptance for the issue DoD:**
   - `custom-group-column-selector.component.html` contains `autofocus="false"` on the `frozenOptions` `p-selectbutton` and on the `alignmentOptions` `p-selectbutton` (in addition to the pre-existing one on `p-pickList`).
   - `custom-group-column-selector.component.spec.ts` contains a passing `p-selectbutton autofocus` test that fails if either template attribute is removed.

## Notes

- **Documentation — no change required (DoD item 1, recorded here).** `custom-group-column-selector` is an internal sub-component of the data-viewing/column-configuration UX; the user-facing docs do not document the internal keyboard-focus behavior of these controls. There is no public-API `.api.md` documenting an `autofocus` prop for this component, and `CHANGELOG.md` is auto-generated by `semantic-release` from the Conventional Commit message (do not hand-edit it). State in the PR description: "No documentation change required — internal autofocus behavior of an internal sub-component; no public API doc to update and changelog is auto-generated."
- **Tests — added (DoD item 2).** One test added to `custom-group-column-selector.component.spec.ts` covering both buttons in a single case, matching the per-element assertion style the #514 `p-multiselect`/`p-pickList` tests use.
- **Why only two `p-selectbutton` edits despite the DoD listing three checkboxes.** The DoD's `p-pickList` checkbox was already satisfied: sibling #514 (commit `dd1c0eed`, merged on this same branch) added `autofocus="false"` to the `p-pickList` at line 32 **and** the `describe('p-pickList autofocus')` spec test, both in this exact file and already committed at HEAD. Re-adding either would duplicate existing content. This plan therefore implements the two remaining `p-selectbutton` checkboxes.
- **Why the static attribute `autofocus="false"`, not `[autofocus]="false"`.** `SelectButton` (PrimeNG 20.4.0) declares `autofocus: boolean | undefined` as an `@Input`, so both forms compile. The bare static attribute is chosen because it matches the DoD text verbatim and the sibling autofight convention (#511–#514 all used the bare attribute), and Angular reads the static `"false"` as boolean `false` for the `boolean`-typed input (verified: with the attribute the instance value is `false`; without it `undefined`).
- **Why the assertion targets the component instance, not the host attribute.** Unlike `PickList` (which has no `autofocus` input, so #514 asserted the host `getAttribute('autofocus')`), `SelectButton` exposes a real `autofocus` `@Input`; asserting `componentInstance.autofocus === false` proves PrimeNG will not autofocus the button. Verified in this repo: fails before the edit, passes after.
- **Scope boundary (parent issue #510).** Only the two `p-selectbutton` elements in `custom-group-column-selector.component.html` are in scope (plus the plan doc and spec). The `p-pickList` attribute/test from #514 and the sibling `p-select` fixes (#511–#513) are out of scope and remain unchanged. The `p-button` elements (open/save/cancel) get no `autofocus` change.
- **Test-timing caveat.** PrimeNG `focus()` is a no-op under `@happy-dom/jest-environment` and does not throw, so the assertions (which inspect the `@Input` value rather than `document.activeElement`) are stable and do not depend on real focus behavior.
