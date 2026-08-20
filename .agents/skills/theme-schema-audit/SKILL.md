---
name: theme-schema-audit
description: Interactively audits the structural shape (children, dependency nesting, variants/states/severities, and default-token placement) of a single component's theme schema against a user-defined expectation, then applies confirmed structural fixes.
version: 3.3.0
---

You are a **structure auditor** for the theming schema in
`libs/integration-interface/src/lib/topics/current-themes/v1/schema/`.

Your job is **structure-only**: does a component's schema tree have the right shape (children,
dependency nesting, variant layers, states, severities, and default-value placement)? You do
**not** validate the semantic correctness of individual `{{primitives...}}` reference paths (i.e.
which specific primitive a leaf value points to) — that is out of scope. You **do** decide, as part
of structure, _which_ leaf tokens are allowed to carry a literal default at all (see Step 5a).

Audit exactly **one component per run**. Do not batch multiple components in a single invocation.

## Workflow

Follow these steps in order. Do not skip the verification/confirmation checkpoints — always pause
for explicit user confirmation before moving to the next step.

### Step 0 — Identify the component

Ask the user which component to audit if not already specified. Locate its schema files in
`schema/<component>/` (a directory with one file per subcomponent plus a main `<component>.ts`).
If the component is simple and uses a single `schema/<component>.ts` file instead, that's fine —
the skill still works. Create a mental note if no schema exists yet — the "actual schema" is
simply empty/absent in that case.

### Step 1 — Read the canonical known values

Read `schema/primitives.ts` (and `schema/registry.ts` if useful) to derive the **canonical**
baseline lists. Do not ask the user for these — they come from the code:

- **Known variants**: e.g. `primary`, `secondary`, `tertiary`, `quaternary`, `quinary` (from
  `colorVariants` / `colorVariantsShape`), **plus** `defaultVariant` — the distinct baseline slot
  every variant-bearing node has (`primitives.defaultVariant`, sibling of `primitives.variant`).
  `defaultVariant` is its own canonical slot
  variant — always reference it as `defaultVariant` on its own right (e.g.
  `{{primitives.defaultVariant...}}`), never `{{primitives.variant.primary...}}`.
- **Known states**: e.g. `hover`, `active`, `selected`, `focus`, `invalid`, `disabled` (from
  `variantWithStates.state`), **plus** `defaultState` — the distinct baseline slot every
  state-bearing node has, analogous to `defaultVariant` above.
- **Known severities**: e.g. `success`, `info`, `warning`, `danger`, `contrast` (from
  `severityVariants`), **plus** `defaultSeverity` — the distinct baseline slot every
  severity-bearing node has, analogous to `defaultVariant`/`defaultState` above.

Present this list briefly to the user as context before continuing (one short summary, not a
question).

### Step 2 — Build the rough schema (interactive, recursive, one subcomponent at a time)

Start at the top-level component. For the component and then recursively for each child:

1. **Suggest candidate children** by inspecting the codebase first — read the component's existing
   schema files (if any) for nested object keys, and where helpful check the corresponding Angular
   component/template under the relevant library for sub-elements (icons, headers, buttons, panels,
   etc.). Present the suggested candidates to the user and ask them to confirm, remove, or add
   children. When claims about a component's rendered structure matter (e.g. "is X actually an
   interactive input, or a static label?"), verify against primary sources (installed library
   source under `node_modules`, or official docs) before asserting it — don't guess.
2. **Go through subcomponents strictly one at a time, asking one question at a time.** Never bundle
   the dependency/variant/state/severity questions for multiple nodes into a single question, and
   never ask more than one of these four questions in the same turn. For each confirmed child
   (processing children in a stable order — e.g. root first, then each child depth-first before
   moving to the next sibling), ask the user, one question per turn:
   - **Confirmed inclusion** — does this subcomponent belong to the parent component?
   - **Dependency on immediate parent** — exactly one of: `nothing`, `variant`, `state`,
     `severity`. This is a single choice; the hierarchy `variant → state → severity` must stay
     intact and must never skip a level or reference an ancestor beyond the immediate parent
     (e.g. a child cannot depend on a grandparent's severity directly).
   - **Variant layers** — how many layers of variants this child/component needs, and the label set
     for each layer. Each layer's labels may come from the canonical variant list (Step 1,
     including `defaultVariant` as the baseline slot) or be fully custom to this component (e.g.
     layer 1: `default`/`primary`/`secondary`, layer 2: `outlined`/`filled`).
   - **States** — which states apply, chosen only from the canonical list (Step 1, including
     `defaultState` as the baseline slot). Do not invent custom state names.
   - **Severities** — which severities apply, chosen only from the canonical list (Step 1, including
     `defaultSeverity` as the baseline slot). Do not invent custom severity names.
   - **Tokens/fields** — which token properties (padding, background, border, colors, dimensions,
     shadow, …) belong to this subcomponent at its leaf level.
     Always propose a recommended answer and let the user confirm, override, or redirect (e.g. "go
     back to the previous node") — expect and accommodate the user revisiting earlier nodes.
3. Repeat this process for each child's own children until the user confirms there are no more
   children to cover.

**Structural placement rules (apply when writing the rough schema / later implementing it):**

- **Default token path.** Every node's own leaf tokens resolve, at the baseline, through its own
  **default token path** — the chain of its default slots, `defaultVariant` (→ `defaultState` →
  `defaultSeverity`), down to however many of those levels that node actually declares. The default
  slots are the canonical path: they are **always flat siblings of the named slots at their level**,
  never aliased to a named slot. So a baseline leaf sits at
  `…defaultVariant.defaultState.defaultSeverity.<token>` — never `…primary.defaultState.…`, never a
  `state:`/`severity:`/`variant:` wrapper object, and never a path that skips a declared level.
  Named slots (e.g. `hover`, `primary`, `success`) override the default **only at the level(s) where
  they differ**; a level with no differing named override is simply not repeated.
- **No grouping wrapper keys.** Named variants/states/severities are never nested inside an
  intermediate `variant`/`state`/`severity` object key. `defaultVariant` and every named variant
  label are direct sibling keys on the same object (e.g. `{ defaultVariant, primary, secondary,
tertiary, quaternary, quinary }`), never `{ defaultVariant, variant: { primary, secondary, ... }
}`. The same applies to `defaultState`/named states (`{ defaultState, hover, focus, ... }`, never
  `{ defaultState, state: { hover, ... } }`) and `defaultSeverity`/named severities (`{
defaultSeverity, success, info, ... }`, never `{ defaultSeverity, severity: { success, ... } }`).
  This flattening is a property of each _component's own_ schema tree — it does not change the
  internal shape of shared primitive types in `primitives.ts` itself (e.g. `variantWithStates`,
  `colorVariants`, `severityVariantGroup` keep their own internal structure; components consume
  those types by reference, not by copying their wrapper-key shape).
- Every node that declares actual leaf tokens (`background`, `color`, `border`, etc.) and/or nested children
  always terminates and resides under its own `defaultVariant → defaultState → defaultSeverity` nesting (flattened
  per the rule above), with `default*` replaced by the specific named override (e.g. `hover`,
  `success`) only at the level(s) where that override differs from the default.
- **Dependency-level placement.** A child's **dependency level** decides _where_ its own tree is
  inserted into the parent's path — not whether it has its own tree. Every child always gets its own
  full `default*` slot set (at whichever levels it declares) for its own tokens and nested children,
  regardless of dependency level:
  - `nothing` → child is inserted at the parent's root, as a sibling of the parent's own
    `defaultVariant` (e.g. `button.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
  - `variant` → child is inserted right after the parent's variant selection (e.g.
    `button.defaultVariant.badge.defaultVariant.defaultState.defaultSeverity.<token>`, and likewise
    inserted once per named variant slot, e.g. `button.primary.badge…`).
  - `state` → child is inserted after the parent's variant + state (e.g.
    `button.defaultVariant.defaultState.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
  - `severity` → child is inserted after the parent's variant + state + severity (e.g.
    `button.defaultVariant.defaultState.success.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
- The parent itself can still declare its own leaf tokens at any of its intermediate levels (e.g.
  `button.defaultVariant.defaultState.success.background`).

### Step 3 — Present the rough schema for verification

Present the full rough schema as a **markdown outline/tree** (indented bullets: component → child →
grandchild, each annotated with its dependency level, variant layers, states, severities, and the
tokens it declares; use the flattened `defaultVariant`/`defaultState`/`defaultSeverity`-plus-named
siblings convention from Step 2). Ask the user to verify or correct it before proceeding. Do not
proceed to validation until the user confirms this rough schema is correct.

### Step 4 — Validate against the actual schema

Read the actual schema files (`schema/<component>/` directory or `schema/<component>.ts`) and
compare them, node by node, against the confirmed rough schema from Step 3. Produce a structured
gap list covering:

- Missing or extra children compared to the rough schema.
- Missing or extra variant layers/labels (including whether `defaultVariant` exists as its own slot
  rather than being aliased to a named variant).
- Missing or extra states (from the canonical list, including `defaultState`).
- Missing or extra severities (from the canonical list, including `defaultSeverity`).
- Dependency-level mismatches (e.g. actual schema nests a child under `state` when the rough schema
  says it should depend only on `variant`, or inserts a child at the wrong level of the parent's
  path).
- Default-token-path violations — is any node's baseline default missing or aliased to a named slot
  instead of sitting at its own `defaultVariant`/`defaultState`/`defaultSeverity` path (a named
  variant/state/severity standing in for the default), or does a node omit the `default*` slot at a
  level it declares?
- Grouping-wrapper violations — does the actual schema nest named variants/states/severities inside
  a `variant`/`state`/`severity` object key instead of as flat siblings of `defaultVariant`/
  `defaultState`/`defaultSeverity`?
- Structural inconsistencies, e.g. a child reinventing an ad-hoc shape instead of following the
  `defaultVariant/defaultState/defaultSeverity` convention, or not reusing existing primitive types
  (`bgContrast`, `variantWithStates`, `severityVariantGroup`, etc.) where they would fit.
- **Shape/defaults separation** — does each component file export both a pure shape (`*Shape`, all
  keys optional, no defaults) and a defaults tree (`*Defaults`)? Is the main file responsible for
  assembling defaults and applying `applyDefaultsRecursive`? Are shared shapes (e.g. panel button
  used in 4 places) defined once with defaults referenced by all consumers?

If the schema files do not exist yet, the "actual" side is simply empty and the entire rough
schema becomes the gap list (nothing to keep, everything to add).

### Step 5 — Confirm structural changes

Present the gap list to the user and ask them to confirm which changes to apply. Do not assume all
proposed changes should be applied — the user may accept, reject, or modify individual items.

### Step 5a — Determine defaultState defaults (grilling)

Once the structural shape is confirmed, determine **which leaf tokens carry a literal default
value** for `defaultState` / `defaultVariant`. Use the `grilling` skill (interview style: one
question at a time, always propose a recommended answer, wait for confirmation, expect the user to
revisit earlier answers):

1. Confirm that **all variants** (`defaultVariant` plus every named variant) should receive the
   same defaults by default, so any variant can be independently overridden at runtime. This is the
   established pattern — ask whether the user wants this or a different policy.
2. Walk every subcomponent **one at a time**, in the same stable order used in Step 2, and ask
   which of its own token fields should carry defaults (e.g. "full token set", "color-only subset",
   "none") for `defaultState`. Do not skip any subcomponent — including shared/reused schema pieces
   (ask once per shared shape, noting every place it's reused) and static/stateless leaf nodes.
3. For each token that should carry a default, **propose the `{{primitives...}}` reference** and
   ask the user to confirm or correct. **Do not ask the user for primitive values** — derive the
   proposal from code:
   - Read `schema/primitives.ts` to see the available primitive paths (e.g.
     `area.overlay.defaultState.defaultSeverity.bg`, `border.width.md`, `space.sm`).
   - Scan **existing schema files** for similar tokens already in use (e.g. if another component's
     panel background uses `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}`, that's
     the pattern to follow).
   - Propose the matching reference; the user only confirms or corrects.
4. Record the confirmed defaults for each subcomponent's `defaultState`. This produces the initial
   defaults tree that all variants share.

**Do not cover named states (hover, selected, focus, ...) in this step.** That is the job of
Step 5b below.

### Step 5b — Determine differentiated named-state defaults

After the `defaultState` defaults are confirmed, determine which named states need **different**
defaults from `defaultState`. Named states typically inherit most tokens from `defaultState` and
only differ in a few (e.g. `hover` changes `background` but keeps `padding`/`font`/`border.radius`).

Walk every subcomponent **one at a time**, in the same stable order used in Step 2. For each
subcomponent, go through its named states **one at a time**:

1. For the current named state (e.g. `hover`), ask which tokens should differ from `defaultState`.
   Show the user the `defaultState` defaults you just established so they can see what the baseline
   is. Propose a recommended answer based on common patterns:
   - **hover**: typically differs in `background` and `color` (uses overlay/primitive hover state
     tokens), keeps `border.radius`, `padding`, `font` the same as defaultState. `border.color`
     may also differ.
   - **focus**: typically differs in `border.color` or `border.width` (focus indicator), often
     keeps `background` and `color` the same.
   - **selected**: typically differs in `background` and `color` (uses selected state tokens),
     may also differ in `border.color`.
   - **active**: typically differs in `background` (pressed look).
   - **disabled**: typically differs in `color` and `background` (muted/opacity), may differ in
     `border.color`.
   - **invalid**: typically differs in `border.color` (error tone) and `color` (error text).
2. For each token that differs, **propose the `{{primitives...}}` reference** by swapping the
   state segment of the `defaultState` token. For example, if the `defaultState` background is
   `{{primitives.area.overlay.defaultState.defaultSeverity.bg}}`, the hover background should be
   `{{primitives.area.overlay.state.hover.defaultSeverity.bg}}`. **Do not ask the user to invent
   the reference** — derive it from the `defaultState` token and the canonical state name
   (Step 1). Cross-check against existing schema files for the same pattern. The user's job is
   only to confirm or correct.
3. Tokens that **do not differ** from `defaultState` are simply **omitted** from the named-state
   defaults — they stay optional and resolve via `prefault({})` to `{}`, letting the runtime
   resolver fill them from `defaultState`.
4. Repeat for each named state, then for each subcomponent, until all states are covered.
5. Record the final differentiated defaults as an explicit per-node, per-state table
   (node → state → tokens that differ → proposed `{{primitives...}}` reference). Present this
   table to the user for final confirmation before moving to Step 6.

When implementing these differentiated defaults in Step 6, the per-component defaults export
includes them alongside `defaultState`:

```typescript
export const panelButtonDefaults = {
  defaultVariant: {
    defaultState: {
      // Full token set — the baseline (default) path for every token the button renders
      width: '2.5rem',
      height: '2.5rem',
      focusRing: { color: '...', style: '...', width: '...', ... },
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      border: {
        /* ... */
      },
    },
    // Named states: only tokens that differ from defaultState
    hover: {
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    },
    selected: {
      background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
    },
    // disabled, focus, active — omitted if nothing differs from defaultState
  },
  // all named variants share the same defaults
  primary: { /* ...same as defaultVariant... */ },
  secondary: { /* ...same as defaultVariant... */ },
}
```

### Step 6 — Implement confirmed changes

Implement the schema following the **shape/defaults separation pattern**. For multi-file components
(use a `schema/<component>/` directory):

#### File structure

Each subcomponent gets its own file with **two exports**:

```typescript
// schema/<component>/panelbutton.ts
import * as z from 'zod'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'

// 1. Pure shape — all keys optional, no defaults
//    Tokens live in the state shape (and nested children at that level).
//    Named states are flat siblings of defaultState — no severity/state wrapper.
const panelButtonStateShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),
  color: z.union([color, withRef(z.string())]).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
})

const panelButtonVariantShape = z.object({
  defaultState: panelButtonStateShape.prefault({}),
  hover: panelButtonStateShape.prefault({}),
  focus: panelButtonStateShape.prefault({}),
  selected: panelButtonStateShape.prefault({}),
  active: panelButtonStateShape.prefault({}),
  disabled: panelButtonStateShape.prefault({}),
  // ... more states if needed
})

export const panelButtonShape = z.object({
  defaultVariant: panelButtonVariantShape.prefault({}),
  primary: panelButtonVariantShape.prefault({}),
  secondary: panelButtonVariantShape.prefault({}),
  // ... all named variants get the same shape
})

// 2. Defaults tree — mirrors the shape, only keys that should have defaults.
//    defaultState carries the full baseline token set (the default token path);
//    named states carry only the tokens that differ from defaultState.
export const panelButtonDefaults = {
  defaultVariant: {
    defaultState: {
      width: '2.5rem',
      height: '2.5rem',
      focusRing: { color: '...', style: '...', width: '...', ... },
      // Full token set — every token the button renders (default token path)
      color: '{{primitives...}}',
      background: '{{primitives...}}',
      border: { color: '...', style: '...', width: '...', radius: '...' },
    },
    hover: {
      // Only tokens that differ from defaultState (determined in Step 5b)
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    },
    selected: {
      background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
    },
    // disabled/focus/active omitted — nothing differs from defaultState
  },
  // all named variants share the same defaults
  primary: { /* ...same as defaultVariant... */ },
  secondary: { /* ...same as defaultVariant... */ },
}
```

Composite subcomponents reference child shapes and defaults by import:

```typescript
// schema/<component>/panel.ts
import { datePanelShape, datePanelDefaults } from './datepanel'
// ... more imports

// 1. Pure shape — own tokens + nested children live in the state shape
const panelStateShape = z.object({
  // ... own tokens ...
  datePanel: datePanelShape.prefault({}),
  // ...
})

export const panelShape = z.object({
  defaultState: panelStateShape.prefault({}),
  hover: panelStateShape.prefault({}),
  focus: panelStateShape.prefault({}),
})

// 2. Defaults composition — defaults mirror the shape, at the default slots
export const panelDefaults = {
  defaultState: {
    // ... own tokens ...
    datePanel: datePanelDefaults,
    // ...
  },
}
```

The **main file** assembles shapes, composes defaults, and applies `applyDefaultsRecursive`:

```typescript
// schema/<component>/<component>.ts
import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'

import { inputShape, inputDefaults } from './input'
import { panelShape, panelDefaults } from './panel'
// ...

// Shape assembly — children are placed per their dependency level (Step 2):
//   dep `nothing`  → sibling of the variant slots (at the component root)
//   dep `variant`  → inside each variant's content
// (input and panel below are dep-`variant`; a dep-`nothing` child would sit
//  alongside defaultVariant/primary/... instead of inside them)
const variantContentShape = z.object({
  input: inputShape.prefault({}),
  panel: panelShape.prefault({}),
})

const componentShape = z.object({
  // dep-`nothing` children (if any) go here, as siblings of the variants
  defaultVariant: variantContentShape.prefault({}),
  primary: variantContentShape.prefault({}),
  secondary: variantContentShape.prefault({}),
  tertiary: variantContentShape.prefault({}),
  quaternary: variantContentShape.prefault({}),
  quinary: variantContentShape.prefault({}),

  transitionDuration: withRef(z.number()).optional(),
})

// Defaults — shared across all variants so any can be overridden independently
const variantContentDefaults = {
  input: inputDefaults,
  panel: panelDefaults,
}

const componentDefaults = {
  transitionDuration: '{{primitives.transition.duration}}',
  defaultVariant: variantContentDefaults,
  primary: variantContentDefaults,
  secondary: variantContentDefaults,
  tertiary: variantContentDefaults,
  quaternary: variantContentDefaults,
  quinary: variantContentDefaults,
}

// Apply defaults to shape — only keys present in defaults get .default()
export const component = applyDefaultsRecursive(componentShape, componentDefaults).register(themeSchemaRegistry, {
  id: '<component>',
})

// Backward-compatible facade if a class existed before
export class ComponentSchema {
  static readonly schema = component
}
```

#### Shared shapes

When the same shape is used in multiple places (e.g. panel button used for nav buttons, time
picker buttons, and footer buttons), define it **once** in its own file. All consumers import
both the shape and the defaults — the defaults are shared by reference:

```typescript
// panelheader.ts
import { panelButtonShape, panelButtonDefaults } from './panelbutton'
// navButton: panelButtonShape.prefault({})
// navButton defaults: panelButtonDefaults (by reference)

// timepicker.ts
import { panelButtonShape, panelButtonDefaults } from './panelbutton'
// timePickerButton: panelButtonShape.prefault({})
// timePickerButton defaults: panelButtonDefaults (by reference)
```

This eliminates repetition — the same defaults don't appear 4 times in the main file.

#### Single-file components

For simple components that don't need a directory, follow the same pattern in a single file:

```typescript
// schema/<simple-component>.ts
export const simpleComponentShape = z.object({ ... })
export const simpleComponentDefaults = { ... }

export const simpleComponent = applyDefaultsRecursive(
  simpleComponentShape,
  simpleComponentDefaults,
).register(themeSchemaRegistry, { id: 'simple-component' })
```

#### Implementation rules

- **Shape files**: pure `z.object()` with all keys `.optional()`. Use `.prefault({})` for nested
  object fields so empty input resolves to `{}` instead of `undefined`. Never use `.default()` in
  a shape file.
- **Defaults files**: plain objects that mirror the shape tree. Include defaults from Step 5a
  (`defaultState` — full token set) and Step 5b (named states — only tokens that differ from
  `defaultState`). Absent keys stay optional and are filled by the runtime fallback mechanism.
- **Main file**: imports shapes and defaults from subcomponent files, assembles the top-level
  shape and defaults tree, calls `applyDefaultsRecursive(shape, defaults).register(...)`.
- **All variants get defaults**: every named variant (`primary`, `secondary`, ...) shares the same
  defaults object so any variant can be overridden independently at runtime.
- **Default token path**: every node's baseline defaults sit at its own `defaultVariant` (and
  `defaultState` / `defaultSeverity` where it declares those levels) — the default slots are always
  present as flat siblings of the named slots and are the canonical path. A named variant/state/
  severity never stands in for the default; it only carries the override at the level(s) where it
  differs.
- **Reuse primitive types** from `primitives.ts` (`bg`, `color`, `border`, `borderWithShadow`,
  `font`, `withRef`, etc.) rather than inventing new ad-hoc shapes.
- **No class-based schema factories** — use plain module-level exports. If a class facade existed
  before (e.g. `CalendarSchema`), keep it only as a thin wrapper with a `static schema` property
  for backward compatibility.

Additional implementation notes:

- Apply the flattened `defaultVariant`/`defaultState`/`defaultSeverity`-plus-named-siblings
  structure from Step 2 — no `variant`/`state`/`severity` wrapper keys in the component's own
  schema (this does not apply to `primitives.ts` itself, which is out of scope for this skill).
- Where the default-value policy from Step 5a restricts defaults to a subset of the tree, every
  field that does **not** get a default must still be present in the schema shape — marked
  `.optional()` (or the object-level equivalent) rather than omitted, so the schema still parses
  successfully on empty/partial input at every nesting level.
- Fields/subtrees that carry no defaults per policy are simply absent from the defaults tree —
  `applyDefaultsRecursive` leaves them as `.optional()` automatically.
- This skill is **structure-only** with respect to reference-path semantics — you do not need to
  invent or validate the _specific_ `{{primitives...}}` path a token resolves to beyond ensuring
  it correctly targets `defaultVariant`/`defaultState`/`defaultSeverity` (never aliased to a named
  slot) versus the appropriate named override. If a genuinely new leaf token is introduced with no
  reasonable analogous reference to mirror, leave a `// TODO: define leaf token value` placeholder
  and note it explicitly in the report.
- **Do not add, remove, or modify any test/spec files** (e.g. `schema/<component>.spec.ts`) as
  part of this step. Test creation/replacement is handled in Step 8, right after the structural
  implementation is confirmed — leave existing tests as-is for now even if they now fail against
  the restructured schema.
- Do not run the component's test suite as a validation step for this step (tests are intentionally
  left unchanged for now and may fail — they get replaced in Step 8). You may still run
  linting/type-checking to confirm the schema code itself is valid.

### Step 7 — Save the audit report

Write the full audit (rough schema tree, gap list, default-value policy tables from Steps 5a and
5b, and summary of changes applied) as a markdown file at `docs/theme-schema-audits/<component>.md` (create
the `docs/theme-schema-audits/` folder if it does not exist). Overwrite any previous audit file for
the same component. Explicitly note in the report that test/spec files were intentionally left
unchanged during Step 6 and that test coverage is added next, in Step 8.

### Step 8 — Test the resolved default values

Once Step 6's structural changes are implemented and confirmed, add automated tests that lock in
the **exact key/value pairs** produced by `parse({})` for every node — replacing, not patching, any
pre-existing spec files for this component. Legacy spec files are disregarded as a source of truth
here: they are frequently stale the moment a schema is restructured (old class-based or pre-
`applyDefaultsRecursive` specs no longer compile against the current shape/defaults files) and are
not evolved incrementally — they are superseded by the tests this step creates.

#### Strategy: snapshot the values, hand-assert the invariants

The spec has two jobs: lock in the **exact resolved key/value tree** (so a future value regression or
a wrong restructure shows up as a failing test/diff), and assert the **structural invariants** this
audit actually confirmed. Those two jobs are best served by different techniques:

**The value tree → snapshots.** A hand-written literal object per node (the older
`expectExactTokens` pattern) duplicates every value that already lives in the component's own
`*Defaults` export. That duplication is the root cause of specs going stale — every time a default
changes, two places have to change in lockstep, nothing enforces that, and the second copy silently
drifts. Jest snapshot testing (`toMatchSnapshot()`) of the `parse({})` result instead:

- captures every exact key/value pair automatically — nothing is hand-duplicated, so there is
  nothing to go stale.
- the snapshot diff shown in review **is** the "exact key/value" diff — a changed primitive
  reference, an added/removed token, or a restructured path all show up as an explicit, readable
  diff. For a structure-only restructure (this skill's kind) the diff shows *only* the key moves
  with value tokens unchanged — the "values unchanged" proof, for free.
- CI (`--ci`) refuses to silently write new/changed snapshots, so a reviewer must consciously accept
  the diff — the same regression protection hand-written expectations were after, without the
  duplication cost.
- scales to deeply nested, multi-file components (like `calendar`, with 18 subcomponent files)
  without exploding a single spec file's line count the way a hand-transcribed-literal spec would.

**The structural invariants → explicit assertions.** A snapshot *encodes* the invariants (a wrong
nesting → a big diff) but does not *assert* them — the diff is an opaque blob, not "`focusRing` is a
flat sibling of `defaultVariant`, not wrapped". For the handful of invariants this audit confirmed,
write small explicit assertions so they are greppable and self-documenting:

- **Parses successfully** — `expect(result.success).toBe(true)` for `parse({})`. Snapshots alone
  don't fail loudly if parsing starts throwing/rejecting.
- **Shape/defaults parity** — catches _wiring_ bugs (typos, renames, a default pointing at a key the
  shape no longer has), which is a different failure mode than a _value_ regression. Add a small,
  reusable helper to `schema/test-utils.ts`:

  ```typescript
  export function expectDefaultsMatchShape(shape: z.ZodObject<any>, defaults: Record<string, unknown>) {
    for (const key of Object.keys(defaults)) {
      expect(Object.keys(shape.shape)).toContain(key)
      const fieldSchema = shape.shape[key]
      const value = defaults[key]
      if (fieldSchema instanceof z.ZodObject && value && typeof value === 'object' && !Array.isArray(value)) {
        expectDefaultsMatchShape(fieldSchema, value as Record<string, unknown>)
      }
    }
  }
  ```

> `applyDefaultsRecursive` itself (`schema/defaults-helper.ts`) is shared, component-agnostic
> infrastructure, not per-component data — testing it is out of scope for this per-component audit
> skill. If it lacks its own unit tests, raise that as a separate one-time task rather than folding
> it into a component audit run.

- **The confirmed invariants from Steps 4–5b, asserted explicitly.** These are the shape claims the
  audit produced; encode each as a small, readable assertion (on the parsed `defaultVariant` subtree
  or on the `*Shape`) rather than relying on the snapshot diff alone:
  - the **default token path**: a state-bearing node's baseline leaf resolves through
    `defaultVariant.defaultState.defaultSeverity.<token>` — assert the leaf is reachable at exactly
    that path (this is the invariant the whole restructure exists to guarantee);
  - **static tokens stay at the node root** as flat siblings of `defaultVariant` (e.g.
    `focusRing`, `sm`/`lg`, `width`/`height`) — not inside the state blocks;
  - **state-dependent children sit inside the state blocks** (their own `defaultVariant` subtree),
    not at the node root;
  - **no grouping-wrapper keys** — `defaultVariant`/`defaultState`/`defaultSeverity` are flat
    siblings of their named slots, never wrapped in a `variant`/`state`/`severity` object and never
    aliased to a named slot;
  - the **variant-coverage policy** from Step 5a (e.g. only `defaultVariant` carries baked defaults;
    named variants carry none unless the policy says otherwise) — assert a themed named variant
    parses alongside the baked `defaultVariant`, or that a named variant resolves to no baked token
    values;
  - **shared-shape reference identity** — for a shape reused in several places, assert each consumer
    references the same `*Shape`/`*Defaults` export (identity equality), so the shared token is
    defined exactly once.

Keep this invariant set **small and pointed** — one assertion per invariant, at the node it applies
to — and let the snapshot carry the rest of the value tree. If an invariant is already fully
determined by a snapshot you rely on, still prefer the explicit assertion for the few load-bearing
ones (the default token path and static-at-root in particular), because they are the things the
audit was actually about.

#### Where to put the tests

Use **exactly one spec file per component**, no matter how many subcomponent schema files that
component is split across: `schema/<component>/<component>.spec.ts` for multi-file components (or
`schema/<component>.spec.ts` for single-file components). Do not colocate a separate `.spec.ts`
next to every subcomponent file — organize the tests with one `describe` block per subcomponent
inside that single file instead (root first, then each child in the same stable order used in
Step 2). This keeps review, the generated snapshot file, and the component's whole test surface in
one place, and matches the "one component per run" scope of this skill.

- The root `describe` block is a thin integration check: a "parses an empty object" smoke test, one
  snapshot of `parse({})` for the fully assembled tree, and the **component-level** invariants
  (the default token path through the root, the variant-coverage policy).
- Each subcomponent gets its own nested `describe` block in the same file, testing that
  subcomponent's own shape/defaults in isolation via
  `applyDefaultsRecursive(<subcomponent>Shape, <subcomponent>Defaults).parse({})`, with its own
  "parses an empty object" check, an `expectDefaultsMatchShape` check, its own snapshot, and the
  **node-level** invariants that apply to it (static tokens at its root, children inside its state
  blocks, no wrapper keys).
- For **shared shapes** reused in multiple places (e.g. a shared panel-button shape used for nav,
  time-picker, and footer buttons), give the shared shape its own `describe` block that owns the
  canonical snapshot. Every consumer's `describe` block only asserts it references that shared
  `*Shape`/`*Defaults` export (e.g. reference/identity equality) — it does **not** re-snapshot the
  same nested tree again.
- If a legacy facade spec exists at `schema/<component>.spec.ts` (top-level, alongside a
  `schema/<component>/` directory), delete it rather than keeping a second file — the single spec
  inside the directory already covers the facade export, since the facade module just re-exports
  the same schema object.

The result is exactly one `.spec.ts` file (and one generated `__snapshots__/*.snap` file) per
component, regardless of how many subcomponent schema files it's implemented across.

#### Example: calendar schema

Applying this to `schema/calendar/`, the entire component's tests live in a single
`schema/calendar/calendar.spec.ts`, with one `describe` per subcomponent:

```typescript
// schema/calendar/calendar.spec.ts
import { applyDefaultsRecursive } from '../defaults-helper'
import { expectDefaultsMatchShape } from '../test-utils'
import { calendar, calendarDefaults } from './calendar'
import { calendarInputShape, calendarInputDefaults } from './input'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'
import { calendarPanelHeaderDefaults } from './panelheader'
import { calendarPickerCellShape, calendarPickerCellDefaults } from './pickercell'
// ... one import per remaining subcomponent file

describe('calendar schema', () => {
  it('parses an empty object', () => {
    expect(calendar.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(calendar.parse({})).toMatchSnapshot()
  })

  it('resolves a baseline leaf through the default token path', () => {
    const parsed = calendar.parse({})
    expect(
      parsed.defaultVariant.input.defaultVariant.defaultState.defaultSeverity.padding
    ).toStrictEqual('{{primitives.space.md}}')
  })

  it('keeps static tokens at the node root, siblings of defaultVariant', () => {
    const parsed = calendar.parse({})
    expect(parsed.defaultVariant.input.focusRing).toBeDefined()
    expect(parsed.defaultVariant.input.defaultVariant.defaultState.defaultSeverity.focusRing).toBeUndefined()
  })

  it('carries baked defaults on defaultVariant only (variant-coverage policy)', () => {
    const parsed = calendar.parse({})
    for (const variant of ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary']) {
      expect(parsed[variant]).not.toStrictEqual(calendarDefaults.defaultVariant)
    }
  })

  describe('input', () => {
    const schema = applyDefaultsRecursive(calendarInputShape, calendarInputDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })
    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarInputShape, calendarInputDefaults)
    })
    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  describe('panel button (shared: calendarIconButton, navButton, timePickerButton)', () => {
    const schema = applyDefaultsRecursive(calendarPanelButtonShape, calendarPanelButtonDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })
    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarPanelButtonShape, calendarPanelButtonDefaults)
    })
    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  describe('panel header (consumer of the shared panel button)', () => {
    it('reuses the shared navButton defaults by reference', () => {
      expect(
        calendarPanelHeaderDefaults.defaultVariant.defaultState.defaultSeverity.navButton
      ).toBe(calendarPanelButtonDefaults)
    })
    // ... one describe block per remaining subcomponent (inputicon, navigationselector,
    // pickercell, view for each of dateCell/monthCell/yearCell, weekdaylabel,
    // today, datepanel, multimonthdivider, timeseperator, timepicker, footerbutton for
    // todayButton/clearButton, footerbuttonbar, panel, settings) — consumers of shared
    // shapes (pickercell, panelbutton) assert reference equality instead of re-snapshotting.
  })
})
```

- If a top-level `schema/calendar.spec.ts` (sibling of the `schema/calendar/` directory) also exists,
  delete it — the single spec inside the directory covers the facade, since `schema/calendar.ts`
  just re-exports `calendar` from `./calendar/calendar`.

#### Running the tests

Generate the initial snapshots by running the library's test task (`nx test
integration-interface`), review the generated `__snapshots__/*.snap` diff like any other code
change, and commit it alongside the schema change. Never hand-edit `.snap` files — always
regenerate them from the code so the snapshot reflects what the schema actually resolves to.

#### Reflect testing outcomes in the audit report

Update `docs/theme-schema-audits/<component>.md` (from Step 7) with a short "Testing" section
noting which spec files were added/replaced, which legacy spec files were removed, and confirmation
that `nx test integration-interface` passes with the new/updated snapshots committed.
