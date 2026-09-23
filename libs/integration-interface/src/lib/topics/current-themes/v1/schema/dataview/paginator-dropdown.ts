import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  radius: '{{primitives.border.radius.md}}',
  offset: '{{primitives.border.offset.none}}',
}

const focusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.md}}',
  radius: '{{primitives.radius.md}}',
  offset: '{{primitives.border.offset.none}}',
  shadow: '{{primitives.shadow.none}}',
}

const dropdownStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  focusRing: borderWithShadow.optional(),
  width: withRef(z.string()).optional(),
})

export const dataviewPaginatorDropdownShape = z.object({
  defaultState: dropdownStateShape.optional(),
  hover: dropdownStateShape.optional(),
  focus: dropdownStateShape.optional(),
  disabled: dropdownStateShape.optional(),
})

export const dataviewPaginatorDropdownDefaults = {
  defaultState: {
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    border: borderDefaults,
    focusRing: focusRingDefaults,
    width: '{{primitives.space.xl}}',
  },
  hover: {
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    border: borderDefaults,
  },
  focus: {
    background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    border: borderDefaults,
    focusRing: focusRingDefaults,
  },
  disabled: {
    background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    border: borderDefaults,
  },
}

export const dataviewPaginatorDropdown = applyDefaultsRecursive(
  dataviewPaginatorDropdownShape,
  dataviewPaginatorDropdownDefaults
).register(themeSchemaRegistry, { id: 'dataviewPaginatorDropdown' })
