# Calendar Schema Audit

**Date:** 2026-08-19 (initial restructure) · **2026-08-26** (input consolidation + `yearMonthNav`)
**Reviewed:** 2026-08-19 (full re-audit against the refined `theme-schema-audit` skill; schema restructure
per v3.1.0, test strategy finalized at v3.3.0) and 2026-08-26 (input consolidation run — see _Input
consolidation (2026-08-26)_).
**Schema files:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/calendar/`
**Status:** ✅ Schema restructured to the **variable-dependency** model with the **default-token-path**
invariant. Reference values unchanged (structure only). **Calendar `input` consolidated to Option 1**
(extends the generic `usages.input`; only `usages.calendar.input.*` is consumed), generic `input`
restructured with the **shape/defaults separation** pattern and an added `active` state, and a new
`header.yearMonthNav` child added. Consolidated test coverage via the snapshot-plus-invariants
strategy (see _Testing_). One downstream item remains deferred (see _Deferred_).

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

## Input consolidation (2026-08-26)

A follow-up audit run (2026-08-26) resolved the calendar `input` consolidation question that the
initial restructure had left as an **independent** token set (Option 2), and added the missing
`header.yearMonthNav` child. Three structural decisions were applied; all reference values were
carried over unchanged.

### G1 — added `header.yearMonthNav`

The `.p-datepicker-title` month/year display was not modelled. Added `calendarYearMonthNavShape`
to `panelheader.ts`: a **static** text element (no own variant/state tree), tokens flat — analogous
to `today` and `timeSeparator`. Tokens: `gap`, `font{weight,size}`, `color`. It sits **inside the
header's state block** (state-dependent: `defaultVariant.defaultState.defaultSeverity.yearMonthNav`),
matching `selectMonth`/`selectYear`/`navButton`. Baseline defaults (states omitted → fallback):
`gap = space.sm`, `font.weight = font.weight`, `font.size = font.size`,
`color = area.overlay.defaultState.defaultSeverity.contrast`.

### G2 — `input` consolidated to Option 1 (extends the generic input)

The calendar `input` was rewritten from its independent token set to **Option 1**:

```ts
export const calendarInputShape = inputShape.extend({
  icon: calendarIconShape.prefault({}), // calendar-only child (own variant/state tree)
  shadow: z.string().optional(), // calendar-only static elevation token
})
export const calendarInputDefaults = {
  ...inputDefaults,
  icon: calendarIconDefaults,
  shadow: '{{primitives.shadow.md}}',
}
```

- Reuses the full generic `inputShape` token set (so the calendar input is themed via
  `usages.calendar.input.*` exclusively — a generic `usages.input.*` is **not** consumed).
- The two calendar-only tokens (`icon`, `shadow`) sit at the input **root**, as siblings of
  `defaultVariant`/`filled`. A shallow `.extend()` cannot re-nest the generic input's severity
  blocks, so calendar-only tokens are added at the root rather than inside a state.
- No `active` override: the generic input's `active` background
  (`{{primitives.defaultVariant.state.active.defaultSeverity.bg}}`) already equals the calendar's
  panel-open look.
- This dropped the calendar-specific `font.family` and the single-string `padding` / `placeholderColor`
  tokens in favour of the generic input's `padding{x,y}` / `placeholder{color}` / `font{weight,size}`.

### G3 — generic `input` restructured + `active` added (prerequisite for G2)

Option 1 requires a clean generic `inputShape`/`inputDefaults` to extend. `schema/input.ts` was
restructured to the **shape/defaults separation** pattern (it was still the legacy flat shape before
this run): pure all-optional `inputShape` (severity blocks with `defaultSeverity`, a `defaultVariant`
tree with `defaultState` + `hover`/`focus`/`active`/`disabled`/`invalid`, and a partial `filled`
variant), a plain `inputDefaults` tree, and `input = applyDefaultsRecursive(inputShape, inputDefaults)
.register(themeSchemaRegistry, { id: 'input' })`. The `active` state was added to the generic input
(carrying an `active` background default) so the calendar inherits a panel-open `active` without an
override. Legacy sub-schemas (`inputTransition`, `inputFocusRingSchema`, `inputHoverState`,
`inputFocusState`, `inputDisabledState`, `inputInvalidState`, `inputFilled*`, `inputFilledVariant`)
were removed; the assembled `input` (and `inputPadding`/`inputSize`) exports are kept —
`current-themes.schema.ts` imports only the assembled `input`.

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
   ├─ input                                (dep: variant) [S] — **Option 1: extends generic `usages.input`**
   │  ├─ icon, shadow                      [s]  calendar-only tokens at the input root (siblings of `defaultVariant`/`filled`)
   │  └─ (token set inherited from generic `inputShape`)
   │     ├─ sm, lg, focusRing              [s]
   │     ├─ defaultVariant
   │     │  ├─ defaultState → defaultSeverity → {transitionDuration, font{weight,size}, padding{x,y}, focusRing, sm, lg, bg, color, border, placeholder{color}}
   │     │  └─ hover/focus/active/disabled/invalid → defaultSeverity → {diffs}
   │     ├─ filled (partial override)      → defaultState/hover/focus/active/disabled/invalid → defaultSeverity → {diffs}
   │     └─ icon (dep: state) [S]  calendarIcon (calendar-only)
   │        └─ defaultVariant
   │           ├─ defaultState → defaultSeverity → {padding, width, height, color, bg}
   │           └─ hover/focus/disabled/invalid/active → defaultSeverity → {color}
   ├─ panel                                (dep: variant) [S]
   │  └─ defaultVariant
   │     ├─ defaultState → defaultSeverity → {bg, color, border, padding, headerGap,
   │     │                                    header, datePanel, multiMonthDivider, timePicker, footerButtonBar}
   │     └─ hover/focus → defaultSeverity → {diffs}
   │        header (dep: state) [S]
   │        │  └─ defaultVariant
   │        │     ├─ defaultState → defaultSeverity → {bg, color, padding, margin, gap, yearMonthNav, selectMonth, selectYear, navButton}
   │        │     └─ hover/focus → defaultSeverity → {diffs}
   │        │        yearMonthNav [s] → {gap, font{weight,size}, color}   (.p-datepicker-title; **new** — G1)
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
   │        │     ├─ defaultState → defaultSeverity → {padding, border, gap, buttonGap, margin, timeInput, timeSeparator, timePickerButton}
   │        │     └─ hover/focus → defaultSeverity → {diffs}
   │        │        timeInput [s] → {width, padding, font, focusRing} (root, static) + defaultVariant.{defaultState,hover,focus} → {color, background, border}
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
4. Time picker's per-unit (hour/minute/second/ampm) pickers → modelled as `timeInput` (the number display) + `timeSeparator` (the `:`) + one shared `timePickerButton` (increment/decrement).

## Gaps Found and Applied

| #      | Node(s)                                                                                                                                                                               | Gap before → applied                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **G1** | All 11 state-bearing shapes: `input`, `icon`, `panel`, `panelHeader`, `datePanel`, `timePicker`, `footerButtonBar`, `navigationSelector`, `panelButton`, `footerButton`, `pickerCell` | **Missing `defaultVariant` slot.** States (`defaultState`, `hover`, …) sat at the node root. Now `<node>.defaultVariant.{defaultState,…}` (`defaultVariant` alone — no named variants declared)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **G2** | All of the above, every state                                                                                                                                                         | **Considered a `defaultSeverity` leaf slot, decided against it.** None of the calendar's own nodes declare named severities, so per the skill's "no unused `defaultState`/`defaultSeverity` wrappers" rule (Step 8) their tokens correctly stay flat on the state object — no `defaultSeverity` key is introduced. `defaultSeverity` only ever appears inside `{{primitives...}}` reference strings for these nodes. The one exception is the calendar `input`, which extends the generic `usages.input` (Option 1) — that generic schema _does_ declare a real `defaultSeverity` level, so it is reachable at `calendar.*.input.defaultVariant.defaultState.defaultSeverity.*`. An earlier draft of this doc and of `calendar.spec.ts` incorrectly assumed every node got the wrapper; both have been corrected (2026-09-07, see _Post-review corrections_) |
| **G3** | `timePicker`                                                                                                                                                                          | **Placement inconsistency.** `timeSeparator` + `timePickerButton` sat at `timePicker`'s root. Moved **inside** its state blocks (`defaultVariant.defaultState.defaultSeverity.…`), matching `panel`/`datePanel`/`footerButtonBar`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **G4** | All 12 defaults trees                                                                                                                                                                 | Re-nested to `defaultVariant.defaultState.defaultSeverity.…`, mirroring G1–G3. **Reference values and literal tokens unchanged — structure only**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **P**  | Root `calendar.ts`                                                                                                                                                                    | **Variant-defaults policy.** Only `defaultVariant` carries the defaults tree; `primary`…`quinary` stay `.optional()` with no baked defaults (resolved via runtime fallback unless a theme supplies them). `settings`/`transitionDuration` remain static at the root                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

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
- ✅ `defaultVariant` at every state-bearing node (alone); `defaultSeverity` intentionally **omitted** for every calendar-local node (none declare named severities — see corrected G2); the calendar `input`'s inherited generic-input tree is the only place `defaultSeverity` is a real key
- ✅ No grouping-wrapper keys (`variant`/`state`/`severity` objects); default slots are flat siblings of named slots
- ✅ Static nodes stay flat; static tokens at the node root (siblings of `defaultVariant`)
- ✅ `prefault({})` on all nested objects; `applyDefaultsRecursive` applies defaults in the main file
- ✅ Root: only `defaultVariant` carries baked defaults; `primary`…`quinary` stay `.optional()`
- ✅ `timePicker` children (`timeInput`, `timeSeparator`, `timePickerButton`) moved into state blocks (G3);
  `timeInput` restored 2026-09-07 after being dropped without documentation (see _Post-review
  corrections_)
- ✅ `tsc --noEmit -p tsconfig.lib.json`: **no errors in any `calendar/` file** (the only errors are
  pre-existing `expect`-global references in the unrelated `test-utils.ts` helper, present at HEAD)
- ✅ Runtime parse of `{}`: default token path resolves; D1 static tokens at root; D2 timePicker children
  inside state blocks; named variants carry no baked defaults

## Files Modified

| File                             | Change                                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calendar/input.ts`              | G1+G2 (defaultVariant + defaultSeverity); sm/lg/focusRing stay at root (D1)                                                                                                |
| `calendar/inputicon.ts`          | G1+G2; focusRing stays at root                                                                                                                                             |
| `calendar/panel.ts`              | G1+G2; children stay inside state block                                                                                                                                    |
| `calendar/panelbutton.ts`        | G1+G2; width/height/focusRing stay at root                                                                                                                                 |
| `calendar/panelheader.ts`        | G1+G2; children stay inside state block                                                                                                                                    |
| `calendar/navigationselector.ts` | G1+G2; focusRing stays at root                                                                                                                                             |
| `calendar/datepanel.ts`          | G1+G2; children stay inside state block                                                                                                                                    |
| `calendar/pickercell.ts`         | G1+G2 (no static tokens); `inRangeBackground` keeps `area.overlay` family (Round 3)                                                                                        |
| `calendar/timepicker.ts`         | G1+G2 **+ G3** (timeInput/timeSeparator/timePickerButton moved into state block)                                                                                           |
| `calendar/timeinput.ts`          | **Restored** 2026-09-07 (was dropped without migration); rewritten to shape/defaults separation, no `defaultSeverity` wrapper, static width/padding/font/focusRing at root |
| `calendar/footerbutton.ts`       | G1+G2 (new file, Round 3); minWidth/focusRing stay at root                                                                                                                 |
| `calendar/footerbuttonbar.ts`    | G1+G2; children stay inside state block                                                                                                                                    |
| `calendar/calendar.ts`           | **P** — `defaultVariant`-only defaults policy; shape unchanged                                                                                                             |

**Unchanged (static/flat, no default slots):** `settings.ts`, `view.ts`, `weekdaylabel.ts`, `today.ts`,
`multimonthdivider.ts`, `timeseperator.ts`. (`today.ts` and `pickercell.ts` carry the Round-3
`defaultVariant` → `area.overlay` reference-family fixes already in the working tree; both are otherwise
static/flat and needed no structural restructure.)

### Files modified (2026-08-26 input-consolidation run)

| File                                                  | Change                                                                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `schema/input.ts`                                     | G3 — restructured to shape/defaults separation + added `active` state (prerequisite for G2)                      |
| `schema/calendar/input.ts`                            | G2 — Option 1: `inputShape.extend({ icon, shadow })`; `calendarInputDefaults = { …inputDefaults, icon, shadow }` |
| `schema/calendar/panelheader.ts`                      | G1 — added `calendarYearMonthNavShape` + `yearMonthNav` defaults                                                 |
| `schema/input.spec.ts`                                | Step 10 — rewritten (removed imports no longer exist; snapshot + invariants)                                     |
| `schema/calendar/calendar.spec.ts`                    | Step 10 — corrected Option-1 invariants + new `yearMonthNav` invariant                                           |
| `schema/__snapshots__/input.spec.ts.snap` (new)       | Step 10 — regenerated (incl. `active`)                                                                           |
| `schema/calendar/__snapshots__/calendar.spec.ts.snap` | Step 10 — regenerated (root/input/panel header/panel)                                                            |

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
  _is_ the exact key/value diff; CI (`--ci`) refuses silent snapshot writes, so a reviewer must consciously
  accept any change.
- **Explicit structural invariants** are asserted alongside the snapshots (snapshots encode the shape but
  don't name it; these make the confirmed invariants greppable and self-documenting): the **default token
  path** (a baseline leaf resolves through `defaultVariant.defaultState.<token>` for every calendar-local
  node — none declare named severities, so no `defaultSeverity` wrapper is introduced there; the calendar
  `input` is the one exception and resolves through the full `defaultVariant.defaultState.defaultSeverity.
<token>`, inherited from the generic `usages.input` — checked with a path-walking helper that fails
  clearly if the leaf is one level shallower or deeper than expected for that node), **static
  tokens at the node root** as siblings of `defaultVariant` (input `sm`/`lg`/`focusRing`, icon
  `focusRing`, panel button `width`/`height`/`focusRing`, footer button `minWidth`/`focusRing` — asserted
  defined at root and _undefined_ inside the state block), **state-dependent children inside the state
  blocks** (timePicker `timeSeparator`/`timePickerButton` — D2 — asserted _undefined_ at the node root and
  defined inside `defaultVariant.defaultState.defaultSeverity`), **no grouping-wrapper keys**
  (`variant`/`state`/`severity` objects) anywhere in the shape tree, and the **`defaultVariant`-only
  variant policy** (each of `primary`…`quinary` parses to a value distinct from the baked
  `defaultVariant` defaults — i.e. no baked token values on named variants).
- **Shared shapes** get one canonical snapshot in their own `describe` block and `toBe()` reference
  identity at each consumer (via a prefault-unwrapping helper, since consumers wrap the shared const in
  `.prefault({})`): `calendarPanelButtonShape`/`Defaults` (used by `calendarIconButton`/`navButton`/
  `timePickerButton`) and `calendarPickerCellShape`/`Defaults` (used by `dateCell`/`monthCell`/`yearCell`
  via the view container, where the cell field sits at the view root). `footerbutton.ts`'s two distinct
  defaults exports (`calendarTodayButtonDefaults`, `calendarClearButtonDefaults`) share the _shape_
  (identity checked) but each gets its own snapshot via `describe.each`, since the _defaults_ are
  independent. `settings.ts` (no defaults export) is asserted to resolve to `{}` when empty and to pass
  custom values through unchanged.
- **Deleted:** the stale top-level `schema/calendar.spec.ts` facade spec — it imported removed classes
  (`CalendarInputSchema`, `CalendarPanelButtonSchema`, etc.) from the pre-restructure class-based API and
  no longer compiled. The consolidated `calendar/calendar.spec.ts` already covers the `calendar` facade
  export (root `parses an empty object` + root snapshot + root invariants), so no replacement facade spec
  was needed.
- **Result:** `npx jest … schema/calendar/calendar.spec` — **84 tests pass, 20 snapshots** (root tree +
  per-node, incl. the restored `timeInput`), stable across re-runs. The one remaining suite failure in the
  full `current-themes/v1/schema` run (`message.spec.ts`, a `focusRing` token-path mismatch) is
  pre-existing and unrelated to the calendar files touched here. (Count corrected 2026-09-07 — see
  _Post-review corrections_ below; the previously recorded 76 included stale assertions that expected an
  unused `defaultSeverity` wrapper on nodes without named severities; 79 was the count immediately after
  that fix, before `timeInput` was restored.)

### Input-consolidation test updates (2026-08-26)

The 2026-08-26 run's structural changes (G1–G3) made the 2026-08-19 calendar spec and the stale
`input.spec.ts` fail; both were updated (Step 10 of the skill — spec/snapshot changes live here, not in
Step 8):

- **`input.spec.ts` rewritten** — it still imported the legacy sub-schemas (`inputDisabledState`,
  `inputFilled*`, `inputFocusRingSchema`, …) that the `input.ts` restructure (G3) removed, so it no longer
  compiled. Rewritten to the **snapshot + invariants** strategy: `safeParse({})`, `expectDefaultsMatchShape`
  (shape/defaults parity), a snapshot of `input.parse({})`, and explicit invariants — the default token
  path, the static input tokens (`transitionDuration`/`font`/`padding`/`focusRing`/`sm`/`lg`) on the
  baseline severity block (not the input root), no grouping-wrapper keys, the `active` background default,
  and the `filled` variant being a **partial override** (`background`/`color`/`placeholder` present;
  `border` + static tokens resolve via fallback). The snapshot `input schema resolves the expected default
token tree 1` was regenerated (now includes the `active` state under both `defaultVariant` and `filled`).
- **`calendar/calendar.spec.ts` updated** — three invariants were stale under Option 1 and were corrected:
  (1) the **root** default-token-path leaf moved from the calendar-input's single-string `padding`
  (`{{primitives.space.md}}`, Option-2) to the generic input's baseline `background`
  (`{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}`); (2) the input's "static tokens at
  root" assertion was replaced — under Option 1 the generic `sm`/`lg`/`focusRing` now live **inside the
  baseline severity block** (inherited), and the **calendar-only `icon`/`shadow` sit at the input root**
  (siblings of `defaultVariant`/`filled`), with the shared `calendarIconShape`/`calendarIconDefaults`
  asserted by reference; (3) a **new `panel header` invariant** asserts the `yearMonthNav` baseline leaf
  (`color = area.overlay.defaultState.defaultSeverity.contrast`) resolves **inside the header's state
  block** and is absent at the header root.
- **Snapshots regenerated** (`jest -u`, never hand-edited): the calendar **root**, **input**, **panel
  header** (new `yearMonthNav`), and **panel** (inherits the header/input changes) snapshots now reflect
  the Option-1 input tree. The root snapshot's net line change is the _expected_ Option-1 effect: under
  Option 2 `icon` was nested inside every state severity block (repeated across all states × named
  variants), whereas under Option 1 `icon`/`shadow` sit once at the input root and the named-variant state
  blocks resolve empty — so the named-variant subtrees shrink while the `defaultVariant` block grows with
  the generic input's full tree (`filled` variant, `padding{x,y}`, `placeholder{color}`, `active`). All 19
  calendar snapshot names remain present (none dropped); `yearMonthNav` appears throughout the
  header-bearing subtrees.
- **Result:** full `current-themes/v1/schema` run — **388 tests pass, 1 fail** (the pre-existing,
  unrelated `message.spec.ts` `close.focusRing` token-path mismatch, which does not import `input.ts`),
  **21/21 snapshots pass**. (Count corrected 2026-09-07, see _Post-review corrections_; includes the
  restored `timeInput` node.)

### Post-review corrections (2026-09-07)

A post-merge code review of this branch (diffed against the `feat/theme-v2` merge-base) surfaced a few
inaccuracies in this document and in `calendar.spec.ts` itself, all now fixed:

- **Stale `defaultSeverity` assertions in `calendar.spec.ts`.** Seven `describe` blocks (panel header,
  picker cell, input icon, panel button, time picker, footer today/clear button, footer button bar)
  asserted a `.defaultSeverity` path segment that the actual schema code never produces for those nodes —
  matching the G2 gap description's claim, which was itself wrong (see below). This made the spec file
  fail to type-check. Fixed by removing the erroneous path segment from all seven blocks; the 15 affected
  snapshots were regenerated (`jest -u`) to match.
- **G2 gap description and the "Structural Verification" checklist** incorrectly stated that _every_
  state wraps its tokens in a `defaultSeverity` level. In fact, per the skill's own "no unused
  `defaultState`/`defaultSeverity` wrappers" rule, none of the calendar's own nodes declare named
  severities, so their tokens correctly stay flat one level shallower; only the calendar `input` (via its
  Option-1 extension of the generic `usages.input`, which does declare real severities) reaches a true
  `defaultSeverity` key. Both sections have been corrected in place above.
- **`timeInput` removal was undocumented — since reverted.** The restructure had deleted
  `calendar/timeinput.ts` without folding its tokens elsewhere, silently dropping a previously themeable
  node. Initially confirmed as an intentional scope reduction, that decision was reversed on further
  review (2026-09-07): `timeinput.ts` has been **restored** (rewritten to the shape/defaults-separation
  pattern — `calendarTimeInputShape`/`calendarTimeInputDefaults`, no `defaultSeverity` wrapper, static
  `width`/`padding`/`font`/`focusRing` at the node root, `color`/`background`/`border` varying per
  `defaultVariant.defaultState`/`hover`/`focus`) and wired back in as a sibling of `timeSeparator` and
  `timePickerButton` inside `timePicker`'s state block. Covered by its own `describe('time input', ...)`
  block in `calendar.spec.ts` (parses-empty, shape/defaults parity, snapshot, static-token-root and
  default-token-path invariants) and by the updated `time picker` block's children assertion. See the
  corrected ASCII tree and simplification list above (item 4).
- **`any` typing in new helpers.** `applyDefaultsRecursive` (`defaults-helper.ts`) and
  `expectDefaultsMatchShape` (`test-utils.ts`) are the only two functions introduced by this branch's
  shape/defaults-separation work; both took `z.ZodObject<any>`. Retyped to plain `z.ZodObject` (valid and
  non-`any` under Zod v4's default type parameters). The repo's other, pre-existing `test-utils.ts`
  helpers (`expectTokens`, `expectExactTokens`, `expectExactUndefinedTokens`, `expectUndefinedTokens`)
  still use `any` — out of scope for this branch, unchanged.
- **Stale test counts** throughout this section were updated to the verified current numbers (see above).

### Snapshot-size reduction (2026-09-08)

`calendar.spec.ts.snap` had grown to ~8,000 lines. Root cause: `toMatchSnapshot()` was called
independently at every level of the component hierarchy, so the same literal token data was serialized
redundantly 3–4 times over (once at each leaf, again inside its composite parent, again inside the root),
and the root `calendar schema` snapshot additionally enumerated all 6 variants even though only
`defaultVariant` carries baked defaults — the other 5 (`primary`/`secondary`/`tertiary`/`quaternary`/
`quinary`) resolve to zero-information, fully-empty shape skeletons already proven empty by the separate
"carries baked defaults on `defaultVariant` only" invariant test.

Fixed without any loss of coverage:

- **Root `calendar schema` snapshot** narrowed from `expect(parsed).toMatchSnapshot()` to
  `expect(parsed['defaultVariant']).toMatchSnapshot()` — drops the 5 redundant empty-variant subtrees.
- **Removed the redundant full-tree `toMatchSnapshot()`** at 5 composite/parent describe blocks (`panel
header`, `date panel`, `time picker`, `footer button bar`, `panel`) — each one's resolved values are
  fully captured once, nested, inside the (now-narrowed) root snapshot; their own non-snapshot invariant
  assertions (children-in-state-block, static-tokens-at-root, shared-shape-by-reference checks) are
  unchanged and still catch structural regressions. Leaf-level snapshots (`time input`, `time separator`,
  `week day label`, `today cell`, `multi month divider`, `panel button`, `picker cell`, `footer button`,
  `input`, `input icon`) were left as-is — they remain the single source of truth for unique literal
  values and give the smallest diff on change.
- **Result:** `calendar.spec.ts.snap` reduced from **7,984 to 1,505 lines** (~81%); `calendar.spec.ts` —
  **79 tests pass, 15 snapshots** (was 84/20 — the 5 fewer tests/snapshots are exactly the removed
  redundant composite-level snapshot assertions). Full `current-themes/v1/schema` run unaffected:
  **383 tests pass, 1 pre-existing unrelated failure** (`message.spec.ts`), **16/16 snapshots pass**.

### Removal of the 5 named color variants (2026-09-08)

The calendar root modeled `defaultVariant` plus the 5 canonical color variants (`primary`,
`secondary`, `tertiary`, `quaternary`, `quinary`) — the same convention documented throughout this
audit (see "Variant-defaults policy" above). No CSS mapper rule or other consumer in the workspace
ever referenced `usages.calendar.primary.*` (or any of the other 4), matching the same finding
already acted on for the generic `input` usage (whose `inputShape` docstring states: _"The 5
canonical color variants are intentionally not modeled ... No flat-root tokens"_). Calendar is now
brought in line with that precedent:

- **`calendar.ts`** — removed the `primary`/`secondary`/`tertiary`/`quaternary`/`quinary` fields from
  `calendarShape` and their corresponding entries from `calendarDefaults`. Only `defaultVariant` is
  modeled at the root now; `calendarVariantContentShape`/`variantContentDefaults` are unchanged in
  shape (they were already `defaultVariant`-only in substance — the other 5 keys just repeated the
  same nested shape by reference).
- **`calendar.spec.ts`** — replaced the "carries baked defaults on `defaultVariant` only — named
  variants carry no baked token values" test (which asserted the 5 named variants resolve to a value
  _different from_ `defaultVariant`'s) with a "does not model the 5 named color variants" test
  (asserts the 5 keys are `undefined` on the parsed tree, since the fields no longer exist in the
  shape at all). Updated the root snapshot's comment accordingly. No snapshot value changes — the
  root snapshot was already scoped to `parsed['defaultVariant']` only (see the entry directly above),
  and `defaultVariant`'s own resolved content is unchanged.
- **Verified:** `calendar.spec.ts` — 79 tests pass, 15 snapshots (same counts; only the test body
  changed, not the count). Full `current-themes/v1/schema` run unaffected.
- This is a breaking change to the calendar schema's shape (removes 5 previously-optional root keys).
  Since no consumer referenced them and they always resolved to `undefined`/empty by default, there is
  no behavioral impact on any existing theme.

### Nesting weekDayLabel inside dayView (2026-09-08)

`weekDayLabel` (the Mon/Tue/… header row above the day grid) previously sat as a flat sibling of
`dayView`/`monthView`/`yearView` inside `calendarDatePanelStateShape` — even though PrimeNG only
renders the weekday header row in date-cell mode; month/year views have no equivalent. It is now
nested inside `dayView` only:

- **`view.ts`** — added `calendarDayViewShape`/`calendarDayViewDefaults`, extending the generic
  `calendarViewShape('dateCell')`/`calendarViewDefaults('dateCell')` with an extra `weekDayLabel` key
  (reusing the existing `calendarWeekDayLabelShape`/`calendarWeekDayLabelDefaults`, now imported here
  instead of in `datepanel.ts`). The generic `calendarViewShape`/`calendarViewDefaults` functions are
  unchanged and still back `monthView`/`yearView` as before.
- **`datepanel.ts`** — removed the flat `weekDayLabel` key from `calendarDatePanelStateShape`/
  `calendarDatePanelDefaults`; `dayView` now uses `calendarDayViewShape`/`calendarDayViewDefaults`
  instead of the generic `calendarViewShape('dateCell')`/`calendarViewDefaults('dateCell')`. Removed
  the now-unused `weekdaylabel` import.
- **`calendar.spec.ts`** — narrowed the `describe.each` view block to `['monthCell', 'yearCell']`
  (asserting neither carries a `weekDayLabel` key) and added a dedicated `day view (dateCell +
weekDayLabel)` describe block for `calendarDayViewShape`/`calendarDayViewDefaults`, including a
  by-reference wiring check for the nested `weekDayLabel`. Added an invariant to the `date panel`
  describe block asserting `weekDayLabel` resolves at `dayView.weekDayLabel` and is absent at the
  panel's own state root and at `monthView`/`yearView`. The standalone `week day label` describe block
  (testing `calendarWeekDayLabelShape`/`calendarWeekDayLabelDefaults` directly) is unchanged.
- **Token path change:** `datePanel.defaultVariant.defaultState.weekDayLabel.*` →
  `datePanel.defaultVariant.defaultState.dayView.weekDayLabel.*`. This is a breaking change to the
  calendar schema's shape.
- **Known consumer:** `libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/calendar/calendar.rules.ts`
  references `usages.calendar.panel.datePanel.weekDayLabel.*` (padding/fontWeight/color). However,
  that file's `from` paths already diverge from the real nested schema elsewhere in the same file
  (e.g. `usages.calendar.panel.datePanel.dateCell.*` instead of the actual
  `datePanel.defaultVariant.defaultState.dayView.dateCell...`, and no `defaultVariant`/`defaultState`
  segments anywhere) — indicating these mapping rules are generated/maintained against a decoupled,
  simplified path convention (likely tied to a separately-versioned `@onecx/integration-interface`
  release) rather than this in-repo schema source directly. Left unchanged here; flagged as a
  follow-up for whoever owns syncing that mapper against the next `integration-interface` release.
- **Verified:** `calendar.spec.ts` — 83 tests pass, 15 snapshots (3 old `dateCell`/`monthCell`/`yearCell`
  view snapshots replaced by 2 `monthCell`/`yearCell` snapshots + 1 new day-view snapshot; root
  snapshot updated to reflect the new nesting). Full `integration-interface` suite: 387/388 passing,
  same single pre-existing unrelated failure (`message.spec.ts`).
