# Dataview Theme Schema Audit

## Canonical Primitive Levels

- Variants: `defaultVariant`, `primary`, `secondary`, `tertiary`, `quaternary`, `quinary`
- States: `defaultState`, `hover`, `active`, `selected`, `focus`, `invalid`, `disabled`
- Severities: `defaultSeverity`, `success`, `info`, `warning`, `danger`, `contrast`

Only `defaultVariant` is required. No named dataview variants were confirmed.

## Confirmed Structure

All child dependencies are `nothing`; dataview has no variant/state/severity hierarchy.

```text
dataview
|- Root tokens: paddingX, paddingY, gap, background, color, border
|- settings: paginator and page-display configuration
|- header: background, color, border, paddingX, paddingY, gap
|  |- paginator: specific
|  |  |- button: specific, shared by first/previous/next/last
|  |  `- dropdown: generic, Option 2, independent minimal shape
|- content: background, color, border, paddingX, paddingY, gap
`- footer: background, color, border, paddingX, paddingY, gap
   |- paginator: same shared structure as header paginator
   |  |- button: specific
   |  `- dropdown: generic, Option 2
```

`dataListGrid` and `dataTable` are not children of standalone `dataview`; they are OneCX children of the separate `dataView` composition.

## Gap List

- Paginator button and dropdown children were missing from both header and footer paginator schemas.
- Paginator, header, content, footer, settings, and root dataview schemas used legacy direct Zod defaults instead of shape/default separation.
- No standalone generic paginator button usage exists; the button is specific.
- A generic dropdown usage exists, but the paginator uses an independent minimal Option 2 shape.

## Default Values

Existing root, header, content, footer, and paginator baseline references were retained. New paginator controls receive explicit defaults for their visible baseline and interaction states:

- paginator buttons: border, focus ring, icon, hover, focus, disabled
- paginator dropdown: background, color, border, focus ring, width, hover, focus, disabled

The same paginator shape/default contract is reused by header and footer. No named variants were added.

## Changes Applied

- Added shared `paginator-button` shape/defaults.
- Added independent minimal `paginator-dropdown` shape/defaults.
- Composed both children into `paginator`.
- Refactored `paginator`, `header`, `content`, `footer`, `settings`, and `dataview` to shape/default separation.
- Kept `dataListGrid` and `dataTable` outside standalone `dataview`.
- Replaced the legacy dataview spec with one top-level parse/snapshot/parity spec.

## Testing

The legacy facade spec was replaced by `schema/dataview/dataview.spec.ts` with exactly three tests. A full parse snapshot was generated at `schema/dataview/__snapshots__/dataview.spec.ts.snap`. The focused spec and integration-interface lint pass; the full integration-interface suite is the final validation target.
