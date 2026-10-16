# Multiselect — Theme Schema Structure Audit

- **Date**: 2026 (this audit)
- **Component**: Multiselect (PrimeNG `p-multiselect`)
- **Scope**: full structure + default-value audit and rewrite. The component was previously
  **unregistered** — its schema existed under a misspelled, never-imported facade
  (`schema/mulitselect.ts`) and was never wired into `current-themes.schema.ts`, so none of its
  tokens were actually part of the theme schema. This audit rebuilds the whole tree on the
  shape/defaults pattern, registers it, and wires it in.

## Canonical baseline values (from `primitives.ts`)

- **Variants** — baseline `defaultVariant`; named `primary`/`secondary`/`tertiary`/`quaternary`/
  `quinary` (not modeled here beyond `defaultVariant` + `filled`, see below — no CSS-mapper need for
  the other 4 named color variants was identified).
- **States** — baseline `defaultState`; named `hover`/`active`/`selected`/`focus`/`invalid`/
  `disabled` (used selectively per node, see tree below).
- **Severities** — not modeled; multiselect has no severity-dependent sub-elements.

## Rough schema (confirmed)

```
multiselect
├─ settings                                  (flat config pass-through, no theming tokens)
├─ defaultVariant        (dep: nothing)      → outlined (default) look
│   ├─ labelContainer     [S] defaultState/hover/focus/invalid/disabled
│   │     ├─ {background, placeholderColor, border, dropdownIcon, clearIcon}  (per state)
│   │     ├─ {font, sm, lg}                   (static — defaultState only)
│   │     └─ chip        (dep: nothing, specific/Option 2)  [S] defaultState/hover/focus
│   │           ├─ {background, color, border, focusRing}   (defaultState baseline)
│   │           ├─ {background, color, border}              (hover/focus — only the differing tokens)
│   │           └─ chipRemoveIcon  (generic/Option 1 — reuses `buttonIconOnlyShape`/`buttonIconOnlyDefaults('defaultVariant')` as-is)
│   └─ overlay           (dep: nothing, flat — no own states)
│         ├─ {background, color, border, paddingX, paddingY}
│         ├─ filter      (dep: nothing, flat)
│         │     ├─ {paddingX, paddingY, filterIcon}
│         │     ├─ checkbox   (shared/specific — same shape reused by listItem.item)  [S] defaultState/hover/focus/selected
│         │     └─ input      (specific/Option 2, independent of generic `input` usage)  [S] defaultState/hover/focus/active
│         └─ listItems   (dep: nothing, flat)
│               ├─ {paddingX, paddingY}
│               ├─ item        [S] defaultState/hover/focus/selected
│               │     ├─ {background}            (per named state only)
│               │     ├─ {paddingX, paddingY, gap, font, border, focusRing}  (static — defaultState only)
│               │     └─ checkbox  (shared with filter's checkbox, same shape/defaults by reference)
│               ├─ groupHeader  (flat, no states)
│               └─ emptyMessage (flat, no states)
└─ filled               (dep: nothing)        → same shape as defaultVariant (`multiselectVariantShape`),
                                                 only labelContainer's background/placeholder/icon-color
                                                 tokens get distinct defaults; overlay (and everything
                                                 nested inside it) has no filled-specific defaults and
                                                 falls back to defaultVariant.overlay.
```

`checkbox` (shared by `filter` and `listItems.item`) itself has its own `defaultState`/`hover`/
`focus`/`selected` axis (background/border/checkIcon).

### Structural decisions (user-confirmed)

1. **No `header` wrapper** around the select-all checkbox + filter — `filter` directly contains
   both `checkbox` and `input` as flat children, matching the original code's layout.
2. **`checkbox` is shared by reference** between `filter` (select-all) and `listItems.item`
   (per-option) — one shape/defaults module (`./checkbox`), imported by both, not duplicated.
3. **`chip`** (selected-item chip in `labelContainer`) is **specific/independent** (Option 2): its
   own minimal token set, not extending the generic top-level `chip` usage.
4. **`chipRemoveIcon`** (the chip's "x" button) is **generic/Option 1**: it reuses
   `buttonIconOnlyShape`/`buttonIconOnlyDefaults('defaultVariant')` directly, with no extra
   multiselect-specific tokens — same precedent as `button/color-variant.ts` reusing `badge`
   directly.
5. **Filter's `input`** is **specific/independent** (Option 2) rather than extending the generic
   top-level `input` usage — kept minimal and scoped to the filter's own states.
6. **`filled` variant added**, applying to the **whole tree** (`labelContainer` + `overlay`), not
   just a sub-node — `defaultVariant` and `filled` are full siblings sharing one shape
   (`multiselectVariantShape`). In practice only `labelContainer`'s own leaf tokens get distinct
   `filled` defaults (background/placeholder/icon colors); `overlay` has no filled-specific
   overrides and falls back to `defaultVariant.overlay`.

## Gap list (Step 5) — confirmed rough schema vs. actual (legacy) schema

The legacy schema (`schema/multiselect/*.ts`, class-based) was **structurally present but
completely disconnected**: `schema/mulitselect.ts` (typo'd facade, missing a "t") was never
imported by `current-themes.schema.ts`, so no multiselect token ever reached the registered theme
schema at all.

| #      | Gap                                         | Legacy                                                                                                                                                                                                                                                                                                                                                                      | Confirmed target                                                                                                                                                                                                                                                                                                                          |
| ------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **G1** | Root wiring                                 | `schema/mulitselect.ts` (misspelled, orphaned); zero references anywhere in `current-themes.schema.ts`.                                                                                                                                                                                                                                                                     | Deleted; replaced with correctly-spelled `schema/multiselect.ts` facade, imported and registered in `current-themes.schema.ts` (`UsagesInput.multiselect`, `usages.multiselect`).                                                                                                                                                         |
| **G2** | Class-based schema factories                | Every sub-file exported a `class XyzSchema { static readonly schema = ... }` using inline `.default(...)` directly on the shape.                                                                                                                                                                                                                                            | Rewritten to the shape/defaults pattern: `xyzShape` (pure, `.optional()`) + `xyzDefaults` (plain object) + `applyDefaultsRecursive` only at the top-level `multiselect.ts`.                                                                                                                                                               |
| **G3** | `filled` variant structure                  | `filled` was bolted on as a sibling of a **flattened** `labelContainer`/`overlay` (no explicit `defaultVariant` key — the plain variant's content was spread directly onto the component root).                                                                                                                                                                             | `defaultVariant` and `filled` are now explicit, symmetric siblings, both typed as `multiselectVariantShape` (`{ labelContainer, overlay }`).                                                                                                                                                                                              |
| **G4** | `chip`/`chipRemoveIcon` reuse               | `chip`'s remove-icon button hand-declared its own tokens (ad hoc, not reusing the button primitives).                                                                                                                                                                                                                                                                       | `chipRemoveIcon` now reuses `buttonIconOnlyShape`/`buttonIconOnlyDefaults('defaultVariant')` directly (Option 1).                                                                                                                                                                                                                         |
| **G5** | Redundant per-state static duplication      | `labelContainer`, `input` (filter), and `listItem` all duplicated static tokens (`font`/`sm`/`lg`, `paddingX`/`paddingY`/`font`/`focusRing`, `paddingX`/`paddingY`/`gap`/`font`/`border`/`focusRing` respectively) identically across every named state.                                                                                                                    | Static tokens pruned to live only on `defaultState`; named states (`hover`/`focus`/`invalid`/`disabled`/`selected`/`active`) carry only the tokens that actually differ (background/color/border/placeholder, etc. — per Step 7).                                                                                                         |
| **G6** | `settings` required fields                  | `scrollHeight`, `selectOnFocus`, `autoOptionFocus` were required (no `.optional()`), inconsistent with `dropdownSettingsShape`'s fully-optional convention.                                                                                                                                                                                                                 | All three made `.optional()`.                                                                                                                                                                                                                                                                                                             |
| **G7** | `font.style` copy-paste bug                 | `groupheader.ts` and `labelcontainer.ts` both defaulted `font.style` to `'{{primitives.font.color}}'` (wrong primitive — copy-paste from the `color` field).                                                                                                                                                                                                                | Fixed to `'{{primitives.font.style}}'` in both files.                                                                                                                                                                                                                                                                                     |
| **G8** | `listitem.ts` selected-state reference path | `selectedTokens.background` referenced `'{{primitives.primary.state.selected.defaultSeverity.bg}}'` — **`primitives.primary` does not exist at all** (verified against `primitives.ts`: the root only exposes `primitives.variant.primary`, never a bare `primitives.primary`), so this was a broken/dangling reference, not merely a different-but-valid primitive choice. | Fixed to `'{{primitives.variant.primary.state.selected.defaultSeverity.bg}}'`, matching `checkbox.ts`'s equivalent `selected` reference. This is a structural path-correctness fix (the path didn't resolve to anything), not a semantic judgment call, so it's within this skill's scope despite the "no reference-path semantics" rule. |

**Confirmed OK (no change):** `groupHeader`/`emptyMessage` staying flat with no state axis;
`overlay`/`listItems`/`filter` staying flat (dependency `nothing`) with no own variant/state axis;
`prefault({})` discipline on every nested object field.

## Default-value policy (Step 7)

**Mandatory baseline** — every state-bearing node's `defaultState` (and, for `checkbox`/
`listItems.item`, its `selected` state) carries the full token set it renders. Named states only
carry tokens that clearly differ from that baseline:

| Node             | `defaultState` (full baseline)                                                                                                                    | Named states — only differing tokens                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `labelContainer` | background, placeholderColor, border (incl. width/offset/radius), dropdownIcon (incl. size/padding), clearIcon (incl. size/padding), font, sm, lg | `hover`/`focus`/`invalid`/`disabled`: background, placeholderColor, border.color/style, dropdownIcon.color, clearIcon.color |
| `chip`           | background, color, border (incl. width/offset/radius), focusRing                                                                                  | `hover`/`focus`: background, color, border.color/style                                                                      |
| `filter.input`   | paddingX, paddingY, font, background, color, border (incl. width/offset/radius), focusRing                                                        | `hover`/`focus`/`active`: background, color, border.color/style                                                             |
| `checkbox`       | background, border (incl. width/offset/radius), checkIcon                                                                                         | `hover`/`focus`/`selected`: background, border.color/style, checkIcon                                                       |
| `listItems.item` | paddingX, paddingY, gap, font, border, background, focusRing                                                                                      | `hover`/`focus`/`selected`: background only                                                                                 |
| `groupHeader`    | paddingX, paddingY, font, color                                                                                                                   | — (no states)                                                                                                               |
| `emptyMessage`   | paddingX, paddingY, font, color                                                                                                                   | — (no states)                                                                                                               |
| `overlay`        | background, color, border, paddingX, paddingY                                                                                                     | — (no states)                                                                                                               |

> **Border/icon static sub-fields are not duplicated per state.** `border.width`/`offset`/
> `radius` (and `dropdownIcon`/`clearIcon`'s `size`/`paddingX`/`paddingY`) never change across
> named states, so — matching the generic top-level `input.ts` precedent — they are defined once
> on `defaultState` only. Named states carry just the sub-fields that actually differ
> (`border.color`/`border.style`, icon `.color`). An initial pass over-filled these consts via a
> shared `commonBorder`/`commonDropdown`/`commonClearIcon` object spread into every state; this
> was corrected during the default-value re-audit (see Testing section).

**`filled` variant** — only `labelContainer`'s per-state `background`/`placeholderColor`/
`dropdownIcon.color`/`clearIcon.color` get distinct defaults, referencing
`{{primitives.variant.primary.<state>.defaultSeverity...}}` instead of
`{{primitives.defaultVariant.<state>.defaultSeverity...}}`; `border`/`font`/`sm`/`lg`/icon
size+padding (which never differ between the two variants) and the entire `overlay` subtree are
intentionally absent from `filled`'s defaults (for every state, including `defaultState`) and
fall back to `defaultVariant`.

## Summary of changes applied (Step 8)

- Rewrote all 13 sub-schema files under `schema/multiselect/` to the shape/defaults pattern:
  `checkbox.ts`, `chipremoveiconbutton.ts`, `chip.ts`, `emptymessage.ts`, `groupheader.ts`,
  `input.ts`, `filter.ts`, `labelcontainer.ts`, `listitem.ts`, `listitems.ts`, `overlay.ts`,
  `settings.ts`, `variant.ts`, and the main `multiselect.ts`.
- Deleted the orphaned `schema/mulitselect.ts` and created a correctly-spelled
  `schema/multiselect.ts` facade re-exporting `multiselect`/`multiselectShape`.
- Wired `multiselect` into `current-themes.schema.ts` (`UsagesInput.multiselect`,
  `usages.multiselect`).
- Verified the library builds/type-checks cleanly (`nx build integration-interface`), including
  JSON-schema generation.
- Test/spec files were intentionally **not** touched in this step — see Step 10 below.

## Testing (Step 10)

Added a single `schema/multiselect/multiselect.spec.ts` with exactly three tests:

- `multiselect.safeParse({}).success === true`
- `multiselect.parse({})` matches a snapshot (`__snapshots__/multiselect.spec.ts.snap`)
- `expectDefaultsMatchShape(multiselect, multiselectDefaults)`

No legacy spec file existed for this component (it was never wired in), so this was a pure
addition, not a replacement. While reviewing the generated snapshot, found and fixed two bugs:

1. The `filled` variant's reference-path builder (`multiselectLabelContainerFilledStateDefaults`
   in `labelcontainer.ts`): named states were missing the `state.` path segment (producing
   `primitives.variant.primary.hover...` instead of `primitives.variant.primary.state.hover...`,
   inconsistent with every other named-state reference in the component, e.g. `checkbox.ts`'s
   `primitives.variant.primary.state.selected...`).
2. `listitem.ts`'s `selected.background` referenced the non-existent `primitives.primary...` (see
   gap G8) — fixed to `primitives.variant.primary...` and the snapshot regenerated.

A follow-up re-audit of the default-value breadth (Step 7) across all 13 files found a third
issue: `chip.ts`, `input.ts` (filter), `checkbox.ts`, and `labelcontainer.ts` all spread a shared
`commonBorder` (and, in `labelcontainer.ts`, also `commonDropdown`/`commonClearIcon`) object into
every named state's defaults, duplicating static `border.width`/`offset`/`radius` and icon
`size`/`paddingX`/`paddingY` values that never actually change across states. Per the generic
top-level `input.ts` precedent (its `stateTokens()` helper only overrides `border.color`/`style`
per state), these static sub-fields were pruned to live only on `defaultState` (and, for the
`filled` variant's icon tokens, removed entirely since they don't differ from `defaultVariant` at
all). Re-ran the full suite after this change — all 437 tests pass, 100% coverage on every
`schema/multiselect/*.ts` file, snapshot regenerated.

Ran `nx test integration-interface -t multiselect` (both with and without `CI=true`, matching the
workspace's `nx test integration-interface` task) — all 3 tests pass, snapshot regenerated and
committed after all fixes.
