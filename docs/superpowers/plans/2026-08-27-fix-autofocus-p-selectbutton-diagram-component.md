# Fix Autofocus on p-selectbutton in Diagram Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `autofocus="false"` to the `p-selectbutton` component in the diagram component HTML template to fix unwanted autofocus behavior on the diagram type selection buttons.

**Architecture:** This is a simple, single-file fix in the Angular component template. The issue is that PrimeNG's `p-selectbutton` component by default applies autofocus to the first button in the group, which can cause unwanted focus behavior when the diagram component renders. Adding `autofocus="false"` to the `p-selectbutton` will disable this behavior.

**Tech Stack:** Angular 20, PrimeNG 20, TypeScript, Jest for testing

**Spec:** GitHub Issue #516 - Fix autofocus on p-selectbutton in diagram component

## Global Constraints

- Follow Angular best practices (standalone components, signals, modern control flow)
- Use PrimeNG components with proper attributes
- Maintain 100% test coverage for new code (existing code: aim for 80%+)
- Follow existing code style and patterns in the angular-accelerator library
- Run tests using `nx affected test (current work)` task
- Run linting using `nx affected lint (current work)` task

---

## File-Level Task List

### Task 1: Add autofocus="false" to p-selectbutton in diagram.component.html

**Files:**
- Modify: `libs/angular-accelerator/src/lib/components/diagram/diagram.component.html` (lines 12-22)

**Summary:** Add `autofocus="false"` attribute to the `p-selectbutton` element to disable the default autofocus behavior on the first select button option.

**Concrete TODOs:**
- [ ] Open `libs/angular-accelerator/src/lib/components/diagram/diagram.component.html`
- [ ] Locate the `p-selectbutton` element at line 14
- [ ] Add `autofocus="false"` attribute to the `p-selectbutton` element
- [ ] Save the file

**Dependencies:** None

---

### Task 2: Run existing tests to verify the fix doesn't break anything

**Files:**
- Test: `libs/angular-accelerator/src/lib/components/diagram/diagram.component.spec.ts`
- Test harness: `libs/angular-accelerator/testing/diagram.harness.ts`

**Summary:** Run the existing diagram component tests to verify that adding `autofocus="false"` doesn't break any existing functionality or tests.

**Concrete TODOs:**
- [ ] Run tests for the diagram component: `npx nx test angular-accelerator --testFile="**/diagram.component.spec.ts"`
- [ ] Verify all existing tests pass
- [ ] Check test coverage report

**Dependencies:** Task 1 must complete first

---

### Task 3: Verify accessibility and functionality with harness test

**Files:**
- Test harness: `libs/angular-accelerator/testing/diagram.harness.ts`

**Summary:** Verify the diagram harness can still interact with the select button properly after adding `autofocus="false"`. The harness uses `getDiagramTypeSelectButton()` and `getAllSelectionButtons()` which should still work correctly.

**Concrete TODOs:**
- [ ] Review the diagram harness to confirm it locates the select button by name attribute (`diagram-type-select-button`)
- [ ] Verify the harness methods will still work with `autofocus="false"` added
- [ ] Run the full test suite for the angular-accelerator library to ensure no regressions

**Dependencies:** Task 2 must complete first

---

### Task 4: Run linting and build to verify no issues

**Files:** None (verification step)

**Summary:** Run linting and build tasks to ensure the change doesn't introduce any linting errors or build failures.

**Concrete TODOs:**
- [ ] Run lint: `npx nx lint angular-accelerator`
- [ ] Run build: `npx nx build angular-accelerator`
- [ ] Verify both complete successfully

**Dependencies:** Task 3 must complete first

---

## Verification Steps

### Automated Verification

1. **Run diagram component tests:**
   ```bash
   npx nx test angular-accelerator --testFile="**/diagram.component.spec.ts"
   ```
   Expected: All tests pass

2. **Run full angular-accelerator test suite:**
   ```bash
   npx nx test angular-accelerator
   ```
   Expected: All tests pass, coverage maintained

3. **Run linting:**
   ```bash
   npx nx lint angular-accelerator
   ```
   Expected: No lint errors

4. **Run build:**
   ```bash
   npx nx build angular-accelerator
   ```
   Expected: Build succeeds

### Manual Verification (if needed)

1. Open the diagram component in a test application or Storybook
2. Verify the diagram type select buttons do not steal focus on initial render
3. Verify keyboard navigation still works correctly on the select buttons
4. Verify screen reader accessibility is maintained

---

## Notes

- **Risk Level:** Very Low - This is a single attribute addition to disable default PrimeNG behavior
- **No documentation changes needed** - This is a bug fix for unwanted autofocus behavior, not a new feature
- **No test changes needed** - The existing tests should continue to pass as the harness locates elements by name attribute, not by autofocus behavior
- **PrimeNG p-selectbutton autofocus behavior:** By default, PrimeNG's `p-selectbutton` applies autofocus to the first button in the group. Setting `autofocus="false"` disables this behavior, which is the desired fix for the diagram component where the select buttons should not steal focus on initial render.

---

## Acceptance Criteria (from Issue Definition of Done)

- [ ] Documentation is updated according to the affected repository's conventions, or the issue records why no documentation change is required → **No documentation change required** (bug fix only)
- [ ] Tests are added or updated according to the affected repository's standards, or the issue records why no test change is required → **No test changes required** (existing tests cover the functionality)
- [ ] Add autofocus="false" to p-selectbutton in diagram.component.html → **Task 1**