# Dialog Theme Schema Audit

Date: 2026-09-14
Component: dialog

## Canonical Baseline Used

- Variants: defaultVariant, primary, secondary, tertiary, quaternary, quinary
- States: defaultState, hover, active, selected, focus, invalid, disabled
- Severities: defaultSeverity, success, info, warning, danger, contrast

## Step 4: Confirmed Rough Schema

- dialog (top-level)
  - settings
    - dependency: nothing
    - classification: specific
    - fields:
      - closable
      - closeOnEscape
      - autoZIndex
      - baseZIndex
      - blockScroll
      - minX
      - minY
      - focusOnShow
      - focusTrap
      - closeIcon
      - closeAriaLabel
      - minimizeIcon
      - maximizeIcon
      - draggable
      - dismissableMask
      - modal
      - maximizable
      - resizable
  - root
    - dependency: nothing
    - classification: specific
    - fields:
      - bg
      - contrast
      - border
      - radius
      - shadow
  - header
    - dependency: nothing
    - classification: specific
    - fields:
      - padding
      - gap
      - alignItems
      - justifyContent
  - title
    - dependency: nothing
    - classification: specific
    - fields:
      - fontSize
      - fontWeight
  - content
    - dependency: nothing
    - classification: specific
    - fields:
      - padding
  - footer
    - dependency: nothing
    - classification: specific
    - fields:
      - padding
      - gap
      - justifyContent

Notes:
- PrimeNG also has mask/headerActions/maximizeButton/closeButton structural elements.
- They are intentionally not modeled as usage tokens in this run because current OneCX dialog mapping rules only consume root/header/title/content/footer.

## Step 5: Gap List vs Actual Schema Before Refactor

1. Shape/defaults separation mismatch
- Existing dialog schema used `.default(...)` directly in shape definitions.
- Required convention is pure optional shape plus external defaults tree via `applyDefaultsRecursive`.

2. Missing top-level defaults export
- Existing file exposed only schema objects with baked defaults.
- Step 10 requires explicit `<component>Defaults` export for shape/default parity test.

3. Spec structure mismatch
- Existing spec had many nested tests and helper assertions.
- Required structure is exactly 3 tests at top-level component:
  - parse success
  - full `parse({})` snapshot
  - `expectDefaultsMatchShape(component, componentDefaults)`

4. No structural dependency mismatch for selected nodes
- Confirmed nodes root/header/title/content/footer are currently dependency `nothing` and stay as such.

## Step 6: Applied Structural Changes

- Refactored dialog schema to:
  - `dialogShape` (pure optional shape)
  - `dialogDefaults` (plain defaults tree)
  - `dialog` assembled with `applyDefaultsRecursive(dialogShape, dialogDefaults)`
- Kept `dialogSettings` as optional settings node (no defaults), unchanged semantically.
- Kept field set and token references aligned with existing mapping usage.

## Step 7: Default-Value Decisions

### Mandatory baseline defaults

Since dialog nodes in this run are modeled without variant/state/severity wrappers, each node baseline is the node root itself.

| Node | Token | Default |
| --- | --- | --- |
| root | bg | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` |
| root | contrast | `{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}` |
| root | border.color | `{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}` |
| root | border.style | `{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}` |
| root | border.width | `{{primitives.border.width.none}}` |
| root | border.radius | `{{primitives.border.radius.md}}` |
| root | border.offset | `{{primitives.border.offset.none}}` |
| root | radius | `{{primitives.radius.md}}` |
| root | shadow | `{{primitives.shadow.md}}` |
| header | padding | `{{primitives.space.md}}` |
| header | gap | `{{primitives.space.sm}}` |
| header | alignItems | `center` |
| header | justifyContent | `space-between` |
| title | fontSize | `{{primitives.font.size}}` |
| title | fontWeight | `{{primitives.font.weight}}` |
| content | padding | `{{primitives.space.md}}` |
| footer | padding | `{{primitives.space.md}}` |
| footer | gap | `{{primitives.space.sm}}` |
| footer | justifyContent | `flex-end` |

### Optional additional defaults

- No extra defaults beyond the baseline set were added.
- `settings` remains intentionally default-less and optional.

## Step 8: Implementation Notes

Updated schema code:
- `libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.ts`

Important process note:
- During Step 8, test/spec files were intentionally left unchanged as required.
- Test updates were performed only in Step 10.

## Step 10: Testing

Updated/replaced spec files:
- Replaced: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.spec.ts`
- Snapshot regenerated: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/dialog.spec.ts.snap`
- Removed legacy top-level facade spec: none (not present)

New dialog spec shape:
- parses an empty object
- resolves expected default token tree snapshot from full `dialog.parse({})`
- verifies shape/default parity with `expectDefaultsMatchShape(dialog, dialogDefaults)`

Execution results:
- Targeted dialog test with snapshot update passed:
  - `CI=false npx nx test integration-interface --no-interactive --testFile=libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.spec.ts -u`
  - 3 tests passed, 1 snapshot written
- Full `nx test integration-interface` currently does not pass due pre-existing failures outside dialog scope (`dataview.spec.ts`, `message.spec.ts`, `interactive-data-view.spec.ts`).

## Summary of Applied Changes

- Converted dialog schema to shape/defaults separation pattern.
- Added explicit `dialogShape` and `dialogDefaults` exports.
- Kept existing dialog token surface (no new usage nodes).
- Replaced dialog spec with the required 3-test top-level format.
- Regenerated dialog snapshot from the new spec.
