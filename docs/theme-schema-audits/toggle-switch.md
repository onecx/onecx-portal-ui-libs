# ToggleSwitch theme schema audit

## Confirmed schema structure

- **ToggleSwitch** — visual aggregator. Canonical variants: `defaultVariant` and `checked`; no named color variants (`primary`, `secondary`, `tertiary`, `quaternary`, `quinary`) are modeled because the usage mapper does not consume them. Relevant parent states are `defaultState`, `hover`, `disabled`, and `invalid`.
  - **Slider** — specific child; depends on the ToggleSwitch parent at `state` level. Owns track geometry, border, background, shadow, spacing, transitions, slide duration, and focus ring. Slider itself has no named variants or states, so those tokens are flat in its schema; checked and interaction-specific values are represented by the containing ToggleSwitch variant/state context.
    - **Handle** — specific child with no own variants or states. Owns knob geometry, background, and optional template-content color. Only its background differs under the ToggleSwitch disabled state; all other contexts inherit the baseline.
- The hidden native checkbox is not modeled as a themeable child; it is an accessibility/control element. The optional handle template is content inside Handle, not a separate built-in visual box.
- Settings contain `autoload`, defaulting to `false`, as explicitly requested. It is schema configuration and is not mapped to a PrimeNG design token.

## Structural gap list and resolutions

| Gap in previous schema | Resolution |
| --- | --- |
| Track tokens were attached directly to ToggleSwitch; Handle was a direct sibling. | Added Slider as the visual child and nested Handle under Slider. |
| The schema used `variant.checked` and `state` grouping objects rather than the agreed default/named variant and flat state siblings. | Modeled `defaultVariant` and `checked`, with `defaultState`, `hover`, `disabled`, and `invalid` siblings. |
| Slider and Handle were not represented as independent schema nodes with the confirmed parent dependencies. | Added component-specific Slider and Handle modules. Slider is flat because it declares no variants/states; parent ToggleSwitch variant/state contexts carry token differences. |
| Color/border/focus ring shapes were ad hoc or used outdated primitive paths. | Reused `bg`, `color`, `border`, `borderWithShadow`, and `withRef`; corrected primitive references. |
| Zod leaf defaults were embedded into schema definitions. | Split optional shapes from defaults and apply the defaults tree with `applyDefaultsRecursive`. |
| Settings was empty. | Added `settings.autoload` with default `false`. |
| Existing mapper and CSS-rule paths targeted the former tree. | Repointed ToggleSwitch mapping and CSS-rule paths to the new Slider/Handle schema. |

## Default-value decisions

| Node / path | Default decision |
| --- | --- |
| Settings `autoload` | `false` |
| Slider unchecked baseline | Width `2.5rem`; height `1.5rem`; radius `{{primitives.radius.full}}`; border width `{{primitives.border.width.md}}`; border style/color from surface baseline; gap `{{primitives.layout.gap}}`; shadow `{{primitives.shadow.sm}}`; transition and slide duration `{{primitives.transition.duration}}`; focus ring from the global focus-ring primitives. |
| Slider unchecked hover | Background and border color from `primitives.area.surface.state.hover.defaultSeverity`. |
| Slider disabled | Background from `primitives.area.surface.state.disabled.defaultSeverity.bg`. |
| Slider invalid | Border color from `primitives.defaultVariant.state.invalid.defaultSeverity.border.color`. |
| Slider checked baseline | Background and border color from `primitives.variant.primary.defaultState.defaultSeverity`. |
| Slider checked hover | Background and border color from `primitives.variant.primary.state.hover.defaultSeverity`. |
| Handle baseline | Full radius; size/width/height `1.25rem`; background from `primitives.area.surface.defaultState.defaultSeverity.contrast`. Optional template-content color remains unset. |
| Handle disabled | Defined at `defaultVariant.disabled.slider.handle.background`, using `primitives.area.surface.state.disabled.defaultSeverity.contrast`. |
| Handle checked and hover | Handle has no own variants/states and no separate mapping entries; it uses its baseline tokens. |

## Changes applied

- Replaced the legacy single-file schema with a compatibility re-export and a directory-based ToggleSwitch schema, Slider schema, and Handle schema.
- Added the requested `settings.autoload` default.
- Updated ToggleSwitch mapping rules and custom CSS rules to read the new nested token paths.
- Removed redundant Handle hover/checked mapping rules; Handle now maps its baseline background/color once, with a separate disabled-background mapping only.
- During structural implementation, test/spec files were initially left unchanged; Step 10 then added the top-level test and snapshot below.

## Testing

- Added the single top-level component spec at `schema/toggleswitch/toggleswitch.spec.ts` with the required three tests and full `parse({})` snapshot at `schema/toggleswitch/__snapshots__/toggleswitch.spec.ts.snap`.
- No legacy ToggleSwitch spec was present to remove. The ToggleSwitch spec passes: 3 tests, 1 snapshot.
- The integration-interface build passed. The angular-utils build reached its package build but failed on unrelated table usage-settings typing errors (`ThemeUsageSettings<'table'>` / `ThemeUsageNameWithSettings`); these errors do not reference ToggleSwitch.
