## Problem Statement

The `p-select` dropdown in the `column-group-selection` component (used for column group selection in data tables) needs an `autofocus` attribute to automatically focus the dropdown when the component is rendered. This will improve keyboard accessibility and user experience by allowing users to immediately interact with the dropdown using keyboard navigation without needing to click or tab to it first.

The issue is straightforward: add the `autofocus` attribute to the `<p-select>` element in `column-group-selection.component.html`, similar to how it's already implemented in `dialog-footer.component.html` for the primary button.

## Approach

1. **Modify the HTML template** (`column-group-selection.component.html`) - Add the `autofocus` attribute to the `<p-select>` element.

2. **Update tests** (`column-group-selection.component.spec.ts`) - Add a test to verify the `autofocus` attribute is present on the p-select element.

3. **No documentation changes needed** - This is a simple accessibility enhancement that follows existing patterns in the codebase (similar to dialog-footer.component.html). The issue's "Definition of Done" states documentation should be updated "or the issue records why no documentation change is required" - since this follows existing patterns and is a simple attribute addition, no documentation update is needed.

4. **Run tests** - Execute the existing tests to verify nothing breaks, and verify the new test passes.

## File-Level Task List

### 1. Modify: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.html`
- **Action**: Add `autofocus` attribute to the `<p-select>` element
- **Summary**: Add the `autofocus` attribute to enable automatic focus on the dropdown when rendered
- **Concrete TODOs**:
  - [ ] Locate the `<p-select>` element (line 3-15)
  - [ ] Add `autofocus` attribute to the p-select element

### 2. Modify: `libs/angular-accelerator/src/lib/components/column-group-selection/column-group-selection.component.spec.ts`
- **Action**: Add test to verify autofocus attribute is present on p-select
- **Summary**: Add a test case that verifies the p-select element has the autofocus attribute
- **Concrete TODOs**:
  - [ ] Add a new test in a `describe` block for the template rendering
  - [ ] Create component with inputs that ensure allGroupKeys has values
  - [ ] Detect changes to render the template
  - [ ] Query for the p-select element and verify it has autofocus attribute

### 3. Verification: Run tests and lint
- **Action**: Execute test and lint tasks to verify implementation
- **Concrete TODOs**:
  - [ ] Run `nx affected test (current work)` to run tests for the modified component
  - [ ] Run `nx affected lint (current work)` to ensure no linting errors
  - [ ] Verify all existing tests pass and new test passes

## Verification Steps

1. **Run component tests**:
   ```
   nx test angular-accelerator -- --testPathPattern="column-group-selection.component.spec.ts"
   ```

2. **Run lint check**:
   ```
   nx lint angular-accelerator -- --testPathPattern="column-group-selection"
   ```

3. **Verify all existing tests pass** - The existing 19 tests in the spec file should continue to pass.

4. **Verify new test passes** - The new test for autofocus attribute should pass.

5. **Manual verification** (optional): 
   - Build the library: `nx build angular-accelerator`
   - Check that the compiled template includes the autofocus attribute

## Notes

- **No documentation update required**: This change follows the existing pattern established in `dialog-footer.component.html` where `autofocus` is used on the primary button. It's a simple accessibility enhancement that doesn't change the component's public API or behavior.
- **No harness update needed**: The harness (`column-group-selection.harness.ts`) only locates the PSelectHarness and doesn't need to verify autofocus.
- **Dependencies**: None - this is a standalone change to a single component.
- **Risk level**: Low - adding a single boolean attribute to an existing element. No logic changes, no API changes, no breaking changes.