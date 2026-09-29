# Badge — Theme Schema Structure Audit

- **Date**: 2026-09-15
- **Component**: `badge` (single-file schema: `schema/badge.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope — but obviously stale primitive references (e.g. paths that no longer resolve against `primitives.ts`) were corrected as part of moving the defaults.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Rough schema (confirmed — Step 4)

Badge is a static status indicator (`.p-badge` / `.p-overlaybadge .p-badge`). It has **no children**, **no interactive states**, and only one color variant (`defaultVariant`). Sizes (`sm`/`lg`/`xl`) and the `dot` mode are root-level scalars — orthogonal to variant/severity.

```
badge (root)
├── defaultVariant                    # baseline color variant (mandatory slot)
│   ├── defaultSeverity               # baseline severity — full token set
│   │   ├── background
│   │   ├── color
│   │   ├── border  { color, style, width, offset, radius, shadow }
│   │   ├── font    { size, weight, ... }
│   │   ├── padding
│   │   ├── minWidth                  # default-size min-width (was PrimeNG root.minWidth)
│   │   └── height                    # default-size height
│   ├── primary       { background, color }   # severity-tag (color-variant primitive)
│   ├── secondary     { background, color }   # severity-tag (color-variant primitive)
│   ├── success       { background, color }
│   ├── info          { background, color }
│   ├── warning       { background, color }
│   ├── danger        { background, color }
│   └── contrast      { background, color }
├── sm     { fontSize, minWidth, height }
├── lg     { fontSize, minWidth, height }
├── xl     { fontSize, minWidth, height }
└── dot    { size }
```

### Structural decisions (user-confirmed)

1. **No children.** `dot`, size overrides, and severity leaves all live inside badge's own token surface. Badge renders as a single visual box with no independently-themable sub-element.
2. **No `defaultState` wrapper anywhere.** Badge has no interactive state (no hover/focus/active/…) — per the SKILL's "no unused wrapper" rule, its tokens sit directly on the variant, immediately wrapped by `defaultSeverity`.
3. **`primary`/`secondary` folded in as severity-tags** (Choice A1). They sit alongside `defaultSeverity` and the standard severities under `defaultVariant`. Their defaults reference the color-variant primitives (`primitives.variant.primary.defaultState.defaultSeverity.*`), while `success/info/warning/danger/contrast` reference the severity primitives (`primitives.defaultVariant.defaultState.severity.<name>.*`).
4. **The 5 canonical color variants are not modeled at the root.** The badge's CSS mapper references no `usages.badge.primary.*` etc. as color variants — `primary/secondary` are severity-tags per above.
5. **`sm`/`lg`/`xl` and `dot` are root-level scalars** (Choice B1). They don't vary per variant/severity in any known use case, and the mapper always reads them flat.
6. **Default-size fontSize** is `defaultVariant.defaultSeverity.font.size` (single path). The old `defaultVariant.defaultVariant.fontSize` duplicate is gone; the mapper is updated accordingly.
7. **`settings` block removed** — legacy, no mapper reference.

## Gap list (Step 5) — vs. actual `badge.ts`

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | `.default()` baked into shape | `badgeShape` (pure, all optional) + `badgeDefaults` (plain object) + `applyDefaultsRecursive` |
| 2 | Missing `defaultSeverity` wrapper | Baseline tokens flat on `defaultVariant` | Baseline tokens under `defaultVariant.defaultSeverity` |
| 3 | Severities under `variant.` wrapper | `badge.variant.<severity>` | `badge.defaultVariant.<severity>` (alongside `defaultSeverity`) |
| 4 | `primary`/`secondary` treated as color variants but modeled as severities | Duplicated `variant.primary` / `variant.secondary` | Folded in as severity-tags under `defaultVariant` |
| 5 | Sizes nested under `defaultVariant.sizeVariant.*` | `defaultVariant.sizeVariant.sm/lg/xl` | Root-level `sm`/`lg`/`xl` siblings of `defaultVariant` |
| 6 | Duplicate default-size block | `defaultVariant.defaultVariant.fontSize/minWidth/height` reduplicated `defaultVariant.font.size` etc. | Single source: `defaultVariant.defaultSeverity.font.size` + `.minWidth` + `.height` |
| 7 | Legacy `settings` block | `settings.{badgeSize, size}` — no mapper reference | Deleted |
| 8 | Legacy `badgeStyleWithSizeVariants` / `badgeSizeStyle` types | Exported wrapper types | Deleted (inlined into shape composition) |
| 9 | Stale primitive references | `primitives.variant.primary.defaultState.defaultVariant.<severity>.bg` (path doesn't resolve) | Corrected to `primitives.defaultVariant.defaultState.severity.<severity>.bg` for severities and `primitives.variant.<name>.defaultState.defaultSeverity.bg` for `primary`/`secondary` |
| 10 | `dot.size` hard literal | `.default('0.5rem')` inline | Same literal `'0.5rem'` (no natural primitive) but placed in the separated `badgeDefaults` tree |
| 11 | Downstream mapper paths | 20+ mapping-rules + 2 css-rules pointing at old paths | Updated `libs/angular-utils/theme/primeng/src/utils/mapper/{mapping-rules,css-rules}/usages/badge.rules.ts` |

All 12 items from Step 6 accepted by the user.

## Default-value tables (Step 7)

### `defaultVariant.defaultSeverity` — mandatory baseline

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `border.radius` | `{{primitives.radius.full}}` |
| `font.size` | `{{primitives.font.size}}` |
| `font.weight` | `{{primitives.font.weight}}` |
| `padding` | `{{primitives.space.sm}}` |
| `minWidth` | `'1.5rem'` *(literal — matches legacy)* |
| `height` | `'1.5rem'` *(literal — matches legacy)* |

Every other border/font sub-token stays optional and resolves via the runtime fallback.

### Named severities under `defaultVariant`

Each defines only `background` + `color` (nothing else needs to differ from the baseline for a badge).

| Severity node | `background` | `color` |
|---|---|---|
| `primary` | `{{primitives.variant.primary.defaultState.defaultSeverity.bg}}` | `{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}` |
| `secondary` | `{{primitives.variant.secondary.defaultState.defaultSeverity.bg}}` | `{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}` |
| `success` | `{{primitives.defaultVariant.defaultState.severity.success.bg}}` | `{{primitives.defaultVariant.defaultState.severity.success.contrast}}` |
| `info` | `{{primitives.defaultVariant.defaultState.severity.info.bg}}` | `{{primitives.defaultVariant.defaultState.severity.info.contrast}}` |
| `warning` | `{{primitives.defaultVariant.defaultState.severity.warning.bg}}` | `{{primitives.defaultVariant.defaultState.severity.warning.contrast}}` |
| `danger` | `{{primitives.defaultVariant.defaultState.severity.danger.bg}}` | `{{primitives.defaultVariant.defaultState.severity.danger.contrast}}` |
| `contrast` | `{{primitives.defaultVariant.defaultState.severity.contrast.bg}}` | `{{primitives.defaultVariant.defaultState.severity.contrast.contrast}}` |

### Root-level size overrides

| Node | `fontSize` | `minWidth` | `height` |
|---|---|---|---|
| `sm` | `{{primitives.font.size}}` | `'1.25rem'` | `'1.25rem'` |
| `lg` | `{{primitives.font.size}}` | `'1.75rem'` | `'1.75rem'` |
| `xl` | `{{primitives.font.size}}` | `'2rem'` | `'2rem'` |

### `dot`

| Token | Default |
|---|---|
| `size` | `'0.5rem'` *(literal — matches legacy; no natural primitive for a badge-dot size)* |

## Changes applied (Step 8)

- **`libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.ts`** — full rewrite: shape/defaults separation via `badgeShape` + `badgeDefaults` + `applyDefaultsRecursive`. Legacy internal wrappers (`badgeSettings`, `badgeSizeStyle`, `badgeStyleWithSizeVariants`) removed; no consumers found. Backward-compatible `badge` export preserved (consumed by `current-themes.schema.ts`).
- **`libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/badge.rules.ts`** — every `from` path repointed to the new structure:
  - `usages.badge.defaultVariant.<root-token>` → `usages.badge.defaultVariant.defaultSeverity.<root-token>`
  - `usages.badge.defaultVariant.defaultVariant.<size-token>` (default-size duplicate) collapsed into `usages.badge.defaultVariant.defaultSeverity.font.size` / `.minWidth` / `.height`
  - `usages.badge.defaultVariant.sizeVariant.{sm,lg,xl}.<token>` → `usages.badge.{sm,lg,xl}.<token>`
  - `usages.badge.variant.<severity>.{background,color}` → `usages.badge.defaultVariant.<severity>.{background,color}` (7 severities)
- **`libs/angular-utils/theme/primeng/src/utils/mapper/css-rules/usages/badge.rules.ts`** — overlaybadge overrides repointed:
  - `usages.badge.defaultVariant.defaultVariant.fontSize` → `usages.badge.defaultVariant.defaultSeverity.font.size`
  - `usages.badge.variant.primary.color` → `usages.badge.defaultVariant.primary.color`

### Note on Step 8 test policy

Per the SKILL, test/spec files were **intentionally not modified during Step 8**. Test coverage is added next, in Step 10.

## Testing (Step 10)

- **Added**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/badge.spec.ts` — one spec file with the three canonical tests (`safeParse({}).success`, `toMatchSnapshot()` on the full `parse({})` tree, `expectDefaultsMatchShape`).
- **Snapshot**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/badge.spec.ts.snap` generated on the first run; matches the Step 7 default-value tables (verified). Committed alongside the schema change.
- **No legacy spec removed** — the badge component had no prior spec file.
- **Test run**: `CI=true npx nx test integration-interface --testPathPattern=badge.spec` → `PASS`, 3 passed. The three pre-existing failing suites in the wider `integration-interface` project (`dataview`, `interactive-data-view`, `message`) were verified to fail on the same commit **without** these badge changes (via `git stash` isolation) and are therefore unrelated.
- **Type-check / lint**: `nx lint integration-interface` passes; the four touched files (`badge.ts`, `badge.spec.ts`, and both angular-utils `badge.rules.ts`) type-check cleanly. `nx build angular-utils` surfaces a pre-existing TS7056 in `calendar/panel.ts` that is unrelated to badge.
