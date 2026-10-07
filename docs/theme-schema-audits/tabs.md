# Tabs — Theme Schema Structure Audit

- **Date**: 2026-10-06
- **Component**: `tabs` (multi-file schema: `schema/tabs/` + `schema/tabs.ts` facade)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness is out of scope — this run focuses on the **state-shape convention** (baseline under `defaultState`, named states carry only overrides) and the **tooltip split** requested in the PR #1756 review.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Convention note — baseline under `defaultState`, named states flat siblings

The tabs usage is **variant-free** (no `defaultVariant` layer — tabs render a single appearance;
the 5 canonical color variants are not modeled). But the two state-bearing nodes — `tab` and
`navButtons` — follow the SKILL's Step 7/8 rule:

- A node that has named states keeps its **full token set** in a `defaultState` baseline; the
  named states (`hover`, `focus`, …) are **flat siblings** of `defaultState` and carry **only the
  tokens that differ** (overrides).
- `defaultState` therefore holds the complete baseline — every token the tab/nav button renders,
  including static ones (`focusRing`) and nested children (`activeBar`).
- Nodes with **no** states stay flat (no `defaultState` wrapper): the component root, `tablist`,
  `tablist.content`, `tabpanel`, `settings`, and `viewport`.

This corrects the earlier "fully flat" layout (PR #1617), which placed baseline tokens alongside
the named states. The mapper `from:` paths (the structural contract) were updated in lockstep to
prefix the **baseline** tokens with `.defaultState` and type-check clean against `ThemePath`.

## Rough schema (confirmed — Step 4)

```
tabs (root — flat, no defaultVariant)  [ background, color, gap, shadow ]
├── settings                          # non-visual config (dep: nothing)
│   unstyled, lazy, selectOnFocus, showNavigators, scrollStrategy
├── tablist                            # the tab strip (dep: nothing)
│   [ background, color, gap, paddingX, paddingY, border ]
│   └── content                        # scrollable inner area (dep: nothing)
│       [ background, gap, border ]
├── viewport                           # scroll-behavior config (dep: nothing)
│   scrollBehavior, overscrollBehavior, scrollbarWidth, webkitScrollbarDisplay
├── tabpanel                           # content panel for the active tab (dep: nothing)
│   [ font, background, color, paddingX, paddingY, alignItems, justifyContent ]
├── navButtons                         # overflow nav icons (STATE-BEARING → defaultState baseline)
│   ├── defaultState [ nextIcon, prevIcon, background, color, width, focusRing ]  (full baseline)
│   └── hover        [ color ]                                                 (override only)
└── tab                                # a single tab entry (STATE-BEARING → defaultState baseline)
    ├── defaultState [ background, color, paddingX, paddingY, alignItems, gap, icon,
    │                  activeBar, border, focusRing, cursor, font ]              (full baseline)
    ├── hover        [ background, color, cursor, border, font ]                 (override only)
    ├── focus        [ background, color, border, font ]                         (override only)
    ├── active       [ background, color, border, font ]                         (override only)
    └── disabled     [ background, color, cursor ]                               (override only)
        ├── activeBar (nested under defaultState) [ background, height, position,
        │                positionOffset, transition, shadow ]
```

### Structural decisions (reviewer-requested)

1. **`tab` and `navButtons` are state-bearing → `defaultState` baseline + flat named states.**
   The full token set moved under `defaultState` (including `focusRing` and the `activeBar`
   child); `hover`/`focus`/`active`/`disabled` keep only the tokens that differ (background,
   color, border, font, and cursor where relevant). This is the exact change requested by the
   PR #1756 comments on the `navButtons.hover` and `tab.active` snapshot lines.
2. **`tab.tooltip` removed — tooltip is a separate top-level usage.** A tooltip can be used
   outside of tabs, so it is not nested under `tab`. It lives at the component root of the theme
   as its own `usages.tooltip` (see `tooltip.md`). The `tab.ts` import of `tooltipShape`/
   `tooltipDefaults` and the `tooltip` field were removed; no mapper rule references
   `usages.tabs.tab.tooltip.*`.
3. **`tab` models only the states the component actually renders** — `hover`, `focus`, `active`,
   `disabled` — not `selected`/`invalid` (a tab has no independent selected/invalid styling;
   "active" is the selected tab). Flat siblings of `defaultState`.
4. **`settings` and `viewport` are config, not design tokens.** Kept as flat config blocks
   (booleans + scroll-behavior strings) with literal defaults, matching the legacy schema.

## Gap list (Step 5) — vs. pre-change `schema/tabs/`

| # | Gap | Pre-change | Confirmed target |
|---|-----|-----------|------------------|
| 1 | `navButtons` baseline placement | full token set flat at the `navButtons` root, with `hover` a flat sibling | `defaultState` holds the full baseline (`nextIcon`/`prevIcon`/`background`/`color`/`width`/`focusRing`); `hover` is a flat sibling carrying only `color` |
| 2 | `tab` baseline placement | baseline tokens flat at the `tab` root, named states flat siblings | `defaultState` holds the full baseline (incl. `activeBar`, `icon`, `focusRing`); `hover`/`focus`/`active`/`disabled` flat siblings carrying only overrides |
| 3 | `tab.tooltip` nesting | `tab` nested a full `usages.tooltip` (Option 1) | Removed — `tooltip` is a standalone top-level usage (`usages.tooltip`), not under `tab` |
| 4 | Mapper `from:` baseline paths | `usages.tabs.tab.background`, `usages.tabs.navButtons.width`, `usages.tabs.tab.activeBar.transition.duration`, `usages.tabs.tab.focusRing.*`, … | Baseline tokens repointed to `usages.tabs.tab.defaultState.*`, `usages.tabs.navButtons.defaultState.*`, `usages.tabs.tab.defaultState.activeBar.transition.duration`, `usages.tabs.tab.defaultState.focusRing.*`. Named-state paths (`hover.*`, `active.*`, …) unchanged. |
| 5 | `tooltip` usage (separate file) | `usages.tooltip.defaultVariant.*`, single `padding` | `usages.tooltip.*` (flat root, no wrapper), `paddingX`/`paddingY`. See `tooltip.md`. |

## Default-value tables (Step 7)

### Root (`usages.tabs`)

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `gap` | `{{primitives.space.md}}` |
| `shadow` | `{{primitives.shadow.none}}` |

### `settings` (config)

| Token | Default |
|-------|---------|
| `unstyled` | `false` |
| `lazy` | `false` |
| `selectOnFocus` | `false` |
| `showNavigators` | `true` |
| `scrollStrategy` | `'nearest'` |

### `tablist`

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `gap` | `{{primitives.space.md}}` |
| `paddingX` / `paddingY` | `{{primitives.space.md}}` |
| `border` | width `{{primitives.border.width.none}}`, radius `{{primitives.border.radius.none}}`, offset `{{primitives.border.offset.none}}`, style `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}`, color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |

### `tablist.content`

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `gap` | `{{primitives.space.md}}` |
| `border` | width `{{primitives.border.width.none}}`, radius `{{primitives.border.radius.sm}}`, offset `{{primitives.border.offset.none}}`, style `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}`, color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |

### `viewport` (config)

| Token | Default |
|-------|---------|
| `scrollBehavior` | `'smooth'` |
| `overscrollBehavior` | `'contain auto'` |
| `scrollbarWidth` | `'none'` |
| `webkitScrollbarDisplay` | `'none'` |

### `tabpanel`

| Token | Reference |
|-------|-----------|
| `font` | size `{{primitives.font.size}}`, weight `{{primitives.font.weight}}`, lineHeight `{{primitives.font.lineHeight}}` |
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `paddingX` / `paddingY` | `{{primitives.space.md}}` |
| `alignItems` | `{{primitives.layout.alignItems}}` |
| `justifyContent` | `{{primitives.layout.justifyContent}}` |

### `navButtons` — `defaultState` baseline (full token set)

| Token | Reference |
|-------|-----------|
| `nextIcon` | `{{primitives.icon.arrowRight}}` (glyph ref — **not mapped**) |
| `prevIcon` | `{{primitives.icon.arrowLeft}}` (glyph ref — **not mapped**) |
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `width` | `2.5rem` |
| `focusRing` | width/style/color/offset/shadow `{{primitives.focusRing.*}}` (global scalar focus-ring primitive) |

`navButtons.hover` (override only): `color` `{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}`.

> The deliberate asymmetry from the earlier audit stands: the `from:` theme key is `navButtons`
> (plural) but the `to:` Primeng preset key is `navButton` (singular). `nextIcon`/`prevIcon` remain
> unmapped glyph refs (the Primeng preset exposes no icon token for the nav button).

### `tab` — `defaultState` baseline (full token set)

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `paddingX` / `paddingY` / `gap` | `{{primitives.space.md}}` |
| `alignItems` | `{{primitives.layout.alignItems}}` |
| `icon` | size `{{primitives.icon.size.sm}}`, color `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}`, font.weight `{{primitives.font.weight}}` |
| `border` | width/radius/offset `{{primitives.border.*.none}}`, style/color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.{style,color}}}` |
| `focusRing` | radius `{{primitives.focusRing.radius}}`, offset `{{primitives.focusRing.offset}}`, width `{{primitives.focusRing.width}}`, shadow `{{primitives.focusRing.shadow}}` |
| `activeBar` | see `tab.activeBar` below (nested under `defaultState`) |

### `tab` — named states (override only)

Each state keeps only the tokens that differ from `defaultState`. `…` = `{{primitives.defaultVariant`.

| State | `background` | `color` | `cursor` | `border.color` / `border.style` | `font.weight` |
|---|---|---|---|---|---|
| `hover` | `{{…state.hover.defaultSeverity.bg}}` | `{{…state.hover.defaultSeverity.contrast}}` | `{{…state.hover.defaultSeverity.cursor}}` | `{{…state.hover.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `focus` | `{{…state.focus.defaultSeverity.bg}}` | `{{…state.focus.defaultSeverity.contrast}}` | — | `{{…state.focus.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `active` | `{{…state.active.defaultSeverity.bg}}` | `{{…state.active.defaultSeverity.contrast}}` | — | `{{…state.active.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `disabled` | `{{…state.disabled.defaultSeverity.bg}}` | `{{…state.disabled.defaultSeverity.contrast}}` | `{{…state.disabled.defaultSeverity.cursor}}` | — | — |

### `tab.activeBar` (nested under `defaultState`)

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `height` | `{{primitives.border.width.sm}}` |
| `position` | `'bottom'` |
| `positionOffset` | `{{primitives.space.none}}` |
| `transition` | duration `{{primitives.transition.duration}}` |
| `shadow` | `{{primitives.shadow.none}}` |

## Changes applied (Step 8)

- **`schema/tabs/navButton.ts`** — state-shape split: `navButtonStateShape` (the full token set) is
  used for both `defaultState` (full baseline defaults) and `hover` (only `color`). Named states are
  flat siblings of `defaultState`.
- **`schema/tabs/tab.ts`** — state-shape split: `tabStateShape` now holds the **full** token set
  (background, color, paddingX/Y, alignItems, gap, icon, `activeBar`, border, focusRing, cursor,
  font). `tabsTabShape = { defaultState, hover, focus, active, disabled }` (all
  `tabStateShape.prefault({})`). `defaultState` carries the full baseline (incl. `activeBar`, `icon`,
  `focusRing`); named states carry only overrides. **Removed the nested `tooltip` import and
  property** — `tooltip` is a standalone usage.
- **Mapper `from:` baseline paths repointed** (named-state and flat paths unchanged):
  - `mapping-rules/usages/tabs/tab.rules.ts` — `tab.background`/`color`/`border.{width,color}`/`paddingX`/`gap`/`focusRing.{width,shadow,offset}`/`activeBar.{background,height,positionOffset}` → `usages.tabs.tab.defaultState.*`.
  - `mapping-rules/usages/tabs/navbutton.rules.ts` — `navButtons.background`/`color`/`width`/`focusRing.{width,style,color,offset,shadow}` → `usages.tabs.navButtons.defaultState.*`.
  - `mapping-rules/usages/tabs/base.rules.ts` — `usages.tabs.tab.activeBar.transition.duration` → `usages.tabs.tab.defaultState.activeBar.transition.duration` (`to:` `components.tabs.root.transitionDuration` unchanged).
  - `mapping-rules/usages/tabs/tabpanel.rules.ts` — the three `usages.tabs.tab.focusRing.{width,shadow,offset}` → `usages.tabs.tab.defaultState.focusRing.*` (`to:` `components.tabs.tabpanel.focusRing.*` unchanged).
  - `css-rules/usages/tabs/tab.rules.ts` — `usages.tabs.tab.activeBar.transition.duration` → `usages.tabs.tab.defaultState.activeBar.transition.duration` (hover/focus/disabled css paths unchanged).
- **Tooltip (separate file, `tooltip.md`)** — `schema/tooltip.ts` flattened (removed
  `defaultVariant`), `padding` → `paddingX`/`paddingY`; `mapping-rules/usages/tooltip.rules.ts`
  `from:` `usages.tooltip.defaultVariant.*` → `usages.tooltip.*`, `usages.tooltip.defaultVariant.padding`
  → `usages.tooltip.paddingX` (`to:` `components.tooltip.root.padding` unchanged).
- **`current-themes.schema.ts`** — unchanged in this run; `UsagesInput.tooltip` →
  `z.input<typeof tooltipShape>` (line 55) and `UsagesInput.tabs` → `z.input<typeof tabsShape>`
  (line 61) already carry the raw shapes so the restructured leaf paths resolve against `ThemePath`.

### Note on Step 8 test policy

Per the SKILL, the structural implementation in Step 8 is confirmed; test/spec coverage is handled
in Step 10.

## Testing (Step 10)

- **Spec files**: `schema/tabs/tabs.spec.ts` and `schema/tooltip.spec.ts` — each holds exactly the
  three canonical tests (`safeParse({}).success`, `toMatchSnapshot()` on the full `parse({})` tree,
  `expectDefaultsMatchShape(<shape>, <defaults>)`). No spec content changed in this run; only the
  regenerated snapshots reflect the restructured trees.
- **Snapshots regenerated**: `schema/tabs/__snapshots__/tabs.spec.ts.snap` (baseline moved under
  `defaultState` for `tab` and `navButtons`; `tab.tooltip` gone) and
  `schema/__snapshots__/tooltip.spec.ts.snap` (flat root, `paddingX`/`paddingY`). Both regenerated
  from code (never hand-edited).
- **Test run**: `npx nx test integration-interface --testPathPattern='tabs|tooltip'` → **PASS**
  (48 suites / 535 tests green, 23 snapshots passed).
- **Mapper contract type-check**: `npx nx build angular-utils` → **success** — every repointed
  mapper `from:` path (`.defaultState.*` baselines, flat `usages.tooltip.*`) resolves against the
  `tabsShape`/`tooltipShape`-derived `ThemePath` (`LeafPaths`), and the `to:` targets still resolve
  against PrimeNG `ComponentsDesignTokens`.
