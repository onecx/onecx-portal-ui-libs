import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const dataviewContentShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
})

export const dataviewContentDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
  },
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  gap: '{{primitives.space.sm}}',
}

export const dataviewContent = applyDefaultsRecursive(dataviewContentShape, dataviewContentDefaults).register(
  themeSchemaRegistry,
  { id: 'dataviewContent' }
)

export class DataviewContentSchema {
  static readonly schema = dataviewContent
}
