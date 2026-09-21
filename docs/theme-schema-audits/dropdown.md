# Dropdown — Theme Schema Structure Audit

- **Date**: 2026-09-15
- **Component**: `dropdown` (single-file schema: `schema/dropdown.ts`) — PrimeNG v21 `p-select`
- **Scope**: structure-only audit (shape, children, dependency nesting, variant layers, states, severities, default-value placement). Semantic `{{primitives...}}` reference-path correctness against the CSS mapper is out of scope.

## Canonical baseline values (from `primitives.ts`)

- **Variants**: `defaultVariant` + `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- **States**: `defaultState` + `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- **Severities**: `defaultSeverity` + `success`, `info`, `warning`, `danger`, `contrast`

## PrimeNG ground truth (`p-select`, v21.2.0)

There is no standalone `Dropdown` component — the dropdown is fully unified into `p-select` (`class Select extends BaseInput`). It renders two distinct regions:

- **Container / trigger box** (`span.p-select` root): the label/value + clear icon + chevron/loading icon. This is the only child with a variant + state axis.
- **Overlay** (`p-select-overlay`, portal-appended): the listbox (`p-select-list`) with option rows, group labels, checkmark/blank icons, and the empty message.
- **Header + filter** render only when `filter=true` — not modeled here (the legacy schema and the mapper reference no filter node).

Styleable PT parts (authoritative): `root`, `label`, `clearIcon`, `dropdownIcon`/`loadingIcon`, `overlay`, `header`+`filter` (conditional), `listContainer`/`list`, `option`(+`optionLabel`), `optionCheckIcon`/`optionBlankIcon`, `optionGroup`(+`optionGroupLabel`), `emptyMessage`. No generic sub-components — every child is specific.

## Rough schema (confirmed)

```
dropdown (root aggregator — no own tokens)
├── settings                        # theming-relevant flags only (no non-theming flags)
├── container                       # variant + state (defaultVariant + filled × 6 states)
│   ├── defaultState                # background, color, border, focusRing,
│   │   └── placeholder, invalidPlaceholder, triggerIcon, width, font, space
│   ├── hover / focus / active      # (same state token set)
│   └── disabled / invalid          # (same state token set)
├── clear                           # state (defaultState/hover/focus/disabled): icon (shared primitive), color
├── overlay                         # flat: background, color, border
├── list                            # flat: space, font
├── option                          # state (defaultState/hover/focus/selected/disabled):
│   ├── background, color, border, font, padding   (per state)
│   └── group                       # flat: background, color, font, padding
├── checkmark                       # flat: color, space
└── empty                           # flat: message{font}, space
```

### Structural decisions (user-confirmed)

1. **`container` is the variant/state node** at the root, preserving the `usages.dropdown.container.*` prefix. Variants = `defaultVariant` + `filled` (mirrors the legacy `settings.variant: ['filled','outlined']` and the `input` precedent).
2. **Full state set on `container`**: `defaultState`/`hover`/`focus`/`active`/`disabled`/`invalid`. PrimeNG's `p-select-open` (expanded) maps to the canonical **`active`** state (same as `input` using `active` for panel-open). Legacy `expanded`→`active`, `disable`→`disabled`, + `invalid`.
3. **The 5 canonical color variants are not modeled** — the mapper references no `usages.dropdown.*.primary.*` etc.
4. **No `defaultSeverity` wrapper** — dropdown has no named severities, so tokens sit directly in each state shape (matching `calendar`, not the `input` outlier which is the only schema that wraps even without named severities).
5. **DOM nesting ≠ schema tokens**: `option`/`checkmark`/`empty` are top-level siblings of `list` (not nested under it) because they map to distinct PrimeNG `components.select.*` targets. `group` stays nested under `option` (the mapper reads `usages.dropdown.option.group.*`).
6. **`triggerIcon` and `clear.icon` use the shared `icon` primitive** (from `primitives.ts`) — the page-header PR that introduced it is merged, so the legacy local `icon` shim + its "remove when page-header PR lands" TODO is removed and replaced by the shared primitive. Defaults mirror `multiselect/labelcontainer.ts` (which models the same `dropdownIcon`/`clearIcon`): `size` `sm`, `paddingX`/`paddingY` `sm`, `color` per state.
7. **No `filter`/`header` node** (legacy and mapper model neither).
8. **`transition` dropped from `container`** — not part of the confirmed rough-schema token set (the legacy mapper still reads `container.transition.duration`, but the mapper is a separate concern — see Out-of-scope).

## Gap list (Step 4) — confirmed rough schema vs. actual `dropdown.ts`

| # | Gap | Actual (legacy) | Confirmed target |
|---|-----|-----------------|------------------|
| 1 | Shape/defaults separation | Inline `.extend()`/`.optional()` shapes, `bgContrast.extend(...)`, local `stateVariant`/`stateVariants`; no `*Shape`/`*Defaults` split | `dropdownShape` (pure, all optional; structural children `.prefault({})`) + `dropdownDefaults` (plain objects) + `applyDefaultsRecursive(...).register({id:'dropdown'})` |
| 2 | Local `icon` shim | Local `dropdownIcon` (`size`/`font`/`url`/`content`) with a "remove when page-header PR lands" TODO | Removed; `triggerIcon`/`clear.icon` use the shared `icon` primitive (page-header PR merged) — resolves the TODO |
| 3 | `defaultSeverity` | Never used (legacy had no severity) | Still none — tokens sit directly in the state shape (calendar pattern) |
| 4 | `container` states | `default`/`disable`/`hover`/`focus`/`expanded` (5) | Canonical `defaultState`/`hover`/`focus`/`active`/`disabled`/`invalid` (6) |
| 5 | `container` variant axis | None (only a `settings.variant` flag) | `defaultVariant` + `filled` |
| 6 | `container` tokens | `bg`/`contrast` (bgContrast) + space/states/placeholder/invalidPlaceholder/border/focusRing/`transition`/font/width | Per-state: `background`/`color` (renamed from bg/contrast) + border/focusRing/`placeholder{color}`/`invalidPlaceholder{color}`/`triggerIcon{color}`/width/font/space; **`transition` dropped** |
| 7 | `option.selected` | Special sub-node (`font` + `focus`) + a `selected` state entry + `group` (`font`+`padding`) | `selected` becomes a **plain state**; `group` = `background`/`color`/`font`/`padding`, flat child at the option root |
| 8 | `clear` | `states{default,hover,disabled,focus}` + `icon` shim | `defaultState`/`hover`/`focus`/`disabled` + `icon` (shared primitive) + `color` |
| 9 | `checkmark.color` | Typed as a plain token string | `color` primitive + `space` |
| 10 | `empty.message` | `space.extend({ font })` | `message { font }` + `space` at the `empty` root |
| 11 | `overlay`/`list` | `bgContrast` (`bg`/`contrast`) | `background`/`color` |
| 12 | Registry ids | 11 ids registered (every sub-node) | Only `dropdown` registered (like `input`/`calendar`); sub-shapes stay local/unregistered |

## Default-value policy

Ref strings are opaque `{{...}}` values resolved at runtime by the consumer/mapper; they are not validated against the primitives shape. The defaults below mirror the conventions in `input.ts` (global `primitives.defaultVariant.*` and `primitives.variant.primary.*` for the trigger; `primitives.area.overlay.*` for the panel) and `calendar/panel.ts`.

### `container.defaultVariant` (per state)

| Token | Default |
|---|---|
| `background` | `{{primitives.defaultVariant.<state>.defaultSeverity.bg}}` |
| `color` | `{{primitives.defaultVariant.<state>.defaultSeverity.contrast}}` |
| `border.color` / `.style` | `{{primitives.defaultVariant.<state>.defaultSeverity.border.color}}` / `.border.style` |
| `border.width` / `.offset` / `.radius` / `.shadow` | `{{primitives.border.width.sm}}` / `.border.offset.none` / `.border.radius.md` / `{{primitives.shadow.none}}` |
| `focusRing.color` / `.style` | `{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}` / `.style` |
| `focusRing.width` / `.offset` / `.radius` / `.shadow` | `{{primitives.border.width.md}}` / `.border.offset.none` / `{{primitives.radius.md}}` / `{{primitives.shadow.none}}` |
| `placeholder.color` / `invalidPlaceholder.color` / `triggerIcon.color` | `{{primitives.defaultVariant.<state>.defaultSeverity.contrast}}` |
| `triggerIcon.size` / `.paddingX` / `.paddingY` | `{{primitives.icon.size.sm}}` / `{{primitives.space.sm}}` / `{{primitives.space.sm}}` |
| `font.weight` / `.size` | `{{primitives.font.weight}}` / `{{primitives.font.size}}` |
| `space.sm` / `.md` / `.lg` | `{{primitives.space.sm}}` / `.space.md` / `.space.lg` |
| `width` | `{{primitives.space.xl}}` |

- **`active`** (expanded/panel-open) and **`invalid`** reference their dedicated primitive states (`state.active.*`, `state.invalid.*`) — both exist on the `variantWithStates` baseline, so no reuse of other states is needed.

### `container.filled` (partial override, per state)

Only the tokens that differ from `defaultVariant` are set; the rest resolve via the runtime fallback:

| Token | Default |
|---|---|
| `background` | `{{primitives.variant.primary.<state>.defaultSeverity.bg}}` |
| `color` | `{{primitives.variant.primary.<state>.defaultSeverity.contrast}}` |
| `placeholder.color` / `triggerIcon.color` | `{{primitives.variant.primary.<state>.defaultSeverity.contrast}}` |
| `triggerIcon.size` / `.paddingX` / `.paddingY` | `{{primitives.icon.size.sm}}` / `{{primitives.space.sm}}` / `{{primitives.space.sm}}` |

### Other children

| Node / token | Default |
|---|---|
| `settings.scrollHeight` | `{{primitives.space.xl}}` (only default set on `settings`; all other flags stay optional) |

The `settings` block is intentionally limited to **theming-relevant** flags: those that affect appearance, which sub-parts render, or focus/interaction feel. It keeps `fluid`, `scrollHeight`, `filter`, `readonly`, `editable`, `loadingIcon`, `filterLocale`, `showClear`, `virtualScroll`, `virtualScrollItemSize`, `selectOnFocus`, `autoOptionFocus`. Non-theming flags are **excluded** to match the closest v2 sibling (`multiselect/settings`): `appendTo` (DOM-mount/stacking position — no visual effect), `lazyLoading` (data-fetching concern), and `resetFilterOnHide` (interaction logic — `multiselect` also drops it). The redundant `variant` flag is omitted because the container's `defaultVariant`/`filled` slots already model the variant axis.
| `clear.<state>.color` / `.icon.color` | `{{primitives.variant.primary.<state>.defaultSeverity.contrast}}` |
| `clear.<state>.icon.size` / `.paddingX` / `.paddingY` | `{{primitives.icon.size.sm}}` / `{{primitives.space.sm}}` / `{{primitives.space.sm}}` |
| `overlay.background` / `.color` | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` / `.contrast` |
| `overlay.border.color` / `.style` / `.width` / `.offset` / `.radius` / `.shadow` | overlay `border.color` / `.border.style` / `{{primitives.border.width.sm}}` / `.border.offset.none` / `{{primitives.border.radius.md}}` / `{{primitives.shadow.md}}` |
| `list.space.md` / `.sm` | `{{primitives.space.md}}` / `{{primitives.space.sm}}` |
| `list.font.weight` / `.size` | `{{primitives.font.weight}}` / `{{primitives.font.size}}` |
| `option.<state>.background` / `.color` | `{{primitives.area.overlay.<base>.defaultSeverity.bg}}` / `.contrast` (base = `hover` for `focus`/`selected`, else `defaultState`) |
| `option.<state>.font.weight` / `.size` | `{{primitives.font.weight}}` / `{{primitives.font.size}}` |
| `option.<state>.padding` | `{{primitives.space.md}}` |
| `option.group.background` / `.color` | `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}` / `.contrast` |
| `option.group.font.weight` / `.size` / `.padding` | `{{primitives.font.weight}}` / `{{primitives.font.size}}` / `{{primitives.space.md}}` |
| `checkmark.color` | `{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}` |
| `checkmark.space.sm` / `.md` | `{{primitives.space.sm}}` / `{{primitives.space.md}}` |
| `empty.message.font.weight` / `.size` | `{{primitives.font.weight}}` / `{{primitives.font.size}}` |
| `empty.space.md` | `{{primitives.space.md}}` |

## Changes applied

- Rewrote `schema/dropdown.ts` to the v2 shape/defaults separation pattern: `dropdownShape` (pure, all-optional, structural children `.prefault({})`) + `dropdownDefaults` (plain tree) + `applyDefaultsRecursive(...).register({id:'dropdown'})`.
- Removed the local `icon` shim and its TODO; `triggerIcon` and `clear.icon` now use the shared `icon` primitive with the `multiselect/labelcontainer` default convention (`size`/`paddingX`/`paddingY` `sm`, `color` per state).
- Renamed `container`/`overlay`/`list`/`option` `bg`/`contrast` → `background`/`color`; renamed container states to canonical names (`expanded`→`active`, `disable`→`disabled`, +`invalid`); added the `defaultVariant`/`filled` variant axis.
- Flattened `option.selected` to a plain state; expanded `option.group` to `background`/`color`/`font`/`padding`.
- Registered only the `dropdown` id (was 11); sub-shapes are now local.
- Trimmed `settings` to theming-relevant flags only: removed `variant` (covered by the container variant axis), `appendTo`, `lazyLoading`, and `resetFilterOnHide`, matching the `multiselect/settings` curation.
- Added `dropdown.spec.ts` (3 tests) and its snapshot.

## Testing (Step 8)

- `schema/dropdown.spec.ts` — exactly 3 tests (matching `input.spec.ts` / `calendar/calendar.spec.ts`):
  1. `dropdown.safeParse({}).success === true`
  2. `dropdown.parse({})` → `toMatchSnapshot()` (full resolved tree)
  3. `expectDefaultsMatchShape(dropdownShape, dropdownDefaults)`
- Command: `CI=false npx nx test integration-interface --no-interactive --testFile='libs/integration-interface/src/lib/topics/current-themes/v1/schema/dropdown.spec.ts' -u` (the `-u` is only needed once to write the fresh snapshot).
- Result: **3 passed, 1 snapshot written** (stable on a subsequent no-`-u` run). Full `nx test integration-interface` has pre-existing out-of-scope failures (dataview, message, interactive-data-view), so the targeted `--testFile` run is the correct gate.

## Out-of-scope notes

- **CSS mapper rules are untouched.** `libs/angular-utils/.../mapping-rules/usages/dropdown.rules.ts` and `css-rules/usages/dropdown.rules.ts` still read the **legacy flat** `usages.dropdown.*` paths (`container.states.disable.bg`, `overlay.bg`, …), not the v2 `defaultVariant`/`filled` shape. This matches every prior audit: the v2 `input`/`calendar` schemas likewise have mappers that read legacy/flat paths. The mapper rework is a separate concern and is not part of this structure-only audit.
- **`container` `transition` was dropped** from the schema (gap #6/#8). The legacy mapper still consumes `usages.dropdown.container.transition.duration`; if that behavior must be preserved it will be handled by the (out-of-scope) mapper rework, not by re-adding the token here.
- **`{{primitives...}}` reference-path correctness** is out of scope; defaults mirror the `input.ts`/`calendar` ref conventions but were not validated against a concrete theme file.
