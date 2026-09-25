import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const paginatorShape = z.object({
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
})

const paginatorDefaults = {
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
}

export const dataviewHeaderDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  gap: '{{primitives.space.md}}',
  paginator: paginatorDefaults,
}

export const dataviewHeaderShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  paginator: paginatorShape.optional(),
})

export const dataviewHeader = applyDefaultsRecursive(dataviewHeaderShape, dataviewHeaderDefaults).register(themeSchemaRegistry, {
  id: 'dataviewHeader',
})

export class DataviewHeaderSchema {
  static readonly schema = dataviewHeader
}
