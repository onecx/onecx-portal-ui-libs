import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { picklist } from '../picklist'
import {
  customGroupColumnSelectorSkeletonDefaults,
  customGroupColumnSelectorSkeletonShape,
} from './custom-group-column-selector-skeleton'

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const picklistShape = z.object(picklist.shape)

export const customGroupColumnSelectorShape = z.object({
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  gap: withRef(z.string()).optional(),
  font: font.pick({ size: true, weight: true }).optional(),
  picklist: picklistShape.optional(),
  skeleton: customGroupColumnSelectorSkeletonShape.optional(),
})

export const customGroupColumnSelectorDefaults = {
  border: borderDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  gap: '{{primitives.space.md}}',
  font: { size: '{{primitives.font.size}}', weight: '{{primitives.font.weight}}' },
  picklist: picklist.parse({}),
  skeleton: customGroupColumnSelectorSkeletonDefaults,
}

export const customGroupColumnSelector = applyDefaultsRecursive(
  customGroupColumnSelectorShape,
  customGroupColumnSelectorDefaults
).register(themeSchemaRegistry, { id: 'customGroupColumnSelector' })

export class CustomGroupColumnSelectorSchema {
  static readonly schema = customGroupColumnSelector
}
