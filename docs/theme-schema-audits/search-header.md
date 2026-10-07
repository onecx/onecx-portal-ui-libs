# Theme Schema Audit — `searchHeader`

- **Component:** `ocx-search-header` (an OCX / `angular-accelerator` component — **not** a PrimeNG component)
- **Schema file:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/search-header.ts` (single-file)
- **Spec file:** `libs/integration-interface/src/lib/topics/current-themes/v1/schema/search-header.spec.ts`
- **CSS mapper:** `libs/angular-utils/theme/primeng/src/utils/mapper/css-rules/usages/search-header.rules.ts`
- **Source:** `libs/angular-accelerator/src/lib/components/search-header/`

## Step 0 — Canonical known values (from `primitives.ts`)

- **Variants:** `defaultVariant` (mandatory) + `primary/secondary/tertiary/quaternary/quinary` (only where a mapper references them).
- **States:** `defaultState` + `hover/active/selected/focus/invalid/disabled`.
- **Severities:** `defaultSeverity` + `success/info/warning/danger/contrast`.

The `searchHeader` usage declares **no** named variants/states/severities. It is a flat layout
container, so none of the canonical slots are modeled. This is intentional, not an oversight: the
component itself renders no styled box of its own — it only positions generic children.

## Step 1 — Component's children

Rendered DOM (verified from `search-header.component.html`):

```
ocx-search-header
└── ocx-page-header                                  ← generic, own usage (usages.pageHeader)
    └── .search-header__layout  (flex container)
        ├── section#searchParameterFields  (<ng-content> search form fields)
        └── .search-header__search-reset-panel
            ├── p-button (search)                   ← generic, own usage (usages.button)
            └── p-button (reset)                    ← generic, own usage (usages.button)
```

### What this component themes (its own tokens only)

The CSS mapper consumes exactly three children, all **specific** layout nodes with no variant/state/severity:

| Child            | Kind     | Tokens                                  |
| ---------------- | -------- | --------------------------------------- |
| `layout`         | specific | `rowGap`, `columnGap`                    |
| `controls`       | specific | `gap`                                   |
| `searchResetPanel` | specific | `paddingX`, `paddingY`, `alignItems`    |

The generic children (the `page-header` shell and the search/reset `p-button`s) are **not**
modeled here — they resolve through `usages.pageHeader` and `usages.button` at the CSS layer.

## Step 2 — Parent ↔ child relationships

`searchHeader` is a flat aggregator with **no** variant/state/severity of its own. Its three
children therefore each sit directly at the component root (dependency `nothing` — the parent has
no variant/state/severity to build a dependency on). There is no nesting to insert.

## Step 3 — Token consolidation

All three children are **specific** (layout-only nodes with no standalone usage), so the
generic/specific decision and the Option 1/Option 2 split do not apply — each gets its own minimal
token set by definition. No generic usage is extended or duplicated.

## Step 4 — Rough schema (confirmed)

```
searchHeader (no variant/state/severity)
├── layout            (specific, dep nothing)  → rowGap, columnGap
├── controls          (specific, dep nothing)  → gap
└── searchResetPanel  (specific, dep nothing)  → paddingX, paddingY, alignItems
```

Confirmed by the user: structure "matches"; the `controls` node is kept separate (its `gap` token
is themable independently of the panel's padding/alignment, even though both map to the same
`.search-header__search-reset-panel` selector).

## Step 5 — Validation against the actual schema

Node-by-node comparison of `search-header.ts` against the confirmed rough schema:

| Aspect                          | Expected                     | Actual                                  | Status |
| ------------------------------- | ---------------------------- | --------------------------------------- | ------ |
| Top-level shape keys            | `layout`, `controls`, `searchResetPanel` | same 3 keys, `.prefault({})`       | ✅ |
| `layout` tokens                 | `rowGap`, `columnGap`         | present, `.optional()`                  | ✅ |
| `controls` tokens               | `gap`                         | present, `.optional()`                  | ✅ |
| `searchResetPanel` tokens       | `paddingX`, `paddingY`, `alignItems` | present, `.optional()`            | ✅ |
| No variant/state/severity       | none modeled                  | none modeled                            | ✅ |
| Shape/defaults separation       | shape + defaults + `applyDefaultsRecursive` | followed; `SearchHeaderSchema` facade retained | ✅ |
| Primitive reuse                 | `withRef(z.string())`         | used throughout                         | ✅ |
| Registry registration           | `themeSchemaRegistry` id `searchHeader` | present                          | ✅ |
| Mapper token coverage           | 3 children covered            | mapper references exactly these tokens  | ✅ |

**Gap list: none.** The actual schema already matches the confirmed rough schema. No children are
missing or extra, there are no dependency-level mismatches (no states/severities to nest), no
consolidation mismatches, and no structural inconsistencies (no superfluous
`defaultState`/`defaultSeverity` wrappers, tokens reuse the `withRef` primitive, and the
`SearchHeaderSchema` class facade is retained only as a thin `static schema` wrapper).

## Step 6 — Structural changes

None required.

## Step 7 — Default values

The baseline default is required for every token (the whole usage is the baseline path — there are
no named variant/state/severity levels to fall back through). All are filled in `searchHeaderDefaults`:

| Path                       | Default                 | Rationale                                                    |
| -------------------------- | ----------------------- | ------------------------------------------------------------ |
| `layout.rowGap`            | `{{primitives.space.md}}` | baseline spacing between wrapped rows of the flex layout    |
| `layout.columnGap`         | `{{primitives.space.md}}` | baseline horizontal gap between fields                        |
| `controls.gap`             | `{{primitives.space.md}}` | baseline gap between the search & reset buttons               |
| `searchResetPanel.paddingX`| `{{primitives.space.md}}` | baseline horizontal padding of the reset panel                |
| `searchResetPanel.paddingY`| `{{primitives.space.md}}` | baseline vertical padding of the reset panel                  |
| `searchResetPanel.alignItems`| `center`              | baseline vertical alignment of the panel's buttons (literal, not a space token) |

No additional defaults are needed — there are no named variants/states/severities, so no
"differs-from-baseline" tokens to consider.

## Step 8 — Implementation changes

**None applied.** The existing `search-header.ts` already implements the confirmed structure
correctly (shape/defaults separation, `withRef` primitives, `applyDefaultsRecursive`, registry
registration, thin class facade). No code changes were made. Test/spec files were left unchanged.

## Testing

- **Spec file:** `search-header.spec.ts` (top-level, single spec — already in the 3-test form:
  parses empty object, `parse({})` full snapshot, `expectDefaultsMatchShape`).
- **Legacy spec files removed:** none (there is no per-subcomponent or facade-duplicate spec).
- **Result:** `nx test integration-interface` — `1 passed`, **3 passed** (3 tests), **1 snapshot
  passed** for `search-header`. No schema change was made, so the committed snapshot is unchanged
  and still green.

## Summary

The `searchHeader` theme schema was audited end-to-end. Because it is a flat layout-only usage of a
non-PrimeNG OCX component, it carries no variant/state/severity and models exactly the three
specific children the CSS mapper consumes (`layout`, `controls`, `searchResetPanel`), each with its
minimal token set and a fully-filled baseline default. The existing schema already matched the
confirmed structure exactly, so **no structural or default changes were required** and no code or
test files were modified.
