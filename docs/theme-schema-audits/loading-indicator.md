# Loading Indicator — Theme Schema Structure Audit

- **Date**: 2026-09-23
- **Component**: `loadingIndicator` (single-file schema: `schema/loading-indicator.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope — no reference paths were changed in this audit (all values carried over verbatim from the legacy schema).

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Rough schema (confirmed — Step 4)

The loading indicator renders a full-screen backdrop with a centered spinner (HTML: `.full-overlay` → `.overlay` → `.loader`). The positioning wrapper `.full-overlay` is a transparent fixed-position box with no themable styling, so it is not a child. The two themable children are the **overlay** (semi-transparent backdrop) and the **spinner** (`.loader`).

The component has **no variants, states, or severities**. This is the **contract** the CSS mapper already reads — a flat shape with no variant/state/severity segment (see `css-rules/usages/loading-indicator.rules.ts`):

- `usages.loadingIndicator.overlay.background`
- `usages.loadingIndicator.spinner.size`
- `usages.loadingIndicator.spinner.border.color`
- `usages.loadingIndicator.spinner.border.trackColor`
- `usages.loadingIndicator.spinner.border.width`
- `usages.loadingIndicator.spinner.animationDuration`

```
loadingIndicator (root)
├── overlay          # dep: nothing — flat at root, no wrapper
│   └── background
└── spinner          # dep: nothing — flat at root, no wrapper
    ├── size
    ├── border { color, trackColor, width }
    └── animationDuration
```

### Structural decisions (user-confirmed)

1. **Two children: `overlay` and `spinner`.** Both render their own distinguishable visual box (backdrop fill; the loader ring).
2. **Dependency `nothing` for both children.** No variant/state/severity axis exists, so each child sits flat at the component root — matching the mapper's flat `usages.loadingIndicator.<child>.<token>` reads.
3. **Both children are specific** (no corresponding standalone generic usage). No Option 1/2 consolidation decision applies; each keeps its own minimal token set.
4. **No `defaultVariant`/`defaultState`/`defaultSeverity` wrappers anywhere** — the component declares no named variants/states/severities, so tokens sit directly on each child (per the "no unused wrapper" rule).
5. **The 5 canonical color variants are not modeled.** The mapper references no `usages.loadingIndicator.primary.*` etc.
6. **Structure preserved.** The flat child shape the mapper reads is the structural contract; this audit must not add nesting or drop tokens.

## Gap list (Step 5) — vs. actual `loading-indicator.ts`

The **structure** (children, dependency, flat shape) already matched the confirmed rough schema exactly. The gaps were purely the authoring pattern:

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | `.default(...)` baked inline in the shape | `loadingIndicatorShape` (pure, all optional) + `loadingIndicatorDefaults` (plain object) + `applyDefaultsRecursive` |
| 2 | Raw-shape export for `UsagesInput` | `current-themes.schema.ts` referenced the **applied** const `z.input<typeof loadingIndicator>` | Export `loadingIndicatorShape`; reference `z.input<typeof loadingIndicatorShape>` in `UsagesInput` (applied const stays for the parse/output side) |

Both items accepted by the user.

> **Note on the raw-shape fix (item 2).** Once a usage is built via `applyDefaultsRecursive(shape, defaults).register(...)`, referencing the applied const in `UsagesInput` as `z.input<typeof …>` collapses the input type to `Record<string, unknown>` (the loose return type of `applyDefaultsRecursive` erases the concrete shape). `LeafPaths` then yields no `usages.loadingIndicator.*` leaf paths, and **every** mapper rule `from:` fails with a `ThemePath` "not assignable" error. The fix follows the established `badge`/`dropdown`/`input` idiom: reference the raw shape. The CSS mapper itself is **not** touched — it already reads the flat paths the restructured schema still produces.

## Default-value tables (Step 7)

Dependency is `nothing`, so every token **is** a baseline and all carry a default. Values are unchanged from the legacy schema.

### `overlay`

| Token | Default |
|-------|---------|
| `background` | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` |

### `spinner`

| Token | Default |
|-------|---------|
| `size` | `{{primitives.space.lg}}` |
| `border.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `border.trackColor` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |
| `border.width` | `{{primitives.border.width.md}}` |
| `animationDuration` | `{{primitives.transition.duration}}` |

No named variants/states/severities → no additional defaults, no wrappers.

## Changes applied (Step 8)

- **`libs/integration-interface/src/lib/topics/current-themes/v1/schema/loading-indicator.ts`** — full rewrite to shape/defaults separation:
  - `loadingIndicatorOverlayShape`, `loadingIndicatorSpinnerBorderShape`, `loadingIndicatorSpinnerShape`, and exported `loadingIndicatorShape` — pure `z.object()` shapes, all keys `.optional()`, nested objects `.prefault({})`, no `.default()`.
  - Exported `loadingIndicatorDefaults` — plain object mirroring the shape with the Step 7 values.
  - Exported `loadingIndicator = applyDefaultsRecursive(loadingIndicatorShape, loadingIndicatorDefaults).register(themeSchemaRegistry, { id: 'loadingIndicator' })` — the backward-compatible facade the downstream `usages` object consumes.
  - Legacy child exports `loadingIndicatorOverlay` / `loadingIndicatorSpinner` were **removed** — no external consumers were found (verified by grep across `libs`).
- **`libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts`** — added `import { loadingIndicatorShape }` and switched the `UsagesInput` entry to `loadingIndicator?: z.input<typeof loadingIndicatorShape>`. The parse/output side (`usages` object) keeps `loadingIndicator: (loadingIndicator as typeof loadingIndicator).optional()`.

### Note on Step 8 test policy

Per the SKILL, test/spec files were **intentionally not modified during Step 8**. Test coverage was replaced next, in Step 10.

## Testing (Step 10)

- **Replaced**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/loading-indicator.spec.ts` — the legacy spec (nested `describe` blocks using `expectExactTokens`/`expectExactUndefinedTokens` and importing the now-removed child exports) was replaced wholesale with the single three-test spec (`safeParse({}).success`, `toMatchSnapshot()` on the full `parse({})` tree, `expectDefaultsMatchShape(loadingIndicator, loadingIndicatorDefaults)`).
- **Snapshot**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/__snapshots__/loading-indicator.spec.ts.snap` generated on the first run; matches the Step 7 default-value tables (verified). Committed alongside the schema change.
- **No legacy spec removed** beyond the replacement above (single-file component, one spec).
- **Test run**: `nx test integration-interface` (loading-indicator) → `PASS`, 3 passed, 1 snapshot written.
- **Type-check**: `tsc -p libs/integration-interface/tsconfig.lib.json --noEmit` → clean (0 errors). `tsc -p libs/angular-utils/theme/primeng/tsconfig.lib.json --noEmit` → clean (0 errors) — confirming the CSS mapper `from: ThemePath` contract holds after the `UsagesInput` raw-shape fix.
