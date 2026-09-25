import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { border, color, icon, withRef } from '../../primitives'
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

const focusRingShape = z.object({
  color: color.optional(),
  style: withRef(z.string()).optional(),
  width: withRef(z.string()).optional(),
  radius: withRef(z.string()).optional(),
  offset: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
})

const focusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

export const dataListGridSortingButtonShape = z.object({
  border: border.optional(),
  focusRing: focusRingShape.optional(),
  icon: icon.optional(),
  hover: z
    .object({
      border: border.optional(),
      icon: icon.pick({ color: true }).optional(),
    })
    .optional(),
  focus: z
    .object({
      border: border.optional(),
      focusRing: focusRingShape.optional(),
    })
    .optional(),
})

export const dataListGridSortingButtonDefaults = {
  border: defaultBorderDefaults,
  focusRing: focusRingDefaults,
  icon: {
    size: '{{primitives.iconSizes.sm}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    content: '',
    url: '',
  },
  hover: {
    border: hoverBorderDefaults,
    icon: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
  },
  focus: {
    border: focusBorderDefaults,
    focusRing: focusRingDefaults,
  },
}

export const dataListGridSortingButton = applyDefaultsRecursive(
  dataListGridSortingButtonShape,
  dataListGridSortingButtonDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSortingButton' })

export class DataListGridSortingButtonSchema {
  static readonly schema = dataListGridSortingButton
}
