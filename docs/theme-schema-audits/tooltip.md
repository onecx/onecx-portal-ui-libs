# Tooltip — Theme Schema Structure Audit

- **Date**: 2026-10-06
- **Component**: `tooltip` (single-file schema: `schema/tooltip.ts`)
- **Scope**: structure-only audit (shape, children, variant/state layers, default-value placement). Semantic `{{primitives...}}` reference-path correctness is out of scope. This run records the PR #1756 review changes: **remove the `defaultVariant` wrapper** (no other variants exist) and **split `padding` into `paddingX`/`paddingY`**.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Rough schema (confirmed — Step 4)

A tooltip is a single overlay box (`.p-tooltip`) with no interactive states (hover/focus/etc. are
driven by the *trigger* element, not the tooltip) and no severity/variant differentiation (one
appearance). It is a **standalone top-level usage** — it can be used outside of tabs, so it is no
longer nested under `usages.tabs.tab`.

Per the SKILL's "no unused wrapper" rule (Step 5 / Step 7): a node with **no** variants, **no**
states, and **no** severities keeps its tokens as **direct fields on the root** — no
`defaultVariant`, no `defaultState`, no `defaultSeverity` wrapper. The earlier `defaultVariant`
wrapper was superfluous (there are no other variants) and was removed.

```
tooltip (root — flat, no defaultVariant/defaultState/defaultSeverity)
├── settings                         # behavioral (non-visual): position / showDelay / hideDelay
│   ├── position
│   ├── showDelay
│   └── hideDelay
├── maxWidth
├── gutter
├── shadow
├── paddingX                         # split from the old single `padding`
├── paddingY
├── border  { color, style, width, offset, radius }
├── background
└── color
```

### Structural decisions (reviewer-requested)

1. **No `defaultVariant` wrapper.** The tooltip has a single appearance and no other variants; the
   SKILL says a `defaultVariant` slot is only added where a real need is confirmed (the mapper
   references no `usages.tooltip.primary.*` etc.). The 7 visual tokens now sit **directly on the
   root** — the baseline path is the root itself.
2. **No `arrow` child.** The `.p-tooltip-arrow` pointer is a real rendered child but purely
   decorative (always painted the box's background color), the CSS mapper has no arrow tokens, and
   there is no independent theming need — not modeled (unchanged from the original audit).
3. **`settings` kept.** `position`/`showDelay`/`hideDelay` are behavioral, not visual, and are
   **not** consumed by the CSS mapper. Kept as a separate optional sub-schema (`tooltipSettings`)
   sibling of the visual tokens, preserving the existing `tooltipSettings` export.
4. **`padding` → `paddingX`/`paddingY`.** Matches the padding convention used by the rest of the
   OneCX usages (`tablist`, `tabpanel`, `tab`, …). Both default to `{{primitives.space.md}}`
   (the value the old single `padding` held). The single Primeng `to:` target
   (`components.tooltip.root.padding`) is fed by `paddingX`.

## Gap list (Step 5) — vs. pre-change `tooltip.ts`

| # | Gap | Pre-change | Confirmed target |
|---|-----|-----------|------------------|
| 1 | `defaultVariant` wrapper | 7 visual tokens under `tooltipShape.defaultVariant` | Tokens moved to the **root** — `defaultVariant` removed (no other variants) |
| 2 | Single `padding` | `padding: withRef(z.string()).optional()` | Split into `paddingX` / `paddingY` |
| 3 | Downstream mapper paths | 7 `from:` paths at `usages.tooltip.defaultVariant.*` | Repointed to `usages.tooltip.*`; `usages.tooltip.defaultVariant.padding` → `usages.tooltip.paddingX` |
| 4 | `UsagesInput` reference | `z.input<typeof tooltipShape>` (raw shape) | Unchanged — `z.input<typeof tooltipShape>` already carries the raw shape so the restructured leaf paths resolve against `ThemePath` |

## Default-value tables (Step 7)

### Root — mandatory baseline (the only baseline path; no variants/states/severities)

The tooltip box always renders its full token set, so every visual token gets the mandatory
baseline default at the root.

| Token | Reference |
|-------|-----------|
| `maxWidth` | `{{primitives.layout.overlayMaxWidth}}` |
| `gutter` | `{{primitives.space.sm}}` |
| `shadow` | `{{primitives.shadow.md}}` |
| `paddingX` | `{{primitives.space.md}}` |
| `paddingY` | `{{primitives.space.md}}` |
| `border.color` | `{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}` |
| `border.style` | `{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}` |
| `border.width` | `{{primitives.border.width.sm}}` |
| `border.offset` | `{{primitives.border.offset.sm}}` |
| `border.radius` | `{{primitives.border.radius.md}}` |
| `background` | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}` |

### `settings` — behavioral (unmapped), kept verbatim

| Token | Default |
|-------|---------|
| `position` | `'top'` |
| `showDelay` | `0` |
| `hideDelay` | `0` |

`settings` keeps its own baked defaults inside the `tooltipSettings` sub-schema; it is
intentionally **absent** from `tooltipDefaults` so `applyDefaultsRecursive` leaves it untouched.

## Changes applied (Step 8)

- **`libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.ts`** — flattened:
  - `tooltipShape` — pure `z.object()`, all keys `.optional()`; the 7 visual tokens (now
    `paddingX`/`paddingY`) plus `settings` live **directly on the root** — no `defaultVariant`.
  - `tooltipDefaults` — plain object mirroring the shape at the root level.
  - `tooltip` — `applyDefaultsRecursive(tooltipShape, tooltipDefaults).register(..., { id: 'tooltip' })`.
  - `tooltipSettings` and `tooltip` exports preserved for existing consumers (incl. the
    `menubar` submenu, which nests `tooltip.optional()`).
- **`libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/tooltip.rules.ts`** — all
  7 `from` paths repointed `usages.tooltip.defaultVariant.<token>` → `usages.tooltip.<token>`;
  `usages.tooltip.defaultVariant.padding` → `usages.tooltip.paddingX` (single Primeng `to:` target
  `components.tooltip.root.padding`). All `to` targets unchanged.
- **`libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts`** —
  unchanged: `UsagesInput.tooltip` → `z.input<typeof tooltipShape>` (line 55) already uses the raw
  shape.

No `css-rules/tooltip.rules.ts` file exists, so no css-rules remapping was required.

### Note on Step 8 test policy

Per the SKILL, the structural implementation in Step 8 is confirmed; test/spec coverage is handled
in Step 10.

## Testing (Step 10)

- **Spec file**: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.spec.ts`
  — one spec with exactly the three canonical tests (`safeParse({}).success`,
  `toMatchSnapshot()` on the full `parse({})` tree, `expectDefaultsMatchShape(tooltipShape,
  tooltipDefaults)`). No spec content changed in this run.
- **Snapshot regenerated**: `schema/__snapshots__/tooltip.spec.ts.snap` — flat root, `paddingX`/
  `paddingY`, no `defaultVariant`. Regenerated from code (never hand-edited).
- **Test run**: `npx nx test integration-interface --testPathPattern='tabs|tooltip'` → **PASS**
  (48 suites / 535 tests green, 23 snapshots passed).
- **Mapper contract type-check**: `npx nx build angular-utils` → **success** — the new flat
  `usages.tooltip.*` mapper `from` paths resolve against the `tooltipShape`-derived `ThemePath`
  (`LeafPaths`), and the `to:` targets still resolve against PrimeNG `ComponentsDesignTokens`.
