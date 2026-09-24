# Button — Theme Schema Structure Audit

- **Date**: 2026-09-16 (initial audit + rewrite; re-audit and border-token trim same day)
- **Component**: Button
- **Scope**: structure-only audit — confirm the token shape (variant- and state-dependency axes +
  baseline `defaultState` / `defaultSeverity` slots), repair the broken/duplicated schema,
  reconcile both consumer layers to the new paths, then trim invariant default tokens. Values
  stay as `{{primitives…}}` references; no primitive values are authored here.

## Canonical baseline values (from `primitives.ts`)

- **Color variants** — baseline `defaultVariant` (the plain, non-colored button); named `primary`,
  `secondary`.
- **Shape variants** — a second variant-dependency axis nested under each color variant; baseline
  `defaultVariant` (the plain button, no shape modifier); named `rounded`, `raised`, `text`,
  `textRaised` (primitives segment `raisedText`), `outlined`, `iconOnly`.
- **States** — baseline `defaultState`; named `hover`, `active`, `focus`, `disabled`.
- **Severities** — baseline `defaultSeverity`; named `success`, `info`, `warning`, `danger`,
  `contrast`.
- **Sizes** — static `sm` / `md` / `lg` (no baseline slot; self-defaulting, color-independent).

## Rough schema (confirmed)

Every state-bearing node `[S]` carries `defaultState` → named-state slots → `defaultSeverity` →
named-severity slots before its leaf tokens. Shape is itself a variant-dependency axis (mirroring
`primitives.<colorPrefix>.defaultVariant…` vs `primitives.<colorPrefix>.variant.<shape>…`): the
plain button sits under its own `defaultVariant` key, a flat sibling of the named shape variants,
rather than flattened onto the color-variant root. Shape variants are full stateful nodes, not flat
severity groups. Static leaves (`font`, `paddingX`/`paddingY`, `focusRing`, `sm`/`md`/`lg`) sit
flat at the color-variant root, siblings of the shape axis.

```
button
└─ defaultVariant / primary / secondary              (color variants — identical shape, distinct refs)
   ├─ defaultVariant     [S] (dep: shape)   → the plain button (no shape modifier)
   │     └─ defaultState / hover / active / focus / disabled
   │           └─ defaultSeverity / success / info / warning / danger / contrast
   │                 └─ {background, color, border{color, style, radius, shadow}}
   ├─ rounded            [S] (dep: shape)   → same stateful/severity shape, radius.full / shadow.none
   ├─ raised             [S] (dep: shape)   → same shape, radius.md / shadow.md
   ├─ text               [S] (dep: shape)   → same shape, radius.md / shadow.none
   ├─ textRaised         [S] (dep: shape)   → same shape, radius.md / shadow.md (primitives seg `raisedText`)
   ├─ outlined           [S] (dep: shape)   → same shape, radius.md / shadow.none
   ├─ iconOnly           [S] (dep: shape)   → stateful shape + {width, icon{color, size}}
   ├─ font               (weight, lineHeight, letterSpacing, style — family/size excluded)
   ├─ paddingX, paddingY
   ├─ focusRing          (color, style, width, offset)
   ├─ sm / md / lg       → {font{size}, paddingX, paddingY}   (self-defaulting)
   └─ badge              (static child token)
```

Full leaf path for the plain button, primary color, hover state, danger severity:
`button.primary.defaultVariant.hover.danger.*` (1st segment = color variant, 2nd = shape variant).

### Structural decisions (user-confirmed)

1. **Color variant is a first-class axis** with its own baseline `defaultVariant`; `primary` and
   `secondary` are named siblings, each carrying the **full** token tree (all shape/state/severity
   slots), not just a thin set — matching the legacy behavior where each color variant was themed
   explicitly with its own `primitives.<colorPrefix>…` reference family.
2. **Shape is a nested, second variant axis.** The plain button lives under its own `defaultVariant`
   key, a flat sibling of `rounded`/`raised`/`text`/`textRaised`/`outlined`/`iconOnly` — **not**
   flattened onto the color-variant root (this was Gap G5 below).
3. **States** use a baseline `defaultState` flat sibling of `hover`/`active`/`focus`/`disabled`.
4. **Severities** use a baseline `defaultSeverity` flat sibling of
   `success`/`info`/`warning`/`danger`/`contrast`.
5. **Static leaves** (`font`, `paddingX`/`paddingY`, `focusRing`, `sm`/`md`/`lg`, `badge`) stay
   flat at the color-variant root — siblings of the shape axis, with no `default*` wrapper.

## Gap list (Step 4) — confirmed rough schema vs. actual `button.ts`

The button schema was **broken at HEAD**: `button.ts` imported `./default-variant`, a module that
never existed (the real files were `default.ts` / `primary-variant.ts` / `secondary.ts`), so the
library failed to build/type-check. Beyond the broken import, those three legacy files hand-
duplicated the entire token tree three times (one full copy per color variant) with no shared shape
and no baseline-slot convention.

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| **G1** | `button.ts` (root) — **broken import** | Imported `./default-variant` (nonexistent); real files were `default.ts`/`primary-variant.ts`/`secondary.ts`; library failed to build. | Root rewritten as `button.ts` + factory files `color-variant.ts` / `stateful.ts` / `severity.ts` / `icon-only.ts` / `sizes.ts`. |
| **G2** | All state-bearing nodes (root + every shape variant) — **no baseline slots** | States and severities were flattened directly onto their parent object; no `defaultState`/`defaultSeverity`. | Every state-bearing node has `defaultState` (flat sibling of the 4 named states); every severity-bearing node has `defaultSeverity` (flat sibling of the 5 named severities). |
| **G3** | The three legacy files — **~3× duplication** | Each color variant hand-duplicated the entire tree (root state axis + 6 shape variants + 3 size variants); no shared shape. | One shared `buttonColorVariantShape` for all 3 variants + one factory chain `buttonSeverityGroupDefaults` → `buttonStatefulDefaults` → `buttonColorVariantDefaults` parameterized by `colorPrefix` (`defaultVariant` / `variant.primary` / `variant.secondary`). |
| **G4** | `iconOnly.icon` — **inconsistent presence** | `default.ts`'s `iconOnly` had `icon` (color + size); `primary-variant.ts`/`secondary.ts` did not. | `iconOnly.icon` present uniformly on all 3 color variants via the shared `buttonIconOnlyDefaults` factory. |
| **G5** | `color-variant.ts` — **missing shape-variant `defaultVariant` wrapper** | The plain button was `.extend()`-ed directly onto the color-variant root, flattening `defaultState`/`hover`/… there. | Plain button nested under its own `defaultVariant` key, a flat sibling of the named shape variants; both consumer-rule files gained a `.defaultVariant` segment in every plain-shape path (64 + 42 paths). |

**Confirmed OK (no change):** shape-variant reuse of the identical stateful/severity token set;
size variants staying static/self-defaulting with no baseline-slot wrapper; the `textRaised` →
`raisedText` primitives-segment quirk (preserved via an explicit lookup map rather than renamed, to
avoid a breaking change on the primitives side); `prefault({})` discipline throughout; no
`variant`/`state`/`severity` grouping-wrapper keys anywhere in the shape tree.

**Coverage:** G1–G5 reconcile the full confirmed tree — root import, all state-bearing nodes, all
three color variants, the `iconOnly` extra tokens, and the shape-variant nesting. Every
color-variant × shape × state × severity leaf is generated by the shared factories.

## Default-value policy (Step 5a — `defaultState` defaults)

**Variant coverage:** all three color variants get **full** baked defaults (not just
`defaultVariant`). Each leaf references its own `primitives.<colorPrefix>.<shapeSeg>.<stateSeg>.
<sev>.…` path family — the legacy schema themed all three explicitly with distinct primitive
references, so this is preserved, just re-derived through the factory instead of hand-duplicated.

**Severity-leaf token references.** Every severity leaf (`defaultSeverity` + the 5 named
severities) carries:

| Token (severity leaf) | Reference (baseline slot, plain button) |
|-----------------------|------------------------------------------|
| `background` | `{{primitives.<cv>.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.<cv>.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `border.color` | `{{primitives.<cv>.defaultVariant.defaultState.defaultSeverity.border.color}}` |
| `border.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}` — single canonical design token (see border-token trim) |
| `border.radius` | shape constant (see per-shape table below) |
| `border.shadow` | shape constant (see per-shape table below) |

where `<cv>` ∈ `defaultVariant` / `variant.primary` / `variant.secondary`. The `textRaised` shape
segment maps to the primitives segment `raisedText` (all other shape keys are used verbatim, the
root shape-variant as `defaultVariant`).

**Per-shape `radius`/`shadow` constants** (supplied by the enclosing shape variant; identical
across color variants and states):

| Shape variant | `border.radius` | `border.shadow` |
|---------------|-----------------|-----------------|
| root / `defaultVariant` | `{{primitives.radius.md}}` | `{{primitives.shadow.none}}` |
| `rounded` | `{{primitives.radius.full}}` | `{{primitives.shadow.none}}` |
| `raised` | `{{primitives.radius.md}}` | `{{primitives.shadow.md}}` |
| `text` | `{{primitives.radius.md}}` | `{{primitives.shadow.none}}` |
| `textRaised` (`raisedText`) | `{{primitives.radius.md}}` | `{{primitives.shadow.md}}` |
| `outlined` | `{{primitives.radius.md}}` | `{{primitives.shadow.none}}` |
| `iconOnly` | `{{primitives.radius.md}}` | `{{primitives.shadow.none}}` |

**Static-leaf references** (flat at the color-variant root):

| Token | Reference |
|-------|-----------|
| `font` | `{{primitives.font.body.weight}}` / `lineHeight` / `letterSpacing` / `style` (family & size excluded) |
| `paddingX` / `paddingY` | `{{primitives.spacing.base}}` / `{{primitives.spacing.md}}` |
| `focusRing.color` | `{{primitives.<cv>.defaultState.defaultSeverity.focusRing.color}}` |
| `focusRing.style` | `{{primitives.<cv>.defaultState.defaultSeverity.focusRing.style}}` |
| `focusRing.width` | `{{primitives.border.width.sm}}` |
| `focusRing.offset` | `{{primitives.border.offset.none}}` |
| `sm`/`md`/`lg` | `{font{size}, paddingX, paddingY}` — self-defaulting, defined once in `sizes.ts`, shared across all color variants |
| `badge` | self-defaulting child token |

## Differentiated named-state defaults (Step 5b)

Unlike `input`, button has **no per-state override defaults layered on `defaultState`**. Each
state's severity-leaf defaults are already **distinct references** — the state segment is baked
into every `{{primitives…}}` path, so a named state points at its own primitive slot rather than
re-pointing a `defaultState` value. The state axis is therefore differentiation-by-path-segment,
not differentiation-by-override.

For a representative leaf (plain button, primary color):

| State | `background` reference |
|-------|------------------------|
| `defaultState` | `{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `hover` | `{{primitives.variant.primary.defaultVariant.hover.defaultSeverity.bg}}` |
| `active` | `{{primitives.variant.primary.defaultVariant.active.defaultSeverity.bg}}` |
| `focus` | `{{primitives.variant.primary.defaultVariant.focus.defaultSeverity.bg}}` |
| `disabled` | `{{primitives.variant.primary.defaultVariant.disabled.defaultSeverity.bg}}` |

(Identical substitution applies to `color`, `border.color`, and to the `defaultVariant`/
`secondary` color variants and to each named severity.)

### Border-token default trim (2026-09-16)

**Audit question:** *do we really need a default — specifically a `{{primitives…}}` ref — for every
border sub-value at every leaf?* The pre-trim button set a full `border` block
(`color`/`style`/`width`/`offset`/`radius`/`shadow`) at every leaf (~631 `border.color` refs), which
the audit judged over-eager.

**Evidence (consumer read-map):** the two button rule-arrays read only these `usages.button.*`
border tokens — `border.color` 47, `border.radius` 4, `border.shadow` 3 (all at `defaultSeverity`);
**0** reads of `border.style` / `border.width` / `border.offset`. `focusRing` reads `color`/`style`/
`width`/`offset` (2/1/1/1) and **0** of `focusRing.radius`/`focusRing.shadow`. No file outside the
two rule-arrays reads these tokens.

**Design decision (grilled):** a leaf carries a default only where its design value genuinely
differs from its baseline; tokens that never vary between leaves must not be repeated per leaf.

**Applied trim** (schema only — no fallback cascade built, no consumer repoint):

| Token | Before | After | Rationale |
|-------|--------|-------|-----------|
| `border.width` / `border.offset` | per-leaf constant (`width.sm`/`offset.none` at every leaf) | **removed** from the per-leaf default | invariant across all leaves; the all-optional shape still lets a theme author set them. |
| `border.style` | per-`(variant/state/severity)` slot `{{primitives.<cv>.<statePath>.<sev>.border.style}}` (nothing populates it) | collapsed to the single canonical token `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}` | a design-wide token every other component already uses; the button's per-severity slot was the dead anomaly. |
| `focusRing.radius` / `focusRing.shadow` | present on the `focusRing` default | **removed** | 0 consumer reads; the ring inherits the variant's radius/shadow. `color`/`style`/`width`/`offset` retained (all consumer-read). |
| `border.color` | per-leaf reference | **kept per-leaf** | genuinely distinct per severity/state; the 47 load-bearing reads. |
| `border.radius` / `border.shadow` | shape-level constant | **kept** at the shape level | 4/3 consumer reads, differentiated by shape. |

**Why no consumer repoint was needed:** the consumer reads 0 of the trimmed tokens, so removing
their defaults changes no mapping. The trim is a pure reduction of the defaults contract (what
`button.parse({})` emits), verified against the regenerated snapshot.

## Changes applied (Step 6)

**Schema** (`libs/integration-interface/src/lib/topics/current-themes/v1/schema/button/`):

- `severity.ts` (new) — severity-axis shape/defaults factory (`buttonSeverityGroupShape` /
  `buttonSeverityGroupDefaults`); `border.style` collapsed to the canonical token (trim).
- `stateful.ts` (new) — state-axis factory on `severity.ts` (`buttonStatefulShape` /
  `buttonStatefulDefaults`).
- `icon-only.ts` (new) — `iconOnly` shape variant, extends the stateful shape with fixed `width`/`icon`.
- `sizes.ts` (new) — static `sm`/`md`/`lg` tokens, shared identically across all color variants.
- `color-variant.ts` (new) — assembles one full color variant (state axis + font/padding/focusRing +
  6 shape variants + sizes); `focusRing` default trimmed (trim); self-defaulting leaves folded in
  (Defect 1 fix below).
- `button.ts` (rewritten) — root assembly of 3 color variants via `color-variant.ts`; fixes the
  broken `./default-variant` import (G1). Deprecated `ButtonSchema` class kept for compatibility.
- `button/button.spec.ts` (new) + `__snapshots__/button.spec.ts.snap` — 3-test spec.

**Deleted:** `default.ts`, `primary-variant.ts`, `secondary.ts` (superseded by the factory files),
and the stale 1042-line top-level `schema/button.spec.ts` (tested the removed class API, no longer
compiled).

**Consumer migration** (`libs/angular-utils/theme/primeng/src/utils/mapper/`):

- `mapping-rules/usages/button.rules.ts` + `css-rules/usages/button.rules.ts` — every
  `usages.button.*` baseline-state/baseline-severity path gained the `.defaultState.`/
  `.defaultSeverity.` segments, and every plain-shape path gained the `.defaultVariant` shape
  segment (G5). Rules that already named a specific severity or a purely structural token
  (`paddingX`/`paddingY`/`focusRing.color`) were left unchanged.
- **Defect 2 fix (re-audit):** a further mechanical transform re-scoped the **primary**
  (defaultVariant color) state/severity rules and all **flat static-leaf / shape-variant** rules,
  which the original migration had left in the old flat schema's shape. 150 of 187 distinct
  `from`-paths resolved to `undefined` (skipped at runtime) before; all **197** `from`-paths now
  resolve against `button.parse({})` (0 dead). Only `from:` values were altered (selectors, `to:`
  targets, and property names untouched).
- **Defect 1 fix (re-audit):** `applyDefaultsRecursive` only recurses into `z.ZodObject` fields,
  but every nested object is wrapped in `.prefault({})` (a `ZodPrefault`), so the recursion branch
  never fired and the color-independent self-defaulting leaves (`font`, `sm`/`md`/`lg`, `badge`)
  were **dropped** from `button.parse({})` — and the snapshot had recorded the broken tree. Fixed
  button-locally by capturing each self-defaulting leaf from its own shape via `.parse(undefined)`
  and folding it into `buttonColorVariantDefaults()` (the shared helper was deliberately left
  unchanged to avoid a ~30-component blast radius). Snapshot regenerated to include all five leaves.

**Re-audit caveat:** the `z.ZodObject<Record<string, z.ZodTypeAny>>` annotation on `buttonShape`
(added to dodge TS2589) widens the type and disables `ThemePath` compile-time path validation —
this is why both defects typechecked and "passed" silently.

## Testing (Step 8)

- `button/button.spec.ts` — `parses an empty object` (`button.safeParse({})`), `resolves the
  expected default token tree` (snapshot of `button.parse({})`), and `shape and defaults stay in
  sync` (`expectDefaultsMatchShape`). **3/3 pass.**
- Trim verification — the trimmed token classes show 0 occurrences in the snapshot's leaf-border
  blocks (the only remaining `width`/`offset` refs are the 3 `focusRing` blocks, one per color
  variant — consumer-read, correctly retained); the canonical `border.style` ref appears at every
  leaf.
- `nx test integration-interface` — 467/470 tests pass across 31/34 suites; the 3 remaining
  failures (`dataview.spec.ts`, `message.spec.ts`, `interactive-data-view.spec.ts`) are pre-existing
  and unrelated (confirmed by diffing against unrelated tokens and reproducing on a clean stash).
- `tsc --noEmit` clean on `integration-interface`; `angular-utils` typechecks with **no button
  errors** (the sole remaining `tsc` error is the pre-existing `calendar/panel.ts` TS7056).
- Both consumer rule-arrays pass `get_errors` and `nx lint angular-utils`; verified via `grep`
  that 0 un-migrated `from`-paths remain. No dedicated unit tests cover the rule-arrays (plain data
  consumed by the mapper at runtime; `angular-utils`'s Jest `testMatch` does not cover
  `src/utils/mapper/**`).

## Out-of-scope notes

- **`usages.button.primary.*` and `badge` are un-referenced by the consumer** — a schema→consumer
  gap (the schema models them; no PrimeNG preset/CSS token maps to them yet). Adding consumer rules
  requires product decisions about the PrimeNG token targets, outside this audit's mechanical
  reconciliation. Left as-is.
- **`nx build integration-interface` fails** at `calendar/panel.ts:33` with the same
  "inferred type exceeds maximum length" class of error fixed here for button, but in an untouched
  calendar file (TS7056).
- **`integration-interface:generate-theme-json-schema`** throws `TypeError: Cannot read properties
  of undefined (reading 'def')` inside zod v4's `to-json-schema.js`, unrelated to button.
- **`nx build angular-testing`** (a dependency of `angular-utils`'s build) fails on an
  `ng-packagr`/`find-cache-directory` ESM `require()` incompatibility — a toolchain issue.
- **No default fallback/cascade exists** — `{{primitives…}}` refs resolve by dot-lookup with no
  "unset inherits shallower" rule (an unresolvable ref is returned as a literal string), so the
  fully-materialized defaults tree is the minimal correct tree; trimming is a reduction of the
  contract, not an introduction of inheritance.
- A trivially-blocking one-character fix **was** applied: a missing trailing comma after
  `...breadcrumbRules` in `mapping-rules/usage-mapping-rules.ts` was blocking `nx lint
  angular-utils` entirely and thus verification of the button consumer changes.
