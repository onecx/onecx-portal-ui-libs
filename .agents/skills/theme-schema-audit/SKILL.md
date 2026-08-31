---
name: theme-schema-audit
description: Interactively audits and (re)builds the theme "usage" schema for a single component — its children, the dependency relationship between parent and child, which children reuse an existing generic usage versus defining their own tokens, and which tokens carry a literal default — then applies confirmed structural changes.
version: 3.4.0
---

# Theme Schema Audit — Theming Usages

You are a **driver** that walks the developer through building or auditing the theme schema for
one component ("usage") in
`libs/integration-interface/src/lib/topics/current-themes/v1/schema/`. Audit exactly **one
top-level component per run**. Do not batch multiple components in a single invocation.

The driver goes through four points, in order, for the component:

1. **Establish the component's children** — what does the component visually consist of?
2. **Establish the parent ↔ child relationship** — how does each child depend on its parent's
   variant/state/severity?
3. **Consolidate tokens** — does a child reuse an existing generic usage, or does it define its
   own minimal token set?
4. **Fill out default values** — which tokens get a literal default, and which are left to the
   fallback mechanism?

Steps 1–3 produce a **structure** (children, dependencies, reuse decisions). Step 4 produces the
**default-value tree** for that structure. Only once both are confirmed does implementation happen.
This skill does not validate the semantic correctness of individual `{{primitives...}}` reference
paths (i.e. which specific primitive a leaf value points to) — that is out of scope. It **does**
decide, as part of structure, _which_ leaf tokens are allowed to carry a literal default at all
(Step 7), and follows the general Zod authoring conventions from the `add-theme-usage` skill when
implementing (Step 8).

## Prerequisites — read the canonical known values

Before starting Step 1, read `schema/primitives.ts` (and `schema/registry.ts` if useful) to derive
the **canonical** baseline lists. Do not ask the user for these — they come from the code:

- **Known variants**: e.g. `primary`, `secondary`, `tertiary`, `quaternary`, `quinary` (from
  `colorVariants` / `colorVariantsShape`), **plus** `defaultVariant` — the distinct baseline slot
  every variant-bearing node has (`primitives.defaultVariant`, sibling of `primitives.variant`).
  `defaultVariant` is its own canonical slot variant — always reference it as `defaultVariant` on
  its own right (e.g. `{{primitives.defaultVariant...}}`), never `{{primitives.variant.primary...}}`.
- **Known states**: e.g. `hover`, `active`, `selected`, `focus`, `invalid`, `disabled` (from
  `variantWithStates.state`), **plus** `defaultState` — the distinct baseline slot every
  state-bearing node has, analogous to `defaultVariant` above.
- **Known severities**: e.g. `success`, `info`, `warning`, `danger`, `contrast` (from
  `severityVariants`), **plus** `defaultSeverity` — the distinct baseline slot every
  severity-bearing node has, analogous to `defaultVariant`/`defaultState` above.

Present this list briefly to the user as context before continuing (one short summary, not a
question).

## Step 0 — Identify the component

Ask the user which component to audit if not already specified. Locate its schema files in
`schema/<component>/` (a directory with one file per subcomponent plus a main `<component>.ts`), or
a single `schema/<component>.ts` for simple components. If no schema exists yet, that's fine — the
"actual schema" side is simply empty/absent, and the whole audit becomes a from-scratch build.

### Step 1 — Establish the component's children

Define the parent ↔ child structure for the whole schema, starting from the top-level component.
Establish each relationship by thinking about the **display responsibility** of each piece — does
this sub-element render its own distinguishable visual box (background, border, padding, ...) that
a designer would reasonably want to theme independently?

Work top-down, one parent at a time, in a stable order (root first, then each child depth-first
before moving to the next sibling):

1. **Suggest candidate children** by inspecting the codebase first — read the component's existing
   schema files (if any), and check the corresponding library (PrimeNG/other) source, rendered DOM,
   or official docs for sub-elements (icons, headers, buttons, panels, etc.). When a claim about a
   component's rendered structure matters (e.g. "is X an interactive input or a static label?"),
   verify against a primary source (installed library source under `node_modules`, or official
   docs) rather than guessing.
2. **Examine different use-cases/modes of the component** to find children that only exist in
   certain configurations. For example, a calendar with a time-picker variant introduces additional
   children (time separator, hour/minute pickers) that don't exist in the plain date-picker mode.
3. Present the suggested children to the user and ask them to confirm, remove, or add children —
   one parent's children at a time, not the whole tree at once.
4. Repeat recursively for each confirmed child's own children until the user confirms there are no
   more.

#### Example: Calendar

```
Calendar
├── Input
└── Panel
    ├── Header
    └── ...
```

#### Guidelines

- Look up the primeng/material/(...) component and validate the tree of components (visually, in
  the DOM, in source code).
- Examine different use-cases of the component to find all children — a variant/mode can introduce
  children that don't otherwise exist (e.g. calendar's time mode).

This step's output is just the **names and nesting** of children — no dependency, token, or default
decisions yet.

### Step 2 — Establish the parent ↔ child relationship

For each confirmed child (same stable order as Step 1: root first, then depth-first per subtree),
establish the **dependency** between it and its immediate parent — this controls whether/how the
child's tokens can be styled differently based on the state of the parent. Ask **one child at a
time**, one question at a time. The dependency is exactly one of:

- `nothing` — the child's own tokens never change based on the parent's variant/state/severity.
- `variant` — the child can be styled differently per parent variant.
- `state` — the child can be styled differently per parent variant **and** state.
- `severity` — the child can be styled differently per parent variant, state, **and** severity.

The hierarchy `variant → state → severity` must stay intact: a dependency level always builds on
the previous one, and a child can never depend on a grandparent's variant/state/severity directly
(only its immediate parent).

#### Example: Calendar

##### Calendar (top-level)

It is an aggregator and has no styles of its own (no variant, state, severity) — it only contains
`Input` and `Panel`, which are the actual visual components.

##### Input

Has no children (in this example, at least).

##### Panel

- Variants: default, example
- States: default, hover, ...
- Severity: none
- Children: `Header`

Q: To which layer should `Header` be dependent?

- **A: `variant`** — header can be "styled" only per panel variant; the panel's state doesn't
  matter for it.
- **B: `state`** — header can be styled per panel variant **and** state.

With option A, the resulting object is smaller but allows fewer combinations. Option B allows
styling the header differently while the panel is hovered. **Option B is the better choice here.**

#### Guidelines

- Think about the likelihood of a variant/state/severity dependency being introduced for this
  component in the future.
- If unsure, choose the more specific option (from more to less specific: severity, state,
  variant) — it's cheaper to leave a level unused than to restructure later.
- Think about the likelihood of the use case, even if unusual: "style this button differently when
  a panel in variant X is focused" sounds unlikely, but is possible and might be a reasonable ask
  from a designer — so a `state` dependency can still be the right call.

#### Structural placement (for implementation later)

The dependency level decides **where** the child's own tree is inserted into the parent's path —
every child always gets its own full baseline (+ any named overrides it needs) for its own tokens
and further nested children, regardless of dependency level:

- `nothing` → child sits at the parent's root, independent of the parent's variant/state/severity.
- `variant` → child is inserted once per parent variant (default + each named variant).
- `state` → child is inserted once per parent variant × state combination.
- `severity` → child is inserted once per parent variant × state × severity combination.

### Step 3 — Consolidate tokens

For each child confirmed in Step 1, decide whether it is **generic** or **specific**:

- **Generic** — the child corresponds to another component that already has (or should have) its
  own top-level usage schema (e.g. an `input`, a `button`, a `dropdown`).
- **Specific** — the child is unique to this parent and has no standalone usage of its own.

For every **generic** child, make an explicit choice between two options:

#### Option 1 — Extend the generic usage

The child reuses the generic usage's full token set and may add its own extra tokens on top. This
produces more tokens overall (the full generic set, duplicated under the parent), but lets every
token be overridden specifically for this parent/child combination.

**Example: `Input` inside `Calendar`.** The calendar's input is specific enough to warrant its own
full token set:

```
calendar
└── input (extends usages.input)
    ├── ...all usages.input tokens
    └── token.specific.for.calendar.input
```

Styling the input inside the calendar uses `usages.calendar.input.*` exclusively —
`usages.input.*` is not consulted at all for it.

#### Option 2 — Independent minimal token set

The child does **not** reuse the generic usage. It only defines the small set of tokens that are
actually necessary for its role inside this parent.

**Example: a dropdown used by a table's paginator.**

```
table
└── paginator
    └── dropdown (does NOT extend usages.dropdown)
        └── token.specific.for.table.paginator.dropdown (e.g. a different width)
```

Styling this dropdown uses mostly the tokens from `usages.dropdown` at the CSS/mapping layer, with
only the paginator-specific tokens (like width) coming from
`usages.table.paginator.dropdown`.

#### Trade-off

Both options are a genuine trade-off, not a "right vs. wrong" choice:

- **Option 1** gives more theming flexibility (every token independently overridable for this
  parent/child pair) but costs more — more computed tokens stored/resolved in the browser, and more
  CSS custom properties to wire up.
- **Option 2** costs less (fewer tokens, less CSS work) but only the explicitly listed tokens can
  ever differ from the generic usage for this child.

Ask the user, per generic child, which option applies — do not default silently to one or the
other. **Specific** children (no corresponding generic usage) skip this decision entirely; they
always get their own minimal token set by definition.

#### Guidelines

- A child is only "generic" if a standalone usage for it is reasonable on its own merits (i.e. it
  would make sense as a component you could theme directly, independent of this parent).
- Prefer Option 2 by default for simple, narrowly-scoped overrides (a width, a gap); reserve
  Option 1 for children the user expects designers to want to theme as extensively as the standalone
  component itself.

### Step 4 — Present the rough schema for verification

After Steps 1–3 are confirmed for the whole tree, present it as a **markdown outline/tree**
(indented bullets: component → child → grandchild), each annotated with:

- its dependency level (Step 2),
- whether it's generic/specific and, if generic, which consolidation option (Step 3),
- the token fields it declares.

Ask the user to verify or correct it before proceeding. Do not move on until the user confirms this
rough schema is correct.

### Step 5 — Validate against the actual schema

Read the actual schema files (`schema/<component>/` directory or `schema/<component>.ts`) and
compare them, node by node, against the confirmed rough schema from Step 4. Produce a structured gap
list covering:

- Missing or extra children.
- Dependency-level mismatches (a child nested under `state` when it should only depend on
  `variant`, or inserted at the wrong point in the parent's path).
- Consolidation mismatches — a child that should extend a generic usage (Option 1) but doesn't
  reuse it, or a child that should be independent (Option 2) but unnecessarily duplicates the full
  generic token set, or a "generic" classification that doesn't match an existing usage anymore.
- Structural inconsistencies — e.g. a child reinventing an ad-hoc shape instead of following
  established primitive types (`bg`, `border`, `borderWithShadow`, `font`, etc. from
  `primitives.ts`), or not reusing existing shared shapes where they'd fit.
- Superfluous `defaultState`/`defaultSeverity` wrapper keys on a node that doesn't actually declare
  named states/severities — these levels must be omitted entirely, not just left empty, when the
  node has nothing to distinguish from the default (see Step 7).

If the schema files don't exist yet, the "actual" side is empty and the entire rough schema becomes
the gap list (nothing to keep, everything to add).

### Step 6 — Confirm structural changes

Present the gap list to the user and ask which changes to apply. Do not assume every proposed change
should be applied — the user may accept, reject, or modify individual items.

### Step 7 — Fill out default values

Once the structure (Steps 1–6) is confirmed, decide which leaf tokens get a **literal default
value**.

#### What must be filled

A default value **must** be generated for the baseline path — default variant → default state →
default severity — of every node in the schema where that baseline exists, even where only a
subset of levels is actually declared for that node (e.g. a node with variants and states but no
severity still needs a baseline default at `variant.state.token`, not just `token`). This is the
value every consumer falls back to when nothing more specific is set.

**Only where the level exists.** `defaultState`/`defaultSeverity` are not automatically present on
every node — they are keys in the schema only when that node actually declares named states or
severities to distinguish from the default. A node with no states at all has no `defaultState`
wrapper (its tokens sit directly on the variant); a node with no severities at all has no
`defaultSeverity` wrapper (its tokens sit directly on the state, or on the variant if it has no
states either). Do not add a `defaultState`/`defaultSeverity` wrapper key purely for consistency
with other nodes — only where there is a real named state/severity for it to sit alongside.

#### What should be filled

Beyond the mandatory baseline, only add a default where the token **should clearly have a
different value** than its parent/ancestor baseline. Do not fill in a default "just in case" —
unfilled tokens are not broken, they simply resolve via the fallback mechanism to the nearest
ancestor default.

#### Example: Input

It does not make sense to define a default for `hover.background` on an input — hovering over an
input usually does not change its background color. But `hover.border.color` should be defined,
since the input's border color typically **does** change on hover.

#### Example: Button

For a button, it does make sense to define a default for `hover.defaultSeverity.background`, since
hovering over a button usually does change its background.

Button is more involved; here is a worked example of the resulting decisions (`X` = intentionally
not defined, inherits through the fallback mechanism):

| Path (conceptual)                                        | Default?                                         |
| -------------------------------------------------------- | ------------------------------------------------ |
| `defaultVariant.defaultState.defaultSeverity.background` | baseline primitive for background                |
| `defaultVariant.hover.defaultSeverity.background`        | baseline primitive for hover background          |
| `defaultVariant.defaultState.success.background`         | green                                            |
| `defaultVariant.hover.success.background`                | different green                                  |
| `outlined.defaultState.defaultSeverity.background`       | X — inherits from `defaultVariant`               |
| `outlined.hover.defaultSeverity.background`              | X — inherits from `defaultVariant.hover`         |
| `outlined.defaultState.success.background`               | X — inherits from `defaultVariant.success`       |
| `outlined.hover.success.background`                      | X — inherits from `defaultVariant.hover.success` |

#### Process

Walk every subcomponent **one at a time**, in the same stable order used in Step 1/2 (root first,
depth-first). For each subcomponent:

1. Confirm the mandatory baseline default (variant → state → severity, to whatever levels that node
   declares).
2. Ask, one token at a time or in small clearly-related groups, which additional tokens should get
   a default because they clearly differ from their ancestor baseline — always propose a
   recommended answer, let the user confirm/override/redirect (including revisiting earlier nodes).
3. For each token that should carry a default, **propose the `{{primitives...}}` reference** rather
   than asking the user to invent it:
   - Read `schema/primitives.ts` for the available primitive paths.
   - Scan existing schema files for the same kind of token already in use, and follow that pattern.
   - The user only confirms or corrects the proposed reference.

#### Guidelines

- Look at the docs of existing component libraries (PrimeNG, etc.) to see what visibly changes
  across variant/state/severity for a similar component.
- Declare a default only where it makes sense; let empty ones fall back.
- Named variants/states/severities normally do **not** need their own baseline defaults duplicated
  from the parent's default — only the tokens that actually differ.

### Step 8 — Implement confirmed changes

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
//    defaultState carries the mandatory baseline token set (Step 7);
//    named states carry only the tokens that clearly differ from defaultState.
export const panelButtonDefaults = {
  defaultVariant: {
    defaultState: {
      width: '2.5rem',
      height: '2.5rem',
      focusRing: { color: '...', style: '...', width: '...', ... },
      // Full token set — every token the button renders (the mandatory baseline)
      color: '{{primitives...}}',
      background: '{{primitives...}}',
      border: { color: '...', style: '...', width: '...', radius: '...' },
    },
    hover: {
      // Only tokens that should clearly differ from defaultState (Step 7)
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    },
    selected: {
      background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
    },
    // disabled, focus, active — omitted if nothing differs from defaultState
  },
  // Named variants only carry a default where Step 7 decided the value should
  // clearly differ from defaultVariant — most named variants stay empty here
  // and inherit through the fallback mechanism instead of repeating the tree.
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

// Defaults — only filled where Step 7 requires it (mandatory baseline, plus
// any named variant that should clearly differ)
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

#### Consolidation (Step 3) in the implementation

- **Option 1 (extends) generic child.** Import and spread/extend the generic usage's shape and
  defaults rather than re-declaring its fields — see `.extend({...})` usages in existing schemas
  (e.g. `menubar.ts`, `table.ts`, `fieldset.ts`, `dropdown.ts`) for the pattern:

  ```typescript
  // calendar's input extends the generic input usage
  import { inputShape, inputDefaults } from '../input'

  export const calendarInputShape = inputShape.extend({
    // token.specific.for.calendar.input
    someCalendarOnlyToken: withRef(z.string()).optional(),
  })

  export const calendarInputDefaults = {
    ...inputDefaults,
    someCalendarOnlyToken: '{{primitives...}}',
  }
  ```

- **Option 2 (independent) generic child.** Declare only the child's own necessary fields; do not
  import the generic usage's shape at all:

  ```typescript
  // table's paginator dropdown does NOT extend the generic dropdown usage
  export const paginatorDropdownShape = z.object({
    width: withRef(z.string()).optional(),
  })

  export const paginatorDropdownDefaults = {
    width: '{{primitives...}}',
  }
  ```

- **Shared shapes** — when the same shape is used in multiple places (e.g. panel button used for
  nav buttons, time picker buttons, and footer buttons), define it **once** in its own file. All
  consumers import both the shape and the defaults — the defaults are shared by reference:

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
- **Defaults files**: plain objects that mirror the shape tree. Include only the defaults from
  Step 7 (mandatory baseline, plus tokens that should clearly differ). Absent keys stay optional
  and are filled by the runtime fallback mechanism.
- **Main file**: imports shapes and defaults from subcomponent files, assembles the top-level
  shape and defaults tree, calls `applyDefaultsRecursive(shape, defaults).register(...)`.
- **Dependency placement (Step 2)**: a child's dependency level determines where in the parent's
  variant/state/severity nesting its own schema object is inserted — insert it once per
  combination the dependency level implies (e.g. a `state`-dependent child appears once under each
  parent variant × state pair), not just once at the parent's root.
- **Reuse primitive types** from `primitives.ts` (`bg`, `color`, `border`, `borderWithShadow`,
  `font`, `withRef`, etc.) rather than inventing new ad-hoc shapes.
- **No class-based schema factories** — use plain module-level exports. If a class facade existed
  before (e.g. `CalendarSchema`), keep it only as a thin wrapper with a `static schema` property
  for backward compatibility.
- **No unused `defaultState`/`defaultSeverity` wrappers**: only nest a node's tokens under a
  `defaultState` shape if that node has named states (`hover`, `focus`, ...) as sibling keys, and
  only nest under `defaultSeverity` if it has named severities (`success`, `warning`, ...) as
  sibling keys. A node without states/severities keeps its tokens as direct fields on the level
  above instead of introducing an empty wrapper.
- Follow the Zod schema conventions in `add-theme-usage/SKILL.md` for anything not covered above
  (no `variant`/`state`/`severity` wrapper keys, `focusRing` at the variant root, registering every
  object with `themeSchemaRegistry`, etc.) — this skill decides _what_ the schema tree looks like
  (Steps 1–7), that skill's conventions decide exactly _how_ it's written in Zod.

Additional implementation notes:

- Where Step 7's default-value policy restricts defaults to a subset of the tree, every field that
  does **not** get a default must still be present in the schema shape — marked `.optional()` (or
  the object-level equivalent) rather than omitted, so the schema still parses successfully on
  empty/partial input at every nesting level.
- Fields/subtrees that carry no defaults per policy are simply absent from the defaults tree —
  `applyDefaultsRecursive` leaves them as `.optional()` automatically.
- This skill is **structure-only** with respect to reference-path semantics — you do not need to
  invent or validate the _specific_ `{{primitives...}}` path a token resolves to beyond ensuring
  it correctly targets the baseline versus the appropriate named override. If a genuinely new leaf
  token is introduced with no reasonable analogous reference to mirror, leave a
  `// TODO: define leaf token value` placeholder and note it explicitly in the report.

Do not add, remove, or modify test/spec files as part of this step — test creation is Step 10,
right after the structural implementation is confirmed. Leave existing tests as-is for now even if
they now fail against the restructured schema. Linting/type-checking the schema code itself is fine
and encouraged; running the component's test suite is not required at this point.

### Step 9 — Save the audit report

Write the full audit (rough schema tree from Step 4, gap list from Step 5, default-value tables
from Step 7, and a summary of changes applied) as a markdown file at
`docs/theme-schema-audits/<component>.md` (create the folder if needed). Overwrite any previous
audit file for the same component. Explicitly note that test/spec files were intentionally left
unchanged during Step 8 and that test coverage is added next, in Step 10.

### Step 10 — Test the resolved default values

Once Step 8's structural changes are implemented and confirmed, add automated tests that lock in the
**exact key/value pairs** produced by `parse({})` for every node — replacing, not patching, any
pre-existing spec files for this component. Legacy spec files are not a source of truth here: the
moment a schema is restructured they are frequently stale, and this step supersedes them rather than
evolving them incrementally.

#### Strategy: snapshot the values, hand-assert the invariants

**The value tree → Jest snapshots.** Hand-writing the full literal resolved-token object duplicates
values that already live in the component's own defaults exports, and that duplication is exactly
what goes stale after a restructure. Snapshotting `parse({})` (`toMatchSnapshot()`) instead captures
every exact key/value pair automatically, shows a reviewable diff on any change, and (with `--ci`)
forces a conscious accept of that diff — without duplicating any values by hand.

**The structural/policy invariants from this audit → explicit assertions.** A snapshot diff proves
values changed, not _why_ they're allowed to. Encode the decisions this audit actually made as
small, explicit, greppable assertions:

- **Parses successfully** — `expect(result.success).toBe(true)` for `parse({})`.
- **Shape/defaults parity** — a small reusable helper in `schema/test-utils.ts`
  (`expectDefaultsMatchShape`) that walks the defaults tree and asserts every key exists on the
  corresponding shape. Catches wiring bugs (typos, renames) that are a different failure mode than
  a value regression.
- **The mandatory baseline default (Step 7)** exists at the conceptual
  `defaultVariant.defaultState.defaultSeverity` path for every node that declares those levels.
- **No unused `defaultState`/`defaultSeverity` wrappers** — a node with no states/severities of its
  own exposes its tokens as flat fields, not wrapped in an empty `defaultState`/`defaultSeverity`
  key. Assert this directly for at least one static child (e.g. `expect(child).not.toHaveProperty
('defaultState')`).
- **Tokens that were intentionally left undefined (Step 7's "X" cases)** are actually absent from
  the parsed defaults for that named variant/state/severity — i.e. the fallback mechanism is what
  supplies the value, not a duplicated literal. Assert this for at least the load-bearing cases
  called out in the Step 7 table (e.g. a named variant/state that should inherit rather than
  override).
- **Consolidation wiring (Step 3)** — for an Option-1 (extends) child, assert its shape/defaults
  actually include the generic usage's fields (e.g. by checking a representative inherited token
  resolves, or by asserting shared references where the implementation reuses the generic usage's
  exported shape/defaults object by identity). For an Option-2 (independent) child, assert it does
  **not** carry the generic usage's full token set — only its own declared fields.
- **Dependency placement (Step 2)** — a child's own tree is reachable at the path implied by its
  confirmed dependency level (e.g. a `state`-dependent child is reachable under each parent
  variant × state combination, not only once at the parent root).

Keep this invariant set small and pointed — one assertion per confirmed decision — and let the
snapshot carry the rest of the value tree.

#### Where to put the tests

Use **exactly one spec file per component**, regardless of how many subcomponent schema files it's
split across: `schema/<component>/<component>.spec.ts` for multi-file components, or
`schema/<component>.spec.ts` for single-file components. Organize with one `describe` block per
subcomponent (root first, then each child in the same stable order used in Step 1), rather than a
separate `.spec.ts` per subcomponent file.

- The root `describe` is a thin integration check: "parses an empty object", one snapshot of
  `parse({})` for the fully assembled tree, and the component-level invariants (mandatory baseline
  default through the root, top-level consolidation/dependency checks).
- Each subcomponent gets its own nested `describe`, testing its own shape/defaults in isolation via
  `applyDefaultsRecursive(<subcomponent>Shape, <subcomponent>Defaults).parse({})`, with its own
  "parses an empty object" check, an `expectDefaultsMatchShape` check, its own snapshot, and the
  node-level invariants that apply to it.
- For an Option-1 (extends) generic child, give it a `describe` that asserts it reuses the generic
  usage's exports (reference/identity or resolved-token equality for a representative field) rather
  than re-snapshotting the generic usage's whole tree again.
- Delete any legacy top-level facade spec (`schema/<component>.spec.ts` alongside a
  `schema/<component>/` directory) rather than keeping a second file.

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

  it('resolves a baseline leaf through the mandatory default path', () => {
    const parsed = calendar.parse({})
    expect(parsed.defaultVariant.input.defaultVariant.defaultState.defaultSeverity.padding).toStrictEqual(
      '{{primitives.space.md}}'
    )
  })

  it('keeps static tokens at the node root, siblings of defaultVariant', () => {
    const parsed = calendar.parse({})
    expect(parsed.defaultVariant.input.focusRing).toBeDefined()
    expect(parsed.defaultVariant.input.defaultVariant.defaultState.defaultSeverity.focusRing).toBeUndefined()
  })

  it('leaves named variants without their own baked defaults unless Step 7 says otherwise', () => {
    const parsed = calendar.parse({})
    for (const variant of ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary']) {
      expect(parsed[variant]).not.toStrictEqual(calendarDefaults.defaultVariant)
    }
  })

  it('omits defaultState/defaultSeverity for a static child with no states or severities of its own', () => {
    // `today` (inside the date panel) declares no states/severities of its own — its tokens
    // (`background`, `color`) sit as flat fields, not wrapped in an empty `defaultState`/
    // `defaultSeverity` key. `datePanel` itself does declare states, so it keeps the wrapper.
    const datePanel = calendar.parse({}).defaultVariant.panel.defaultVariant.defaultState.defaultSeverity.datePanel
    const today = datePanel.defaultVariant.defaultState.defaultSeverity.today

    expect(today.background).toBeDefined()
    expect(today).not.toHaveProperty('defaultState')
    expect(today).not.toHaveProperty('defaultSeverity')
  })

  describe('input (Option 1 — extends the generic input usage)', () => {
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
      expect(calendarPanelHeaderDefaults.defaultVariant.defaultState.defaultSeverity.navButton).toBe(
        calendarPanelButtonDefaults
      )
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
change, and commit it alongside the schema change. Never hand-edit `.snap` files — always regenerate
them from the code.

#### Reflect testing outcomes in the audit report

Update `docs/theme-schema-audits/<component>.md` (from Step 9) with a short "Testing" section
noting which spec files were added/replaced, which legacy spec files were removed, and confirmation
that `nx test integration-interface` passes with the new/updated snapshots committed.
