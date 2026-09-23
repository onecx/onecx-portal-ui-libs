import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { bg, border, color, withRef } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'
import { dataListGridSortingButtonDefaults, dataListGridSortingButtonShape } from './data-list-grid-sorting-button'
import {
  dataListGridSortingDropdownDefaults,
  dataListGridSortingDropdownShape,
} from './data-list-grid-sorting-dropdown'
import {
  dataListGridSortingFloatLabelDefaults,
  dataListGridSortingFloatLabelShape,
} from './data-list-grid-sorting-float-label'

export const dataListGridSortingShape = z.object({
  border: border.pick({ color: true, width: true, radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  space: withRef(z.string()).optional(),
  floatLabel: dataListGridSortingFloatLabelShape.optional(),
  dropdown: dataListGridSortingDropdownShape.optional(),
  button: dataListGridSortingButtonShape.optional(),
})

export const dataListGridSortingDefaults = {
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.radius.sm}}',
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  space: '{{primitives.space.md}}',
  floatLabel: dataListGridSortingFloatLabelDefaults,
  dropdown: dataListGridSortingDropdownDefaults,
  button: dataListGridSortingButtonDefaults,
}

export const dataListGridSorting = applyDefaultsRecursive(
  dataListGridSortingShape,
  dataListGridSortingDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSorting' })

export class DataListGridSortingSchema {
  static readonly schema = dataListGridSorting
}
