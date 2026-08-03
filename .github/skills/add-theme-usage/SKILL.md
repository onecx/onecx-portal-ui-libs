---
name: add-theme-usage
description: Adds a new "usage" to the OneCX Theme V2 system — the per-component token group that themes a single PrimeNG component. The typical invocation is the user pasting a PrimeNG docs URL like `https://primeng.org/<component>`. Handles Zod schema creation in `integration-interface`, mapping rules in `angular-utils` and CSS-rules scaffolding.
---

# Add a Theme V2 Usage

This skill adds full Theme V2 support for one PrimeNG component (called a **usage**).

## What this skill does and does not do

**Does:**

1. Add (if needed) new **primitive** tokens that the usage's defaults reference.
2. Create the **usage Zod schema** under `libs/integration-interface`.
3. Register the usage in the top-level `usages` object and `UsagesInput` type.
4. Add **mapping rules** that translate schema leaves to PrimeNG preset paths under `libs/angular-utils`.
5. Extend the `ThemePath` union so typos in mapping rules fail at compile time.
6. Scaffold an **empty `CssRule[]` file** for the usage and wire it into the css-rules barrel.

**Does not:**

- Implement any `CssRule` entries. The scaffold is empty by design — CSS rules need design judgement.
- Touch `mapper.ts`, `mapping-rules.ts`, or `css-rules.ts` at the aggregation layer — those iterate barrels automatically.
- Add per-MFE component code, services, or templates that consume the new `settings` object.

## Theme token hierarchy

The token path hierarchy is: **component → variant → state → severity → property**.

Rules enforced by the schema and tests:

- **`defaultVariant` must NOT appear as a key in flattened token paths.** The default variant has no key — `usages.textarea.background` (not `usages.textarea.defaultVariant.background`).
- **Named variants use their name directly** — `usages.textarea.filled.background` (not `usages.textarea.variant.primary.background`).
- **`focusRing` must NEVER be inside a state object.** It belongs at the variant level (e.g., `usages.textarea.focusRing`), not nested under a state. FocusRing is referenced when setting focus styles but is defined at the variant root.
- **Hierarchy order: component → variant → state → severity → token.** Breaking this order is invalid.

In the Zod schema, the default variant's tokens live at the root of the usage object (no wrapper key). States (`hover`, `active`, `focus`, `disabled`, `invalid`) are sibling keys. Named variants (e.g., `filled`) are also sibling keys, with their own nested state objects.

## Reference implementations

The repository contains three reference implementations for Schema and tests:

- **Textarea** — simpler component, single file schema:
  - Schema: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/textarea.ts`
  - Tests: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/textarea.spec.ts`

- **Carousel** — simpler component, single file schema:
  - Schema: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/carousel.ts`
  - Tests: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/carousel.spec.ts`

- **Picklist** — complex component, directory-based schema with child components:
  - Schema directory: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/picklist/`
  - Tests: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/picklist.spec.ts`

- **Calendar** - complex component, directory-based schema with child components:
  - Schema directory: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/calendar/`
  - Tests: `libs/integration-interface/src/lib/topics/current-themes/v1/schema/calendar.spec.ts`

Read these files when anything about the conventions below is unclear.

## Inputs

A PrimeNG docs URL, e.g. `https://primeng.org/card`. Derive:

1. **Component name** from the URL path segment.
2. **All design tokens** from the **Theming → Design Tokens** table — every leaf must be exposed.
3. **Settings candidates** from the **API → Properties** table — promote only inputs that benefit from a workspace-wide default (like `position`, `showDelay`, `hideDelay`). If nothing qualifies, omit `settings`.

Use `primeng-mcp` tools if available (`mcp__primeng_mcp_get_component_tokens`, `mcp__primeng_mcp_get_component_props`). Fall back to `fetch_webpage`. Do not guess — if the URL is wrong, stop and ask.

## Primitives structure

Every `.default("{{primitives.…}}")` must resolve to an existing path in `primitives.ts`. The primitive structure is:

```
primitives
  defaultVariant  -> variantWithStates (defaultState + state.hover/active/focus/invalid/disabled)
  variant         -> colorVariants (primary, secondary, tertiary, quaternary, quinary)
  font            -> { family, size, weight, lineHeight, letterSpacing, style }
  space           -> { xs, sm, md, lg, xl, xxl }
  border          -> { width, offset, radius, color, style }
  focusRing       -> { width, offset, radius, shadow } (focusRingShape)
  shadow          -> { none, sm, md, lg, xl }
  transition      -> { duration }
```

**Inside `defaultState` or `state.hover`, etc.** each has a `severityVariantGroup`:

```
variantWithStates
  defaultState (or state.hover)
    defaultSeverity  -> { bg, contrast, ... }   (the default fallback)
    severity
      info           -> { bg, contrast, ... }
      success        -> { bg, contrast, ... }
      warning        -> { bg, contrast, ... }
      danger         -> { bg, contrast, ... }
      contrast       -> { bg, contrast, ... }
```

Common reference patterns:

- `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` — default variant, default state
- `{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}` — default variant, hover state
- `{{primitives.variant.primary.defaultState.defaultSeverity.bg}}` — filled/primary variant, default state
- `{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}` — filled variant, disabled state
- `{{primitives.defaultVariant.defaultState.severity.warning.bg}}` — default variant, default state, warning severity
- `{{primitives.defaultVariant.state.hover.severity.warning.bg}}` — default variant, hover state, warning severity
- `{{primitives.variant.primary.state.hover.severity.info.bg}}` — filled variant, hover state with info severity
- `{{primitives.font.weight}}`, `{{primitives.space.md}}` — global primitives

**Key rules for primitive references:**

- **Default fallback** → use `defaultSeverity` directly: `...defaultState.defaultSeverity.bg`
- **Named severity** → MUST include the `severity` intermediary: `...defaultState.severity.warning.bg` (NOT `...defaultState.warning.bg`)
- **Hover state** → reference `state.hover`, not `defaultState`: `...state.hover.severity.info.bg`
- **Color mapping to primitives**: `info` → `severity.info`, `success` → `severity.success`, `warn` → `severity.warning`, `error` → `severity.danger`, `secondary` → `variant.secondary`, `contrast` → `defaultSeverity` (swapped bg/contrast)

**If a usage has hover state, reference `primitives.[variant].state.hover.severity.[severity].[token]`, not `primitives.[variant].defaultState.severity.[severity].[token]`.** The state in the primitive reference should match the semantic meaning.

## Severity defaults — per-severity distinct primitive values

When a usage has severity variants (info, success, warn, error, etc.), **each severity must have its own distinct `.default()` object** with unique primitive references. Do NOT use `.prefault({})` on severity variants — use `.default({...})` with per-severity values.

**Schema pattern:**

```typescript
// Define the shared severity shape once (leaves are .optional())
const severityShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    borderColor: color.optional(),
    color: color.optional(),
    shadow: withRef(z.string()).optional(),
    closeButton: severityCloseButton.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'componentSeverity' })

// Define per-severity default objects — each references DIFFERENT primitives
const infoDefaults = {
  background: '{{primitives.defaultVariant.defaultState.severity.info.bg}}',
  borderColor: '{{primitives.defaultVariant.defaultState.severity.info.bg}}',
  color: '{{primitives.defaultVariant.defaultState.severity.info.contrast}}',
  shadow: '{{primitives.shadow.none}}',
  closeButton: {
    /* per-severity values */
  },
}

const successDefaults = {
  background: '{{primitives.defaultVariant.defaultState.severity.success.bg}}',
  borderColor: '{{primitives.defaultVariant.defaultState.severity.success.bg}}',
  color: '{{primitives.defaultVariant.defaultState.severity.success.contrast}}',
  shadow: '{{primitives.shadow.none}}',
  closeButton: {
    /* per-severity values */
  },
}

// Apply in the usage schema — each severity gets its OWN .default()
export const component = z.object({
  // ... root tokens ...

  // Default variant severity — at root level (no wrapper)
  // Token path: usages.component.info.color
  info: (severityShape as typeof severityShape).default(infoDefaults),
  success: (severityShape as typeof severityShape).default(successDefaults),
  warn: (severityShape as typeof severityShape).default(warnDefaults),
  error: (severityShape as typeof severityShape).default(errorDefaults),
})
```

**Nested sub-shapes in severity defaults:** When the severity shape has nested objects (e.g., `closeButton`), the default must include the full nested structure. Leaves inside nested objects that are `.optional()` can be omitted from the default if they don't apply, but the nested object itself must be present (e.g., `closeButton: { hoverBackground: '...' }`).

## Step 1 — Read the PrimeNG tokens

Pull the design-token tree via MCP or the docs page. Enumerate every leaf token. Record the PrimeNG dot-path and kind (color, layout, numeric). Preserve deeper groupings (`body`, `header`, `title`, severity sub-trees) — do not flatten.

At the end: a flat list of `(PrimeNG path, kind)` pairs. Every entry becomes one schema leaf and one mapping rule.

## Step 2 — Add missing primitives (if needed)

Check that every planned default resolves to `primitives.ts`. Add a primitive only when:

- The value is reusable across usages, and
- No existing primitive expresses the same idea.

## Step 3 — Create the usage schema

Create `libs/integration-interface/src/lib/topics/current-themes/v1/schema/<component>.ts` (or a `<component>/` directory for complex components with children, following the picklist pattern).

**Conventions:**

- Import `bg`, `color`, `withRef`, `font`, `borderWithShadow` etc. from `./primitives` and `themeSchemaRegistry` from `./registry`.
- Exported `z.object(...)` ends with `.register(themeSchemaRegistry, { id: "<usage>" })`.
- **Re-use types from primitives:** `background` → `bg`, `color` → `color`, `border` → `border`/`borderWithShadow`, `font` → `font`. For partial types use `font.pick({ size: true })`.
- For color tokens accepting plain color or structured background: `z.union([bg, withRef(z.string())])`.
- Every leaf has a `.default("{{primitives.…}}")` — no leaf without a default (except `settings`).
- **States and variants:** the default variant's tokens sit at the root. States (`hover`, `active`, `focus`, `disabled`, `invalid`) are sibling keys using `.prefault({})`. Named variants are sibling keys with nested state objects, also using `.prefault({})`.
- **Severity placement in hierarchy:** severity is the INNERMOST layer before property. The hierarchy is always **component → variant → state → severity → property**.
  - **Default variant, default state, no severity:** `usages.textarea.background`
  - **Default variant, default state, WITH severity:** `usages.message.info.color` (severity at root, no state layer)
  - **Default variant, hover state, WITH severity:** `usages.component.hover.info.color` (state wraps severity)
  - **Named variant, default state, WITH severity:** `usages.message.outlined.info.color` (variant wraps severity)
  - **Named variant, hover state, WITH severity:** `usages.component.outlined.hover.info.color` (variant → state → severity)
- **In Zod schema:** severity keys (`info`, `success`, `warn`, `error`) are placed as siblings inside the variant or state that owns them — never outside a variant. If a component has no states and no variants, severity keys sit at the root.
- `.prefault({})` is only used on **nested object-shaped fields** (states, variants, subcomponent schemas), whose own children carry `.default(...)` values.
- **Factor out recurring shapes:** if the same token shape repeats across variants, extract it into a separate exported `z.object(...)` with its own `id` in the registry.
- Use `border: border.default({...})` or `border: borderWithShadow.default({...})` for border tokens, not flat scalar `borderRadius` or `borderWidth`.
  **`defaultVariant` must NOT appear as a key in token paths.** The default variant has no key — `usage.textarea.background` (not `usage.textarea.defaultVariant.background`).
- **`variant` must NOT appear as a raw key in token paths.** Named variants use their name directly — `usage.textarea.filled.background` (not `usage.textarea.variant.primary.background`).
- **`focusRing` must NEVER be inside a state object.** It belongs at the variant level (e.g., `usage.textarea.filled.focusRing`), not `usage.textarea.hover.focusRing`. FocusRing is referenced when setting focus styles but is defined at the variant root.
- Hierarchy order: When a usage needs variant, state and severity simultaneously: **component → variant → state → severity → token**. Breaking this order (e.g., state before variant) is invalid.
- The schema must produce tokens that follow this hierarchy when flattened: usage.component.[variant].state.severity.tokenName

**The `settings` object:**

- First property of the usage object.
- Own exported `z.object` named `<usage>Settings`, registered with the schema registry.
- Every field wrapped in `withRef(...)`.
- No `.default()` on settings fields — let PrimeNG decide.
- No mapping rules for `settings.*`.
- Only include when a PrimeNG input benefits from a workspace-wide default and a sensible default is independent of any specific screen/dataset/flow.

**`focusRing` placement:**

- `focusRing` is defined at the variant root level, not inside a state object.
- It is optional at the root: `focusRing: borderWithShadow.optional().default(focusRingDefaults)`.

**Verify types used in schema**

The schema should re-use types from `primitives.ts` for tokens that makes sense. For example:

- `background` -> `bg` from `primitives.ts` file
- `color` -> `color` from `primitives.ts` file
- `border` -> `border` from `primitives.ts` file
- `font` -> `font` from `primitives.ts` file
- `bgContrast` -> `bgContrast` from `primitives.ts` file

Example of re-using types in schema:

```typescript
import { z } from 'zod'
import { bg, color, border, font } from 'primitives'

const hoverTextareaStyles = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    width: '{{primitives.border.width.sm}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  }),
  focusRing: borderWithShadow.default({
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    width: '{{primitives.focusRing.width.md}}',
    offset: '{{primitives.focusRing.offset.md}}',
    radius: '{{primitives.focusRing.radius.md}}',
    shadow: '{{primitives.focusRing.shadow.md}}',
  }),
})
```

If only a subset of the type should be used as a token (e.g., only font size), use font.pick({ size: true }) instead of the full font type. If a token is not a primitive, use `z.string()` or `z.number()`, `z.object()` as appropriate.

## Step 4 — Register the usage

In `current-themes.schema.ts`:

1. Add import: `import { <component> } from './schema/<component>';`
2. Add to `UsagesInput` type: `<component>?: z.input<typeof <component>>`
3. Add to `usages` object: `<component>: (<component> as typeof <component>).optional(),`

The `(x as typeof x).optional()` cast is required — it prevents TS2589 inference depth explosion.

## Step 5 — Mapping rules

Create `libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/<component>.rules.ts`:

```ts
import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const <component>MappingRules: MappingRule[] = [
  { from: 'usages.<component>.defaultVariant.defaultState.defaultSeverity.background',
    to: 'components.<component>.colorScheme.{mode}.root.background',
    transform: toColorString },
  // ...one rule per exposed leaf...
];
```

**Conventions:**

- `from` paths always use the full hierarchy: `defaultVariant.defaultState.defaultSeverity` for non-severity tokens.
- **Severity-aware `from` paths:** `usages.component.defaultVariant.defaultState.severity.warning.color` for severity tokens.
- Use `toColorString` for any `color` or `bg` leaf.
- Use `{mode}` for `colorScheme.<light|dark>` targets.
- No rules for `settings.*`.

Spread into `usage-mapping-rules.ts`.

### Step 5b — Extend `ThemePath`

In `theme-path.types.ts`, add:

```ts
| `usages.<component>.${LeafPaths<NonNullable<Usages['<component>']>>}`
```

This makes typos in `from` paths produce TypeScript errors.

## Step 6 — Scaffold CSS rules file

Create `libs/angular-utils/theme/primeng/src/utils/mapper/css-rules/usages/<component>.rules.ts`:

```ts
import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// TODO: <property> — <explanation>.

export const <component>CssRules: CssRule[] = [];
```

Wire into `usage-css-rules.ts`. Do not populate the array — CSS rules are a separate design decision.

## Verification checklist

Before considering the task complete:

1. **Parity check:** every PrimeNG design token from Step 1 has a corresponding schema leaf and mapping rule.
2. **Primitive validity:** every `{{primitives.…}}` reference resolves to an existing path in `primitives.ts`.
3. **Hierarchy compliance:** no `defaultVariant` or `variant` as raw keys in flattened paths; `focusRing` at variant level.
4. **Type compliance:** `ThemePath` extension catches deliberate `from` typos as TypeScript errors.
5. **Token direction check:** `background`/`bg` fields must reference `...bg}`, `color` fields must reference `...contrast}` - never the other way around.

## Common mistakes

- Forgetting the `(x as typeof x)` cast in `current-themes.schema.ts` or `theme-path.types.ts` — causes TS2589.
- Forgetting `{mode}` on color/bg targets — dark mode silently uses light values.
- Forgetting `toColorString` on color/bg leaves.
- Adding mapping rules for `settings.*` — no effect, adds noise.
- Implementing CSS rules in the scaffold — stays empty.
- Adding leaves without `.default("{{primitives.…}}")` — incomplete look when only primitives are overridden.
- Forgetting `.register(themeSchemaRegistry, { id: "..." })` — schema not discoverable.
- Incomplete token coverage — exposing only obvious tokens and dropping component-specific groups. Run the parity check.
- Putting `focusRing` inside a state object — it belongs at the variant root.
- Using `defaultVariant.defaultState` in primitive refs for hover state — use `state.hover`.
- Using `.prefault({})` on severity variants instead of `.default({...})` — each severity must have its own distinct primitive defaults.
- Forgetting the `severity` intermediary in primitive paths — `...defaultState.severity.warning.bg` not `...defaultState.warning.bg`.
- Putting severity tokens at the wrong level in the hierarchy — severity must come after variant and state, not before.
