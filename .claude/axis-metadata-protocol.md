# Protocol: add Theme V2 axis markers + spec to one usage

You are adding explicit `axis` markers to ONE usage's schema and a matching axis-metadata test
spec. The markers drive the build-time relaxed-axis fallback (see `dev-docs/theming/theme-v2.adoc`,
section "Schema Node Marker and Axis Metadata"). Work is self-validated: you write, run the spec,
and iterate until green.

## Ground truth — how the walker classifies nodes

The walker is `libs/integration-interface/src/lib/topics/current-themes/v1/utils/axis-metadata.ts`.
For each object node it classifies its keys from the node's registered `axis` + each child's marker:

- A child with `child: true` **opens a new fallback scope**.
- A child with `axis: 'none'` or `axis: 'setting'` is **skipped** (never an axis member, never a
  scope) — this is how static token groups and `settings` opt out.
- Under a node with `axis: 'variant' | 'state' | 'severity'`, **each key is a member of that axis**
  (e.g. a `variant` node's keys `defaultVariant`, `filled` are variant members). This is the crucial
  effect: without the marker, only the literal `defaultVariant`/`defaultState`/`defaultSeverity`
  keys are recognised and the named variants/states/severities get no fallback.
- A child object whose shape **contains a `defaultVariant` key** opens a scope automatically
  (variant-root heuristic), even without `child: true`.
- Default-key heuristic: a key literally named `defaultVariant`/`defaultState`/`defaultSeverity` is
  the default member of that axis even if the parent node is unmarked.

The test (`collectAxisScopes`) introspects the **final applied** schema and reports, per fallback
scope, the set of variant / state / severity members. `expectAxes` prints actual-vs-expected on a
mismatch — use the diff to converge.

## Marker rules (top-down, per object node)

- **Variant container** — keys are named variants (`defaultVariant`, `filled`, `primary`, ...):
  `axis: 'variant'`. On a **nested** component root (not the usage root) also `child: true`
  (calendar convention: `axis: 'variant', child: true`).
- **State container** — keys are named states (`defaultState`, `hover`, `focus`, `active`,
  `disabled`, `selected`, `invalid`, ...): `axis: 'state'`.
- **Severity container** — keys are named severities (`defaultSeverity`, `success`, `info`,
  `warning`, `danger`, `contrast`, `help`, `primary`, ...): `axis: 'severity'`.
- **Settings** — behavioral options with no visual tokens: `axis: 'setting'`.
- **Static token group** — `axis: 'none'` is ONLY for a static group that sits as a **direct sibling
  of the named members of a slot** and must not vary by them. Examples: `focusRing` sitting next to
  `defaultState`/`hover` inside the state slot (input, accordion header); `settings` /
  `transitionDuration` / `shadow` sitting next to `defaultVariant` at a root or input root. These
  would otherwise be classified as members of the enclosing slot's axis — opt them out.
- **Per-state / per-variant CONTENT stays UNMARKED.** The *value* of a state or variant member —
  the object holding the leaf tokens (`color`, `background`, `border`, `padding`, `font`,
  `toggleIcon`, a nested `content`/`first`/`last`, …) — is **plain structural: leave it unmarked**
  (no `axis`, no `none`). Its tokens then fall back *within* the enclosing scope's state/variant
  axis (exactly like the input's per-state tokens). Do NOT mark this content `none` — that would
  strip the tokens from the scope entirely. This is the #1 gotcha; `none` is for siblings of the
  slot, not for the slot's member values.
- **Plain structural / no axis** — a group with no axis of its own: leave unmarked (or
  `child: true` for a child boundary that re-roots without an axis).

### Which object gets the axis (the slot, not its values)
Register the axis on the **container whose keys ARE the named members**, then wrap it with
`.prefault({})` where it's used:
- **Usage root** — `applyDefaultsRecursive(...).register(reg, { id, axis: 'variant' })` (no `child`).
- **Nested component root** — the `{ defaultVariant: <slot>.prefault({}) }` object:
  `z.object({ defaultVariant: ... }).register(reg, { id, axis: 'variant', child: true })`. The
  `child: true` re-roots the fallback and opens the component's own scope; `axis: 'variant'` makes
  its `defaultVariant` key the default variant member. (calendar `panel`/`input` do exactly this.)
- **State slot** — the object whose keys are states (`defaultState`, `hover`, …):
  `z.object({ defaultState, hover, ... }).register(reg, { id, axis: 'state' })`.
- **Severity slot** — the object whose keys are severities (`defaultSeverity`, …):
  `axis: 'severity'`. Only present when the node actually has a `defaultSeverity` wrapper.
- The **member values** (what `defaultState`, `hover`, `filled`, … map to) — the leaf-token object —
  stay unmarked.

### Where the root marker goes
`applyDefaultsRecursive(shape, defaults)` rebuilds the **root object fresh**, so any `axis`
registered on the pure `*Shape` is silently discarded. Put the root marker on the **final export**:
`applyDefaultsRecursive(xShape, xDefaults).register(themeSchemaRegistry, { id: 'x', axis: 'variant' })`
(see `badge.ts`, `input.ts`, `calendar.ts`). Usages that DON'T use `applyDefaultsRecursive`
(breadcrumb, togglebutton, selectbutton, dataview) put the marker on the root `z.object` directly.
Sub-shapes are registered directly on their own `z.object` as normal. `applyDefaultsRecursive` only
recurses into a field when that field is itself a `z.ZodObject`; because slots hold a
`.prefault({})` wrapper (not a raw `ZodObject`), **nested sub-shape registrations survive** — so put
axis markers on the nested `*Shape` objects and they will be seen by the walker.

### Worked example — accordion (multi-level: root → panel → header)
- `accordion/index.ts` — root export `applyDefaultsRecursive(accordionShape, accordionDefaults)
  .register(reg, { id: 'accordion', axis: 'variant' })`.
- `accordion/panel.ts` —
  - state slot `z.object({ defaultState, active, disabled }).register(reg, { id, axis: 'state' })`;
  - root `accordionPanelShape = z.object({ defaultVariant: <slot>.prefault({}) }).register(reg,
    { id, axis: 'variant', child: true })`;
  - `accordionPanelStateShape` (border/header/content — the value of each state) **unmarked**.
- `accordion/header.ts` —
  - state slot `z.object({ focusRing, defaultState, hover }).register(reg, { id, axis: 'state' })`
    where `focusRing` (a **static sibling of the states**) is
    `borderWithShadow.extend({}).register(reg, { id, axis: 'none' }).optional()`;
  - root `accordionHeaderShape = z.object({ defaultVariant: <slot>.prefault({}) }).register(reg,
    { id, axis: 'variant', child: true })`;
  - `accordionHeaderStateShape` (color/background/padding/font/border/toggleIcon/first/last — the
    value of each state) **unmarked** (so its tokens fall back within the header state scope).
- Resulting scopes: `accordion` → `{variant:[defaultVariant]}`; `panel` →
  `{variant:[defaultVariant], state:[defaultState,active,disabled]}`; `header` →
  `{variant:[defaultVariant], state:[defaultState,hover]}` (no severity — states carry no
  `defaultSeverity` wrapper here).

### Critical pitfalls (from the task)
- **Do NOT register a shared primitive** (`borderWithShadow`, `bg`, `border`, `color`, `font`, ...)
  directly with a marker. Make a fresh copy first: `borderWithShadow.extend({})` then register the
  copy with the marker. `.extend()` drops the registry entry, so the extended copy must be
  registered itself.
- **Markers on a `withRef(...)` union are lost.** `withRef(x)` is `z.union([x, themeRef])`;
  registering the union loses the marker. Register the **inner** `z.string()`/`z.number()`/
  `z.boolean()` instead: `withRef(z.string().register(themeSchemaRegistry, { id: '...', axis: 'none' }))`.
  Only do this where the token genuinely sits next to axis members (see the "static token group"
  rule) — do not blanket-mark every leaf.

## Validation loop (run from `libs/integration-interface`)

1. **Probe first** (optional, high value): temporarily dump current scopes to see what exists before
   you change anything and to confirm your expected output:
   ```
   npx ts-node -e "
   import { collectAxisScopes } from './src/lib/topics/current-themes/v1/schema/test-utils'
   for (const [s,a] of collectAxisScopes('v2.usages.MYUSAGE')) console.log(s, JSON.stringify(a))
   "
   ```
   (Adjust the import path to an absolute or `./` relative from the lib root.)
2. Write the spec.
3. Run it fast (single file, no coverage):
   ```
   cd libs/integration-interface && npx jest --config jest.config.ts --testPathPatterns="MYUSAGE-axis-metadata" --coverage=false --ci
   ```
4. On an `expectAxes` failure, read the `expect(received).toEqual(expected)` diff — `received` is the
   actual marker-derived axes. Adjust markers (or the expectation) and rerun.
5. When the axis spec is green, run the usage's **existing** spec to confirm no snapshot/behavior
   regression from your edits: `--testPathPatterns="MYUSAGE"` (matches both specs).
6. Type-check just your files:
   ```
   cd libs/integration-interface && npx tsc -p tsconfig.lib.json --noEmit 2>&1 | grep -E "MYUSAGE"
   ```
   (If `tsc` is too slow/noisy, at minimum ensure the two spec files + the edited schema file
   compile — jest's ts-jest transform already type-checks them at test time.)

## Spec structure — mirror the references

References: `input-axis-metadata.spec.ts`, `calendar/calendar-axis-metadata.spec.ts`,
`button/button-axis-metadata.spec.ts`, and the newly added `badge-axis-metadata.spec.ts`. Use
`collectAxisScopes`, `expectAxes`, `expectFallback` from the shared `test-utils.ts`.

```ts
import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'   // adjust depth for subdirs

const USAGE = 'v2.usages.<usageKey>'   // exact key: dataTable, groupByCountDiagram, pageHeader, interactiveDataView, toggleswitch, ...

describe('<usage> axis metadata', () => {
  const scopes = collectAxisScopes(USAGE)

  // (a) If the usage opens MULTIPLE distinct component scopes, list them:
  it('opens scopes only for the expected components', () => {
    const names = new Set([...scopes.keys()].map((p) => p.split('.').pop()))
    expect([...names].sort()).toEqual([ /* ... */ ].sort())
  })

  // (b) Per component level (root + each child component), assert:
  //     exact variant/state/severity members (none/setting keys are excluded by construction),
  //     then the fallback behaviour on that level.
  describe('root', () => {
    it('has its variants/states/severities', () => {
      expectAxes(scopes, USAGE, { variant: [...], state: [...], severity: [...] })
    })
    it('a non-default <axis> falls back to its default on this level', () => {
      expectFallback(USAGE, { from: '<...>', to: '<...>' })
    })
    it('the fully-default path has no fallback (no parent scope)', () => {
      expectFallback(USAGE, { from: '<...all default...>', to: undefined })
    })
  })
  // Repeat for each child component (use its scope name / path suffix for expectAxes).
})
```

### Spec rules (from the task)
- Per component level: **exact** variants/states/severities — nothing missing, nothing extra
  (`axis: 'none'`/`'setting'` keys are excluded by construction, so don't list them).
- **Fallback**: a non-default key falls back to its default on its own level; a fully-default level
  falls back on the **first parent** level with a non-default key; **no fallback** when all parents
  are default. `expectFallback` takes `{ from, to }` paths **relative to `USAGE`**, where `to` is
  `undefined` for "no fallback".
- **If the usage is purely static (no variant/state/severity anywhere)** — e.g. content, region,
  tooltip, ripple, diagram, groupByCountDiagram, loadingIndicator — the correct result is **no
  fallback scopes**. The spec then asserts `expect(collectAxisScopes(USAGE).size).toBe(0)` with a
  comment explaining the usage is a static container. Still review the schema for `setting`/`none`
  markers where appropriate (e.g. a `settings` block).

### Choosing fallback leaves
Pick a leaf that actually exists at that level (a token that is in the defaults tree). Use
`defaultState`/named-state (and `defaultSeverity` where the node has severity) segments matching the
real schema. For a flat usage whose tokens sit directly on the state (no severity wrapper), the leaf
is `defaultState.<token>`. Prefer `color`/`background`/`padding`-style leaves that clearly exist.

## Deliverable
- Edited schema file(s) under `.../v1/schema/` (markers only — do not change token values, defaults,
  or the shape's public API).
- New `<usage>-axis-metadata.spec.ts` beside the usage (same dir; for single-file usages, same
  directory as the `.ts`; for subdir usages, the subdir's `index`/main file's folder).
- Both your axis spec AND the usage's existing spec green; no tsc errors in your files.

## Guardrails
- Do NOT touch other usages' schema files. Do NOT edit `test-utils.ts`, `registry.ts`,
  `axis-metadata.ts`, `resolve-leaf-fallback.ts`, `defaults-helper.ts`, or `current-themes.schema.ts`
  unless a change is strictly required (report it if so).
- Do NOT modify existing snapshot files. If an existing spec's snapshot changes because of your
  markers, STOP and report — markers must not change the resolved token values.
- Keep comments concise and in the file's existing style.
