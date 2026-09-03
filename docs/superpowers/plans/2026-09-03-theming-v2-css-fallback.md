# Theming V2 CSS-based Fallback Mechanism Implementation Plan

## Problem Statement

Theming V2 lets tenants override CSS custom properties for component token combinations arranged in a variant → state → severity hierarchy (for example `outlined.hover.success.background`). Every leaf combination in a token schema must currently define an explicit value, because no mechanism exists for an unset, more-specific combination (`outlined.hover.success`) to inherit the value of a less-specific combination (`outlined.hover.defaultSeverity`, then `outlined.defaultState.defaultSeverity`, then `defaultVariant.defaultState.defaultSeverity`). This forces schema authors to hand-author a value for every variant/state/severity permutation even when most permutations should simply inherit a more general value, producing bloated schemas.

The end state: every token's CSS custom property is defined once per theme load as either the tenant's explicit value or a `var(--fallback-combo)` reference to the next less-specific combination, chained down to that token's base combination (`defaultVariant.defaultState.defaultSeverity`). The browser resolves these `var()` chains natively; no runtime "resolve fallback value" function runs at the point a token is consumed by component styles. A token's path may cross multiple nested axis groups (one per component/child boundary, for example a button and its nested icon); each group relaxes independently, innermost group first. The relaxation order across variant/state/severity is configurable per theme via a `fallbackOrder` field, defaulting to `['state', 'variant', 'severity']`. Primitive base combinations always resolve to a concrete value; usage base combinations may remain undefined, in which case no CSS variable entry is emitted for that combination and the browser's or PrimeNG's own default styling applies.

This repository, `onecx-portal-ui-libs`, contains the shared `@onecx/integration-interface` library used by the runtime shell application (`onecx-shell-ui`, hosted in a separate repository not present in this checkout). This plan delivers the schema model, the schema-introspection function, and the fallback-chain-construction function inside `libs/integration-interface`, as pure exported functions consumable by that separate repository's `ThemeApplyService`. No `onecx-shell-ui` file is created or modified by this plan because no such repository exists in this checkout.

## Approach

Add a Zod-based schema model for Theming V2 token documents (`ThemePropertiesV2Schema`, with `primitives`, `usages`, `regionOverrides`, and `fallbackOrder` fields) inside a new `schema/` subdirectory of the existing, real directory `libs/integration-interface/src/lib/topics/current-theme/v1/`. Add `zod` as a direct dependency of `libs/integration-interface/package.json`, matching the existing pattern in `libs/ngrx-accelerator/package.json`, which already declares `"zod": "^4.0.0"` directly rather than relying on hoisting from the root `package.json`.

Classify each schema node's role (`variant`, `state`, `severity`, or `child` axis-group boundary) using a pair of marker helper functions, `markAxis`/`getAxisMeta`, built on Zod 4's `.meta()` API, which attaches and reads back an arbitrary metadata object on any Zod schema node. Build one schema-introspection function, `deriveLeafAxisMetadata`, that walks a marked-up schema tree once and produces, per terminal token field, the ordered list of axis groups (outermost first) it passes through, each with its available variant/state/severity names and its default (base-combo) name per axis.

Build one pure, exported fallback-chain-construction function, `buildFallbackChainForLeaves`, that takes that per-leaf axis metadata, a map of the tenant's real (explicitly configured) CSS variable values, a CSS variable name prefix, and an optional `fallbackOrder`, and returns a single `Map<string, string>` of every combination's CSS variable name to either its real value or a `var(--parent-combo)` reference. The relaxation algorithm is single and uniform: for a full combination spanning one or more axis groups, the immediately enclosing axis group (the last, innermost group in the leaf's group list) is scanned first; within that group, the configured `fallbackOrder` is scanned in order and the first axis whose current value differs from that axis's default is reset to its default, producing the parent combination. When every axis in the innermost group already equals its default, the next-outer group is scanned the same way. When every axis in every group already equals its default, the combination is the leaf's absolute base combination and, if it has no real value, no CSS variable entry is emitted for it.

Three example schemas exercise this mechanism end-to-end and are the direct subjects of the introspection and chain-construction tests: a `primitives` example (`colorPrimitiveSchema`, single axis group, base combination guaranteed via Zod `.default(...)`), an `input` usage example (`inputUsageSchema`, single axis group, sparse/undefined-allowed leaves), and a `button` usage example (`buttonUsageSchema`, one nested `child` axis group for a button's icon). All new modules are exported from the existing barrel file `libs/integration-interface/src/index.ts`. Developer documentation is added under the existing, real `dev-docs/theming/` directory.

## File-Level Task List

### 1. `libs/integration-interface/package.json`

- **Path**: `libs/integration-interface/package.json`
- **Action**: modify
- **Summary**: Add `zod` as a direct dependency so the `@nx/dependency-checks` lint rule passes for the new schema modules, matching the existing direct-dependency pattern used by `libs/ngrx-accelerator/package.json`.
- **Concrete TODOs**:
  1. Open `libs/integration-interface/package.json` and locate the `"dependencies"` object, which currently contains only `"semver": "^7.7.3"`.
  2. Add `"zod": "^4.1.12"` as a second entry in the `"dependencies"` object, matching the version already declared in the root `package.json`.
- **Dependencies**: none.

### 2. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/axis.model.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/axis.model.ts`
- **Action**: create (new file inside the existing, real directory `libs/integration-interface/src/lib/topics/current-theme/v1/`; the `schema` subdirectory does not yet exist and is created by this task)
- **Summary**: Define the shared axis-kind type, the per-axis-group and per-leaf metadata interfaces, and the default fallback order constant used by every other module in this plan.
- **Concrete TODOs**:
  1. Create the file with the exact content:
     ```typescript
     export type AxisKind = 'variant' | 'state' | 'severity' | 'child'

     export interface AxisGroupMetadata {
       variants: string[]
       states: string[]
       severities: string[]
       defaultVariant: string
       defaultState: string
       defaultSeverity: string
     }

     export interface LeafAxisMetadata {
       path: string[]
       groups: AxisGroupMetadata[]
     }

     export const DEFAULT_FALLBACK_ORDER: AxisKind[] = ['state', 'variant', 'severity']
     ```
  2. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/axis.model.spec.ts` with two tests: one asserting `DEFAULT_FALLBACK_ORDER` equals `['state', 'variant', 'severity']`, one asserting a `AxisKind[]` literal array containing all four kinds (`'variant'`, `'state'`, `'severity'`, `'child'`) has length 4.
  3. Run `npx nx test integration-interface --testPathPattern=axis.model.spec.ts` and confirm both tests pass.
- **Dependencies**: none.

### 3. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/theme-properties-v2.schema.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/theme-properties-v2.schema.ts`
- **Action**: create
- **Summary**: Implement `markAxis`/`getAxisMeta` marker helpers on top of Zod's `.meta()` API, and the top-level `ThemePropertiesV2Schema` with `primitives`, `usages`, `regionOverrides`, and `fallbackOrder` fields.
- **Concrete TODOs**:
  1. Import `z` from `zod` and `AxisKind` from `./axis.model`.
  2. Define an internal `AxisMarkerMeta` interface: `{ axisKind: AxisKind; axisName: string }`.
  3. Implement `export function markAxis<T extends z.ZodType>(schema: T, kind: AxisKind, name: string): T` returning `schema.meta({ axisKind: kind, axisName: name }) as T`.
  4. Implement `export function getAxisMeta(schema: z.ZodType): AxisMarkerMeta | undefined` that calls `schema.meta()`, returns `undefined` when the result is missing or its `axisKind`/`axisName` are not both strings, and otherwise returns the metadata object.
  5. Define `const AxisKindEnum = z.enum(['variant', 'state', 'severity', 'child'])`.
  6. Define `export const ThemePropertiesV2Schema = z.object({ primitives: z.record(z.string(), z.unknown()), usages: z.record(z.string(), z.unknown()), regionOverrides: z.record(z.string(), z.object({ primitives: z.record(z.string(), z.unknown()), usages: z.record(z.string(), z.unknown()) })).optional(), fallbackOrder: z.array(AxisKindEnum).optional() })`.
  7. Define `export type ThemePropertiesV2 = z.infer<typeof ThemePropertiesV2Schema>`.
  8. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/theme-properties-v2.schema.spec.ts` with tests covering: `markAxis`/`getAxisMeta` round trip, `getAxisMeta` returning `undefined` for an unmarked schema, marking preserving normal `.parse()` behavior, `ThemePropertiesV2Schema` accepting an explicit `fallbackOrder`, accepting a document without `fallbackOrder`, accepting a `regionOverrides` entry, and rejecting an invalid axis-kind string inside `fallbackOrder`.
  9. Run `npx nx test integration-interface --testPathPattern=theme-properties-v2.schema.spec.ts` and confirm all tests pass.
- **Dependencies**: Task 2 (`axis.model.ts`).

### 4. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/primitives.schema.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/primitives.schema.ts`
- **Action**: create
- **Summary**: Implement `colorPrimitiveSchema`, a single-axis-group primitive schema whose base combination (`defaultVariant.defaultState.defaultSeverity`) is guaranteed to resolve to a concrete value via Zod `.default(...)`.
- **Concrete TODOs**:
  1. Import `z` from `zod` and `markAxis` from `./theme-properties-v2.schema`.
  2. Define `baseSeveritySchema` as `markAxis(z.object({ background: z.string().default('#ffffff'), text: z.string().default('#000000') }), 'severity', 'defaultSeverity')`.
  3. Define `baseStateSchema` as `markAxis(z.object({ defaultSeverity: baseSeveritySchema }), 'state', 'defaultState')`.
  4. Define `export const colorPrimitiveSchema = markAxis(z.object({ defaultVariant: markAxis(z.object({ defaultState: baseStateSchema }), 'variant', 'defaultVariant') }), 'variant', 'defaultVariant')`.
  5. Define `export type ColorPrimitive = z.infer<typeof colorPrimitiveSchema>`.
  6. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/primitives.schema.spec.ts` with tests confirming `colorPrimitiveSchema.parse({})` fills `defaultVariant.defaultState.defaultSeverity.background` with `'#ffffff'` and `.text` with `'#000000'`, and that explicit values passed at that path override the defaults.
  7. Run `npx nx test integration-interface --testPathPattern=primitives.schema.spec.ts` and confirm all tests pass.
- **Dependencies**: Task 3 (`theme-properties-v2.schema.ts`, for `markAxis`).

### 5. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/input.schema.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/input.schema.ts`
- **Action**: create
- **Summary**: Implement `inputUsageSchema`, a single-axis-group usage schema with two variants (`outlined` default, `filled`), demonstrating sparse leaves where every combination is allowed to remain undefined.
- **Concrete TODOs**:
  1. Import `z` from `zod` and `markAxis` from `./theme-properties-v2.schema`.
  2. Define a helper `severityLeafSchema()` returning `z.object({ background: z.string().optional() })`.
  3. Define `outlinedVariantSchema` marked `'variant'`/`'outlined'`, containing `defaultState` (marked `'state'`/`'defaultState'`) with `defaultSeverity` (marked `'severity'`/`'defaultSeverity'`), and `hover` (marked `'state'`/`'hover'`) with both `defaultSeverity` and `success` (marked `'severity'`/`'success'`) severity leaves.
  4. Define `filledVariantSchema` marked `'variant'`/`'filled'`, containing only `defaultState` (marked `'state'`/`'defaultState'`) with `defaultSeverity` (marked `'severity'`/`'defaultSeverity'`).
  5. Define `export const inputUsageSchema = z.object({ outlined: outlinedVariantSchema.optional(), filled: filledVariantSchema.optional() })`.
  6. Define `export type InputUsage = z.infer<typeof inputUsageSchema>`.
  7. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/input.spec.ts` with tests confirming an empty object parses with every leaf `undefined`, that only `outlined.hover.success.background` can be set while `outlined.defaultState.defaultSeverity.background` stays `undefined`, and that `filled.defaultState.defaultSeverity.background` can be set independently.
  8. Run `npx nx test integration-interface --testPathPattern=input.spec.ts` and confirm all tests pass.
- **Dependencies**: Task 3 (`theme-properties-v2.schema.ts`, for `markAxis`).

### 6. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/button.schema.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/button.schema.ts`
- **Action**: create
- **Summary**: Implement `buttonUsageSchema`, a usage schema with two variants (`outlined` default, `text`) where the `outlined.defaultState.defaultSeverity` combination additionally holds a nested `child` axis group (`icon`) demonstrating a second, inner axis group.
- **Concrete TODOs**:
  1. Import `z` from `zod` and `markAxis` from `./theme-properties-v2.schema`.
  2. Define `iconChildSchema` marked `'child'`/`'icon'`, structured as one axis group with variant `defaultVariant`, state `defaultState`, severity `defaultSeverity`, holding `{ color: z.string().optional() }`.
  3. Define helper `severityLeafSchema()` returning `z.object({ background: z.string().optional() })` and `severityLeafWithIconSchema()` returning `z.object({ background: z.string().optional(), icon: iconChildSchema.optional() })`.
  4. Define `outlinedVariantSchema` marked `'variant'`/`'outlined'`, containing `defaultState` (marked `'state'`/`'defaultState'`) whose `defaultSeverity` leaf uses `severityLeafWithIconSchema()` and whose `success` leaf uses `severityLeafSchema()`, and `hover` (marked `'state'`/`'hover'`) with `defaultSeverity` and `success` leaves both using `severityLeafSchema()`.
  5. Define `textVariantSchema` marked `'variant'`/`'text'`, containing only `defaultState` (marked `'state'`/`'defaultState'`) with `defaultSeverity` (marked `'severity'`/`'defaultSeverity'`) using `severityLeafSchema()`.
  6. Define `export const buttonUsageSchema = z.object({ outlined: outlinedVariantSchema.optional(), text: textVariantSchema.optional() })`.
  7. Define `export type ButtonUsage = z.infer<typeof buttonUsageSchema>`.
  8. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/button.spec.ts` with tests confirming an empty object parses successfully, `outlined.hover.success.background` can be set, the nested `icon` child's `color` can be set under `outlined.defaultState.defaultSeverity.icon.defaultVariant.defaultState.defaultSeverity.color`, and `text.defaultState.defaultSeverity.background` can be set independently of any icon child.
  9. Run `npx nx test integration-interface --testPathPattern=button.spec.ts` and confirm all tests pass.
- **Dependencies**: Task 3 (`theme-properties-v2.schema.ts`, for `markAxis`).

### 7. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/metadata.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/metadata.ts`
- **Action**: create
- **Summary**: Implement `deriveLeafAxisMetadata`, the schema-introspection function that walks a marked-up Zod schema tree and produces one `LeafAxisMetadata` entry per terminal token field, and `getBaseComboPath`, a small helper returning an axis group's base-combination path segments.
- **Concrete TODOs**:
  1. Import `z` from `zod`, `AxisGroupMetadata` and `LeafAxisMetadata` from `./axis.model`, and `getAxisMeta` from `./theme-properties-v2.schema`.
  2. Implement an internal `unwrap(schema: z.ZodType): z.ZodType` that repeatedly calls `.unwrap()` while the schema is a `z.ZodOptional`, `z.ZodDefault`, or `z.ZodNullable`, returning the innermost schema.
  3. Implement an internal `shapeOf(schema: z.ZodType): z.ZodRawShape` returning `(unwrap(schema) as z.ZodObject<z.ZodRawShape>).shape`.
  4. Implement an internal `GroupBuilder` interface `{ variants: Set<string>; states: Set<string>; severities: Set<string> }`, a `newGroupBuilder()` factory, a `recordAxisName(builder, kind, name)` function that adds `name` to the matching set for `kind` in `{'variant','state','severity'}`, and a `finalizeGroup(builder): AxisGroupMetadata` function that converts the three sets to arrays and sets `defaultVariant`/`defaultState`/`defaultSeverity` to the literal name `'defaultVariant'`/`'defaultState'`/`'defaultSeverity'` when present in the corresponding set, else the first array element.
  5. Implement `export function deriveLeafAxisMetadata(schema: z.ZodType): LeafAxisMetadata[]` using a nested recursive `walk(node, path, closedGroups, openGroup)` function: at each object node, partition `Object.entries(shapeOf(node))` into `axisEntries` (children whose `getAxisMeta(unwrap(child))` is defined) and `dataEntries` (children whose `getAxisMeta(unwrap(child))` is `undefined`). First pass over `axisEntries`: for each entry marked `'child'`, close the current `openGroup` into `closedGroups` (only if it has recorded any axis name) and recurse with a fresh `openGroup`; for each entry marked `'variant'`/`'state'`/`'severity'`, call `recordAxisName` on `openGroup`. Second pass over `axisEntries`: for each non-`'child'` entry, recurse (`walk`) into that child with the same `closedGroups`/`openGroup`, appending the key to `path`. For each `dataEntries` entry, push one `LeafAxisMetadata` onto the results array with `path` set to the full path including that key and `groups` set to `closedGroups` plus the finalized `openGroup` (only when `openGroup` has recorded any axis name).
  6. Implement `export function getBaseComboPath(group: AxisGroupMetadata): string[]` returning `[group.defaultVariant, group.defaultState, group.defaultSeverity]`.
  7. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/metadata.spec.ts` importing `inputUsageSchema` from `./input.schema`, `buttonUsageSchema` from `./button.schema`, and `colorPrimitiveSchema` from `./primitives.schema`. Add tests confirming: `deriveLeafAxisMetadata(inputUsageSchema)` returns exactly one leaf (`background`) whose single group lists variants `['filled','outlined']` sorted, states `['defaultState','hover']` sorted, severities `['defaultSeverity','success']` sorted, and defaults `outlined`/`defaultState`/`defaultSeverity`; `deriveLeafAxisMetadata(colorPrimitiveSchema)` returns two leaves (`background`, `text`) each with one group whose defaults are all literally `'defaultVariant'`/`'defaultState'`/`'defaultSeverity'`, and `getBaseComboPath` on that group returns `['defaultVariant','defaultState','defaultSeverity']`; `deriveLeafAxisMetadata(buttonUsageSchema)` produces a `color` leaf with exactly two groups, the outer group's variants sorted equal to `['outlined','text']` and the inner group's defaults equal to `'defaultVariant'`/`'defaultState'`/`'defaultSeverity'`; the sibling `background` leaf under `outlined` has exactly one group (no inner child group attached).
  8. Run `npx nx test integration-interface --testPathPattern=metadata.spec.ts` and confirm all tests pass.
- **Dependencies**: Task 2 (`axis.model.ts`), Task 3 (`theme-properties-v2.schema.ts`), Task 4, Task 5, Task 6 (example schemas used as test fixtures).

### 8. `libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.ts`

- **Path**: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.ts`
- **Action**: create
- **Summary**: Implement the CSS variable naming function, the single-axis-group parent-combination relaxation function, the cross-group innermost-first relaxation function, and the two chain-construction functions (`buildFallbackChain` for one leaf, `buildFallbackChainForLeaves` merging many leaves with collision detection).
- **Concrete TODOs**:
  1. Import `AxisGroupMetadata`, `AxisKind`, `DEFAULT_FALLBACK_ORDER`, `LeafAxisMetadata` from `./axis.model`.
  2. Define `export interface Combo { variant: string; state: string; severity: string }`.
  3. Implement `export function cssVariableName(prefix: string, path: string[]): string` returning `` `--${prefix}-${path.join('-')}` ``.
  4. Implement `export function cartesianCombos(group: AxisGroupMetadata): Combo[]` iterating `variants` outermost, then `states`, then `severities` innermost, pushing one `Combo` per triple.
  5. Implement an internal `defaultOf(group, axis)` returning `group.defaultVariant`/`group.defaultState`/`group.defaultSeverity` per `axis`.
  6. Implement `export function parentCombo(combo: Combo, group: AxisGroupMetadata, relaxOrder: AxisKind[]): Combo | undefined` scanning `relaxOrder`, skipping the `'child'` entry if present, and for the first axis whose `combo[axis]` differs from `defaultOf(group, axis)`, returning `{ ...combo, [axis]: defaultOf(group, axis) }`; returning `undefined` when no axis differs.
  7. Implement `export function parentOfFullCombo(groups: AxisGroupMetadata[], combos: Combo[], relaxOrder: AxisKind[]): Combo[] | undefined` scanning group index from `groups.length - 1` down to `0`; for the first index `g` where `parentCombo(combos[g], groups[g], relaxOrder)` is defined, return `combos` with index `g` replaced by that parent; return `undefined` when no group has a defined parent.
  8. Implement `export function comboPathSegment(combo: Combo): string[]` returning `[combo.variant, combo.state, combo.severity]`.
  9. Implement an internal `fullCombosCartesian(groups: AxisGroupMetadata[]): Combo[][]` computing the cartesian product across all groups' `cartesianCombos(group)` results using an accumulating `result: Combo[][]` starting as `[[]]`.
  10. Implement an internal `pathFor(fullCombo: Combo[], leafFieldName: string): string[]` concatenating `comboPathSegment` for every combo in `fullCombo`, in group order, followed by `leafFieldName`.
  11. Implement `export function buildFallbackChain(leaf: LeafAxisMetadata, realValues: Map<string, string>, cssPrefix: string, fallbackOrder: AxisKind[] = DEFAULT_FALLBACK_ORDER): Map<string, string>`. For each full combo from `fullCombosCartesian(leaf.groups)`: compute `path = pathFor(fullCombo, leaf.path[leaf.path.length - 1])` and `varName = cssVariableName(cssPrefix, path)`; when `realValues.get(varName)` is defined, set `result.set(varName, realValues.get(varName))`; otherwise compute `parent = parentOfFullCombo(leaf.groups, fullCombo, fallbackOrder)`; when `parent` is defined, set `result.set(varName, \`var(${cssVariableName(cssPrefix, pathFor(parent, leaf.path[leaf.path.length - 1]))})\`)`; when `parent` is `undefined`, add no entry.
  12. Implement `export function buildFallbackChainForLeaves(leaves: LeafAxisMetadata[], realValues: Map<string, string>, cssPrefix: string, fallbackOrder: AxisKind[] = DEFAULT_FALLBACK_ORDER): Map<string, string>` calling `buildFallbackChain` per leaf and merging into one `Map`, throwing `new Error(\`Fallback chain collision for CSS variable "${key}"\`)` when two leaves produce different values for the same key.
  13. Create `libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.spec.ts` importing `deriveLeafAxisMetadata` from `./metadata`, `inputUsageSchema` from `./input.schema`, `buttonUsageSchema` from `./button.schema`. Add tests confirming: `cssVariableName('onecx-theme-input', ['outlined','hover','success','background'])` equals `'--onecx-theme-input-outlined-hover-success-background'`; for the `input` schema's single `background` leaf, a real value at `outlined.hover.success` is used directly; with no real values, `outlined.hover.defaultSeverity.background` resolves to `var(--onecx-theme-input-outlined-defaultState-defaultSeverity-background)` under the default fallback order; the fully-relaxed base combination `outlined.defaultState.defaultSeverity.background` produces no map entry when it has no real value; passing `['variant','state','severity']` explicitly causes `filled.defaultState.defaultSeverity.background` to resolve to `var(--onecx-theme-input-outlined-defaultState-defaultSeverity-background)`; omitting `fallbackOrder` produces an identical map to passing `['state','variant','severity']` explicitly; for the `button` schema's nested `color` leaf, the fully-relaxed combination across both groups produces no map entry when it has no real value, and no computed value ever references the `text` variant since `outlined` and `text` are sibling variants, not fallback targets of each other; `buildFallbackChainForLeaves` merges multiple leaves into one non-empty map; a fabricated collision scenario (two computed chains disagreeing on the same key) throws an `Error` whose message matches `/collision/`.
  14. Run `npx nx test integration-interface --testPathPattern=fallback-chain.spec.ts` and confirm all tests pass.
  15. Run `npx nx test integration-interface --coverage --no-interactive` and confirm 100% statement, branch, function, and line coverage for every file created under `libs/integration-interface/src/lib/topics/current-theme/v1/schema/`.
- **Dependencies**: Task 2 (`axis.model.ts`), Task 7 (`metadata.ts`, for the test fixtures' leaf metadata), Task 5, Task 6 (example schemas used as test fixtures).

### 9. `libs/integration-interface/src/index.ts`

- **Path**: `libs/integration-interface/src/index.ts`
- **Action**: modify
- **Summary**: Export every new public module from the library's existing barrel file so consumers import via `@onecx/integration-interface`.
- **Concrete TODOs**:
  1. Open `libs/integration-interface/src/index.ts` and locate the existing line `export * from './lib/topics/current-theme/v1/theme-override.model'`.
  2. Immediately after that line, add:
     ```typescript
     export * from './lib/topics/current-theme/v1/schema/axis.model'
     export * from './lib/topics/current-theme/v1/schema/theme-properties-v2.schema'
     export * from './lib/topics/current-theme/v1/schema/metadata'
     export * from './lib/topics/current-theme/v1/schema/fallback-chain'
     export * from './lib/topics/current-theme/v1/schema/primitives.schema'
     export * from './lib/topics/current-theme/v1/schema/input.schema'
     export * from './lib/topics/current-theme/v1/schema/button.schema'
     ```
  3. Run `npx nx build integration-interface` and confirm the build succeeds with no TypeScript errors.
  4. Run `npx nx test integration-interface --no-interactive` and confirm every test (existing and new) passes.
  5. Run `npx nx lint integration-interface` and confirm no lint errors, including the `@nx/dependency-checks` rule (satisfied by Task 1's addition of `zod` to `libs/integration-interface/package.json`).
- **Dependencies**: Task 2 through Task 8 (every module being exported must exist first).

### 10. `dev-docs/theming/fallback-mechanism.adoc`

- **Path**: `dev-docs/theming/fallback-mechanism.adoc`
- **Action**: create (new file inside the existing, real directory `dev-docs/theming/`)
- **Summary**: Document the fallback mechanism's overview, `fallbackOrder` semantics, axis markers, metadata generation, chain materialization, nested axis groups, and `regionOverrides` reuse, for engineers integrating this library's exports into a `ThemeApplyService`.
- **Concrete TODOs**:
  1. Create the file with an AsciiDoc `= Theming V2 Fallback Mechanism` title and section headers `Overview`, `fallbackOrder`, `Axis Markers`, `Metadata Generation`, `Chain Materialization`, `Nested Axis Groups`, `regionOverrides`.
  2. In `Overview`, state that every token's CSS custom property resolves to either the tenant's explicit value or a `var(--fallback-combo)` reference, resolved natively by the browser, with no runtime resolution function at the point of consumption.
  3. In `fallbackOrder`, state the default order `['state', 'variant', 'severity']` and that a theme document may override it via `ThemePropertiesV2.fallbackOrder`.
  4. In `Axis Markers`, document `markAxis(schema, kind, name)` and the four `AxisKind` values, exported from `@onecx/integration-interface`.
  5. In `Metadata Generation`, document `deriveLeafAxisMetadata(schema)`, its `LeafAxisMetadata[]` return shape, and that its output is tenant-independent static build output, exported from `@onecx/integration-interface`.
  6. In `Chain Materialization`, document `buildFallbackChainForLeaves(leaves, realValues, cssPrefix, fallbackOrder)`, its four parameters, and that its returned `Map<string, string>` is applied through an inline `setProperty` loop with no second CSS delivery mechanism, exported from `@onecx/integration-interface`.
  7. In `Nested Axis Groups`, state that a token's path may cross multiple axis groups and that each group relaxes independently, innermost group first, using the same `fallbackOrder`.
  8. In `regionOverrides`, state that `ThemePropertiesV2.regionOverrides` reuses the identical `primitives`/`usages` shape per region and that `buildFallbackChainForLeaves` is invoked once per region using that region's merged data.
- **Dependencies**: Task 3 (schema field names referenced), Task 7, Task 8 (function names and signatures referenced).

### 11. `dev-docs/theming/concept.adoc`

- **Path**: `dev-docs/theming/concept.adoc`
- **Action**: modify
- **Summary**: Add a cross-reference from the existing theming concept overview to the new fallback-mechanism documentation page.
- **Concrete TODOs**:
  1. Open `dev-docs/theming/concept.adoc` and locate the paragraph ending "...the link:../../libs/portal-layout-styles/src/styles/shell/theme_defaults.scss[theme defaults stylesheet], which is imported by the Shell's global stylesheet."
  2. Immediately after that paragraph, add a new subsection:
     ```asciidoc

     [#fallback-mechanism]
     === CSS-Based Fallback Mechanism (Theming V2)

     For Theming V2 tokens, undefined variant/state/severity combinations resolve via a native CSS `var()` fallback chain rather than requiring every combination to be hand-authored. See link:fallback-mechanism.adoc[Theming V2 Fallback Mechanism] for details.
     ```
- **Dependencies**: Task 10 (the linked file must exist).

## Verification Steps

1. Run `npx nx test integration-interface --no-interactive` and confirm every test passes, including all new spec files listed in the tasks above.
2. Run `npx nx test integration-interface --coverage --no-interactive` and confirm 100% statement, branch, function, and line coverage for `axis.model.ts`, `theme-properties-v2.schema.ts`, `primitives.schema.ts`, `input.schema.ts`, `button.schema.ts`, `metadata.ts`, and `fallback-chain.ts`.
3. Run `npx nx lint integration-interface` and confirm zero lint errors.
4. Run `npx nx build integration-interface` and confirm the library builds successfully with the new exports and the `zod` dependency resolved.
5. Run `git diff main --stat` and confirm the changed-file list matches exactly the eleven files listed in the File-Level Task List section above.

## Notes

`onecx-shell-ui` and its `ThemeApplyService` are hosted in a separate repository not present in this checkout. This plan delivers `buildFallbackChain` and `buildFallbackChainForLeaves` as pure, exported functions from `@onecx/integration-interface` so that separate repository's `ThemeApplyService` calls them directly.

`regionOverrides` reuses the identical `primitives`/`usages` shape modeled in `ThemePropertiesV2Schema` (Task 3); a consumer invokes `buildFallbackChainForLeaves` once per region using that region's merged `primitives`/`usages` data, as documented in Task 10.

Every file path referenced in the File-Level Task List above is either a confirmed-existing repository path (`libs/integration-interface/package.json`, `libs/integration-interface/src/index.ts`, `dev-docs/theming/concept.adoc`, and the existing parent directories `libs/integration-interface/src/lib/topics/current-theme/v1/` and `dev-docs/theming/`) or a new file created inside one of those confirmed-existing parent directories.
