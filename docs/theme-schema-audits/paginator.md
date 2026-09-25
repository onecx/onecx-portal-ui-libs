# Paginator Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only a flat standalone usage was confirmed for `paginator`; no named variants or severities were added.

## Confirmed Structure

```text
paginator
|- paddingX, paddingY
|- button: independent minimal token set
|  |- border.radius
|  |- background
|  |- hover.background
|  `- active.background
`- input: independent minimal token set
   |- border
   `- icon.color
```

The paginator slider remains generic and is not modeled as a paginator child. Dataview header/footer paginator nodes keep only `paddingX` and `paddingY`; they do not import or extend the standalone paginator usage.

## Gap List

- No standalone top-level `usages.paginator` key existed.
- Dataview header/footer previously imported a full paginator-like child shape, which caused all paginator-related children to appear in the dataview snapshot.
- Dataview paginator snapshots were reduced further so embedded dataview paginators contain only `paddingX` and `paddingY`.
- The standalone paginator and dataview-local paginator nodes both needed only the minimal reusable button/input/padding fields requested.

## Default Values

- `paddingX` and `paddingY` default to `{{primitives.space.sm}}`.
- Button baseline radius/background and hover/active background defaults point at corresponding default variant state tokens.
- Input border defaults to baseline primitive border values; input icon color uses baseline contrast.

## Changes Applied

- Added `schema/paginator/paginator.ts` with `paddingX`, `paddingY`, minimal `button`, and minimal `input` tokens, plus a top-level `schema/paginator.ts` facade.
- Registered `paginator` as a top-level usage.
- Did not add a `slider` child.
- Replaced dataview header/footer paginator imports with a dataview-local padding-only shape/default tree.

## Testing

Added `schema/paginator/paginator.spec.ts` and generated `schema/paginator/__snapshots__/paginator.spec.ts.snap`. Test/spec files were intentionally added after the structural implementation, in Step 10.

`nx test integration-interface --no-interactive --updateSnapshot` passes: 38 suites, 450 tests, 11 snapshots.