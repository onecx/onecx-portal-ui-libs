---
name: theme-schema-audit
description: Interactively audits the structural shape (variants/states/severities/children) of a single component's theme schema against a user-defined expectation, then applies confirmed structural fixes.
version: 3.0.0
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
   - **Dependency on immediate parent** — exactly one of: `nothing`, `variant`, `state`, `severity`.
     This is a single choice; the hierarchy `variant → state → severity` must stay intact and must
     never skip a level or reference an ancestor beyond the immediate parent (e.g. a child cannot
     depend on a grandparent's severity directly).
   - **Variant layers** — how many layers of variants this child/component needs, and the label set
     for each layer. Each layer's labels may come from the canonical variant list (Step 1,
     including `defaultVariant` as the baseline slot) or be fully custom to this component (e.g.
     layer 1: `default`/`primary`/`secondary`, layer 2: `outlined`/`filled`).
   - **States** — which states apply, chosen only from the canonical list (Step 1, including
     `defaultState` as the baseline slot). Do not invent custom state names.
   - **Severities** — which severities apply, chosen only from the canonical list (Step 1,
     including `defaultSeverity` as the baseline slot). Do not invent custom severity names.
     Always propose a recommended answer and let the user confirm, override, or redirect (e.g. "go
     back to the previous node") — expect and accommodate the user revisiting earlier nodes.
3. Repeat this process for each child's own children until the user confirms there are no more
   children to cover.

**Structural placement rules (apply when writing the rough schema / later implementing it):**

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
- Every node that declares actual leaf tokens (`background`, `color`, `border`, etc.) always
  terminates through its own `defaultVariant → defaultState → defaultSeverity` nesting (flattened
  per the rule above), with `default*` replaced by the specific named override (e.g. `hover`,
  `success`) only at the level(s) where that override differs from the default.
- A child's **dependency level** decides _where_ its own tree is inserted into the parent's path,
  not whether it has its own tree — every child always gets its own full
  `defaultVariant.defaultState.defaultSeverity` structure for its own tokens regardless of
  dependency level:
  - `nothing` → child is inserted at the parent's root, as a sibling of the parent's own
    `defaultVariant` (e.g. `button.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
  - `variant` → child is inserted right after the parent's variant selection (e.g.
    `button.defaultVariant.badge.defaultVariant.defaultState.defaultSeverity.<token>`, and likewise inserted once
    per named variant slot, e.g. `button.primary.badge...`).
  - `state` → child is inserted after the parent's variant + state (e.g.
    `button.defaultVariant.defaultState.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
  - `severity` → child is inserted after the parent's variant + state + severity (e.g.
    `button.defaultVariant.defaultState.success.badge.defaultVariant.defaultState.defaultSeverity.<token>`).
- The parent itself can still declare its own leaf tokens at any of its intermediate levels (e.g.
  `button.defaultVariant.defaultState.success.background`).

### Step 3 — Present the rough schema for verification

Present the full rough schema as a **markdown outline/tree** (indented bullets: component → child
→ grandchild, each annotated with its dependency level, variant layers, states, and severities,
using the flattened `defaultVariant`/`defaultState`/`defaultSeverity`-plus-named-siblings
convention from Step 2). Ask the user to verify or correct it before proceeding. Do not proceed to
validation until the user confirms this rough schema is correct.

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
  says it should depend only on `variant`).
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
  width: '2.5rem',
  height: '2.5rem',
  defaultState: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
    border: {
      /* ... */
    },
  },
  hover: {
    // Only tokens that differ from defaultState
    background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
  },
  selected: {
    background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
    color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
  },
  // disabled, focus, active — omitted if nothing differs from defaultState
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
const panelButtonStateShape = z.object({
  color: z.union([color, withRef(z.string())]).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  border: border.optional(),
})

export const panelButtonShape = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),
  defaultState: panelButtonStateShape.prefault({}),
  hover: panelButtonStateShape.prefault({}),
  // ... more states
})

// 2. Defaults tree — mirrors the shape, only keys that should have defaults
//    defaultState gets the full token set (Step 5a);
//    named states only include tokens that differ from defaultState (Step 5b)
export const panelButtonDefaults = {
  width: '2.5rem',
  height: '2.5rem',
  focusRing: { color: '...', style: '...', width: '...', ... },
  defaultState: {
    // Full token set — every token the button renders
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
}
```

Composite subcomponents reference child shapes and defaults by import:

```typescript
// schema/<component>/panel.ts
import { datePanelShape, datePanelDefaults } from './datepanel'
// ... more imports

const panelStateShape = z.object({
  // ... own tokens ...
  datePanel: datePanelShape.prefault({}),
  // ...
})

export const panelShape = z.object({
  defaultState: panelStateShape.prefault({}),
  hover: panelStateShape.prefault({}),
})

// Defaults compose child defaults
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

// Shape assembly
const variantContentShape = z.object({
  input: inputShape.prefault({}),
  panel: panelShape.prefault({}),
})

const componentShape = z.object({
  defaultVariant: variantContentShape.prefault({}),
  primary: variantContentShape.prefault({}),
  secondary: variantContentShape.prefault({}),
  // ... all named variants get the same shape
})

// Defaults — shared across all variants so any can be overridden independently
const variantContentDefaults = {
  input: inputDefaults,
  panel: panelDefaults,
}

const componentDefaults = {
  defaultVariant: variantContentDefaults,
  primary: variantContentDefaults,
  secondary: variantContentDefaults,
  // ... all named variants share the same defaults
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
  part of this step. Test updates are handled in a separate follow-up task, out of scope for this
  skill run. Leave existing tests as-is even if they now fail against the restructured schema —
  note this explicitly in the Step 7 report so the follow-up task has full context.
- Do not run the component's test suite as a validation step for this skill (since tests are
  intentionally left unchanged and may fail). You may still run linting/type-checking to confirm
  the schema code itself is valid.

### Step 7 — Save the audit report

Write the full audit (rough schema tree, gap list, default-value policy tables from Steps 5a and
5b, and summary of changes applied) as a markdown file at `docs/theme-schema-audits/<component>.md` (create
the `docs/theme-schema-audits/` folder if it does not exist). Overwrite any previous audit file for
the same component. Explicitly note in the report that test/spec files were intentionally left
unchanged and are deferred to a follow-up task.
