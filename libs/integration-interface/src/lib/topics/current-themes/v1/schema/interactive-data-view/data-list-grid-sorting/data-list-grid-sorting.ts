import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { bg, border, withRef } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'
import { dataListGridSortingButtonDefaults, dataListGridSortingButtonShape } from './data-list-grid-sorting-button'

export const dataListGridSortingShape = z.object({
  border: border.pick({ color: true, width: true, radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  gap: withRef(z.string()).optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  button: dataListGridSortingButtonShape.optional(),
})

export const dataListGridSortingDefaults = {
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.radius.sm}}',
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  gap: '{{primitives.space.md}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  button: dataListGridSortingButtonDefaults,
}

export const dataListGridSorting = applyDefaultsRecursive(
  dataListGridSortingShape,
  dataListGridSortingDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSorting' })

export class DataListGridSortingSchema {
  static readonly schema = dataListGridSorting
}
