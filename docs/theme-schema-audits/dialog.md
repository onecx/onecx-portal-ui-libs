# Dialog Theme Schema Audit

Date: 2026-09-15
Component: dialog

Supersedes the 2026-09-14 revision (which restructured the file only). This
run narrows the `settings` block from 18 unconsumed behavioural pass-throughs to
5 curated behavioural flags that default to PrimeNG's own `p-dialog` values,
nests `title` under `header`, and models the buttons as a single shared
`dialogButtonShape` (a scoped stand-in for the future generic `button` usage)
reused by `header.closeButton` and the footer action buttons — the close button
gets rest + hover foreground defaults, the action buttons stay inert
(see Steps 3, 7, and the button notes below). The schema stays a single file
(`schema/dialog.ts`) for readability.

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
  `usages.dialog.header.title.{fontSize,fontWeight}`,
  `usages.dialog.content.padding`,
  `usages.dialog.footer.{padding,gap}`.
- `css-rules/usages/dialog.rules.ts` additionally reads:
  `usages.dialog.header.{alignItems,justifyContent}`,
  `usages.dialog.header.closeButton.{color,hover.color}`,
  `usages.dialog.footer.justifyContent`,
  and pulls the mask's background directly from `primitives.area.overlay.…bg`.

The `title` node is nested under `header` (it lives inside the header bar in the
PrimeNG DOM). `header.closeButton` is a `dialogButtonShape` child carrying rest +
hover `color` tokens, each wired via a CSS rule on `.p-dialog-close-button` (rest
on the base selector, hover on `:not(:disabled):hover`). The `settings` block is
curated to the five flags in Step 4. The footer's `primaryActionButton` /
`secondaryActionButton` reuse the same shared `dialogButtonShape`; they carry no
defaults (they are developer content themed by the future generic `button` usage
+ the severity the developer picks), so they resolve to `{}` today and no mapper
reads them. `content.fontSize` is present for body text, and `content.input` /
`content.textarea` are *not* present — a dialog's content is a free-form region,
so nesting form children there was rejected as speculative structure (see the
Step 1 note on PR #1703).

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
├── header                         (layout + title typography + close button)
│   ├── title                      (typography — fontSize / fontWeight)
│   └── closeButton                (shared dialogButtonShape — rest + hover `color`)
├── content                        (padding + fontSize)
└── footer                         (layout + two inert action buttons)
    ├── primaryActionButton        (shared dialogButtonShape — no defaults, inert)
    └── secondaryActionButton      (shared dialogButtonShape — no defaults, inert)
```

`title` is nested under `header` rather than kept as a sibling: the title lives
inside the header bar in the PrimeNG DOM (`.p-dialog-header > .p-dialog-title`),
and the PR review asked whether both `header` and `title` should exist (line 132).
Nesting keeps the two distinct theming concerns — the bar's layout
(`padding` / `gap` / `alignItems` / `justifyContent`) vs. the title's
typography (`fontSize` / `fontWeight`) — while answering "use either one" with a
single `header` region that owns both.

`settings` is the one non-visual child: a small curated set of `p-dialog`
behavioural flags a designer plausibly tunes per usage (`closable`, `modal`,
`draggable`, `resizable`, `dismissableMask`). The rest of PrimeNG's `p-dialog`
inputs (icons, z-index, focus, positioning, `minX`/`minY`) are component
wiring, not theming, and are intentionally not modelled — see Step 3.

Not modelled this run: `mask`, `headerActions`, `maximizeButton`,
`minimizeButton`. The mask is themed globally via `primitives.area.overlay`
(no per-dialog override needed). The others aren't referenced by any consumer
today.

**Content input/textarea — deliberately not modelled (PR #1703 review).**
A dialog's `content` region is free-form in PrimeNG — the developer drops any
template content in (form fields, images, tables, plain text, ...), so it has
no fixed intrinsic children like `header`/`footer` do. Pre-reserving
`content.input` / `content.textarea` as empty placeholders was considered and
rejected: they would parse to `{}`, no consumer reads them, and they'd be
speculative structure for the (uncommon) form-in-dialog case — the same
"don't add unused keys just in case" rule that applies to the 5 canonical
variant keys. `content.fontSize` *is* added, because body-text sizing is a
real themable concern regardless of what the content holds. If a specific
dialog later needs its own content-form theming, the consumer can reference
the existing generic `input` / `textarea` usages (Option 2, cf. the table's
paginator dropdown), and a real `content.input` with real tokens can be added
then.

## Step 2: Dependencies

All children resolve to dependency `nothing`. The dialog has no built-in
variant/state/severity axis in PrimeNG. The buttons do not nest a full
variant/state/severity axis of their own — the shared `dialogButtonShape`
carries only the per-dialog surface tokens a dialog can override (rest + hover
`color`, plus overridable `background` / `border`), and the full button state
system is expected to come from the future generic `button` usage.

| Child                              | Parent | Dependency |
| ---------------------------------- | ------ | ---------- |
| `settings`                         | dialog | nothing    |
| `root`                             | dialog | nothing    |
| `header`                           | dialog | nothing    |
| `header.title`                     | header | nothing    |
| `header.closeButton`               | header | nothing    |
| `content`                          | dialog | nothing    |
| `footer`                           | dialog | nothing    |
| `footer.primaryActionButton`       | footer | nothing    |
| `footer.secondaryActionButton`     | footer | nothing    |

No `defaultVariant` / `defaultState` / `defaultSeverity` wrappers are
introduced anywhere in the dialog tree.

## Step 3: Consolidation

| Child                          | Class    | Notes |
| ------------------------------ | -------- | ----- |
| `settings`                     | specific | Curated behavioural flags (not visual tokens). Trimmed from 18 optional pass-throughs to 5 flags that default to `p-dialog` values — the prior block was unconsumed by any mapper and inconsistent with the small default-populated `settings` convention used by `message` and `menu`. |
| `root`                         | specific | Dialog's own visual box. |
| `header`                       | specific | Structural to dialog; owns layout + the nested title + close button. |
| `header.title`                 | specific | Title typography tokens (fontSize / fontWeight). Nested under `header` (see Step 1 note). |
| `header.closeButton`           | generic (scoped stand-in) | Reuses the shared `dialogButtonShape`. Carries rest + hover `color` defaults (the close button is PrimeNG's own icon-only chrome, so only its foreground is themed here); wired via CSS rules on `.p-dialog-close-button` (rest + `:not(:disabled):hover`). |
| `content`                      | specific | Layout + `fontSize` typography token. Free-form region — no intrinsic input/textarea children (see Step 1 note on PR #1703). |
| `footer`                       | specific | Layout + two shared `dialogButtonShape` action-button slots (see note below). |
| `footer.primaryActionButton`   | generic (scoped stand-in) | Reuses the shared `dialogButtonShape`, overridable but inert (no defaults). |
| `footer.secondaryActionButton` | generic (scoped stand-in) | Reuses the shared `dialogButtonShape`, overridable but inert (no defaults). |

**Shared button shape (PR #1703 review).** The buttons modelled here are a
*scoped stand-in* for the future generic `button` usage, defined once as
`dialogButtonShape` and reused across all three slots (matching the
"shared shape imported by multiple consumers" pattern from `calendar/`, e.g.
its `calendarFooterButtonShape`). The shape is deliberately wide — rest +
hover `color`, plus overridable `background` / `border` — so a dialog can
override the surface tokens it cares about per-dialog, while any token or state
not present here falls through to the global `button` theme once that usage and
its mapper rules land. The defaults are deliberately narrow: the close button
(PrimeNG's own `.p-dialog-close-button`, whose icon inherits `currentColor`) gets
rest + hover `color` only; the two footer action buttons get *no* defaults —
PrimeNG's footer is a free-form `#footer` template holding developer-supplied
`<p-button>`s, so those slots are themable surface but inert today (the
developer's chosen `severity` is a `p-button` input, not a theme token).

## Step 4: Confirmed rough schema

Same as Step 1 tree above, with the Step 2/3 annotations. Fields (only for
nodes with tokens):

- `settings`: closable, modal, draggable, resizable, dismissableMask.
- `root`: bg, contrast, border, radius, shadow.
- `header`: padding, gap, alignItems, justifyContent, plus nested `title`
  (fontSize, fontWeight) and `closeButton` (dialogButtonShape: color,
  hover.color, background, border).
- `content`: padding, fontSize.
- `footer`: padding, gap, justifyContent, plus `primaryActionButton` and
  `secondaryActionButton` (each the shared dialogButtonShape, no defaults).

## Step 5: Gap list against actual schema

Compared against the previous single-file `schema/dialog.ts`:

1. `header.closeButton` missing — add it as a `dialogButtonShape` child.
2. `footer.primaryActionButton` missing — add it as a `dialogButtonShape` child.
3. `footer.secondaryActionButton` missing — add it as a `dialogButtonShape` child.
4. `title` is a top-level child but should be nested under `header` (it lives
   inside the header bar in the PrimeNG DOM) — re-nest it.
5. `dialogRootShape` — replaced `bgContrast.extend({ bg, contrast, … })` with
   an explicit `z.object({ … })` since the `bgContrast.extend` was
   re-declaring the `bg` and `contrast` it inherited. Semantically identical.
6. File organisation — the schema stays a single file (`schema/dialog.ts`).
   An intermediate split into `schema/dialog/` was reverted on user request
   for readability.
7. Dependency wrappers — no changes; the schema was already flat.

## Step 6: Structural changes applied

All seven items from Step 5 were applied. `dialogRoot`, `dialogRootShape`,
`dialogRootDefaults`, `dialogSettingsShape`, `dialogButtonShape`, `dialogShape`,
`dialogDefaults`, and `dialog` are all publicly exported from `schema/dialog.ts`;
`dialogSettingsDefaults` is also exported, and the internal `dialogCloseButtonDefaults`
is kept as a plain `const`. Existing import sites
(`current-themes.schema.ts`) are unchanged.

## Step 7: Default-value decisions

Every visual default is preserved unchanged. `header.closeButton` carries two
new defaults — a rest `color` and a `hover.color`, both the overlay `contrast`
primitive — because the close button is PrimeNG's own icon-only chrome whose
icon inherits `currentColor`. The two footer action buttons carry **no** defaults
(`primaryActionButton: {}` / `secondaryActionButton: {}`), so they resolve to
`{}` in the parsed tree — overridable surface, inert until the future `button`
usage + its mapper rules land. The shared `dialogButtonShape`'s `background` /
`border` / `hover.background` tokens are therefore overridable-but-unset for
every slot (they stay `.optional()` with no `.default()`). The curated `settings`
flags each carry a literal default matching PrimeNG's own `p-dialog` value, so
they resolve to a concrete value in the parsed tree rather than falling back.

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
| `header.title.fontSize` | | `{{primitives.font.size}}` |
| `header.title.fontWeight` | | `{{primitives.font.weight}}` |
| `header.closeButton.color` | | `{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}` |
| `header.closeButton.hover.color` | | `{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}` |
| `content.padding` | | `{{primitives.space.md}}` |
| `content.fontSize` | | `{{primitives.font.size}}` |
| `footer.padding` | | `{{primitives.space.md}}` |
| `footer.gap` | | `{{primitives.space.sm}}` |
| `footer.justifyContent` | | `flex-end` |
| `footer.primaryActionButton` | | `{}` (no defaults — inert, see Step 7) |
| `footer.secondaryActionButton` | | `{}` (no defaults — inert, see Step 7) |
| `settings.closable` | | `true` (matches `p-dialog`) |
| `settings.modal` | | `false` (matches `p-dialog`) |
| `settings.draggable` | | `true` (matches `p-dialog`) |
| `settings.resizable` | | `true` (matches `p-dialog`) |
| `settings.dismissableMask` | | `false` (matches `p-dialog`) |

## Step 8: Implementation notes

Single file modified:

- `libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.ts`
  is the entire schema, declaring in order: settings (shape + defaults), root
  (shape + defaults + applied), the shared `dialogButtonShape` + the
  `dialogCloseButtonDefaults`, then the header's two nested children (`title`,
  `closeButton` — declared before `header` so `header` can reference them),
  header, content, footer, and the top-level shape/defaults/assembly. `title`
  and `closeButton` are nested inside `header` (via `.prefault({})`), so they
  are no longer top-level children of the dialog.

All subcomponent shapes and defaults are declared as plain module-level
constants. `dialogSettingsShape`, `dialogSettingsDefaults`, `dialogRootShape`,
`dialogRootDefaults`, `dialogButtonShape`, `dialogShape`, and `dialogDefaults`
are exported for importers, while `dialogTitleShape` / `dialogTitleDefaults`,
`dialogCloseButtonDefaults`, and the header/content/footer shape+defaults pairs
are internal (`const`) since nothing outside this file needs them. `settings`,
`title`, and `closeButton` each follow the same shape/defaults separation as the
other children (`.prefault({})` in the shape + a matching defaults entry), so
they resolve to a concrete object in the parsed tree. `closeButton` reuses the
shared `dialogButtonShape` (rest + hover `color`, overridable `background` /
`border`) and carries the rest + hover `color` defaults (see Step 7), wired via
two CSS rules on `.p-dialog-close-button` in the consumer.

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
- Snapshot delta vs the 2026-09-14 revision: moves `title` under `header`,
  gives `header.closeButton` its rest + hover `color` defaults, resolves
  `footer.primaryActionButton` / `footer.secondaryActionButton` to `{}` (shared
  `dialogButtonShape`, no defaults), and adds `content.fontSize` and a `settings`
  object with the 5 curated behavioural flags. (`content.input` /
  `content.textarea` were considered and rejected — no form children are added
  to the free-form content region; see Step 1.) All other paths unchanged.

Execution:

- `CI=false npx nx test integration-interface --no-interactive --testFile=libs/integration-interface/src/lib/topics/current-themes/v1/schema/dialog.spec.ts -u`
  → 3 tests passed, 1 snapshot (stable — the nested `header.closeButton.hover.color`
  shape resolves, confirming the raw-shape `ThemePath` fix in
  `current-themes.schema.ts` still holds for the new button leaves).
- `CI=false npx nx build angular-utils --skip-nx-cache` → clean. This is the
  type-level guard: the mapper rule files reference
  `usages.dialog.header.closeButton.{color,hover.color}`, which must be valid
  `ThemePath` members for the `@onecx/angular-utils/theme/primeng` entry point
  to compile.
- `CI=true npx nx lint integration-interface` → clean.
- `CI=true npx nx lint angular-utils` → 0 errors (68 pre-existing non-null-assertion
  warnings in unrelated files; none in `dialog.rules.ts`).

## Summary of applied changes

- Introduced `dialogButtonShape` — a shared scoped stand-in for the future
  generic `button` usage (rest + hover `color`, overridable `background` /
  `border`) — and reused it across `header.closeButton`,
  `footer.primaryActionButton`, and `footer.secondaryActionButton`. The close
  button carries rest + hover `color` defaults (PrimeNG's own icon-only chrome);
  the two footer action buttons carry no defaults (overridable surface, inert
  until the global `button` usage + its mapper rules land).
- Nested `title` under `header` (it lives inside the header bar in the PrimeNG
  DOM); updated the mapper rules to read
  `usages.dialog.header.title.{fontSize,fontWeight}` and added CSS rules wiring
  `usages.dialog.header.closeButton.{color,hover.color}` to
  `.p-dialog-close-button` (rest + `:not(:disabled):hover`).
- Added `content.fontSize` (mirrors `header.title.fontSize`). `content.input` /
  `content.textarea` were considered and rejected — no form children are added
  to the free-form content region (see Step 1); a consumer that themes a
  form-in-dialog later can reference the existing `input` / `textarea` usages.
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
