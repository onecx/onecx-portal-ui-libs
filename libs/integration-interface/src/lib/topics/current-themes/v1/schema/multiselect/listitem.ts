/**
 * Single selectable item in the list of the multiselect overlay.
 * `paddingX`/`paddingY`/`gap`/`font`/`border`/`focusRing` are static (same regardless of
 * state) and only live on `defaultState`; named states only carry `background`, the one
 * token that actually differs. `checkbox` is the same shared shape used by `filter`.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { multiselectCheckboxDefaults, multiselectCheckboxShape } from './checkbox'
import { border, borderWithShadow, font, withRef } from '../primitives'

const multiselectListItemStateShape = z
  .object({
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    font: font.pick({ weight: true, size: true }).optional(),
    border: border.optional(),
    background: z.union([z.string(), withRef(z.string())]).optional(),
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectListItemStateShape' })

export const multiselectListItemShape = z
  .object({
    checkbox: multiselectCheckboxShape.prefault({}),
    defaultState: multiselectListItemStateShape.prefault({}),
    hover: multiselectListItemStateShape.prefault({}),
    focus: multiselectListItemStateShape.prefault({}),
    selected: multiselectListItemStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectListItemShape', axis: 'state' })

export const multiselectListItemDefaults = {
  checkbox: multiselectCheckboxDefaults,
  defaultState: {
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
    gap: '{{primitives.space.sm}}',
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    },
    border: {
      width: '{{primitives.border.width.none}}',
      offset: '{{primitives.border.offset.none}}',
      color: '{{primitives.border.color.none}}',
      style: '{{primitives.border.style.none}}',
      radius: '{{primitives.border.radius.sm}}',
    },
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    focusRing: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.width}}',
      offset: '{{primitives.focusRing.offset.none}}',
      shadow: '{{primitives.focus.shadow.none}}',
    },
  },
  hover: {
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
  },
  focus: {
    background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
  },
  selected: {
    background: '{{primitives.variant.primary.state.selected.defaultSeverity.bg}}',
  },
}
