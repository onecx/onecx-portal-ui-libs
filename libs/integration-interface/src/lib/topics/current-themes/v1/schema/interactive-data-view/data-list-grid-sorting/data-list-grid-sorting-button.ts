import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { border, icon } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'

const defaultBorderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
}

const hoverBorderDefaults = {
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  width: '{{primitives.border.width.none}}',
}

const focusBorderDefaults = {
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  width: '{{primitives.border.width.none}}',
}

export const dataListGridSortingButtonShape = z.object({
  defaultState: z
    .object({
      border: border.optional(),
      icon: icon.pick({ color: true }).optional(),
    })
    .optional(),
  hover: z
    .object({
      border: border.optional(),
      icon: icon.pick({ color: true }).optional(),
    })
    .optional(),
  focus: z
    .object({
      border: border.optional(),
    })
    .optional(),
})

export const dataListGridSortingButtonDefaults = {
  // `icon` is picked to `color` only in the shape, so only `color` carries a
  // default here — size/content/url are not modeled at this level.
  defaultState: {
    border: defaultBorderDefaults,
    icon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    },
  },
  hover: {
    border: hoverBorderDefaults,
    icon: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
  },
  focus: {
    border: focusBorderDefaults,
  },
}

export const dataListGridSortingButton = applyDefaultsRecursive(
  dataListGridSortingButtonShape,
  dataListGridSortingButtonDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSortingButton' })

export class DataListGridSortingButtonSchema {
  static readonly schema = dataListGridSortingButton
}
