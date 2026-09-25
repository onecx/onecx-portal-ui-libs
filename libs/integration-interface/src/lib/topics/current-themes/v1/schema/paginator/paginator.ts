import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const paginatorButtonShape = z.object({
  border: border.pick({ radius: true }).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  hover: z.object({ background: z.union([bg, withRef(z.string())]).optional() }).optional(),
  active: z.object({ background: z.union([bg, withRef(z.string())]).optional() }).optional(),
})

const paginatorInputShape = z.object({
  border: border.optional(),
  icon: icon.pick({ color: true }).optional(),
})

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  radius: '{{primitives.border.radius.md}}',
  offset: '{{primitives.border.offset.none}}',
}

export const paginatorShape = z.object({
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  button: paginatorButtonShape.optional(),
  input: paginatorInputShape.optional(),
})

export const paginatorDefaults = {
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  button: {
    border: { radius: '{{primitives.border.radius.md}}' },
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    hover: { background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}' },
    active: { background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}' },
  },
  input: {
    border: borderDefaults,
    icon: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}' },
  },
}

export const paginator = applyDefaultsRecursive(paginatorShape, paginatorDefaults).register(themeSchemaRegistry, {
  id: 'paginator',
})

export class PaginatorSchema {
  static readonly schema = paginator
}