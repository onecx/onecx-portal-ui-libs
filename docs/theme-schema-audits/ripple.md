# Ripple Theme Schema Audit

## Structure

Ripple is a PrimeNG **directive** (`[pRipple]`), not a container component. Applied to a host
element it appends a single `.p-ink` element — a circle that scales up and fades out on mousedown.
The host element is owned by the parent component's own schema, so the only themable element the
directive renders is the ink circle.

- `ripple` (root — aggregator, no variant/state/severity of its own; flat tokens at the root)
  - `ink`: dependency `nothing`; specific; `background`, `opacity`
  - `settings`: behavioral directive options (sibling of `ink`, no visual box); `disabled`,
    `unbounded`, `centered`, `radius` — kept with its own literal defaults (legacy pattern, same
    as `tooltip.settings`).

The `ink` node sits at the root (dependency `nothing`) alongside `settings`. `opacity` is the base
opacity of the ink before it fades to 0 via the keyframe. (The scale factor it animates to is
PrimeNG's internal `@keyframes ripple` target — `2.5` — which has no PrimeNG preset token and
cannot be expressed by the current `CssRule` model, so it was intentionally **not** made themable.)

## Gap Analysis And Changes

The legacy `ripple.ts` modelled `background` as a flat root token (inline `.default()`) with no `ink`
node and no `opacity`/`scale`. Confirmed structure moves the visual tokens under an `ink` node and
adopts the shape/defaults separation.

- Added an `ink` node (`usages.ripple.ink`) to model the `.p-ink` element.
- Moved `background` from the root to `usages.ripple.ink.background`.
- Added an `ink.opacity` token (`withRef(z.number())`). An `ink.scale` token was considered and
  **dropped**: it is only reachable inside PrimeNG's `@keyframes ripple`, which the declarative
  `CssRule`/`buildCss` model (flat `selector { prop: value }` blocks) cannot express, so it was
  left out of the schema rather than shipped unmappable.
- Split `ripple.ts` into `rippleShape` + `rippleDefaults` + `applyDefaultsRecursive` (house pattern),
  replacing the inline `.default()` form. `rippleSettings` is unchanged and retains its own defaults.
- Updated the mapper rule `from` path from `usages.ripple.background` to
  `usages.ripple.ink.background` (`ripple.rules.ts`) so the token resolves.
- Pointed the `UsagesInput.ripple` **type** reference in `current-themes.schema.ts` at the new
  `rippleShape` (matching every other restructured component). This was required because
  `applyDefaultsRecursive` returns a loose `z.ZodObject<Record<string, z.ZodTypeAny>>` whose type
  erases the named keys — leaving the type pointed at the applied `ripple` collapsed `LeafPaths`
  and broke the mapper path type-check. The runtime `usages` value (line ~100) still uses the
  applied `ripple`.
- Moved the schema into a `schema/ripple/` folder to match the other components:
  - `schema/ripple/ripple.ts` — the shape + defaults + applied schema (was `schema/ripple.ts`),
    named after the component (same pattern as `calendar/calendar.ts` / `panelmenu/panelmenu.ts`).
  - `schema/ripple.ts` — thin facade re-exporting `ripple`, `rippleDefaults`, `rippleShape`
    from `./ripple/ripple` (same pattern as `calendar.ts` / `panelmenu.ts`), so existing
    `import … from './schema/ripple'` consumers are unchanged.
  - `schema/ripple/ripple.spec.ts` + `schema/ripple/__snapshots__/ripple.spec.ts.snap` — spec and
    snapshot relocated into the folder (snapshot moved with the spec; content unchanged).

## Default Values

No variant/state/severity on ripple, so the mandatory baseline is the `ink` node itself:

| Path | Default | Rationale |
| --- | --- | --- |
| `ink.background` | `{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}` | existing value, now under `ink` |
| `ink.opacity` | `1` | base opacity (visible) before fading to 0 via the keyframe; no primitive ref, literal |

## Mapping

| Theme path | Mechanism | Destination |
| --- | --- | --- |
| `ink.background` | `MappingRule` → PrimeNG preset | `components.ripple.colorScheme.{mode}.root.background` (`toColorString`); PrimeNG's `dt('ripple.background')` consumes it on `.p-ink` |
| `ink.opacity` | `CssRule` (no preset token) | `.p-ink { opacity: var(--onecx-theme-…-ink-opacity); }` in `css-rules/usages/ripple.rules.ts`, spread into `usageCssRules` |
| `ink.scale` | — (dropped) | Not themable; only reachable inside PrimeNG's `@keyframes ripple`, unexpressible by the `CssRule` model |

`background` resolves through the preset as before; `opacity` flows through the companion CSS
because PrimeNG's `.p-ink` declares no base opacity (it defaults to `1` and the `@keyframes ripple`
animation fades it to `0`). The `from` path is a valid `ThemePath`, so both rules type-check.

## Testing

- The legacy `ripple.spec.ts` (exact-object / `expectExactTokens` assertions) was **replaced** with
  the three top-level schema tests: empty-object parsing, a full `parse({})` snapshot, and
  shape/default parity (`expectDefaultsMatchShape(ripple, rippleDefaults)`). No per-subcomponent
  spec files were added (single-file component).
- The snapshot (`__snapshots__/ripple.spec.ts.snap`) was generated by the test runner, not
  hand-edited. It resolves to `ink: { background, opacity: 1 }` (`settings` stays
  optional and is absent from the parsed output).
- `npx nx test integration-interface` passes (411 tests, 13 snapshots). The primeng theme entry
  point (`tsc --noEmit -p …/primeng/tsconfig.lib.json`) type-checks the `usages.ripple.ink.background`
  `MappingRule` and the new `usages.ripple.ink.opacity` `CssRule` `from` path cleanly; the only
  remaining `tsc` errors in that build are 3 pre-existing `table`-mapper errors unrelated to this
  audit.
