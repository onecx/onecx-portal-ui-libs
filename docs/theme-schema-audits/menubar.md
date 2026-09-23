# Menubar — Theme Schema Structure Audit

- **Date**: 2026-09-22
- **Component**: `menubar` (single-file schema: `schema/menubar.ts`)
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope — but the mapper's `from:` paths are the **structural contract**, so the shape was preserved so those paths keep resolving.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## PrimeNG ground truth (`p-menubar`)

PrimeNG's `Menubar` is a single horizontal bar of items plus a mobile toggle button; opened overlays render as a submenu (`p-submenu`). There are no separate variant layers and no severity palette — the component uses one baseline color variant (`defaultVariant`) and one baseline severity (`defaultSeverity`) throughout, with per-state overrides for the interactive children. Every child is **specific** (no generic sub-component): `item`, `submenu`, `separator`, `mobileButton`.

Styleable regions (authoritative): the root bar, each `item`, the `submenu` overlay, the `separator` divider, and the `mobileButton` (with its `focusRing`).

## Rough schema (confirmed)

```
menubar (root)
├── settings                        # theming-relevant flags (autoHide, autoHideDelay,
│                                   #   autoDisplay, showDivider, showBackdrop)
└── defaultVariant
    └── defaultState
        └── defaultSeverity         # baseline token container
            ├── alignItems
            ├── background
            ├── backdrop
            ├── color
            ├── border    { color, radius }
            ├── transition { duration }
            ├── padding
            ├── gap
            ├── item
            │   ├── defaultVariant
            │   │   ├── defaultState.defaultSeverity { background, color, border, transition, shadow, icon, cursor }
            │   │   └── state
            │   │       ├── focus.defaultSeverity    { background, color, border, transition, shadow, icon, cursor }
            │   │       └── active.defaultSeverity   { background, color, border, transition, shadow, icon, cursor }
            │   ├── padding
            │   ├── gap
            │   ├── focusRing
            │   └── tooltip
            ├── submenu
            │   ├── defaultVariant
            │   │   ├── defaultState.defaultSeverity { background, color, border, transition, shadow, icon }
            │   │   └── state
            │   │       ├── focus.defaultSeverity    { … + cursor }
            │   │       └── active.defaultSeverity   { … + cursor }
            │   ├── padding
            │   ├── gap
            │   ├── minWidth
            │   ├── maxWidth
            │   └── screenSettings.xs { …layout, indent }
            ├── separator            # a `border` object (color, radius, …)
            └── mobileButton
                ├── defaultVariant
                │   ├── defaultState.defaultSeverity { background, color, border, transition, shadow, icon, size }
                │   └── state
                │       └── hover.defaultSeverity    { … + size, cursor }
                └── focusRing        { color, width, shadow }
```

### Structural decisions (user-confirmed + contract-preserving)

- **Keep `defaultSeverity` at every node as the baseline token container.** Although the "no unused wrapper" rule would normally drop a `defaultSeverity` that has no *named* severities, the badge precedent retains it as the baseline container, and — decisively — the mapper reads every token through a `defaultSeverity` path. It is a **contract** here, not an unused wrapper.
- **Preserve the legacy nested `defaultVariant → defaultState → defaultSeverity` and the `state.{focus, active, hover}` wrapper.** The mapper's `from:` paths (`usages.menubar.…item.defaultVariant.state.focus.defaultSeverity.…`, `…mobileButton.defaultVariant.state.hover.defaultSeverity.…`) read exactly this nested shape. Flattening the states to `defaultVariant` siblings (the v2 convention used by `badge`/`dropdown`/`input`) would break every `state.*`/`defaultSeverity` path and is therefore **not** applied. See "Out-of-scope notes".

## Gap list (Step 5) — original `menubar.ts` vs. target

| Area | Original | Migration |
|---|---|---|
| Declaration pattern | Inline `.default(...)` on every token; sub-schemas registered separately with their own ids | Pure `menubarShape` (all optional, nested objects `.prefault({})`) + `menubarDefaults` + `applyDefaultsRecursive(…).register(…)` |
| `menubarSettings` | Registered sub-schema, all-optional | Folded into `menubarShape` as `settings` |
| `menubarItem` / `menubarSubmenu` / `menubarSeparator` / `menubarMobileButton` | Registered sub-schemas, `.optional()` with **no** default → `undefined` in a parsed tree | Folded into `menubarShape`; now carry defaults so the deep `defaultSeverity` sub-trees are populated |
| `menubarBaseSeverityStyles` / `menubarSeverityWithCursor` / `menubarSeverityWithSize` | `.extend()` chains + registered ids | Re-expressed as optional shape fragments (`menubarBaseSeverityStylesShape`, `…WithCursor`, `…WithSize`) |
| Root `parse({})` | **Throws** — root `defaultVariant` is a required plain object with no default | `.prefault({})` chain makes empty-parse succeed |

## Default-value policy (Step 7)

Defaults mirror the original token values. The root `defaultSeverity` baseline is the single source for the shared severity tokens (background / color / border / transition / shadow), reused via a `menubarBaseSeverityDefaults` const across item / submenu / mobileButton.

| Node | Filled tokens (defaults) | Left intentionally undefined (matches original) |
|---|---|---|
| root `defaultSeverity` | `alignItems`, `background`, `color`, `border`, `transition`, `padding`, `gap` | `backdrop` (no default) |
| `item.defaultVariant.*.defaultSeverity` | `…WithCursor` set (base + `cursor: 'pointer'`) at `defaultState`, `state.focus`, `state.active` | `icon` (no default icon) |
| `item` | `padding` (`space.md`), `gap` (`space.sm`) | `focusRing`, `tooltip` |
| `submenu.defaultVariant.*.defaultSeverity` | `defaultState` = base; `state.focus`/`state.active` = base + `cursor` | `icon` (no default icon) |
| `submenu` | `padding`, `gap`, `minWidth` (`10rem`), `maxWidth` (`20rem`), `screenSettings.xs.indent` (`space.md`) | — |
| `separator` | `border` (`color`, `radius`) | `style`, `width`, `offset` |
| `mobileButton.defaultVariant.*.defaultSeverity` | `defaultState`/`state.hover` = base + `size` (`2.5rem`), hover + `cursor` | `icon` |
| `mobileButton` | `focusRing` (`color`, `width`, `shadow`) | `style`, `offset`, `radius` |

The full resolved tree is captured by the snapshot test (Step 10) as the canonical reference.

## Changes applied (Step 8)

1. **`schema/menubar.ts`** rewritten to shape/defaults separation:
   - `menubarShape` — pure, all keys optional, nested objects `.prefault({})`. Exports `MenubarShapeInput = z.input<typeof menubarShape>` (the raw-shape input alias; `applyDefaultsRecursive` returns `ZodObject<Record<string, ZodTypeAny>>`, so `z.input` of the *applied* const collapses — see `theme-usages-themepath-raw-shape`).
   - `menubarDefaults` — plain object mirroring the tree (values above).
   - `menubar = applyDefaultsRecursive(menubarShape, menubarDefaults).register(themeSchemaRegistry, { id: 'menubar' })`.
   - Legacy registered sub-schema exports (`menubarSettings`, `menubarBaseSeverityStyles`, `menubarSeverityWithCursor`, `menubarSeverityWithSize`, `menubarItem`, `menubarSubmenuScreenSettings`, `menubarSubmenu`, `menubarSeparator`, `menubarMobileButton`) removed — no external consumers exist (verified: only `menubar.ts` and `current-themes.schema.ts` reference them).
   - The three `defaultVariant` wrappers (item / submenu / mobileButton) make their `state` key `.optional()` so `{}` satisfies `.prefault({})`; the mapper only ever *reads* `state.*` (which the defaults populate), so this is faithful.
2. **`current-themes.schema.ts`**:
   - `import { menubar, menubarShape } from './schema/menubar'`.
   - `UsagesInput.menubar?: z.input<typeof menubarShape>` (was `z.input<typeof menubar>`) — the raw-shape fix so `usages.menubar.${LeafPaths<…>}` keeps its concrete leaf paths instead of collapsing to `Record<string, unknown>` (the `#1718` gotcha).
   - `usages` object still registers the applied `menubar` const (unchanged).

### Note on Step 8 test policy

The legacy spec for `menubar` did not exist; the new spec uses the three-test pattern (parses `{}`, full-tree snapshot, `expectDefaultsMatchShape`). No legacy assertions were preserved because none existed.

## Testing (Step 10)

- **`schema/menubar.spec.ts`** created with the standard three tests: `safeParse({}).success === true`, `expect(menubar.parse({})).toMatchSnapshot()`, and `expectDefaultsMatchShape(menubarShape, menubarDefaults)`.
- Snapshot `schema/__snapshots__/menubar.spec.ts.snap` generated via `nx test integration-interface`. It captures the full resolved tree, including the intentionally-undefined `icon` sub-trees and the `focusRing` `style`/`offset` fields (which have no defaults).
- Verification:
  - `nx test integration-interface` — 477 passed, snapshot written.
  - `tsc` over `integration-interface` (`tsconfig.lib.json`) — clean (confirms `current-themes.schema.ts` compiles).
  - `tsc` over the `primeng` mapper lib (`tsconfig.lib.json`) — clean. Because `menubarMappingRules: MappingRule[]` has `from: ThemePath` and `@onecx/integration-interface` resolves to **source**, this is the compile-time check that all 30 `usages.menubar.*` `from:` paths still resolve against the new raw shape.

## Out-of-scope notes

- **Mapper not reworked** — per the audit's structure-only scope, `menubar.rules.ts` was left untouched. Its `from:` paths are the contract that the shape is preserved to satisfy.
- **Nested vs. flat state axis** — the menubar mapper reads the legacy **nested** `defaultVariant → defaultState → defaultSeverity` + `state.{focus,active,hover}` shape, whereas the v2 convention (`badge`, `dropdown`, `input`) flattens states to `defaultVariant` siblings. Reconciling the menubar to the flat convention would require remapping every `state.*`/`defaultSeverity` `from:` path and is deliberately **out of scope** for this audit. If the team later wants the menubar on the flat convention, it must be paired with a mapper rework (separate task).
- **Semantic ref paths** — `{{primitives.…}}` reference-path correctness is not audited; the default reference values were carried over verbatim from the original.
