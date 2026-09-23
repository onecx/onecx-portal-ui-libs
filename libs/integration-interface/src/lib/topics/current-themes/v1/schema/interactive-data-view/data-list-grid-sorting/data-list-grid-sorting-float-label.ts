import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { bg, border, color, font, withRef } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'

const floatLabelActiveBorderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const floatLabelShape = z.object({
  font: font.pick({ weight: true }).optional(),
  color: color.optional(),
  focus: z
    .object({
      color: color.optional(),
    })
    .optional(),
  active: z
    .object({
      color: color.optional(),
      font: font.pick({ size: true, weight: true }).optional(),
      background: z.union([bg, withRef(z.string())]).optional(),
      border: border.optional(),
      paddingX: withRef(z.string()).optional(),
      paddingY: withRef(z.string()).optional(),
    })
    .optional(),
})

export const dataListGridSortingFloatLabelDefaults = {
  font: {
    weight: '{{primitives.font.weight}}',
  },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  focus: {
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
  },
  active: {
    color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
    font: {
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
    background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
    border: floatLabelActiveBorderDefaults,
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  },
}

export const dataListGridSortingFloatLabelShape = floatLabelShape

export const dataListGridSortingFloatLabel = applyDefaultsRecursive(
  floatLabelShape,
  dataListGridSortingFloatLabelDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSortingFloatLabel' })

export class DataListGridSortingFloatLabelSchema {
  static readonly schema = dataListGridSortingFloatLabel
}
