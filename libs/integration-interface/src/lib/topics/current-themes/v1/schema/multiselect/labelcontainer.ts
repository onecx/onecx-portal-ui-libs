/**
 * Multiselect label container schema: the input-style box showing the placeholder/selected
 * chips, the clear icon, and the dropdown trigger icon.
 * Own axis: defaultState/hover/focus/invalid/disabled. `font`/`sm`/`lg`, plus the static
 * sub-fields of `border` (width/offset/radius) and `dropdownIcon`/`clearIcon` (size/paddingX/
 * paddingY), only live on `defaultState`; named states only carry the tokens that actually
 * differ (background/placeholderColor/border.color+style/dropdownIcon.color/clearIcon.color).
 * `chip` is a flat child (dependency: nothing) reused by display='chip' mode.
 */
// TODO: use schema from input component when available
import { border, color, font, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import * as z from 'zod'
import { multiselectChipDefaults, multiselectChipShape } from './chip'

const multiselectLabelContainerSizeShape = z.object({
  padding: withRef(z.string()).optional(),
  font: font.pick({ size: true }).optional(),
})

const multiselectLabelContainerStateShape = z
  .object({
    background: withRef(z.string()).optional(),
    placeholderColor: color.optional(),
    border: border.optional(),
    dropdownIcon: icon.optional(),
    clearIcon: icon.optional(),
    font: font.pick({ weight: true, size: true, style: true }).optional(),
    sm: multiselectLabelContainerSizeShape.optional(),
    lg: multiselectLabelContainerSizeShape.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectLabelContainerStateShape' })

export const multiselectLabelContainerShape = z
  .object({
    chip: multiselectChipShape.prefault({}),
    defaultState: multiselectLabelContainerStateShape.prefault({}),
    hover: multiselectLabelContainerStateShape.prefault({}),
    focus: multiselectLabelContainerStateShape.prefault({}),
    invalid: multiselectLabelContainerStateShape.prefault({}),
    disabled: multiselectLabelContainerStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectLabelContainerShape', axis: 'state' })

const stateTokens = (state: 'defaultState' | 'hover' | 'focus' | 'invalid' | 'disabled') => {
  const ref = state === 'defaultState' ? 'defaultState' : `state.${state}`
  return {
    background: `{{primitives.defaultVariant.${ref}.defaultSeverity.bg}}`,
    placeholderColor: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    border: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.border.color}}`,
      style: `{{primitives.defaultVariant.${ref}.defaultSeverity.border.style}}`,
    },
    dropdownIcon: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    },
    clearIcon: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    },
  }
}

export const multiselectLabelContainerDefaults = {
  chip: multiselectChipDefaults,
  defaultState: {
    ...stateTokens('defaultState'),
    border: {
      ...stateTokens('defaultState').border,
      width: '{{primitives.border.width.md}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    },
    dropdownIcon: {
      ...stateTokens('defaultState').dropdownIcon,
      size: '{{primitives.icon.size.sm}}',
      paddingX: '{{primitives.space.sm}}',
      paddingY: '{{primitives.space.sm}}',
    },
    clearIcon: {
      ...stateTokens('defaultState').clearIcon,
      size: '{{primitives.icon.size.sm}}',
      paddingX: '{{primitives.space.sm}}',
      paddingY: '{{primitives.space.sm}}',
    },
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
      style: '{{primitives.font.style}}',
    },
    sm: {
      padding: '{{primitives.space.sm}}',
      font: { size: '{{primitives.font.size.sm}}' },
    },
    lg: {
      padding: '{{primitives.space.lg}}',
      font: { size: '{{primitives.font.size.lg}}' },
    },
  },
  // Named states only carry the tokens that actually differ — static sizing (border
  // width/offset/radius, icon size/paddingX/paddingY) only lives on `defaultState`.
  hover: stateTokens('hover'),
  focus: stateTokens('focus'),
  invalid: stateTokens('invalid'),
  disabled: stateTokens('disabled'),
}

/**
 * `labelContainer`'s own defaults for the `filled` variant (see `./multiselect.ts`): only the
 * tokens that actually change between outlined (`defaultVariant`) and filled are populated here
 * (background/placeholder/icon colors referencing `primitives.variant.primary...` instead of
 * `primitives.defaultVariant...`); `border`/`font`/`sm`/`lg`/icon size+padding never differ
 * between the two variants and fall back to `defaultVariant` entirely (for every state,
 * including `defaultState`).
 */
export const multiselectLabelContainerFilledStateDefaults = (
  state: 'defaultState' | 'hover' | 'focus' | 'invalid' | 'disabled'
) => {
  const ref = state === 'defaultState' ? 'defaultState' : `state.${state}`
  return {
    background: `{{primitives.variant.primary.${ref}.defaultSeverity.bg}}`,
    placeholderColor: `{{primitives.variant.primary.${ref}.defaultSeverity.contrast}}`,
    dropdownIcon: {
      color: `{{primitives.variant.primary.${ref}.defaultSeverity.contrast}}`,
    },
    clearIcon: {
      color: `{{primitives.variant.primary.${ref}.defaultSeverity.contrast}}`,
    },
  }
}
