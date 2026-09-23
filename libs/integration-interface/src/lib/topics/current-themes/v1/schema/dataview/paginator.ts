import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { dataviewPaginatorButtonDefaults, dataviewPaginatorButtonShape } from './paginator-button'
import { dataviewPaginatorDropdownDefaults, dataviewPaginatorDropdownShape } from './paginator-dropdown'

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const focusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

export const dataviewPaginatorShape = z.object({
  border: border.optional(),
  focusRing: borderWithShadow.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  button: dataviewPaginatorButtonShape.optional(),
  dropdown: dataviewPaginatorDropdownShape.optional(),
})

export const dataviewPaginatorDefaults = {
  border: borderDefaults,
  focusRing: focusRingDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  gap: '{{primitives.space.sm}}',
  button: dataviewPaginatorButtonDefaults,
  dropdown: dataviewPaginatorDropdownDefaults,
}

export const dataviewPaginator = applyDefaultsRecursive(dataviewPaginatorShape, dataviewPaginatorDefaults).register(
  themeSchemaRegistry,
  { id: 'dataviewPaginator' }
)

export class DataviewPaginatorSchema {
  static readonly schema = dataviewPaginator
}
