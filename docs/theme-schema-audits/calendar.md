# Calendar Schema Audit

**Date:** 2026-08-19
**Reviewed:** 2026-08-19 (full re-audit against the refined `theme-schema-audit` skill; schema restructure
per v3.1.0, test strategy finalized at v3.3.0)
**Schema files:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/calendar/`
**Status:** ✅ Schema restructured to the **variable-dependency** model with the **default-token-path**
invariant. Reference values unchanged (structure only). Consolidated test coverage added via the
snapshot-plus-invariants strategy (see _Testing_). One downstream item remains deferred (see _Deferred_).

## What changed in this run (relative to the prior 3-round audit)

The prior audit (`2026-08-14`) was built under a **uniform-nesting** reading of the skill. The skill was
redirected (v3.0.0 → v3.1.0) to restore the **variable-dependency** model _and_ add an explicit
**default-token-path** rule:

- **Variable dependency** — each child's dependency level (`nothing` / `variant` / `state` / `severity`)
  decides _where_ its own tree is inserted into the parent's path.
- **Default token path** — a node's baseline leaf always resolves through its own default slots,
  `…defaultVariant.defaultState.defaultSeverity.<token>`. The default slots are always **flat siblings of
  the named slots**, never aliased to a named slot, never wrapped in a `variant`/`state`/`severity` object,
  and never skip a declared level.

The re-audit (Steps 0–5b) re-derived the rough schema from PrimeNG 21.2.13's rendered DOM, confirmed it
node-by-node, and applied the structural gaps G1–G4 (below). **All `{{primitives…}}` reference values and
literal tokens were left byte-identical — only the nesting was restructured.**

## Canonical Values

| Category       | Baseline slot     | Named slots (from `primitives.ts`)                            |
| -------------- | ----------------- | ------------------------------------------------------------- |
| **Variants**   | `defaultVariant`  | `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`   |
| **States**     | `defaultState`    | `hover`, `active`, `selected`, `focus`, `invalid`, `disabled` |
| **Severities** | `defaultSeverity` | `success`, `info`, `warning`, `danger`, `contrast`            |

## Confirmed Rough Schema

Every state-bearing node (`[S]`) carries its own `defaultVariant` → state slots → `defaultSeverity` before
its tokens; static nodes (`[s]`) stay flat at the node root; static tokens (sm/lg, focusRing, width/height,
minWidth, view margin) sit at the node root as siblings of `defaultVariant`. Calendar declares **no named
variants** (so `defaultVariant` stands alone at each node) and **no named severities** (so
`defaultSeverity` stands alone inside each state).

```
calendar                                   [variants: defaultVariant + primary…quinary]
├─ settings                                (static — no default slots; pass-through props)
├─ transitionDuration                      (static — scalar, z.number)
└─ defaultVariant / primary…quinary        (variant slots — same shape; only defaultVariant gets defaults)
   ├─ input                                (dep: variant) [S]
   │  ├─ sm, lg, focusRing                 [s]  input root
   │  └─ defaultVariant
   │     ├─ defaultState → defaultSeverity → {padding, shadow, font, bg, color, border, placeholderColor, icon}
   │     └─ hover/focus/disabled/invalid/active → defaultSeverity → {diffs}
   │        icon (dep: state) [S]
   │           └─ defaultVariant
   │              ├─ defaultState → defaultSeverity → {padding, width, height, color, bg}
   │              └─ hover/focus/disabled/invalid/active → defaultSeverity → {color}
   ├─ panel                                (dep: variant) [S]
   │  └─ defaultVariant
   │     ├─ defaultState → defaultSeverity → {bg, color, border, padding, headerGap,
   │     │                                    header, datePanel, multiMonthDivider, timePicker, footerButtonBar}
   │     └─ hover/focus → defaultSeverity → {diffs}
   │        header (dep: state) [S]
   │        │  └─ defaultVariant
   │        │     ├─ defaultState → defaultSeverity → {bg, color, padding, margin, gap, selectMonth, selectYear, navButton}
   │        │     └─ hover/focus → defaultSeverity → {diffs}
   │        │        selectMonth / selectYear → navigationSelector (shared) [S]
   │        │        navButton → panelButton (shared) [S]
   │        datePanel (dep: state) [S]
   │        │  └─ defaultVariant
   │        │     ├─ defaultState → defaultSeverity → {bg, color, padding, margin, weekDayLabel, dayView, monthView, yearView, today}
   │        │     └─ hover/focus → defaultSeverity → {diffs}
   │        │        weekDayLabel [s] → {padding, font, color}
   │        │        dayView/monthView/yearView → view [s] → {margin, <cell>: pickerCell}
   │        │           pickerCell (shared) [S]
   │        │        today [s] → {background, color}
   │        multiMonthDivider [s] → {border, gap}
   │        timePicker (dep: state) [S]
   │        │  └─ defaultVariant
   │        │     ├─ defaultState → defaultSeverity → {padding, border, gap, buttonGap, margin, timeSeparator, timePickerButton}
   │        │     └─ hover/focus → defaultSeverity → {diffs}
   │        │        timeSeparator [s] → {color, padding, font}
   │        │        timePickerButton → panelButton (shared) [S]
   │        footerButtonBar (dep: state) [S]
   │           └─ defaultVariant
   │              ├─ defaultState → defaultSeverity → {padding, border, gap, todayButton, clearButton}
   │              └─ hover/focus → defaultSeverity → {diffs}
   │                 todayButton / clearButton → footerButton (shared shape, independent defaults) [S]
   └─ calendarIconButton (dep: variant) → panelButton (shared) [S]
```

**Deliberate DOM simplifications** (flagged and confirmed):

1. `prev-button`/`next-button` → one shared `navButton` (visually identical).
2. Year-view `title`/`decade` → modelled by `selectYear` (navigationSelector).
3. `weeknumber` (PrimeNG `showWeek`) not themed.
4. Time picker's per-unit (hour/minute/second/ampm) pickers → modelled as `timeSeparator` + one `timePickerButton` (increment/decrement are `panelButton`).

## Gaps Found and Applied

| #      | Node(s)                                                                                                                                                                               | Gap before → applied                                                                                                                                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G1** | All 11 state-bearing shapes: `input`, `icon`, `panel`, `panelHeader`, `datePanel`, `timePicker`, `footerButtonBar`, `navigationSelector`, `panelButton`, `footerButton`, `pickerCell` | **Missing `defaultVariant` slot.** States (`defaultState`, `hover`, …) sat at the node root. Now `<node>.defaultVariant.{defaultState,…}` (`defaultVariant` alone — no named variants declared)                                                                     |
| **G2** | All of the above, every state                                                                                                                                                         | **Missing `defaultSeverity` leaf slot.** Tokens sat directly in the state object. Now each state (incl. `defaultState`) wraps its tokens/children in `defaultSeverity` (alone — no named severities)                                                                |
| **G3** | `timePicker`                                                                                                                                                                          | **Placement inconsistency.** `timeSeparator` + `timePickerButton` sat at `timePicker`'s root. Moved **inside** its state blocks (`defaultVariant.defaultState.defaultSeverity.…`), matching `panel`/`datePanel`/`footerButtonBar`                                   |
| **G4** | All 12 defaults trees                                                                                                                                                                 | Re-nested to `defaultVariant.defaultState.defaultSeverity.…`, mirroring G1–G3. **Reference values and literal tokens unchanged — structure only**                                                                                                                   |
| **P**  | Root `calendar.ts`                                                                                                                                                                    | **Variant-defaults policy.** Only `defaultVariant` carries the defaults tree; `primary`…`quinary` stay `.optional()` with no baked defaults (resolved via runtime fallback unless a theme supplies them). `settings`/`transitionDuration` remain static at the root |

**Confirmed OK (no change):** root shape (`defaultVariant` + 5 named variants); static nodes
(`settings`, `view`, `weekDayLabel`, `today`, `multiMonthDivider`, `timeSeparator`) stay flat; static
tokens (`sm`/`lg`, `focusRing`, `width`/`height`, `minWidth`, view `margin`) stay at the node root as
siblings of `defaultVariant`; shared-shape reuse (`panelButton` ×3, `footerButton` ×2 with independent
defaults, `pickerCell` ×3, `navigationSelector` ×2); no grouping-wrapper keys, no aliasing of
`defaultVariant` to a named slot, `prefault({})` discipline throughout.

## Default-Value Policy

**Variant coverage:** only `defaultVariant` gets baked defaults (it _is_ the default). Named variants
resolve via the runtime fallback mechanism unless a theme supplies values — verified at runtime: a themed
`primary` parses alongside the baked `defaultVariant`.

**`defaultState` default coverage per node** (full token set; values unchanged, re-nested under
`defaultVariant` → `defaultSeverity`):

| Node                                                                                                        | defaultState defaults                                                          |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| input                                                                                                       | padding, shadow, font, background, color, border, placeholderColor, icon       |
| input.icon                                                                                                  | padding, width, height, color, background                                      |
| panel                                                                                                       | background, color, border, padding, headerGap (+ children)                     |
| panel.header                                                                                                | background, color, padding, margin, gap (+ selectMonth, selectYear, navButton) |
| navigationSelector                                                                                          | padding, font, border, background, color                                       |
| panelButton                                                                                                 | color, background, border (+ static width/height/focusRing)                    |
| datePanel                                                                                                   | background, color, padding, margin (+ weekDayLabel, views, today)              |
| pickerCell                                                                                                  | width, height, padding, font, color, background, border                        |
| footerButton (today + clear, independent)                                                                   | padding, font, color, background, border (+ static minWidth/focusRing)         |
| timePicker                                                                                                  | padding, border, gap, buttonGap, margin (+ timeSeparator, timePickerButton)    |
| footerButtonBar                                                                                             | padding, border, gap (+ todayButton, clearButton)                              |
| static leaves (weekDayLabel, today, multiMonthDivider, timeSeparator, view.margin, input.sm/lg, focusRings) | full small set (flat at root, no default slots)                                |
| settings / transitionDuration                                                                               | pass-through / scalar                                                          |

**Differentiated named-state defaults** (only tokens that differ from `defaultState` are present; the rest
are omitted and resolve via `prefault({})` → runtime fallback):

| Node                | hover             | focus  | active | selected                                      | disabled  | invalid       |
| ------------------- | ----------------- | ------ | ------ | --------------------------------------------- | --------- | ------------- |
| input               | bg, color         | border | bg     | —                                             | color, bg | border, color |
| input.icon          | color             | color  | —      | —                                             | color     | color         |
| panel               | —                 | —      | —      | —                                             | —         | —             |
| panel.header        | —                 | —      | —      | —                                             | —         | —             |
| navigationSelector  | bg, color         | border | —      | —                                             | —         | —             |
| panelButton         | bg, color         | border | bg     | —                                             | color, bg | —             |
| datePanel           | —                 | —      | —      | —                                             | —         | —             |
| pickerCell          | bg, color, border | border | bg     | bg, color, border, inRangeBg, rangeSelectedBg | color, bg | —             |
| footerButton (both) | bg, color         | border | bg     | —                                             | color, bg | —             |
| timePicker          | —                 | —      | —      | —                                             | —         | —             |
| footerButtonBar     | —                 | —      | —      | —                                             | —         | —             |

Reference families are preserved per token: `{{primitives.defaultVariant.*}}` for the input/icon (field
role) and `{{primitives.area.overlay.*}}` for the overlay parts (variant-independent surface). Named-state
refs use the standard state-segment swap (`…defaultState.defaultSeverity.X` → `…state.<name>.defaultSeverity.X`).
Footer buttons: `todayButton` and `clearButton` share one _shape_ but have two _independent_ defaults
objects so a theme can restyle them separately.

## Structural Verification

- ✅ Shape/defaults separation across all files; shared shapes defined once, referenced by all consumers
- ✅ `defaultVariant` at every state-bearing node (alone); `defaultSeverity` inside every state before tokens
- ✅ No grouping-wrapper keys (`variant`/`state`/`severity` objects); default slots are flat siblings of named slots
- ✅ Static nodes stay flat; static tokens at the node root (siblings of `defaultVariant`)
- ✅ `prefault({})` on all nested objects; `applyDefaultsRecursive` applies defaults in the main file
- ✅ Root: only `defaultVariant` carries baked defaults; `primary`…`quinary` stay `.optional()`
- ✅ `timePicker` children moved into state blocks (G3)
- ✅ `tsc --noEmit -p tsconfig.lib.json`: **no errors in any `calendar/` file** (the only errors are
  pre-existing `expect`-global references in the unrelated `test-utils.ts` helper, present at HEAD)
- ✅ Runtime parse of `{}`: default token path resolves; D1 static tokens at root; D2 timePicker children
  inside state blocks; named variants carry no baked defaults

## Files Modified

| File                             | Change                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `calendar/input.ts`              | G1+G2 (defaultVariant + defaultSeverity); sm/lg/focusRing stay at root (D1)         |
| `calendar/inputicon.ts`          | G1+G2; focusRing stays at root                                                      |
| `calendar/panel.ts`              | G1+G2; children stay inside state block                                             |
| `calendar/panelbutton.ts`        | G1+G2; width/height/focusRing stay at root                                          |
| `calendar/panelheader.ts`        | G1+G2; children stay inside state block                                             |
| `calendar/navigationselector.ts` | G1+G2; focusRing stays at root                                                      |
| `calendar/datepanel.ts`          | G1+G2; children stay inside state block                                             |
| `calendar/pickercell.ts`         | G1+G2 (no static tokens); `inRangeBackground` keeps `area.overlay` family (Round 3) |
| `calendar/timepicker.ts`         | G1+G2 **+ G3** (timeSeparator/timePickerButton moved into state block)              |
| `calendar/footerbutton.ts`       | G1+G2 (new file, Round 3); minWidth/focusRing stay at root                          |
| `calendar/footerbuttonbar.ts`    | G1+G2; children stay inside state block                                             |
| `calendar/calendar.ts`           | **P** — `defaultVariant`-only defaults policy; shape unchanged                      |

**Unchanged (static/flat, no default slots):** `settings.ts`, `view.ts`, `weekdaylabel.ts`, `today.ts`,
`multimonthdivider.ts`, `timeseperator.ts`. (`today.ts` and `pickercell.ts` carry the Round-3
`defaultVariant` → `area.overlay` reference-family fixes already in the working tree; both are otherwise
static/flat and needed no structural restructure.)

## Deferred

1. **Mapper / preset layer (out of scope).** The restructure deepened the paths (added `defaultVariant` and
   `defaultSeverity` at every state-bearing node), so the CSS/preset mapper's calendar rules must be
   regenerated against the new shape. This is downstream of the schema (mapper layer) and outside the
   `theme-schema-audit` skill's **structure-only** scope. Deferred.

2. **`calendar.spec.ts` (test follow-up).** ✅ Resolved — see _Testing_ below.

## Testing

Per Step 8 of the `theme-schema-audit` skill (v3.3.0), the resolved default-token tree for every
subcomponent is covered by a single consolidated spec file, using the **snapshot the values,
hand-assert the invariants** strategy:

- **New:** `calendar/calendar.spec.ts` — one file, one `describe('calendar schema', …)` block, with a
  nested `describe` per subcomponent (input, input icon, panel button, navigation selector, panel header,
  picker cell, view [×3 cell fields via `describe.each`], week day label, today cell, date panel, multi
  month divider, time separator, time picker, footer today/clear buttons, footer button bar, panel,
  settings). Each subcomponent block asserts: `safeParse({})` succeeds, `expectDefaultsMatchShape`
  (shape/defaults key-sync), and a **snapshot** of `parse({})` (`toMatchSnapshot`) — the exact resolved
  key/value tree, captured rather than hand-transcribed, so nothing duplicates the `*Defaults` exports and
  nothing can drift. For a structure-only restructure the snapshot diff is the "values unchanged" proof:
  only the key moves show, value tokens byte-identical.
- **Why snapshots instead of hand-written `expected*` literal trees or
  `toStrictEqual(calendarXDefaults)`:** (a) hand-transcribed literals duplicate every value that already
  lives in the `*Defaults` exports — two copies that must change in lockstep and silently drift (the root
  cause of stale specs); (b) asserting `parse({})` against the very `*Defaults` object used to build the
  schema is tautological — `defaults-helper.spec.ts` already guarantees `parse({})` structurally equals
  the defaults passed in, so a source edit changes both sides at once and never fails. Snapshots carry
  regression protection for the value tree with zero duplication, and the snapshot diff shown in review
  *is* the exact key/value diff; CI (`--ci`) refuses silent snapshot writes, so a reviewer must consciously
  accept any change.
- **Explicit structural invariants** are asserted alongside the snapshots (snapshots encode the shape but
  don't name it; these make the confirmed invariants greppable and self-documenting): the **default token
  path** (a baseline leaf resolves through `defaultVariant.defaultState.defaultSeverity.<token>` — checked
  with a path-walking helper that fails clearly if the leaf is one level shallower or wrapped), **static
  tokens at the node root** as siblings of `defaultVariant` (input `sm`/`lg`/`focusRing`, icon
  `focusRing`, panel button `width`/`height`/`focusRing`, footer button `minWidth`/`focusRing` — asserted
  defined at root and *undefined* inside the state block), **state-dependent children inside the state
  blocks** (timePicker `timeSeparator`/`timePickerButton` — D2 — asserted *undefined* at the node root and
  defined inside `defaultVariant.defaultState.defaultSeverity`), **no grouping-wrapper keys**
  (`variant`/`state`/`severity` objects) anywhere in the shape tree, and the **`defaultVariant`-only
  variant policy** (each of `primary`…`quinary` parses to a value distinct from the baked
  `defaultVariant` defaults — i.e. no baked token values on named variants).
- **Shared shapes** get one canonical snapshot in their own `describe` block and `toBe()` reference
  identity at each consumer (via a prefault-unwrapping helper, since consumers wrap the shared const in
  `.prefault({})`): `calendarPanelButtonShape`/`Defaults` (used by `calendarIconButton`/`navButton`/
  `timePickerButton`) and `calendarPickerCellShape`/`Defaults` (used by `dateCell`/`monthCell`/`yearCell`
  via the view container, where the cell field sits at the view root). `footerbutton.ts`'s two distinct
  defaults exports (`calendarTodayButtonDefaults`, `calendarClearButtonDefaults`) share the *shape*
  (identity checked) but each gets its own snapshot via `describe.each`, since the *defaults* are
  independent. `settings.ts` (no defaults export) is asserted to resolve to `{}` when empty and to pass
  custom values through unchanged.
- **Deleted:** the stale top-level `schema/calendar.spec.ts` facade spec — it imported removed classes
  (`CalendarInputSchema`, `CalendarPanelButtonSchema`, etc.) from the pre-restructure class-based API and
  no longer compiled. The consolidated `calendar/calendar.spec.ts` already covers the `calendar` facade
  export (root `parses an empty object` + root snapshot + root invariants), so no replacement facade spec
  was needed.
- **Result:** `npx jest … schema/calendar/calendar.spec` — **76 tests pass, 19 snapshots** (root tree +
  per-node), stable across re-runs. The one remaining suite failure in the full `current-themes/v1/schema`
  run (`message.spec.ts`, a `focusRing` token-path mismatch) is pre-existing and unrelated to the calendar
  files touched here.
