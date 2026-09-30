# Carousel — Theme Schema Structure Audit

- **Date**: 2026-09-30
- **Component**: `carousel` (restructured from a single flat file `schema/carousel.ts` into `schema/carousel/` — one file per child)
- **Scope**: full restructure from the legacy **flat** convention (inline `.default(...)` per token, `bg`/`contrast` names) to the **nested (calendar-style)** convention, **plus** the mapper rework that this restructure forces. Semantic `{{primitives...}}` reference-path correctness is out of scope (default ref values carried over verbatim from the original); the mapper `from:` paths are re-authored against the new shape and compile-checked via `ThemePath`.

## Why this audit is broader than a structure-only audit

Most audited components (e.g. `menubar`) kept their legacy nesting because their mapper `from:` paths are the structural contract. Here the user explicitly chose to move `carousel` onto the **nested (calendar-style)** convention. That changes every token path (e.g. `usages.carousel.container.bg` → `usages.carousel.defaultVariant.container.background`), so the two PrimeNG mapper files (`mapping-rules` + `css-rules`) **had to be re-authored in the same change** — they are compile-time validated against `ThemePath`. This is documented, not an out-of-scope note.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## PrimeNG ground truth (`p-carousel`)

PrimeNG's `Carousel` is a root container wrapping a content track, previous/next navigation buttons, and an indicator (dot) button list. It is themed with a single baseline variant and baseline severity throughout — no named color variants and no severity palette. Every child is **specific** (no generic sub-component is reused): `container`, `content`, `navigationButton`, `indicator`.

Styleable regions (authoritative, matching the mapper): the root container, the content track (`gap`), the navigation buttons (`padding`), and the indicator buttons (`width`/`height`, `border`, `focusRing`, per-state color/border/background).

## Children & dependency level (Steps 1–2)

| Child | Type | Own states | Dependency on parent |
|---|---|---|---|
| `container` | specific, no states | — | nothing |
| `content` | specific, no states | — | nothing |
| `navigationButton` | specific, stateful | `defaultState`, `hover`, `active`, `focus` | nothing |
| `indicator` | specific, stateful | `defaultState`, `hover`, `active`, `focus` | nothing |

The `carousel` root is an **aggregator** with no variant/state/severity of its own (like `calendar`), so every child sits under the single `defaultVariant` and is effectively dependency-`nothing`.

**No 5 named variants** are modeled (the mapper references no `usages.carousel.primary.*` etc.). **No severity** is declared anywhere → **no `defaultSeverity` wrapper** at any node (tokens sit directly on the state block). This matches `calendar`/`chip`.

## Rough schema (confirmed)

```
carousel (root)
├── settings                         # theming-relevant flags (orientation,
│                                    #   showIndicators, showNavigators,
│                                    #   circular, autoplayInterval) — plain optional,
│                                    #   NO inline defaults (PrimeNG built-ins apply)
├── transitionDuration               # scalar, root
└── defaultVariant                   # the only variant modeled
    ├── container                    # no states — flat token group
    │    ├── background, color, padding
    │    └── border { color, style, width, radius, offset }
    ├── content                      # no states — flat token group
    │    └── gap
    ├── navigationButton             # stateful — own defaultVariant
    │    ├── padding                 # static (variant root)
    │    ├── focusRing               # static (variant root) { color,style,width,radius,offset,shadow }
    │    └── defaultVariant
    │         ├── defaultState { background, color, border }
    │         ├── hover        { background, color, border }
    │         ├── active       { background, color, border }
    │         └── focus        { background, color, border }
    └── indicator                    # stateful — own defaultVariant
         ├── width, height           # static (variant root)
         ├── focusRing               # static (variant root) { color,style,width,radius,offset,shadow }
         └── defaultVariant
              ├── defaultState { background, color, border }
              ├── hover        { background, color, border }
              ├── active       { background, color, border }
              └── focus        { background, color, border }
```

### Structural decisions (user-confirmed)

- **Nested (calendar-style) convention** — the root `defaultVariant` is an aggregator holding the children; each **stateful** child (`navigationButton`, `indicator`) carries its **own** `defaultVariant` whose `defaultState`/`hover`/`active`/`focus` are flat siblings (not behind a `state.*` wrapper). **Static** tokens (`padding`, `width`, `height`, `focusRing`) sit at the child's node root, siblings of its `defaultVariant` — mirroring `calendar/panelbutton.ts`. **No-state** children (`container`, `content`) are flat token groups directly under `defaultVariant` — mirroring `calendar`'s multi-month divider.
- **No `defaultSeverity` wrapper** at any node (no named severities declared).
- **Token rename** `bg` → `background`, `contrast` → `color`, to match the audited nested convention used by `calendar`/`menubar`/`chip`.
- **`settings` is plain-optional with no inline defaults** (like every other audited component). PrimeNG's built-in input defaults (`orientation='horizontal'`, `circular=false`, `showIndicators=true`, `showNavigators=true`, `autoplayInterval=0`) **exactly match** the old inline defaults, so this is behavior-neutral: when `settings` is unset, `mapThemeUsageSettings` returns `undefined` and PrimeNG falls back to its own inputs.

## Gap list (Step 5) — original flat `carousel.ts` vs. target

| Area | Original | Target |
|---|---|---|
| Declaration pattern | Inline `.default(...)` on every token; 12 sub-schemas each registered with its own id | Pure `carouselShape` (all optional, nested objects `.prefault({})`) + `carouselDefaults` + `applyDefaultsRecursive(…).register(…)` |
| Root shape | `settings`, `transition`, `container`, `content`, `navigationButton`, `indicator` all flat siblings | `settings` (optional), `defaultVariant` (aggregator), `transitionDuration` (scalar) |
| Nesting | flat, `container.bg`, `indicator.hover.bg` | nested, `defaultVariant.container.background`, `defaultVariant.indicator.defaultVariant.hover.background` |
| Token names | `bg`, `contrast` | `background`, `color` |
| State model | `hover`/`active`/`focus` as flat siblings of the base tokens on one node | `defaultVariant.{defaultState,hover,active,focus}` with `defaultState` added; static tokens hoisted to node root |
| `transition` | nested `{ duration }` | scalar `transitionDuration` (calendar convention) |
| Sub-schema exports | `carouselSettings`, `carouselTransition`, `carouselContainer`, `carouselContent`, `carouselNavigationButton{,Hover,Active,Focus}`, `carouselIndicator{,Hover,Active,Focus}` | per-child `*Shape`/`*Defaults` (settings, container, content, navigationbutton, indicator) |

## Default-value policy (Step 7)

Defaults mirror the original token values verbatim (only the path/naming changes).

| Node | Filled tokens (defaults) | Left intentionally undefined |
|---|---|---|
| root | `transitionDuration` (`{{primitives.transition.duration}}`) | — |
| `settings` | — | the whole object (no inline defaults; PrimeNG built-ins apply) |
| `defaultVariant.container` | `background`, `color`, `padding` (`space.md`), `border` (full: color/style/`width md`/`radius md`/offset none) | — |
| `defaultVariant.content` | `gap` (`space.md`) | — |
| `defaultVariant.navigationButton` | static `padding` (`space.sm`), `focusRing` (full 6 fields); per-state `background`/`color`/`border` at `defaultState`/`hover`/`active`/`focus` | — |
| `defaultVariant.indicator` | static `width`/`height` (`space.md`), `focusRing` (full 6 fields); per-state `background`/`color`/`border` (border `width none`) at `defaultState`/`hover`/`active`/`focus` | — |

Baseline refs: `{{primitives.defaultVariant.defaultState.defaultSeverity.{bg,contrast,border.*,focusRing.*}}}`; hover/active/focus state refs: `{{primitives.defaultVariant.state.{hover,active,focus}.defaultSeverity.{bg,contrast,border.*}}}`.

The full resolved tree is captured by the snapshot test (Step 10) as the canonical reference.

## Changes applied (Step 8)

1. **`schema/carousel/`** (new directory) — one file per child, shape/defaults separation:
   - `settings.ts` — `carouselSettingsShape` (all-optional; **no** inline defaults).
   - `container.ts`, `content.ts` — no-state flat token shapes + defaults.
   - `navigationbutton.ts`, `indicator.ts` — stateful shapes: static tokens (`padding`/`width`/`height`/`focusRing`) at the node root, `defaultVariant.{defaultState,hover,active,focus}` flat state blocks, no `defaultSeverity` wrapper.
   - `carousel.ts` — `carouselShape` (root `settings` + `defaultVariant` + `transitionDuration`), `CarouselShapeInput` (hand-written input alias — `applyDefaultsRecursive` returns the loose `ZodObject<Record<string, ZodTypeAny>>`), `carouselDefaults`, `carousel = applyDefaultsRecursive(carouselShape, carouselDefaults).register(…)`, and the back-compat `CarouselSchema` facade class.
2. **`schema/carousel.ts`** (sibling facade, replaces the old flat schema file) — mirrors `schema/calendar.ts`: re-exports `carousel = CarouselSchema.schema` and `type { CarouselShapeInput }`.
3. **`current-themes.schema.ts`**:
   - `import type { CarouselShapeInput } from './schema/carousel'`.
   - `UsagesInput.carousel?: CarouselShapeInput` (was `z.input<typeof carousel>`) — so `usages.carousel.${LeafPaths<…>}` keeps concrete leaf paths instead of collapsing to a loose record.
   - The runtime `usages` object still registers the applied `carousel` const (unchanged).
4. **Mappers re-authored to the nested `from:` paths** (this restructure's required companion):
   - `mapping-rules/usages/carousel.rules.ts` — e.g. `usages.carousel.transition.duration` → `usages.carousel.transitionDuration`; `usages.carousel.indicator.bg` → `usages.carousel.defaultVariant.indicator.defaultVariant.defaultState.background`; hover/active → `…indicator.defaultVariant.{hover,active}.background`; `focusRing.*` → `…defaultVariant.indicator.focusRing.*` (variant root). All `to:` targets unchanged.
   - `css-rules/usages/carousel.rules.ts` — `container.*` → `usages.carousel.defaultVariant.container.*`; indicator color/border → `usages.carousel.defaultVariant.indicator.defaultVariant.{defaultState,hover,active}.{color,border.*}`; nav-button padding → `usages.carousel.defaultVariant.navigationButton.padding`.
5. **Type depth** — `theme-path.types.ts` needed **no change**: the deepest new path (`usages.carousel.defaultVariant.navigationButton.defaultVariant.defaultState.border.color`) is 7 segments after `usages.carousel.`, within the default `LeafPaths` depth of 11.
6. **`transitionDuration` type normalized** `z.string()` → `z.number()` to match `calendar` and the `transition` primitive (default ref is unchanged).

### Note on Step 8 test policy

Per the audit's structure-only-scope rule, no test was added/modified during Step 8. The spec rewrite (old `expectExactTokens` spec → three-test pattern) is Step 10 and was done as a separate step.

## Testing (Step 10)

- **`schema/carousel.spec.ts`** deleted; **`schema/carousel/carousel.spec.ts`** created with the standard three tests: `safeParse({}).success === true`, `expect(carousel.parse({})).toMatchSnapshot()`, and `expectDefaultsMatchShape(carouselShape, carouselDefaults)`.
- Snapshot `schema/carousel/__snapshots__/carousel.spec.ts.snap` generated via `nx test integration-interface`. It captures the full nested resolved tree (static tokens at variant roots, per-state color/border/background, `transitionDuration` at root) with `settings` absent (undefined, as designed).
- Verification:
  - `nx test integration-interface` — 378 passed, snapshot written.
  - `tsc` over the `primeng` mapper lib (`theme/primeng/tsconfig.lib.json`, `--noEmit`) — **clean**, with both `carousel.rules.ts` files and all `schema/carousel/*` files confirmed in the compiled set. Because `MappingRule`/`CssRule` have `from: ThemePath` and `@onecx/integration-interface` resolves to **source**, this is the compile-time check that all the new `usages.carousel.*` `from:` paths resolve against the new `CarouselShapeInput`.
  - `tsc` over `angular-utils` (`tsconfig.lib.json`, `--noEmit`) — **clean** (confirms the `mapPrimeNgCarouselSettings` settings mapper still type-checks through `ThemeUsageSettings<'carousel'>` = `UsageSettingsInput<CarouselShapeInput>`).
  - `nx test angular-utils --testPathPattern providers/primeng/carousel` — the two carousel specs (`carousel.mapper.spec.ts`, `carousel-component-settings.service.spec.ts`) **pass**.

## Out-of-scope notes

- **Semantic ref paths** — `{{primitives.…}}` reference-path correctness is not audited; default ref values were carried over verbatim from the original.
- **Indicator `focus` state** — the `focus` state block is modeled (with defaults) even though the current mapper only references `hover`/`active`; it was present in the original flat schema and is retained for parity. PrimeNG does not emit a distinct `:focus` indicator rule today.
- **`custom-use-style.service.spec.ts`** — an unrelated `angular-utils` suite fails in this environment on both the clean and working trees (a locale-data / timer issue, not carousel-related); confirmed pre-existing by stashing the change and re-running.
