import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { dataListGridItemCardDefaults, dataListGridItemCardShape } from './data-list-grid-item-card'
import { dataListGridItemRowDefaults, dataListGridItemRowShape } from './data-list-grid-item-row'

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

export const dataListGridShape = z.object({
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  gap: withRef(z.string()).optional(),
  justifyContent: withRef(z.string()).optional(),
  itemCard: dataListGridItemCardShape.optional(),
  itemRow: dataListGridItemRowShape.optional(),
})

export const dataListGridDefaults = {
  border: borderDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  gap: '{{primitives.space.md}}',
  justifyContent: 'flex-start',
  itemCard: dataListGridItemCardDefaults,
  itemRow: dataListGridItemRowDefaults,
}

export const dataListGrid = applyDefaultsRecursive(dataListGridShape, dataListGridDefaults).register(
  themeSchemaRegistry,
  { id: 'dataListGrid' }
)

export class DataListGridSchema {
  static readonly schema = dataListGrid
}