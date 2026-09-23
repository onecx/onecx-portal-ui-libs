import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { bg, border, borderWithShadow, color, withRef } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'

const defaultBorderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const hoverBorderDefaults = {
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const focusBorderDefaults = {
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
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

const itemRowStateShape = z.object({
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),
})

export const dataListGridItemRowShape = itemRowStateShape.extend({
  hover: itemRowStateShape.partial().optional(),
  focus: itemRowStateShape.partial().optional(),
})

export const dataListGridItemRowDefaults = {
  border: defaultBorderDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  gap: '{{primitives.space.sm}}',
  hover: {
    border: hoverBorderDefaults,
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  },
  focus: {
    border: focusBorderDefaults,
    background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    focusRing: focusRingDefaults,
  },
}

export const dataListGridItemRow = applyDefaultsRecursive(
  dataListGridItemRowShape,
  dataListGridItemRowDefaults
).register(themeSchemaRegistry, { id: 'dataListGridItemRow' })

export class DataListGridItemRowSchema {
  static readonly schema = dataListGridItemRow
}
