---
name: add-theme-usage
description: Adds a new "usage" to the OneCX Theme V2 system — the per-component token group that themes a single PrimeNG component (tooltip, dialog, card, button, menu, accordion, message, toast, paginator, …). The typical invocation is the user pasting a PrimeNG docs URL like `https://primeng.org/<component>` and nothing else — treat that as a request to wire the named component into Theme V2 end-to-end. Use this skill whenever the user pastes a PrimeNG component docs URL on its own, OR asks to "make X themeable", "add theme support for X", "expose X tokens", "wire X into the theme", "add a usage schema for X", "let designers configure X via the theme", or anything that implies extending OneCX themes to cover an additional PrimeNG component — even when the user does not literally say "usage" or "schema". This skill handles both the Zod schema in `integration-interface` and the mapping rules in `angular-utils`, and scaffolds the CSS-rules file (without implementing the rules themselves — those stay a human decision).
---

# Add a Theme V2 Usage

This skill adds full Theme V2 support for one PrimeNG component (called a **usage**).

## What this skill does and does not do

Does:

1. Add (if needed) new **primitive** tokens that the usage's defaults reference.
2. Create the **usage Zod schema** under `libs/integration-interface`.
3. Register the usage in the top-level `usages` object.
4. Add **mapping rules** that translate schema leaves to PrimeNG preset paths under `libs/angular-utils`.
5. Extend the `ThemePath` union so typos in mapping rules fail at compile time.
6. Scaffold an **empty `CssRule[]` file** for the usage and wire it into the css-rules barrel. Inside that file, leave `// TODO:` comments listing any visual properties the component exposes that look themeable but have **no matching PrimeNG design token** — these are candidates for a hand-written `CssRule`.

Does **not**:

- Implement any `CssRule` entries. The scaffold is empty by design; CSS rules need design judgement and are out of scope. The `// TODO:` comments are suggestions for a human to act on.
- Touch `mapper.ts`, `mapping-rules.ts`, `css-rules.ts`, or anything below those — the aggregation already iterates the barrels.
- Add per-MFE component code, services, or templates that consume the new `settings` object. That belongs to consuming applications.

## Inputs

The normal invocation is a single PrimeNG docs URL, e.g. `https://primeng.org/card`. Everything else is inferred from that page — do not interrogate the user unless the URL is missing, malformed, or points at a non-component page. If the user provides extra constraints ("only the colors", "include a settings block", "skip the icon size"), respect them; otherwise infer.

Derive from the URL:

1. **Component name**: the last path segment of the URL (`/card` → `card`, `/inputtext` → `inputText` for variable/type names but keep `inputtext` for file/schema id when that is what PrimeNG uses in its preset tree — mirror the key PrimeNG actually uses under `components.<name>`).
2. **Tokens to expose** — **completeness is mandatory**: every leaf in the **Theming → Design Tokens** table on that page must be exposed in the schema and reachable via a mapping rule. The user expects "the component is themeable", and "themeable" means *all* of its design tokens, not the ones you found convenient. You may expose **more** (CSS-rule fallbacks for properties PrimeNG does not tokenize — see Step 6); you may not expose **less**. There are exactly two narrow exceptions, and even these require a one-line comment in the schema next to the omission:
   - The token has no semantic meaning of its own and is a pure alias for another token you have already exposed (the same path resolved twice on the PrimeNG side).
   - The token is `colorScheme.{mode}.shadow` (or similar) where PrimeNG documents both light and dark variants but they are mapped from a single schema leaf via the `{mode}` placeholder — that is still one schema leaf, two preset entries.
   Do **not** omit a token because it is a state variant (`hover`, `active`, `focus`, `disabled`, severity variants such as `success`/`info`/`warn`/`error`/`secondary`/`contrast`, etc.) — each state is a distinct themeable surface and must have its own schema leaf and mapping rule.
3. **`settings` candidates**: scan the component's **API → Properties** table on the same page. Promote an input into `settings` only when it passes every check in [§ When to add a `settings` object](#when-to-add-a-settings-object) — this is a small set in practice (tooltip's `position`/`showDelay`/`hideDelay` is the model). If nothing qualifies, omit `settings`.
4. **New primitives needed**: only when a token has no existing primitive that fits as its default — see Step 2.
5. **CSS-rule candidates**: see Step 6.

### How to read the docs page

Prefer `primeng-mcp` if it is available — it returns structured data that is far less error-prone than scraping HTML:

- `mcp__primeng_mcp_get_component_tokens` for the design-token tree (drives the schema and mapping rules),
- `mcp__primeng_mcp_get_component_props` for the input/property list (drives `settings` decisions),
- `mcp__primeng_mcp_get_component_styles` and `mcp__primeng_mcp_get_component_sections` to spot CSS-only candidates for Step 6.

Fall back to a single `fetch_webpage` call on the URL when MCP is unavailable. Do not ask the user to paste the token table — fetch it.

If the URL returns 404 or does not look like a component page (e.g. a guide URL), stop and ask the user for a valid component URL. Picking the wrong token set is the most expensive mistake here — it shapes every other step — so when the page itself is wrong, do not guess.

## Reference: the worked tooltip example

The repository already contains a complete worked example to mirror:

- Schema: [libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.ts](../../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/tooltip.ts)
- Registration: [libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts](../../../libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts)
- Mapping rules: `libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/tooltip.rules.ts`
- ThemePath extension: `libs/angular-utils/theme/primeng/src/utils/mapper/theme-path.types.ts`

Read tooltip's files first if anything about the conventions below is unclear — they are short and they encode the canonical structure.

## Step 1 — Read the PrimeNG tokens from the docs page

The URL you were given is the source of truth. Pull the **Theming → Design Tokens** table via `primeng-mcp` (`mcp__primeng_mcp_get_component_tokens`) or, as a fallback, a `fetch_webpage` call on the URL.

**Enumerate every leaf token** the page lists — do not paraphrase, do not collapse, do not pick a representative subset. Capture the list verbatim before you start writing the schema. Many components have token groups beyond `root` (e.g. `body`, `caption`, `title`, `subtitle`, `header`, `content`, `footer`, `icon`, `arrow`) and severity sub-trees (`colorScheme.{mode}.<severity>.<area>.background`/`color`/`border.color`/`shadow`). All of them count.

For each leaf, record:

- the PrimeNG dot-path under `components.<component>` (e.g. `components.card.root.shadow`, `components.card.body.padding`, `components.card.title.fontSize`, `components.message.colorScheme.{mode}.info.background`),
- whether it sits under `colorScheme.<mode>.…` (these need the `{mode}` placeholder in mapping rules and a `color` / `bg` schema type),
- whether it is layout/spacing/shape (string), color (color or bg), or numeric (font weight, line height — use `withRef(z.number())` or `withRef(z.string())` as appropriate).

If the docs page exposes the token tree under a deeper group than `root` (e.g. `colorScheme.{mode}.arrow`, `header`, `content`, `body`, `title`, `subtitle`, `<severity>`), preserve that grouping in the schema (`card.body.padding`, `card.title.fontSize`) and mirror it in the mapping rule's `to` (`components.card.body.padding`). Flattening the tree is a frequent way to silently lose tokens — don't do it.

At the end of this step you should have a flat list of `(PrimeNG path, kind)` pairs. Every entry in that list becomes exactly one schema leaf in Step 3 and exactly one mapping rule in Step 5a. The counts must match.

## Step 2 — Add missing primitive tokens (only if needed)

Before writing the schema, check that every `.default("{{primitives.…}}")` you plan to write already resolves to a real path in [`primitives.ts`](../../../libs/integration-interface/src/lib/topics/current-themes/v1/schema/primitives.ts).

Add a primitive when:

- the value is generic enough to be reused by other usages (e.g. an "overlay max width", an extra spacing step), and
- no existing primitive expresses the same idea.

Keep usage-specific values inside the usage schema instead. Always wrap scalars with `withRef(...)` so theme references stay valid.

## Step 3 — Create the usage schema

Create `libs/integration-interface/src/lib/topics/current-themes/v1/schema/<component>.ts`.

Conventions, all enforced by the existing tooltip example:

- Import building blocks from `./primitives` (`bg`, `border`, `color`, `font`, `withRef`, …) and `themeSchemaRegistry` from `./registry`.
- Every exported `z.object(...)` ends with `.register(themeSchemaRegistry, { id: "<usage>" })`. The id must be unique.
- **Every PrimeNG leaf from Step 1 appears here** — as its own field, or inside a nested object that mirrors PrimeNG's grouping (e.g. `body: z.object({ padding: …, gap: … })` for `components.card.body.padding`/`gap`; one nested object per severity for message-like components). Verify count parity before moving on: if Step 1 produced 14 leaves, the schema has 14 themeable leaves.
- Every leaf has a `.default("{{primitives.…}}")` so themes that define only primitives still get a complete look.
- For PrimeNG color tokens that accept either a plain color or a structured background, use `z.union([bg, withRef(z.string())])`. For pure colors, use `color`.
- For enum choices, wrap with `withRef(z.enum([...]))` so themes may also pass a reference.
- When you only want to set a sub-property of a structured primitive (e.g. only `border.radius`), use `border.default({ radius: "…" })` — Zod leaves the rest undefined and the mapper skips undefined leaves. **Important**: PrimeNG's `borderRadius` on `root` is a single scalar token, not a structured `border`. Use `borderRadius: withRef(z.string()).default("…")` (or place it inside a nested `border` object only if you also expose `border.color`/`border.width` from the same PrimeNG group). Do not silently drop `borderRadius` by collapsing it into a `border` object whose other fields the component does not tokenize.

### When to add a `settings` object

`settings` is for PrimeNG **component inputs** (not design tokens) that benefit from a workspace-wide default — e.g. tooltip `position`, `showDelay`, `hideDelay`.

Add a field to `settings` only when all hold:

- It is a PrimeNG component input, not a design token.
- A sensible default is independent of any specific screen, dataset, or business flow.
- Centralising it improves consistency across the workspace.

Never put data, structural config, runtime state (`disabled`, `loading`, …), handlers, templates, identifiers, or labels into `settings` — those are per-screen concerns.

Rules for `settings`:

- Place it as the first property of the usage object.
- Define it as its own exported `z.object` named `<usage>Settings` and register it.
- Wrap every field in `withRef(...)`.
- Do **not** add `.default()` to `settings` fields — let PrimeNG decide.
- Do **not** add mapping rules for `settings` — it is consumed by app code, not the preset.

If unsure, omit `settings`. It can always be added later.

## Step 4 — Register the usage

Open [`current-themes.schema.ts`](../../../libs/integration-interface/src/lib/topics/current-themes/v1/current-themes.schema.ts) and add the import + entry to the `usages` object:

```ts
import { <component> } from "./schema/<component>";

const usages = z.object({
  // …existing entries…
  <component>: (<component> as typeof <component>).optional(),
}).register(themeSchemaRegistry, { id: "usages" });
```

The `(x as typeof x).optional()` cast is required — it breaks an inference depth chain that otherwise produces TS2589. Mirror the surrounding entries verbatim.

The schema barrel `libs/integration-interface/src/index.ts` already re-exports `current-themes.schema`, so nothing else needs to be exported unless the user is publishing new public TypeScript types they want consumers to import by name.

## Step 5 — Mapping rules and `ThemePath`

### 5a — Mapping rules file

Create `libs/angular-utils/theme/primeng/src/utils/mapper/mapping-rules/usages/<component>.rules.ts`:

```ts
import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const <component>MappingRules: MappingRule[] = [
  { from: 'usages.<component>.<leaf>', to: 'components.<component>.root.<token>' },
  {
    from: 'usages.<component>.background',
    to:   'components.<component>.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  // …one rule per exposed leaf…
];
```

Spread it into `usage-mapping-rules.ts`:

```ts
import { <component>MappingRules } from './usages/<component>.rules';

export const usageMappingRules: MappingRule[] = [
  // …existing entries…
  ...<component>MappingRules,
];
```

Conventions:

- One `from` → one `to`. No fan-out, no conditionals. Put any complexity in `transform`.
- Use `toColorString` for any leaf whose schema type is `color` or `bg` (or a union containing them).
- Use `{mode}` whenever the PrimeNG target path sits under `colorScheme.<light|dark>.…`. The mapper expands it to both light and dark.
- Do **not** add rules for `settings.*` paths.
- Do **not** edit `mapping-rules.ts` or `mapper.ts`.

### 5b — Extend `ThemePath`

Open `libs/angular-utils/theme/primeng/src/utils/mapper/theme-path.types.ts` and add a branch for the new usage:

```ts
export type ThemePath =
  | `primitives.${LeafPaths<NonNullable<Primitives>>}`
  | `usages.region.${LeafPaths<NonNullable<Usages['region']>>}`
  | `usages.table.${LeafPaths<NonNullable<Usages['table']>>}`
  | `usages.tooltip.${LeafPaths<NonNullable<Usages['tooltip']>>}`
  | `usages.<component>.${LeafPaths<NonNullable<Usages['<component>']>>}` // ← new
```

This per-usage branching is intentional: a single `usages.${LeafPaths<Usages>}` blows past the TypeScript instantiation budget (TS2589). Skipping this step makes typos in `from` paths compile silently.

## Step 6 — Scaffold the CSS-rules file (empty, with suggestions)

Even when no hand-written CSS is needed today, create the scaffold so the file is there for future additions and so contributors discover the pipeline naturally.

Create `libs/angular-utils/theme/primeng/src/utils/mapper/css-rules/usages/<component>.rules.ts`:

```ts
import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

// TODO: <property name on the PrimeNG component that looks themeable but has
//        no matching design token> — candidate CssRule selector + property.
// TODO: …

export const <component>CssRules: CssRule[] = [];
```

Wire it into `css-rules/usage-css-rules.ts`:

```ts
import { <component>CssRules } from './usages/<component>.rules';

export const usageCssRules: CssRule[] = [
  // …existing entries…
  ...<component>CssRules,
];
```

### How to find CSS-rule candidates

Use the same sources as Step 1, plus the component's styles/sections:

- `mcp__primeng_mcp_get_component_styles` and `mcp__primeng_mcp_get_component_sections` (or the docs page's **Style** / **Theming → Styled Mode** section) for the list of CSS classes and pseudo-elements the component renders,
- diff that against the design-token tree from Step 1.

A candidate property is one that:

- visibly affects the component's appearance (color, spacing, border, shadow, layout, animation), **and**
- is **not** present in the component's Theming → Design Tokens table, **and**
- is not just a per-instance input (size, label, value).

Typical examples: arrow/caret rendering details, focus-ring offsets not exposed as tokens, animation timing for non-tokenized transitions, scrollbar styling, decorative pseudo-elements.

For each candidate, add one `// TODO:` line that names the property and where it would apply, e.g.:

```ts
// TODO: arrow tip color — .p-tooltip-arrow::before { border-color: … } has no PrimeNG token.
// TODO: enter/exit animation duration — .p-tooltip-enter-active { transition-duration: … }.
```

If you find zero candidates, leave the array empty and a single comment stating "No CSS-only properties identified at time of authoring." — keeping the scaffold consistent across usages is more valuable than omitting empty files.

Do **not** populate the `CssRule[]` array. Adding rules requires a design call and is intentionally left to a follow-up.

## Step 7 — Verify

Before running tasks, do a **parity self-check**:

1. Re-list the PrimeNG design tokens from Step 1 (`mcp__primeng_mcp_get_component_tokens` or the docs page).
2. List the mapping rules you wrote in `mapping-rules/usages/<component>.rules.ts` — each `from` path corresponds to one PrimeNG leaf.
3. The two lists must contain the same leaves. If a PrimeNG leaf has no matching mapping rule, the component is not fully themeable — go back to Step 3 and add it. The only acceptable absences are the two narrow exceptions called out in [Inputs](#inputs); each must be justified by a comment in the schema next to the omission.

Then run from the repo root, in order:

1. `nx affected lint (current work)` — picks up both `integration-interface` and `angular-utils`.
2. `nx affected test (current work)` — same.
3. `nx affected build (current work)` — confirms the TypeScript graph (including `ThemePath` and `PresetPath`) still type-checks.

Use the workspace tasks defined in `.vscode/tasks.json` (per repo `copilot-instructions.md`), not raw terminal `npx nx` invocations.

Sanity checks that catch the common regressions:

- Make a deliberate typo in a `from` of a new mapping rule. It must produce a TypeScript error. If it does not, `ThemePath` was not extended in step 5b.
- A theme that overrides only primitives still produces a fully populated PrimeNG preset for the new component (because every leaf has a `.default("{{primitives.…}}")`).
- A theme that overrides a single leaf of the new usage retains primitive-derived defaults for every other leaf.

If lint/test/build pass and the sanity checks hold, the usage is wired correctly.

## Common mistakes to avoid

- **Forgetting the `(x as typeof x)` cast** in `current-themes.schema.ts` or `theme-path.types.ts`. Looks redundant; isn't. It prevents TS2589 depth-explosion as the union of usages grows.
- **Forgetting `{mode}`** on color/bg targets. The mapper emits one path; PrimeNG expects both `light` and `dark` to be set. Symptom: dark mode silently uses light values.
- **Forgetting `toColorString`** on color/bg leaves. Themes can pass a string, a `{ light, dark }` object, or a full `bg` object — `toColorString` normalises all three.
- **Adding mapping rules for `settings.*`**. `settings` is consumed by app code, not by the PrimeNG preset; rules for it have no effect and add noise.
- **Implementing CSS rules in the scaffold**. The scaffold stays empty; CSS rules are a separate, intentional decision.
- **Adding leaves without `.default("{{primitives.…}}")`**. Themes that only override primitives stop producing a complete look — every other leaf becomes undefined and the component falls back to PrimeNG defaults.
- **Forgetting to register the schema** (`.register(themeSchemaRegistry, { id: "<usage>" })`). Registration is what makes the schema discoverable by tooling that walks the registry.
- **Incomplete token coverage**. The most common qualitative failure mode is exposing only the obvious tokens (`background`, `color`, `border`, `padding`, `shadow`) and silently dropping component-specific groups (`body.padding`, `body.gap`, `caption.gap`, `title.fontSize`, `title.fontWeight`, `subtitle.color`, per-severity variants on `Message`/`Toast`, etc.). The user said "make X themeable" \u2014 they mean every token PrimeNG exposes. The Step 7 parity self-check exists specifically to catch this. Always run it.
