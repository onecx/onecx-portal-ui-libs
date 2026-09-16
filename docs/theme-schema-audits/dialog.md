# Dialog Theme Schema Audit

Date: 2026-09-15
Component: dialog

Supersedes the 2026-09-14 revision (which restructured the file only). This
run adds action-button and close-button placeholder children, keeps the schema
as a single file (`schema/dialog.ts`) for readability, and narrows the
`settings` block from 18 unconsumed behavioural pass-throughs to 5 curated
behavioural flags that default to PrimeNG's own `p-dialog` values (see Steps 3,
4, and 7).

## Canonical Baseline Used

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Not used by dialog: PrimeNG's `p-dialog` has no built-in variant/state/severity
system of its own — every child is dependency `nothing`.

## Consumer Surface (for scoping)

Verified against `libs/angular-utils/theme/primeng/src/utils/mapper/`:

- `mapping-rules/usages/dialog.rules.ts` reads:
  `usages.dialog.root.{bg,border.color,contrast,radius,shadow}`,
  `usages.dialog.header.{padding,gap}`,
  `usages.dialog.title.{fontSize,fontWeight}`,
  `usages.dialog.content.padding`,
  `usages.dialog.footer.{padding,gap}`.
- `css-rules/usages/dialog.rules.ts` additionally reads:
  `usages.dialog.header.{alignItems,justifyContent}`,
  `usages.dialog.footer.justifyContent`,
  and pulls the mask's background directly from `primitives.area.overlay.…bg`.

No consumer references the new `closeButton` / `primaryActionButton` /
`secondaryActionButton` slots today. They are intentional placeholders — see
Step 3.

## Step 1: Children

Real usage cross-checked against `p-dialog` in
`libs/angular-accelerator/src/lib/components/custom-group-column-selector/`,
which shows the concrete `.p-dialog-header > .p-dialog-close-button` pattern
plus footer templates rendering two `p-button`s (`cancelButton` +
`saveButton`).

```
dialog
├── settings                       (curated behavioural flags, default to p-dialog values)
├── root                           (visual box)
├── header                         (layout)
│   └── closeButton                (icon-button placeholder)
├── title                          (typography)
├── content                        (padding)
└── footer                         (layout)
    ├── primaryActionButton        (button placeholder — save/apply role)
    └── secondaryActionButton      (button placeholder — cancel role)
```

`settings` is the one non-visual child: a small curated set of `p-dialog`
behavioural flags a designer plausibly tunes per usage (`closable`, `modal`,
`draggable`, `resizable`, `dismissableMask`). The rest of PrimeNG's `p-dialog`
inputs (icons, z-index, focus, positioning, `minX`/`minY`) are component
wiring, not theming, and are intentionally not modelled — see Step 3.

Not modelled this run: `mask`, `headerActions`, `maximizeButton`,
`minimizeButton`. The mask is themed globally via `primitives.area.overlay`
(no per-dialog override needed). The others aren't referenced by any consumer
today.

## Step 2: Dependencies

All children resolve to dependency `nothing`. The dialog has no built-in
variant/state/severity axis in PrimeNG, and the buttons will get their own
state system from the future generic `button` usage rather than from a
per-parent nesting.

| Child                  | Parent  | Dependency |
| ---------------------- | ------- | ---------- |
| `settings`             | dialog  | nothing    |
| `root`                 | dialog  | nothing    |
| `header`               | dialog  | nothing    |
| `header.closeButton`   | header  | nothing    |
| `title`                | dialog  | nothing    |
| `content`              | dialog  | nothing    |
| `footer`               | dialog  | nothing    |
| `footer.primaryActionButton`   | footer | nothing |
| `footer.secondaryActionButton` | footer | nothing |

No `defaultVariant` / `defaultState` / `defaultSeverity` wrappers are
introduced anywhere in the dialog tree.

## Step 3: Consolidation

| Child                          | Class    | Notes |
| ------------------------------ | -------- | ----- |
| `settings`                     | specific | Curated behavioural flags (not visual tokens). Trimmed from 18 optional pass-throughs to 5 flags that default to `p-dialog` values — the prior block was unconsumed by any mapper and inconsistent with the small default-populated `settings` convention used by `message` and `menu`. |
| `root`                         | specific | Dialog's own visual box. |
| `header`                       | specific | Structural to dialog. |
| `header.closeButton`           | generic (Opt. 1, placeholder) | Will extend the future `button` usage. Empty shape today (see `dialogButtonShape`), TODO comment in place. |
| `title`                        | specific | Text tokens only. |
| `content`                      | specific | Padding only. |
| `footer`                       | specific | Layout only. |
| `footer.primaryActionButton`   | generic (Opt. 1, placeholder) | Same shared placeholder shape as `closeButton`. |
| `footer.secondaryActionButton` | generic (Opt. 1, placeholder) | Same shared placeholder shape. |

Shared shape `dialogButtonShape` (currently `z.object({})`) is defined once in
`dialog/button.ts` and reused across all three button slots, matching the
"shared shape imported by multiple consumers" pattern from `calendar/`.

## Step 4: Confirmed rough schema

Same as Step 1 tree above, with the Step 2/3 annotations. Fields (only for
nodes with tokens):

- `settings`: closable, modal, draggable, resizable, dismissableMask.
- `root`: bg, contrast, border, radius, shadow.
- `header`: padding, gap, alignItems, justifyContent.
- `title`: fontSize, fontWeight.
- `content`: padding.
- `footer`: padding, gap, justifyContent.
- Button placeholders: no fields yet.

## Step 5: Gap list against actual schema

Compared against the previous single-file `schema/dialog.ts`:

1. `header.closeButton` missing — add generic placeholder child.
2. `footer.primaryActionButton` missing — add generic placeholder child.
3. `footer.secondaryActionButton` missing — add generic placeholder child.
4. `dialogRootShape` — replaced `bgContrast.extend({ bg, contrast, … })` with
   an explicit `z.object({ … })` since the `bgContrast.extend` was
   re-declaring the `bg` and `contrast` it inherited. Semantically identical.
5. File organisation — the schema stays a single file (`schema/dialog.ts`).
   An intermediate split into `schema/dialog/` was reverted on user request
   for readability. Section comments in the file mark each subcomponent
   (settings, button placeholder, root, header, title, content, footer,
   top-level assembly).
6. Dependency wrappers — no changes; the schema was already flat.

## Step 6: Structural changes applied

All six items from Step 5 were applied. `dialogRoot`, `dialogRootShape`,
`dialogRootDefaults`, `dialogSettings`, `dialogButtonShape`,
`dialogButtonDefaults`, `dialogShape`, `dialogDefaults`, and `dialog` are all
publicly exported from `schema/dialog.ts`; existing import sites
(`current-themes.schema.ts`) are unchanged.

## Step 7: Default-value decisions

Every visual default is preserved unchanged. The three new placeholder
children carry no defaults (empty `z.object({})` with an empty defaults
object) — they resolve to `{}` in the parsed tree, waiting for the future
`button` usage to fill them in. The curated `settings` flags each carry a
literal default matching PrimeNG's own `p-dialog` value, so they resolve to a
concrete value in the parsed tree rather than falling back.

| Node | Token | Default |
| --- | --- | --- |
| `root.bg` | | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` |
| `root.contrast` | | `{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}` |
| `root.border.color` | | `{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}` |
| `root.border.style` | | `{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}` |
| `root.border.width` | | `{{primitives.border.width.none}}` |
| `root.border.radius` | | `{{primitives.border.radius.md}}` |
| `root.border.offset` | | `{{primitives.border.offset.none}}` |
| `root.radius` | | `{{primitives.radius.md}}` |
| `root.shadow` | | `{{primitives.shadow.md}}` |
| `header.padding` | | `{{primitives.space.md}}` |
| `header.gap` | | `{{primitives.space.sm}}` |
| `header.alignItems` | | `center` |
| `header.justifyContent` | | `space-between` |
| `header.closeButton` | | `{}` (placeholder) |
| `title.fontSize` | | `{{primitives.font.size}}` |
| `title.fontWeight` | | `{{primitives.font.weight}}` |
| `content.padding` | | `{{primitives.space.md}}` |
| `footer.padding` | | `{{primitives.space.md}}` |
| `footer.gap` | | `{{primitives.space.sm}}` |
| `footer.justifyContent` | | `flex-end` |
| `footer.primaryActionButton` | | `{}` (placeholder) |
| `footer.secondaryActionButton` | | `{}` (placeholder) |
| `settings.closable` | | `true` (matches `p-dialog`) |
| `settings.modal` | | `false` (matches `p-dialog`) |
| `settings.draggable` | | `true` (matches `p-dialog`) |
| `settings.resizable` | | `true` (matches `p-dialog`) |
| `settings.dismissableMask` | | `false` (matches `p-dialog`) |

## Step 8: Implementation notes

Single file modified:

- `libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.ts`
  is the entire schema, declaring in order: settings (shape + defaults),
  shared button placeholder, root (shape + defaults + applied), header (with
  `closeButton`), title, content, footer (with `primaryActionButton` +
  `secondaryActionButton`), and the top-level shape/defaults/assembly.

All subcomponent shapes and defaults are declared as plain module-level
constants; per-child `Shape` / `Defaults` names are kept for the ones
external code might import (`dialogSettingsShape`, `dialogSettingsDefaults`,
`dialogRootShape`, `dialogRootDefaults`, `dialogButtonShape`,
`dialogButtonDefaults`, `dialogShape`, `dialogDefaults`) and kept internal
(`const`) for the others (header/title/content/footer) since nothing outside
this file needs them. `settings` follows the same shape/defaults separation as
the other children (`.prefault({})` in the shape + a matching defaults entry),
so it resolves to a concrete object in the parsed tree.

Process note: test/spec files were left unchanged during Step 8 as required
by the skill. Test updates happened in Step 10.

## Step 10: Testing

- Spec stays at
  `libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.spec.ts`
  with the 3-test structure (`parses an empty object`, `resolves the
  expected default token tree`, `shape and defaults stay in sync`) preserved
  verbatim.
- Snapshot at
  `libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/dialog.spec.ts.snap`
  regenerated for the new tree.
- Snapshot delta vs the 2026-09-14 revision: adds `header.closeButton: {}`,
  `footer.primaryActionButton: {}`, `footer.secondaryActionButton: {}`, and a
  `settings` object with the 5 curated behavioural flags. All other paths
  unchanged.

Execution:

- `CI=false npx nx test integration-interface --no-interactive --testFile=libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.spec.ts -u`
  → 3 tests passed, 1 snapshot written.
- `CI=true npx nx lint integration-interface` → clean.
- Full `nx test integration-interface` still shows the same 3 pre-existing
  failures noted in the previous audit (`message.spec.ts`, `dataview.spec.ts`,
  `interactive-data-view.spec.ts`) — none of them touch the dialog schema.

## Summary of applied changes

- Introduced `dialogButtonShape` / `dialogButtonDefaults` shared placeholder.
- Added `header.closeButton`, `footer.primaryActionButton`,
  `footer.secondaryActionButton` as placeholder generic children (all reuse
  the shared placeholder shape).
- Simplified `dialogRootShape` to a plain `z.object` (removed redundant
  `bgContrast.extend`).
- Narrowed `settings` from 18 unconsumed optional pass-throughs to 5 curated
  behavioural flags (`closable`, `modal`, `draggable`, `resizable`,
  `dismissableMask`), each defaulting to PrimeNG's own `p-dialog` value, and
  renamed the export `dialogSettings` → `dialogSettingsShape` with a matching
  `dialogSettingsDefaults` (consistent with the small default-populated
  `settings` convention in `message`/`menu`).
- Kept the schema in one file (`schema/dialog.ts`) — a mid-audit split into
  `schema/dialog/` was reverted for readability.
- Regenerated the 3-test snapshot at the top-level location.
- No consumer changes required (all public exports preserved).
