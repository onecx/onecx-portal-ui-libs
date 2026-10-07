# Theme Schema Audit — `breadcrumb`

- **Component:** PrimeNG `p-breadcrumb` (it **is** a PrimeNG component)
- **Schema dir:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/breadcrumb/` (`breadcrumb.ts`, `item.ts`, `separator.ts`)
- **Spec file:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/breadcrumb/breadcrumb.spec.ts`
- **CSS mapper:** `libs/angular-utils/theme/primeng/src/utils/mapper/css-rules/usages/breadcrumb.rules.ts`
- **Mapping mapper:** `libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/breadcrumb.rules.ts`

## Step 0 — Canonical known values (from `primitives.ts`)

- **Variants:** `defaultVariant` (mandatory) + `primary/secondary/tertiary/quaternary/quinary`.
- **States:** `defaultState` + `hover/active/selected/focus/invalid/disabled`.
- **Severities:** `defaultSeverity` + `success/info/warning/danger/contrast`.

The `breadcrumb` root, its `item`, and its `separator` all model **`defaultVariant` only** — the
5 canonical color variants are not modeled at any node (the CSS/mapping mappers reference no
`usages.breadcrumb.*.primary.*` etc.). This is intentional and matches the mapper.

## Step 1 — Component's children

Verified from the installed PrimeNG source (`node_modules/primeng/fesm2022/primeng-breadcrumb.mjs`)
and the `@primeuix/themes` breadcrumb design-token type. PrimeNG breadcrumb renders:

```
nav.p-breadcrumb                     (root)
└── ol.p-breadcrumb-list
    ├── li.p-breadcrumb-home-item    (home icon — uses the item link/icon/label structure)
    ├── li.p-breadcrumb-item         (each nav item)
    │     └── a.p-breadcrumb-item-link
    │           ├── span.p-breadcrumb-item-icon
    │           └── span.p-breadcrumb-item-label
    └── .p-breadcrumb-separator      (divider between items)
```

`item` carries `p-disabled` when `menuitem.disabled`; the interactive element is the
`.p-breadcrumb-item-link` anchor.

### The usage models three children

| Child       | Kind     | Levels                                    | Tokens |
| ----------- | -------- | ----------------------------------------- | ------ |
| (root)      | specific | `defaultVariant` (flat, no child nesting) | `padding`, `background`, `gap`, `transition` |
| `item`      | specific | `defaultVariant` → `defaultState` + `hover` + `focus` | `color`, `background`, `border{radius,width,color}`, `gap`, `icon{color,size}`, `label.font{weight,size}`, `focusRing`, `paddingX`, `paddingY` |
| `separator` | specific | `defaultVariant` only (stateless)          | `color`, `width` |

The home item is not modeled separately — it renders through the same `item` token set (PrimeNG's
breadcrumb design tokens only define `root`, `item`, and `separator` sections, confirmed in
`@primeuix/themes/types/breadcrumb`).

## Step 2 — Parent ↔ child relationships

The root is a flat aggregator with **no** variant/state/severity of its own; it holds its own
layout tokens and nests `item` and `separator` as siblings under the root (dependency `nothing` —
the root has no variant/state/severity to build a dependency on). Neither `item` nor `separator`
depends on any parent variant/state/severity. Both carry their own `defaultVariant` (+ states for
`item`).

## Step 3 — Token consolidation

Both `item` and `separator` are **specific** — PrimeNG breadcrumb's item/separator have no
standalone top-level usage of their own. Each gets its own minimal token set by definition. No
generic usage is extended or duplicated.

## Step 4 — Rough schema (confirmed)

```
breadcrumb
├── (root, dep nothing, defaultVariant flat)  → padding, background, gap, transition
├── item   (specific; defaultVariant → defaultState + hover + focus)
│     color, background, border{radius,width,color}, gap, icon{color,size},
│     label.font{weight,size}, focusRing, paddingX, paddingY
└── separator (specific; defaultVariant only — no states)
      color, width
```

Confirmed by the user:
- Separator stays **stateless** (`defaultVariant` only) — it's a static divider.
- Item keeps **`default` + `hover` + `focus`** (the user dropped `active` and `disabled`).
- Item **keeps** its `background` / `border.{width,color}` / `paddingX` / `paddingY` tokens (rather
  than trimming to only what the mapper consumed) — and the mapper was enhanced to emit them.

## Step 5 — Validation against the actual schema

The pre-audit schema already matched the confirmed structure (root flat `defaultVariant`,
`item` = `defaultVariant` → states, `separator` = `defaultVariant` only, specific children,
`withRef`/primitive shapes, `applyDefaultsRecursive`, registry id `breadcrumb`, thin class facade).

**Gap list (pre-audit state):**

| # | Gap | Severity |
| - | --- | -------- |
| 1 | `item` declared **`active` + `disabled`** states (shape + defaults + snapshot) that no mapper rule ever consumed — dead states. | structural |
| 2 | `item.focus.color` / `icon.color` declared + defaulted but never emitted (dead focus state). | dead token |
| 3 | `item.background.color`, `border.width`, `border.color`, `paddingX`, `paddingY` (defaultState) declared + defaulted + snapshot-locked but **never emitted** by any rule. | dead token |

**Changes applied (Step 6, per user decision "drop active and disabled state. Only have default,
hover and focus. Adjust mappings if needed" + "Keep + wire via CSS"):**

1. **`item.ts`** — removed the `active` and `disabled` states from both the shape
   (`breadcrumbItemVariantShape`) and the defaults. Item now models `defaultState`, `hover`,
   `focus` only.
2. **`css-rules/usages/breadcrumb.rules.ts`** — wired the previously-dead tokens so every
   declared item token is actually emitted:
   - baseline `.p-breadcrumb-item` rule now also emits `background`, `border-color`,
     `border-width`, `padding-inline`/`padding-block` (from `defaultState`).
   - new `.p-breadcrumb-item:not(.p-disabled):hover` rule emits `background`, `border-color`,
     `border-width` (color/icon already covered by the mapping-rules → `item.color`/`hoverColor`).
   - new `.p-breadcrumb-item:not(.p-disabled):focus-visible` rule emits `background`,
     `border-color`, `border-width`, plus `.p-breadcrumb-item-link` → focus `color` and
     `.p-breadcrumb-item-icon` → focus `icon.color`.
   - Pseudo-class selectors follow the established convention from
     `tabs/tab.rules.ts` (`.p-tab:not(.p-disabled):hover` / `:focus-visible`).
3. **`mapping-rules/usages/breadcrumb.rules.ts`** — **unchanged**. It only ever referenced
   `defaultState.*` and `hover.*` (which remain valid); the newly-wired tokens go through the
   CSS mapper (PrimeNG's breadcrumb item colorScheme has no focus/active/disabled/border-color
   props, so those can't be expressed as preset-token mappings — pseudo-class CSS is the correct
   mechanism).

## Step 7 — Default values

Baseline defaults required and present:

| Node | Path (conceptual) | Default |
| ---- | ----------------- | ------- |
| root | `defaultVariant.padding` | `{{primitives.space.md}}` |
| root | `defaultVariant.background.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}` |
| root | `defaultVariant.gap` | `{{primitives.space.md}}` |
| root | `defaultVariant.transition.duration` | `{{primitives.transition.duration}}` |
| item | `item.defaultVariant.defaultState.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}` |
| item | `item...defaultState.background.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}` |
| item | `item...defaultState.border.{radius,width,color}` | radius `{{...border.radius}}`, width `{{primitives.border.width.md}}`, color `{{...border.color}}` |
| item | `item...defaultState.gap` | `{{primitives.space.sm}}` |
| item | `item...defaultState.icon.{color,size}` | color `{{...contrast}}`, size `{{primitives.icon.md}}` |
| item | `item...defaultState.label.font.{weight,size}` | `{{primitives.font.weight}}`, `{{primitives.font.size}}` |
| item | `item...defaultState.focusRing.{color,width,offset,radius,shadow}` | `{{...focusRing.*}}` baseline |
| item | `item...defaultState.paddingX` / `paddingY` | `{{primitives.space.md}}` |
| item | `item...hover.{background,border,color,icon}` | `{{primitives.defaultVariant.state.hover.defaultSeverity.*}}` |
| item | `item...focus.{background,border,color,icon}` | `{{primitives.defaultVariant.state.focus.defaultSeverity.*}}` |
| separator | `separator.defaultVariant.color` | `{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}` |
| separator | `separator.defaultVariant.width` | `{{primitives.border.width.md}}` |

Named states (`hover`, `focus`) carry only the tokens that differ from `defaultState` (the
per-state color/background/border/icon set). The removed `active`/`disabled` states no longer
appear anywhere in the shape, defaults, or snapshot.

## Step 8 — Implementation changes

- **Schema:** `item.ts` restructured (dropped `active`/`disabled`). Test/spec files intentionally
  left unchanged during this step (Step 10 covers them).
- **Mapper:** `css-rules/usages/breadcrumb.rules.ts` enhanced to consume the newly-kept tokens and
  the focus state via pseudo-class rules. `mapping-rules` untouched.
- **Type-check:** both `integration-interface` and `angular-utils` `tsc --noEmit` pass clean — the
  new `from` paths are valid `ThemePath`s.

## Testing

- **Spec file:** `breadcrumb/breadcrumb.spec.ts` (top-level, single spec, 3-test form) —
  **unchanged**; it only imports the top-level `breadcrumb` schema + defaults, so it still covers
  the restructured tree.
- **Legacy spec files removed:** none.
- **Snapshot:** `breadcrumb.spec.ts.snap` regenerated (`-u`). The diff is exactly the removal of
  the `item.defaultVariant.active` and `item.defaultVariant.disabled` blocks; all other values are
  unchanged. **No hand-edits** to the `.snap`.
- **Result:** `nx test integration-interface` — breadcrumb suite **3 passed** (parse, full
  `parse({})` snapshot, `expectDefaultsMatchShape`), snapshot **updated** and committed.

## Summary

The `breadcrumb` schema already had the correct structure (PrimeNG component; root + specific
`item`/`separator`; `defaultVariant` only). The audit's real work was the **mapper/schema
dead-weight cleanup** the user requested:

1. **Item states trimmed to `default` + `hover` + `focus`** — the `active` and `disabled` states
   were removed from the shape, defaults, and snapshot (they were declared but never consumed).
2. **Dead tokens wired up** — the CSS mapper was extended so every kept item token is emitted:
   the baseline item rule now emits background/border/padding, and new `:hover` / `:focus-visible`
   rules consume the hover and focus `background`/`border`/`color`/`icon` tokens. PrimeNG's
   breadcrumb item colorScheme has no focus/border-color props, so pseudo-class CSS (the
   `tabs`-style convention) is the correct mechanism rather than preset-token mapping.

Net result: smaller, honest schema (no dead states), a mapper that actually emits every declared
item token, clean type-check, and a green updated snapshot.
