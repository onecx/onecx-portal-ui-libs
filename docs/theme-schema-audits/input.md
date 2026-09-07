# Input — Theme Schema Structure Audit

- **Date**: 2026-08-26
- **Component**: `input` (single-file schema: `schema/input.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Rough schema (confirmed)

The input renders a single element (`.p-inputtext`) — **no children/subcomponents**.

```
input (root) — no children (single .p-inputtext element)
├── defaultVariant                      # outlined variant (baseline)
│   ├── defaultState
│   │   └── defaultSeverity
│   │       ├── padding   { x, y }
│   │       ├── font      { weight, size }
│   │       ├── focusRing { color, style, width, offset, radius, shadow }
│   │       ├── sm        { fontSize, padding { x, y } }
│   │       ├── lg        { fontSize, padding { x, y } }
│   │       ├── transitionDuration
│   │       ├── background
│   │       ├── color
│   │       ├── border    { color, style, width, offset, radius, shadow }
│   │       └── placeholder { color }
│   ├── hover      └── defaultSeverity { background, color, border, placeholder }
│   ├── focus      └── defaultSeverity { background, color, border, placeholder }
│   ├── disabled   └── defaultSeverity { background, color, border, placeholder }
│   └── invalid    └── defaultSeverity { background, color, border, placeholder }
└── filled                            # custom variant (partial override of defaultVariant)
    ├── defaultState  └── defaultSeverity { background, color, placeholder }
    ├── hover         └── defaultSeverity { background, color, placeholder }
    ├── focus         └── defaultSeverity { background, color, placeholder }
    ├── disabled      └── defaultSeverity { background, color, placeholder }
    └── invalid       └── defaultSeverity { background, color, placeholder }
```

### Structural decisions (user-confirmed)

1. **Variant layers**: `defaultVariant` (outlined baseline) + `filled` (custom variant). The 5 canonical color variants (`primary`…`quinary`) were intentionally *not* added — the input CSS mapper references no `usages.input.primary.*` etc., and `filled` is already modeled as a custom variant slot in `multiselect`.
2. **States**: `defaultState` + `hover`, `focus`, `disabled`, `invalid` (no `active`/`selected` for a text input — matches the mapper).
3. **Severities**: severity level declared with only `defaultSeverity` (no named severities), keeping the full `defaultVariant → defaultState → defaultSeverity` token path per the canonical restructured pattern (`calendar/input.ts`).
4. **Token placement**: **everything under states** (user decision) — no flat-root static tokens; all leaf tokens, including the formerly-static `padding`/`font`/`focusRing`/`sm`/`lg`/`transitionDuration`, live under the variant/state/severity path.
5. **`filled` is a partial override**: carries only its necessary tokens (`background`, `color`, `placeholder`); static tokens and `border` are omitted and resolve via the runtime fallback from `defaultVariant` (matches the legacy schema's semantics, where static tokens were shared at the top level).
6. **`transition`**: flat `transitionDuration` key (matches calendar/textarea), not the legacy nested `transition: { duration }`.
7. **`sizes` grouping key unwrapped**: flat `sm` / `lg` keys under the severity block.
8. **`placeholder`** stays nested as `placeholder: { color }` (existing convention, matches `usages.input.placeholder.color`).

## Gap list (Step 4) — confirmed rough schema vs. actual `input.ts`

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | `.default()` baked into shape; no `*Shape`/`*Defaults` split | `inputShape` (pure, all optional) + `inputDefaults` (plain objects) + `applyDefaultsRecursive(inputShape, inputDefaults)` |
| 2 | Missing `defaultVariant` slot | No `defaultVariant`; baseline at component root | `defaultVariant` as its own baseline slot, `filled` a flat sibling |
| 3 | Missing `defaultState` slot | No `defaultState` | `defaultState` slot inside each variant |
| 4 | Missing `defaultSeverity` level | No severity level | Every state block wraps leaf tokens in `defaultSeverity` |
| 5 | Wrong state placement | `hover`/`focus`/`disabled`/`invalid` flat at root | States inside each variant: `<variant>.<state>.defaultSeverity` |
| 6 | Baseline tokens misplaced | `background`/`color`/`padding`/`border`/`focusRing`/`font` at root | Moved under `defaultVariant.defaultState.defaultSeverity` (nothing at the flat root) |
| 7 | `sizes` grouping wrapper | `sizes: { sm, lg }` | Flat `sm`, `lg` keys under the severity block |
| 8 | `filled` lacks state structure | `filled` has flat sub-states, no `defaultState`/`defaultSeverity` slots | `filled.<state>.defaultSeverity.{background, color, placeholder}`; static tokens omitted (fallback) |
| 9 | Transition token shape | Nested `transition: { duration }` | Flat `transitionDuration` |

Children coverage: none (no gap). States coverage: matches (no gap). All 9 items accepted by the user.

## Default-value policy (Step 5a — `defaultState` defaults)

**Variant-coverage policy**: `defaultVariant` and `filled` each carry their own defaults; no other named variants exist. `filled` carries only its necessary tokens (partial override; the rest fall back from `defaultVariant`).

**`defaultVariant.defaultState.defaultSeverity` — full baseline set** (all references carried over unchanged from the legacy schema — the restructure moves structure, not values):

| Token | Reference |
|-------|-----------|
| `transitionDuration` | `{{primitives.transition.duration}}` |
| `font.weight` | `{{primitives.font.weight}}` |
| `font.size` | `{{primitives.font.size}}` |
| `padding.x` | `{{primitives.space.md}}` |
| `padding.y` | `{{primitives.space.sm}}` |
| `focusRing.width` | `{{primitives.border.width.md}}` |
| `focusRing.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}` |
| `focusRing.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}` |
| `focusRing.offset` | `{{primitives.border.offset.none}}` |
| `focusRing.radius` | `{{primitives.radius.md}}` |
| `focusRing.shadow` | `{{primitives.shadow.none}}` |
| `sm.fontSize` | `{{primitives.font.size}}` |
| `sm.padding.x` | `{{primitives.space.sm}}` |
| `sm.padding.y` | `{{primitives.space.xs}}` |
| `lg.fontSize` | `{{primitives.font.size}}` |
| `lg.padding.x` | `{{primitives.space.lg}}` |
| `lg.padding.y` | `{{primitives.space.md}}` |
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `border.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |
| `border.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}` |
| `border.width` | `{{primitives.border.width.sm}}` |
| `border.offset` | `{{primitives.border.offset.none}}` |
| `border.radius` | `{{primitives.border.radius.md}}` |
| `border.shadow` | `{{primitives.shadow.none}}` |
| `placeholder.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |

## Differentiated named-state defaults (Step 5b)

| Variant | State | Tokens differing from `defaultState` | References |
|---------|-------|----------------------------------------|------------|
| `defaultVariant` | `hover` | `background`, `color`, `placeholder.color`, `border.color`, `border.style` | `{{primitives.defaultVariant.state.hover.defaultSeverity.…}}` |
| `defaultVariant` | `focus` | `background`, `color`, `placeholder.color`, `border.color`, `border.style` | `{{primitives.defaultVariant.state.focus.defaultSeverity.…}}` |
| `defaultVariant` | `disabled` | `background`, `color`, `placeholder.color`, `border.color`, `border.style` | `{{primitives.defaultVariant.state.disabled.defaultSeverity.…}}` |
| `defaultVariant` | `invalid` | `background`, `color`, `placeholder.color`, `border.color`, `border.style` | `{{primitives.defaultVariant.state.invalid.defaultSeverity.…}}` |
| `filled` | `defaultState` | `background`, `color`, `placeholder.color` | `{{primitives.variant.primary.defaultState.defaultSeverity.…}}` |
| `filled` | `hover` | `background`, `color`, `placeholder.color` | `{{primitives.variant.primary.state.hover.defaultSeverity.…}}` |
| `filled` | `focus` | `background`, `color`, `placeholder.color` | `{{primitives.variant.primary.state.focus.defaultSeverity.…}}` |
| `filled` | `disabled` | `background`, `color`, `placeholder.color` | `{{primitives.variant.primary.state.disabled.defaultSeverity.…}}` |
| `filled` | `invalid` | `background`, `color`, `placeholder.color` | `{{primitives.variant.primary.state.invalid.defaultSeverity.…}}` |

All omitted tokens stay `.optional()` and resolve via the runtime fallback mechanism (from `defaultState` within a variant, or from `defaultVariant` for `filled`'s omitted static tokens).

## Changes applied (Step 6)

- **Rewrote `schema/input.ts`** with the shape/defaults separation pattern:
  - `inputShape` — pure shape, all keys optional, nested objects `.prefault({})`, no `.default()`.
  - `inputDefaults` — plain defaults tree mirroring the shape (full baseline on `defaultVariant.defaultState.defaultSeverity`; named states carry only their differing tokens; `filled` partial).
  - `input` — `applyDefaultsRecursive(inputShape, inputDefaults).register(themeSchemaRegistry, { id: 'input' })`.
- **Removed legacy exports** (`inputTransition`, `inputFocusRingSchema`, `inputHoverState`, `inputFocusState`, `inputDisabledState`, `inputInvalidState`, `inputFilledHoverState`, `inputFilledFocusState`, `inputFilledDisabledState`, `inputFilledInvalidState`, `inputFilledVariant`). Verified no non-spec files import any of them (only `current-themes.schema.ts` imports `input`, and the old spec, which Step 8 replaces).
- Kept exports: `input` (assembled schema), `inputShape`, `inputDefaults`, `inputPadding`, `inputSize` (reusable sub-shapes).
- **Validation**: `tsc -p tsconfig.lib.json --noEmit` reports **0 errors in `input.ts`** (the only pre-existing errors are in `test-utils.ts`, which references jest globals and was not touched by this audit).
- **Test/spec files intentionally left unchanged** in Step 6 (per the audit workflow) — the legacy `schema/input.spec.ts` imports removed exports and will fail until it is replaced in Step 8. Test coverage is added next, in Step 8.

## Testing (Step 8)

_TBD — to be updated after the spec replacement and snapshot generation in Step 8._

## Out-of-scope notes

- The CSS mapper (`css-rules/usages/input.rules.ts`, `mapping-rules/usages/input.rules.ts`) still reads the legacy flat paths (`usages.input.background`, `usages.input.filled.hover.background`, `usages.input.sizes.sm.fontSize`, `usages.input.transition.duration`, …). Aligning those `from:` paths with the restructured theme shape is a separate consumer-side change, consistent with the calendar restructure (its CSS mapper also reads non-nested paths).
- The legacy schema referenced `{{primitives.border.width.*}}` / `{{primitives.border.offset.*}}` / `{{primitives.border.radius.*}}` under a `primitives.border` key that is not part of the current `primitivesShape` (it has `radius`, `focusRing`, but no `border` aggregate). These references were carried over unchanged; this skill is structure-only w.r.t. reference-path semantics.
