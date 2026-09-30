# Tabs — Theme Schema Structure Audit

- **Date**: 2026-09-30
- **Component**: `tabs` (multi-file schema: `schema/tabs/` + `schema/tabs.ts` facade)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope — but obviously stale primitive references (paths that no longer resolve against `primitives.ts`) were corrected, per the user's "fix them now" choice.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## Convention note — tabs is **fully flat**

Unlike most v2 usages (which nest tokens under `defaultVariant.defaultState.defaultSeverity.*`), the
tabs usage — and its CSS mapper — use the **fully-flat** convention (same as `menu`):

- **No `defaultVariant`** layer anywhere; tokens sit directly on each node
  (`usages.tabs.tab.background`, `usages.tabs.tablist.background`, `usages.tabs.tabpanel.background`).
- **No `defaultState`/`defaultSeverity` wrapper**; interaction states are **flat siblings** of the
  baseline tokens (`usages.tabs.tab.hover.background`, `.focus.*`, `.active.*`, `.disabled.*`).
- `focusRing` sits at the **tab** node root (not inside a state), mirroring the accordion/input
  convention.

This was deliberately authored flat in PR #1617 ("Fix/refactoring tabs usage":
*"removed defaultVariant/State/Severity from schema, set default or prefault for every key and child
schema"*). The mapper `from:` paths (the structural contract) confirm it and type-check clean against
`ThemePath`. **The SKILL's generic `usages.<component>.defaultVariant.*` wrapper guidance does not
apply to tabs** — the structure is preserved as flat.

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
├── navButtons                         # overflow nav icons (dep: nothing)
│   [ nextIcon, prevIcon ]
└── tab                                # a single tab entry (dep: nothing)
    [ background, color, paddingX, paddingY, alignItems, gap, icon, border, focusRing ]
    ├── activeBar                       # the active-tab indicator bar
    │   [ background, height, position, positionOffset, transition, shadow ]
    ├── tooltip                         # GENERIC — reuses full usages.tooltip (Option 1)
    └── hover / focus / active / disabled   # flat state siblings
        [ background, color, (cursor), border, font ]
```

### Structural decisions (user-confirmed)

1. **Structure/children/dependency are unchanged.** The mapper `from:` paths already resolve against
   this flat tree; no children added/removed, no dependency or nesting changes. The audit's work is
   the *declaration-pattern* conversion and the raw-shape fix below.
2. **`tab.tooltip` keeps full reuse (Option 1).** It reuses the entire `usages.tooltip`
   (`tooltipShape`/`tooltipDefaults`) rather than a minimal independent set. The mapper is
   indifferent (references no `usages.tabs.tab.tooltip.*`); full reuse preserves the current token
   surface with least disruption.
3. **`tab` models only the states the component actually renders** — `hover`, `focus`, `active`,
   `disabled` — not `selected`/`invalid` (a tab has no independent selected/invalid styling; "active"
   is the selected tab). Flat siblings of the tab baseline.
4. **`settings` and `viewport` are config, not design tokens.** Kept as flat config blocks
   (booleans + scroll-behavior strings) with literal defaults, matching the legacy schema.

## Gap list (Step 5) — vs. actual `schema/tabs/`

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | Class-based (`TabsSchema`, `TabsTabSchema`, …) with inline `.default()` | `tabsShape` (pure, all-optional) + `tabsDefaults` (plain object) + `applyDefaultsRecursive`; each subcomponent gets `tabs<X>Shape` + `tabs<X>Defaults` |
| 2 | **Raw-shape gotcha** | `ThemePath` derives from `UsagesInput.tabs = z.input<typeof tabs>`; works *only* because `TabsSchema.schema` is a concrete class `z.object` | Export `tabsShape` and repoint `current-themes.schema.ts` `UsagesInput.tabs` → `z.input<typeof tabsShape>`, so `ThemePath` keeps its `usages.tabs.*` leaf paths after the conversion to the loose `applyDefaultsRecursive` return type |
| 3 | `{{icon.size.sm}}` / `{{icon.content}}` / `{{icon.url}}` (tab icon) | No `primitives.` prefix → do not resolve | `size` → `{{primitives.icon.size.sm}}` (canonical); `content`/`url` **dropped** (no canonical primitive form; non-resolvable) |
| 4 | `{{primitives.border.color}}` / `{{primitives.border.style}}` (tablist border) | Global `primitives.border` (`borderShape`) has **no** `color`/`style` → do not resolve | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` / `.border.style` (area-derived, the `content.ts`/`input.ts` idiom) |
| 5 | `{{primitives.defaultVariant.focusedState.defaultSeverity.{bg,color}}}` (tab focus state) | `focusedState` is a typo — no such state key | `{{primitives.defaultVariant.state.focus.defaultSeverity.{bg,color}}}` |
| 6 | `{{primitives.border.style.solid}}` (tablist content border.style) | `primitives.border` has no `style` → does not resolve | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}` |
| 7 | `{{...state.<s>.defaultSeverity.font.weight}}` (tab hover/focus/active) | The `defaultSeverity` severity group (`severityStyles`) has **no** `font` key → does not resolve | `{{primitives.font.weight}}` (global — no valid per-state primitive exists; keeps the per-state override surface) |
| 8 | Tests | Legacy `schema/tabs.spec.ts` — 289 lines, per-subcomponent `expectExactTokens`/`expectExactUndefinedTokens` | Replaced by a single 3-test snapshot spec in `schema/tabs/tabs.spec.ts` |

Items 1, 2 and 8 are the mandatory conversion work. Items 3–7 are the "fix them now" reference-path
corrections the user requested. **Carried verbatim** (not broken — they are runtime theme-level
paths consistent with every other component's per-state references, and structure-only scope does not
rewrite them): `cursor` per-state (`state.hover/disabled.defaultSeverity.cursor`), and `focusRing.{radius,offset,width,shadow}` (scalar `primitives.focusRing.*`).

## Default-value tables (Step 7)

The token tree is **unchanged** from the legacy schema — every baseline token keeps its default
(Step 7's mandatory baseline is satisfied for every node), and per-state tokens keep only the tokens
that differ (background/color/border/font, plus cursor where relevant). Tables below record the
**final** reference strings after the Step 5 fixes.

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
| `border` | width `{{primitives.border.width.none}}`, radius `{{primitives.border.radius.none}}`, offset `{{primitives.border.offset.none}}`, style `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}`*, color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}`* |

\* was `{{primitives.border.style}}` / `{{primitives.border.color}}` (non-resolving) — fixed (Gap 4).

### `tablist.content`

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `gap` | `{{primitives.space.md}}` |
| `border` | width `{{primitives.border.width.none}}`, radius `{{primitives.border.radius.sm}}`, offset `{{primitives.border.offset.none}}`, style `{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}`*, color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |

\* was `{{primitives.border.style.solid}}` (non-resolving) — fixed (Gap 6).

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

### `navButtons` (expanded — see "NavButton expansion")

| Token | Reference |
|-------|-----------|
| `nextIcon` | `{{primitives.icon.arrowRight}}` (glyph ref — **not mapped**, Primeng preset has no icon slot) |
| `prevIcon` | `{{primitives.icon.arrowLeft}}` (glyph ref — **not mapped**) |
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `width` | `2.5rem` |
| `hover.color` | `{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}` |
| `focusRing` | width/style/color/offset/shadow `{{primitives.focusRing.*}}` (global scalar focus-ring primitive) |

> **NavButton expansion (post-audit, user-requested).** The original v1 `navButtons` schema exposed
> only `nextIcon`/`prevIcon` (a `// TODO: Pick relevant tokens from button usage tokens` carried from
> PR #1617). Per the user's "like the dialog" request, the nav button was expanded to model the full
> Primeng Tabs `navButton` preset surface — `background`/`color`/`width`, a flat `hover.color`, and a
> **local** `focusRing` (Option A) — with a matching pair of mapper rules added in
> `mapping-rules/usages/tabs/navbutton.rules.ts`. The 3 focus-ring rules that previously **inherited
> from `usages.tabs.tab.focusRing.*`** were replaced by 5 local `usages.tabs.navButtons.focusRing.*`
> rules (now also covering `style` + `color`, which the inherited mapping skipped). Note the
> deliberate asymmetry: the `from:` theme key is `navButtons` (plural) but the `to:` Primeng preset
> key is `navButton` (singular). `nextIcon`/`prevIcon` remain unmapped glyph refs — the Primeng preset
> exposes no icon token for the nav button, so they have no `to:` target.

### `tab` (baseline)

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| `paddingX` / `paddingY` / `gap` | `{{primitives.space.md}}` |
| `alignItems` | `{{primitives.layout.alignItems}}` |
| `icon` | size `{{primitives.icon.size.sm}}`*, color `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}`, font.weight `{{primitives.font.weight}}` (*was `{{icon.size.sm}}`; `{{icon.content}}`/`{{icon.url}}` dropped — Gap 3) |
| `border` | width/radius/offset `{{primitives.border.*.none}}`, style/color `{{primitives.defaultVariant.defaultState.defaultSeverity.border.{style,color}}}` |
| `focusRing` | radius `{{primitives.focusRing.radius}}`, offset `{{primitives.focusRing.offset}}`, width `{{primitives.focusRing.width}}`, shadow `{{primitives.focusRing.shadow}}` |

### `tab` state siblings

Each state keeps only the tokens that differ from the baseline. Per-state `font.weight` is now the
global `{{primitives.font.weight}}` (Gap 7 — the per-state `defaultSeverity.font.weight` path did not
resolve).

| State | `background` | `color` | `cursor` | `border.color` / `border.style` | `font.weight` |
|---|---|---|---|---|---|
| `hover` | `{{…state.hover.defaultSeverity.bg}}` | `{{…state.hover.defaultSeverity.contrast}}` | `{{…state.hover.defaultSeverity.cursor}}` | `{{…state.hover.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `focus` | `{{…state.focus.defaultSeverity.bg}}`* | `{{…state.focus.defaultSeverity.contrast}}`* | — | `{{…state.focus.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `active` | `{{…state.active.defaultSeverity.bg}}` | `{{…state.active.defaultSeverity.contrast}}` | — | `{{…state.active.defaultSeverity.border.{color,style}}}` | `{{primitives.font.weight}}` |
| `disabled` | `{{…state.disabled.defaultSeverity.bg}}` | `{{…state.disabled.defaultSeverity.contrast}}` | `{{…state.disabled.defaultSeverity.cursor}}` | — | — |

\* `focus` bg/color were `{{primitives.defaultVariant.focusedState.defaultSeverity.*}}` (typo) — fixed
to `state.focus` (Gap 5). `…` = `{{primitives.defaultVariant`. `cursor`/`font.weight`/`focusRing` are
carried verbatim (see Gap list — not broken, runtime theme-level).

### `tab.activeBar`

| Token | Reference |
|-------|-----------|
| `background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` |
| `height` | `{{primitives.border.width.sm}}` |
| `position` | `'bottom'` |
| `positionOffset` | `{{primitives.space.none}}` |
| `transition` | duration `{{primitives.transition.duration}}` |
| `shadow` | `{{primitives.shadow.none}}` |

### `tab.tooltip` (Option 1 — full reuse of `usages.tooltip`)

Nests `tooltipDefaults` verbatim (baseline under `tooltip.defaultVariant`): `maxWidth
{{primitives.layout.overlayMaxWidth}}`, `gutter {{primitives.space.sm}}`, `shadow
{{primitives.shadow.md}}`, `padding {{primitives.space.md}}`, border
`{{primitives.area.overlay.defaultState.defaultSeverity.border.*}}` + `width/offset/radius
{{primitives.border.*}}`, `background {{primitives.area.overlay.defaultState.defaultSeverity.bg}}`,
`color {{primitives.area.overlay.defaultState.defaultSeverity.contrast}}`.

## Changes applied (Step 8)

- **`schema/tabs/settings.ts`, `viewport.ts`, `activeBar.ts`, `panel.ts`, `navButton.ts`,
  `listContent.ts`, `list.ts`, `tab.ts`, `tabs.ts`** — rewritten from class-based inline `.default()`
  to shape/defaults separation: each exports a pure, all-optional `tabs<X>Shape` and a plain
  `tabs<X>Defaults`. Child shapes are composed by reference (e.g. `tab.ts` composes
  `tabsActiveBarShape`/`tooltipShape`; `list.ts` composes `tabsListContentShape`/`tabsListContentDefaults`;
  `tabs.ts` composes all subcomponent shapes/defaults). `tabs.ts` exports `tabsShape`, `tabsDefaults`,
  the applied `tabs` (`applyDefaultsRecursive(tabsShape, tabsDefaults).register(…)`), and a thin
  `TabsSchema` facade (`static schema = tabs`) for backward compatibility.
- **Reference fixes (Steps 5/7)** — applied in `tab.ts` (icon, focus-state typo, per-state
  `font.weight`), `list.ts` and `listContent.ts` (border color/style). See the gap list above.
- **`current-themes.schema.ts`** — `import { tabs, tabsShape } from './schema/tabs'`;
  `UsagesInput.tabs` → `z.input<typeof tabsShape>` (raw-shape fix). The applied `usages` object still
  references the applied `tabs` const (unchanged).
- **`schema/tabs.ts`** (facade) — now re-exports `tabs` **and** `tabsShape` so `UsagesInput` can name
  the raw shape.
- **NavButton expansion (post-audit, user-requested)** — `schema/tabs/navButton.ts` now models the full
  Primeng Tabs `navButton` preset (`background`/`color`/`width`/`hover.color`/local `focusRing`) in
  addition to the `nextIcon`/`prevIcon` glyph refs, and the TODO comment was removed. The mapper pair
  `mapping-rules/usages/tabs/navbutton.rules.ts` was updated to add 5 rules for these tokens and
  replace the 3 tab-inherited `usages.tabs.tab.focusRing.*` rules with local
  `usages.tabs.navButtons.focusRing.*` rules (now covering `style`/`color` too). The snapshot was
  regenerated to reflect the expanded `navButtons` tree.

### Note on Step 8 test policy

Per the SKILL, the legacy spec was **not** patched during Step 8 — it was replaced wholesale in
Step 10.

## Testing (Step 10)

- **Added**: `schema/tabs/tabs.spec.ts` — one spec file with exactly the three canonical tests
  (`safeParse({}).success`, `toMatchSnapshot()` on the full `parse({})` tree,
  `expectDefaultsMatchShape(tabsShape, tabsDefaults)`).
- **Removed**: legacy `schema/tabs.spec.ts` (289 lines, per-subcomponent `expectExactTokens`/
  `expectExactUndefinedTokens` suites) — superseded by the snapshot.
- **Snapshot**: `schema/tabs/__snapshots__/tabs.spec.ts.snap` generated on the first run and reviewed;
  it matches the Step 7 tables (verified: focus state uses `state.focus`, icon has no
  `content`/`url`, per-state `font.weight` is `{{primitives.font.weight}}`, list/list-content
  border color/style are area-derived). Committed alongside the schema change.
- **Test run**: `npx nx test integration-interface --testPathPattern='tabs/tabs.spec'` → `PASS`
  (37 suites / 433 tests green, 1 snapshot written).
- **Type-check (raw-shape contract)**: `npx tsc --noEmit -p libs/angular-utils/theme/primeng/tsconfig.lib.json`
  → exit 0 — every tabs mapper `from:` path (`usages.tabs.tab*`, `.tablist.*`, `.tabpanel.*`,
  `.activeBar.*`, `.focusRing.*`) still resolves against the new `tabsShape`-derived `ThemePath`.
  `npx tsc --noEmit -p libs/integration-interface/tsconfig.lib.json` → exit 0.
