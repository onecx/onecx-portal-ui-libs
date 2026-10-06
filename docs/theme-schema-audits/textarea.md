# Textarea — Theme Schema Structure Audit

- **Date**: 2026-09-30
- **Component**: `textarea` (single-file schema: `schema/textarea.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `help`, `warning`, `danger`, `contrast`

## Rough schema (confirmed)

A PrimeNG `<Textarea>` renders a single `.p-textarea` element — **no themable children/subcomponents**. Steps 2 (parent↔child dependencies) and 3 (generic/specific consolidation) are therefore trivial: there are no child relationships to establish and no generic-child consolidation decisions to make.

```
textarea (root) — no children (single .p-textarea element)
├── settings { autoResizeX, autoResizeY, variant, fluid }   # root-level, no defaults
├── defaultVariant                      # outlined variant (baseline)
│   ├── defaultState                    # tokens sit directly on the state (no severity wrapper)
│   │   ├── font        { weight, lineHeight, letterSpacing, style }
│   │   ├── border      { color, style, width, offset, radius, shadow }
│   │   ├── transitionDuration
│   │   ├── focusRing   { color, style, width, offset, radius, shadow }
│   │   ├── sm          { font{size}, paddingX, paddingY }
│   │   ├── md          { font{size}, paddingX, paddingY }
│   │   ├── lg          { font{size}, paddingX, paddingY }
│   │   ├── cursor
│   │   ├── background
│   │   ├── color
│   │   └── placeholderColor
│   ├── hover      { border{color} }                                        # per-state defaults (see below)
│   ├── focus      { border{color} }
│   ├── disabled   { background, color, border{color} }
│   └── invalid    { border{color}, placeholderColor }
└── filled                            # custom variant (partial override of defaultVariant)
    ├── defaultState  { background, color, placeholderColor }                # full baseline set
    ├── hover         { background, border{color} }
    ├── focus         { background, border{color} }
    ├── disabled      { background, color, border{color} }
    └── invalid       { placeholderColor, border{color} }
```

> **Per-state defaults are minimal.** The shape still declares every token under each state (all `.optional()`), but the *defaults* carry only tokens that visibly differ from `defaultState` for that state — the rest resolve via the runtime fallback. One structural simplification applies everywhere: **no per-state `border.style`** (only the border *color* changes across states; the style inherits from `defaultState`). Both variants do carry a per-state `border.color` — the `filled` states follow the same border-color shift as the outlined `defaultVariant` (pointing at `variant.primary.state.<state>`).

> **No `defaultSeverity` wrapper.** The textarea declares **named states** but **no named severities**, so per the Step 7 rule its leaf tokens sit directly on the state level (`<variant>.<state>.<token>`) — a `defaultSeverity` key would be a superfluous empty wrapper and is omitted. Note this is the *usage-schema* nesting only: the `{{primitives...}}` reference strings still target the primitives tree, which genuinely nests its per-state values under a `defaultSeverity` key (e.g. `primitives.defaultVariant.state.hover.defaultSeverity.bg`), so those refs are unchanged.

### Structural decisions (user-confirmed)

1. **Variant layers**: `defaultVariant` (outlined baseline) + `filled` (custom variant). The 5 canonical color variants (`primary`…`quinary`) were intentionally *not* added — the textarea CSS mapper references no `usages.textarea.primary.*` etc. (it reads only `usages.textarea.*` and `usages.textarea.filled.*`), and `filled` is already modeled as a custom variant slot in `input`/`multiselect`.
2. **States**: `defaultState` + `hover`, `focus`, `disabled`, `invalid`. **`active` removed** — a standalone textarea has no pressed/touch-down interaction (`focus` covers interacting), the mapper reads zero `usages.textarea.active.*` paths, and the legacy `active` blocks only pointed at primitive slots nothing consumes. (The `input` sibling keeps `active` because the *calendar* input uses it for the panel-open background; that rationale does not exist here.)
3. **Severities**: **none** — the textarea declares no named severities, so there is **no `defaultSeverity` wrapper** anywhere in its usage shape; leaf tokens sit directly on the state. (The skill's Step 7 rule: a `defaultSeverity` wrapper key exists only when the node declares named severities to distinguish from the default; the textarea declares none.)
4. **Token placement**: **everything under states** — no flat-root static tokens; all leaf tokens, including the formerly-static `font`/`border`/`sm`/`md`/`lg`/`focusRing`/`cursor`/`transitionDuration`, live directly on the state (the variant/state path, with no severity level).
5. **`filled` is a partial override**: carries only its necessary tokens (`background`, `color`, `placeholderColor`); static tokens and `border` are omitted and resolve via the runtime fallback from `defaultVariant` (matches `input` and the legacy schema's semantics, where static tokens were shared at the top level).
6. **`placeholderColor` stays flat** (direct token on the severity leaf), not input's nested `placeholder: { color }` — matches the existing `usages.textarea.placeholderColor` mapper path and the legacy shape.
7. **`cursor` kept at baseline** (`cursor: 'pointer'` on `defaultVariant.defaultState`); `filled` falls back and no named state carries it. The mapper reads no cursor path; this preserves legacy behavior faithfully.
8. **`settings` kept at root** with no defaults (a root-level sibling of the variant slots, carried over from the legacy schema) — `autoResizeX`/`autoResizeY`/`variant`/`fluid`.
9. **Per-state `border` trimmed to `color`/`style`** — width/offset/radius/shadow are not repeated per state; they resolve via fallback from the baseline (matches `input`).
10. **`focusRing` on the severity leaf** (not inside a state object), defaulted once on the baseline severity leaf; `filled` falls back.

## Gap list (Step 5) — confirmed rough schema vs. actual `textarea.ts` (legacy)

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| G1 | Shape/defaults separation | `.default()` baked into shapes; no `*Shape`/`*Defaults` split | `textareaShape` (pure, all optional) + `textareaDefaults` (plain objects) + `applyDefaultsRecursive(textareaShape, textareaDefaults)` |
| G2 | Missing `defaultVariant`/`defaultState` slots (plus an unwanted `defaultSeverity` wrapper) | Baseline tokens at component root; states flat siblings | `defaultVariant` as its own baseline slot, `filled` a flat sibling; every token directly under `<variant>.<state>` (no `defaultSeverity` wrapper — the textarea declares no named severities) |
| G3 | `filled` over-modeled | Full `baseTokens` spread duplicated into `filled` (+ its 6 states), incl. border overrides pointing at `variant.primary` | `filled` = partial override: `defaultState` carries `background`/`color`/`placeholderColor`; `hover`/`focus` carry `background`+`border.color`; `disabled` carries `background`/`color`/`border.color`; `invalid` carries `placeholderColor`/`border.color` |
| G4 | Dead `active` state | Modeled in both variants (6 stateful sub-schemas), 0 consumer reads | Removed |
| G5 | Per-state defaults over-modeled | Uniform 5-token set (`background`/`color`/`placeholderColor`/`border.color`/`border.style`) repeated across every state | **Minimal per-state defaults** — each state carries only the tokens that differ for that state (see "Differentiated named-state defaults"); no per-state `border.style` on either variant |
| G6 | Legacy sub-schema exports | 10 named exports (`hoverTextareaStyles`, `activeTextareaStyles`, `focusTextareaStyles`, `disabledTextareaStyles`, `invalidTextareaStyles`, `filledTextareaStyles`, `hoverFilledTextareaStyles`, `activeFilledTextareaStyles`, `focusFilledTextareaStyles`, `disabledFilledTextareaStyles`, `invalidFilledTextareaStyles`) imported only by the legacy spec | Removed; keep `textarea`, `textareaShape`, `textareaDefaults`, `textareaSettings`, `textareaSize` |

Children coverage: none (no gap). States coverage: matches after `active` removal (no gap). All 6 items accepted by the user.

## Default-value policy (Step 7)

**Variant-coverage policy**: `defaultVariant` and `filled` each carry their own defaults; no other named variants exist. `filled` carries only its necessary tokens (partial override; the rest fall back from `defaultVariant`).

**`defaultVariant.defaultState` — full baseline set** (no severity wrapper; all references carried over unchanged from the legacy schema — the restructure moves structure, not values):

| Token | Reference |
|-------|-----------|
| `font.weight` | `{{primitives.font.weight}}` |
| `font.lineHeight` | `{{primitives.font.lineHeight}}` |
| `font.letterSpacing` | `{{primitives.font.letterSpacing}}` |
| `font.style` | `{{primitives.font.style}}` |
| `border.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |
| `border.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}` |
| `border.width` | `{{primitives.border.width.md}}` |
| `border.offset` | `{{primitives.border.offset.none}}` |
| `border.radius` | `{{primitives.radius.md}}` |
| `border.shadow` | `{{primitives.shadow.none}}` |
| `transitionDuration` | `{{primitives.transition.duration}}` |
| `focusRing.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}` |
| `focusRing.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}` |
| `focusRing.width` | `{{primitives.border.width.md}}` |
| `focusRing.offset` | `{{primitives.border.offset.none}}` |
| `focusRing.radius` | `{{primitives.radius.md}}` |
| `focusRing.shadow` | `{{primitives.shadow.none}}` |
| `sm.font.size` / `sm.paddingX` / `sm.paddingY` | `{{primitives.font.size}}` / `{{primitives.space.xs}}` / `{{primitives.space.xs}}` |
| `md.font.size` / `md.paddingX` / `md.paddingY` | `{{primitives.font.size}}` / `{{primitives.space.md}}` / `{{primitives.space.md}}` |
| `lg.font.size` / `lg.paddingX` / `lg.paddingY` | `{{primitives.font.size}}` / `{{primitives.space.md}}` / `{{primitives.space.md}}` |
| `cursor` | `pointer` |
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `placeholderColor` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |

## Differentiated named-state defaults

Per-state defaults are **minimal** — a token is carried only when it visibly differs from `defaultState` for that state; everything else resolves via the runtime fallback from `defaultState`. Both variants carry a per-state `border.color` (a filled field's border darkens/dims exactly as the outlined one does). No per-state `border.style` (only the border *color* changes across states).

| Variant | State | Defaulted tokens (reference) |
|---------|-------|------------------------------|
| `defaultVariant` | `hover` | `border.color` — `{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}` |
| `defaultVariant` | `focus` | `border.color` — `{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}` |
| `defaultVariant` | `disabled` | `background` — `{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}` · `color` — `…disabled.defaultSeverity.contrast` · `border.color` — `…disabled.defaultSeverity.border.color` |
| `defaultVariant` | `invalid` | `border.color` — `{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}` · `placeholderColor` — `…invalid.defaultSeverity.contrast` |
| `filled` | `defaultState` | `background` — `{{primitives.variant.primary.defaultState.defaultSeverity.bg}}` · `color` / `placeholderColor` — `…defaultState.defaultSeverity.contrast` |
| `filled` | `hover` | `background` — `{{primitives.variant.primary.state.hover.defaultSeverity.bg}}` · `border.color` — `…hover.defaultSeverity.border.color` |
| `filled` | `focus` | `background` — `{{primitives.variant.primary.state.focus.defaultSeverity.bg}}` · `border.color` — `…focus.defaultSeverity.border.color` |
| `filled` | `disabled` | `background` — `{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}` · `color` — `…disabled.defaultSeverity.contrast` · `border.color` — `…disabled.defaultSeverity.border.color` |
| `filled` | `invalid` | `placeholderColor` — `{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}` · `border.color` — `…invalid.defaultSeverity.border.color` |

(`…` abbreviates `{{primitives.defaultVariant.state` for the `defaultVariant` rows and `{{primitives.variant.primary.state` for the `filled` rows, i.e. the same `…<state>.defaultSeverity.…` tail.)

**Rationale** (was uniform 5-token per-state before this grill):
- `hover`/`focus` `background`/`color`/`placeholderColor` dropped on `defaultVariant` — a textarea's background/foreground don't change on hover/focus; only the border does. `border.style` dropped everywhere.
- `defaultVariant.disabled` keeps `background`+`color` (the dimmed look) **and** `border.color` (kept at the user's request).
- `defaultVariant.invalid` drops `background`/`color` (invalid doesn't repaint the field bg or the typed text — only the border and placeholder turn red).
- Both variants carry a per-state `border.color` — the filled field's border darkens/dims exactly as the outlined one does (`variant.primary.state.<state>`). `border.style` is not repeated per state on either variant.
- `filled.hover`/`focus` = `background`+`border.color` (the filled bg and border shift on hover/focus; text stays at the filled baseline).
- `filled.disabled` = `background`+`color`+`border.color` (a disabled filled field dims its bg, text, and border); `filled.invalid` = `placeholderColor`+`border.color` (invalid tints the placeholder and turns the border red). All four filled states carry `border.color` at the user's request.

All omitted tokens stay `.optional()` and resolve via the runtime fallback mechanism (from `defaultState` within a variant, or from `defaultVariant` for `filled`'s omitted static tokens).

## Changes applied (Step 8)

- **Rewrote `schema/textarea.ts`** with the shape/defaults separation pattern:
  - `textareaShape` — pure shape, all keys optional, nested objects `.prefault({})`, no `.default()`.
  - `textareaDefaults` — plain defaults tree mirroring the shape (full baseline on `defaultVariant.defaultState` — **no `defaultSeverity` wrapper**, since the textarea declares no named severities; named states carry only their differing tokens; `filled` partial).
  - `textarea` — `applyDefaultsRecursive(textareaShape, textareaDefaults).register(themeSchemaRegistry, { id: 'textarea' })`.
  - **Per-state defaults trimmed to a minimal set** (re-grilled in follow-up passes): the shape is unchanged (every token still declared `.optional()` under each state), but the defaults now carry only the tokens that visibly differ for that state. Removed the uniform per-state `background`/`color`/`placeholderColor`/`border.style`. `defaultVariant`: `hover`/`focus` → `border.color` only; `disabled` → `background`/`color`/`border.color`; `invalid` → `border.color`/`placeholderColor`. `filled`: `hover`/`focus` → `background`+`border.color`; `disabled` → `background`/`color`/`border.color`; `invalid` → `placeholderColor`/`border.color`. (The `filled` per-state `border.color` was added at the user's request so the filled states track the outlined border-color shift.) The `{{primitives...}}` reference strings are unchanged — only the set of *states that carry defaults* changed.
- **Removed legacy exports** (`hoverTextareaStyles`, `activeTextareaStyles`, `focusTextareaStyles`, `disabledTextareaStyles`, `invalidTextareaStyles`, `filledTextareaStyles`, `hoverFilledTextareaStyles`, `activeFilledTextareaStyles`, `focusFilledTextareaStyles`, `disabledFilledTextareaStyles`, `invalidFilledTextareaStyles`). Verified no non-spec file imports any of them — the only consumer is `current-themes.schema.ts`, which imports just `textarea`.
- **Kept exports**: `textarea` (assembled schema), `textareaShape`, `textareaDefaults`, `textareaSettings`, `textareaSize` (reusable sub-shapes).
- **Reference-path note (out of scope, flagged):** the legacy `filled`/`defaultVariant` named-state refs used `variant.primary.state.<state>` / `defaultVariant.state.<state>` (with the `state` segment). These were carried over unchanged. The sibling `input.ts` restructure emitted `variant.primary.<state>` *without* the segment for 4 of its 5 `filled` states (an internally inconsistent artifact — its own `active` state uses the segment). This audit keeps the `state` segment everywhere, matching the `defaultVariant.state.<state>` convention (330× across schemas), the legacy values, and the primitives tree (named states live under `variant.primary.state.*`). See Out-of-scope notes.
- **Migrated the CSS mapper `from:` paths** to the restructured nested shape (done as a follow-up, since `input`/`calendar`'s restructures did the same): `mapping-rules/usages/textarea.rules.ts` now reads `usages.textarea.defaultVariant.defaultState.*` / `usages.textarea.defaultVariant.<state>.*` / `usages.textarea.filled.<state>.*` (the `to:`/`transform:` fields are unchanged). **No `defaultSeverity` segment** on any path — textarea declares no named severities (unlike `input`, whose migrated paths carry it). All 29 rules were flat before; 22 read the removed flat baseline/state paths (`usages.textarea.background`, `usages.textarea.hover.border.color`, `usages.textarea.sm.font.size`, …) and resolved `undefined` at runtime, so no textarea tokens were emitted.
- **Fixed the `UsagesInput.textarea` type** (required for the mapper paths to type-check): `current-themes.schema.ts` now types it as `z.input<typeof textareaShape>` (the pure shape) instead of `z.input<typeof textarea>` (the assembled schema). The assembled `applyDefaultsRecursive` output type is loose (`z.input` collapses to `Record<string, unknown>`), which made the `usages.textarea` arm of `ThemePath` empty — so *no* `usages.textarea.*` path (flat or nested) was assignable to `ThemePath` (the type of `MappingRule.from`). Every other restructured usage (`input`, `chip`, `badge`, …) already references its `*Shape`, not the assembled schema.
- **Validation**: `tsc -p tsconfig.lib.json --noEmit` reports **0 errors**; `nx lint integration-interface` passes ("All files pass linting"). The mapper `from:` paths are compile-time-validated against `ThemePath` (a negative probe confirms a nonexistent `usages.textarea.…` path is now rejected).
- **Test/spec files intentionally left unchanged** in Step 8 (per the audit workflow) — the legacy `schema/textarea.spec.ts` imported removed exports and would fail until replaced in Step 10.

## Testing (Step 10)

- **Replaced `schema/textarea.spec.ts`** (single-file component → the one in-place spec). The new spec contains exactly three tests in one `describe` block:
  1. `parses an empty object` — `textarea.safeParse({})` succeeds.
  2. `resolves the expected default token tree` — `expect(textarea.parse({})).toMatchSnapshot()` on the **full** parsed object.
  3. `shape and defaults stay in sync` — `expectDefaultsMatchShape(textarea, textareaDefaults)`.
  It imports only `textarea` and `textareaDefaults` — no legacy sub-schema shape/defaults imports, no per-state `describe` blocks, no hand-written structural assertions.
- **Generated `__snapshots__/textarea.spec.ts.snap`** (committed, regenerated from code — never hand-edited). Snapshot verified to match the confirmed tree: full baseline on `defaultVariant.defaultState` — **tokens sit directly on the state, with no `defaultSeverity` wrapper key**; per-state defaults are minimal: `defaultVariant.hover`/`focus` carry only `border.color`; `defaultVariant.disabled` carries `background`/`color`/`border.color`; `defaultVariant.invalid` carries `border.color`/`placeholderColor`; `filled.defaultState` carries the full `background`/`color`/`placeholderColor` baseline, `filled.hover`/`focus` carry `background`/`border.color`, `filled.disabled` carries `background`/`color`/`border.color`, and `filled.invalid` carries `placeholderColor`/`border.color`. The `filled` named states correctly reference `variant.primary.state.<state>` with the `state` segment (including `…border.color`); `filled.defaultState` references `variant.primary.defaultState`. No `active` key present anywhere. Note the `{{primitives...}}` reference *strings* inside the snapshot still contain a `defaultSeverity` segment — that is the primitives-tree path (correct and unchanged), distinct from the usage-schema nesting.
- **Result**: `nx test integration-interface --testFile=…/textarea.spec.ts` → **3/3 pass**, 1 snapshot written. `tsc --noEmit` 0 errors; `nx lint integration-interface` passes.

## Out-of-scope notes

- ~~The CSS mapper read the legacy flat paths (`usages.textarea.background`, …)~~ — **resolved**: the mapper `from:` paths were migrated to the restructured nested shape (see the "Migrated the CSS mapper `from:` paths" and "Fixed the `UsagesInput.textarea` type" items in Step 8). No remaining consumer-side gap for the textarea mapper. (Note the usage paths carry **no** `defaultSeverity` segment, since textarea declares no named severities — unlike the `input`/`calendar` mappers.)
- The legacy schema referenced `{{primitives.border.width.*}}` / `{{primitives.border.offset.*}}` under a `primitives.border` key that is not part of the current `primitivesShape` (which has `radius`, `focusRing`, but no `border` aggregate). These references were carried over unchanged; this skill is structure-only w.r.t. reference-path semantics.
- The `filled` named-state reference-segment inconsistency in the sibling `input.ts` (4 of 5 states omit the `state` segment) was **not** propagated here; `textarea` uses the segment uniformly. Whether to reconcile `input.ts` to the same convention is out of scope for this audit.
