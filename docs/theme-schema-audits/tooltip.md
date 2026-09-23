# Tooltip — Theme Schema Structure Audit

- **Date**: 2026-09-21
- **Component**: `tooltip` (single-file schema: `schema/tooltip.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness is out of scope — the legacy reference strings were preserved verbatim while moving the defaults (see "Preserved reference paths" below).

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Rough schema (confirmed — Step 4)

A tooltip is a single overlay box (`.p-tooltip`) with one child element the user declined to model: the decorative pointer (`.p-tooltip-arrow`). It has **no interactive states** (hover/focus/etc. are driven by the *trigger* element, not the tooltip) and **no severity/variant differentiation** (one appearance). The baseline `defaultVariant` therefore carries the full token set directly, with **no `defaultState`/`defaultSeverity` wrapper** (per the SKILL's "no unused wrapper" rule).

```
tooltip (root)
├── settings                         # behavioral (non-visual): position / showDelay / hideDelay
│   ├── position
│   ├── showDelay
│   └── hideDelay
└── defaultVariant                   # baseline — the full token set sits directly here
    ├── maxWidth
    ├── gutter
    ├── shadow
    ├── padding
    ├── border  { color, style, width, offset, radius }
    ├── background
    └── color
```

### Structural decisions (user-confirmed)

1. **No `arrow` child.** The `.p-tooltip-arrow` pointer is a real rendered child (confirmed in `node_modules/primeng`), but it is purely decorative (always painted the box's background color), the CSS mapper has no arrow tokens, and there is no realistic independent theming need today. The user chose **not** to model it.
2. **`settings` kept.** `position`/`showDelay`/`hideDelay` are behavioral, not visual, and are **not** consumed by the CSS mapper. The user chose to **keep** them rather than drop them (unlike the badge audit, which removed its orphaned settings). They live as a sibling of `defaultVariant` at the root (dependency `nothing` — independent of the box's variant), as a separate optional sub-schema (`tooltipSettings`), preserving the existing `tooltipSettings` export.
3. **Single `defaultVariant` only.** The 5 canonical color variants are not modeled — the tooltip's CSS mapper references no `usages.tooltip.primary.*` etc.
4. **No `defaultState` / `defaultSeverity` wrappers.** The tooltip has no states and no severities, so its 7 tokens sit directly on `defaultVariant` (baseline path is `defaultVariant`).

## Gap list (Step 5) — vs. actual `tooltip.ts`

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | `.default()` baked into a single flat shape | `tooltipVariantShape` (pure, all optional) + `tooltipShape` (top level) + `tooltipDefaults` (plain object) + `applyDefaultsRecursive` |
| 2 | Missing `defaultVariant` wrapper | 7 visual tokens flat at the tooltip root | 7 tokens under `tooltipShape.defaultVariant` |
| 3 | `settings` coupling | `settings` (with its own baked defaults) as an optional root field | Kept as-is: `settings: tooltipSettings.optional()` sibling of `defaultVariant` (dep `nothing`) |
| 4 | Legacy flat default placement | `.default(...)` per token | Baseline defaults moved into the separated `tooltipDefaults.defaultVariant` tree |
| 5 | Downstream mapper paths | 7 mapping-rules pointing at flat `usages.tooltip.*` | Repointed to `usages.tooltip.defaultVariant.*` |
| 6 | `UsagesInput` reference | `z.input<typeof tooltip>` (applied const) | `z.input<typeof tooltipShape>` (raw shape) — required so the restructured usage's leaf paths resolve against `ThemePath` |
| 7 | Spec style | 4 nested hand-written token tests (`expectExactTokens`/`expectExactUndefinedTokens`) | Replaced with the 3 canonical tests (parse / snapshot / `expectDefaultsMatchShape`) |

All items from Step 6 accepted by the user (arrow: **don't model**; settings: **keep**).

## Default-value tables (Step 7)

### `defaultVariant` — mandatory baseline (the only baseline path; no states/severities)

The tooltip box always renders its full token set, so all 7 get the mandatory baseline default. Reference strings are preserved verbatim from the legacy schema.

| Token | Reference (preserved from legacy) |
|-------|-----------------------------------|
| `maxWidth` | `{{primitives.layout.overlayMaxWidth}}` |
| `gutter` | `{{primitives.space.sm}}` |
| `shadow` | `{{primitives.shadow.md}}` |
| `padding` | `{{primitives.space.md}}` |
| `border.color` | `{{primitives.area.overlay.defaultState.defaultVariant.defaulSeverity.border.color}}` |
| `border.style` | `{{primitives.area.overlay.defaultState.defaultVariant.defaulSeverity.border.style}}` |
| `border.width` | `{{primitives.border.width.sm}}` |
| `border.offset` | `{{primitives.border.offset.sm}}` |
| `border.radius` | `{{primitives.border.radius.md}}` |
| `background` | `{{primitives.area.overlay.defaultState.defaultVariant.bg}}` |
| `color` | `{{primitives.area.overlay.defaultState.defaultVariant.contrast}}` |

### `settings` — behavioral (unmapped), kept verbatim

| Token | Default |
|-------|---------|
| `position` | `'top'` |
| `showDelay` | `0` |
| `hideDelay` | `0` |

`settings` keeps its own baked defaults inside the `tooltipSettings` sub-schema; it is intentionally **absent** from `tooltipDefaults` so `applyDefaultsRecursive` leaves it untouched.

### Preserved reference paths (out of scope — noted, not corrected)

The legacy `border.color`/`border.style` references point at
`primitives.area.overlay.defaultState.defaultVariant.defaulSeverity.border.*`. The
`defaultVariant`/`defaulSeverity` naming there predates the current primitive layout and is
flagged as a **preserved legacy reference** — reference-path semantics are explicitly out of scope
for this structure-only audit, and these strings were carried over verbatim rather than rewritten.

## Changes applied (Step 8)

- **`libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.ts`** — full rewrite: shape/defaults separation.
  - `tooltipVariantShape` — pure `z.object()`, all keys `.optional()`, tokens live directly on the variant (no state/severity wrapper).
  - `tooltipShape` — top level: `settings` (optional, dep `nothing`) + `defaultVariant` (`tooltipVariantShape.prefault({})`).
  - `tooltipDefaults` — the `defaultVariant` baseline token set only.
  - `tooltip` — `applyDefaultsRecursive(tooltipShape, tooltipDefaults).register(..., { id: 'tooltip' })`.
  - `tooltipSettings` export and the `tooltip` export preserved for existing consumers.
- **`libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/tooltip.rules.ts`** — all 7 `from` paths repointed `usages.tooltip.<token>` → `usages.tooltip.defaultVariant.<token>` (`to` targets unchanged).
- **`libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts`** — imported `tooltipShape`; `UsagesInput.tooltip` switched from `z.input<typeof tooltip>` to `z.input<typeof tooltipShape>` (raw-shape idiom so the restructured usage's leaf paths resolve against `ThemePath`).

No `css-rules/tooltip.rules.ts` file exists, so no css-rules remapping was required.

### Note on Step 8 test policy

Per the SKILL, the structural implementation in Step 8 is confirmed; test/spec coverage is handled in Step 10.

## Testing (Step 10)

- **Replaced**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.spec.ts` — one spec file with the three canonical tests only (`safeParse({}).success`, `toMatchSnapshot()` on the full `parse({})` tree, `expectDefaultsMatchShape(tooltip, tooltipDefaults)`). The 4 legacy hand-written token tests and their `test-utils` imports were removed.
- **Snapshot**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/tooltip.spec.ts.snap` generated on the first (non-CI) run; matches the Step 7 default-value tables (verified by inspection — 7 tokens under `defaultVariant`, `settings` absent from the parsed baseline). Committed alongside the schema change.
- **Test run**: `CI=true npx nx test integration-interface --testPathPattern=tooltip.spec` → `PASS`, 473 passed (35 suites), 5 snapshots passed.
- **Type-check**: `npx tsc -p libs/integration-interface/tsconfig.lib.json --noEmit` and `npx tsc -p libs/angular-utils/tsconfig.lib.json --noEmit` both report **0 errors** — confirming the new `usages.tooltip.defaultVariant.*` mapper `from` paths resolve against `ThemePath` (the raw-shape `UsagesInput` fix is effective).
