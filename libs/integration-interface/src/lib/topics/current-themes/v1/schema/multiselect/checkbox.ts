/**
 * Checkbox shared between the multiselect filter header (select-all) and each list item.
 * Shape/defaults are separated (see `../input.ts` for the full convention writeup) so the same
 * shape+defaults pair can be imported by reference from both `filter.ts` and `listitem.ts`
 * without duplicating the token set.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, icon, withRef } from '../primitives'

const multiselectCheckboxStateShape = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    border: border.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectCheckboxStateShape' })

const multiselectCheckboxSelectedShape = multiselectCheckboxStateShape
  .extend({
    checkIcon: icon.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectCheckboxSelectedShape' })

export const multiselectCheckboxShape = z
  .object({
    defaultState: multiselectCheckboxStateShape.prefault({}),
    hover: multiselectCheckboxStateShape.prefault({}),
    focus: multiselectCheckboxStateShape.prefault({}),
    selected: multiselectCheckboxSelectedShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectCheckboxShape', axis: 'state' })

const commonBorder = {
  width: '{{primitives.border.width.none}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.border.radius.none}}',
}

export const multiselectCheckboxDefaults = {
  defaultState: {
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    border: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      ...commonBorder,
    },
  },
  // Named states only carry background/border.color/border.style — width/offset/radius are
  // static and only live on `defaultState`.
  hover: {
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
    border: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    },
  },
  focus: {
    background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
    border: {
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    },
  },
  selected: {
    background: '{{primitives.variant.primary.state.selected.defaultSeverity.bg}}',
    checkIcon: {
      color: '{{primitives.variant.primary.state.selected.defaultSeverity.contrast}}',
      size: '{{primitives.icon.size.sm}}',
    },
    border: {
      color: '{{primitives.variant.primary.state.selected.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.selected.defaultSeverity.border.style}}',
    },
  },
}
