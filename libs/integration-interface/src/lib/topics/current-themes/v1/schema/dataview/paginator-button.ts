import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { border, borderWithShadow, icon } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const hoverBorderDefaults = {
  ...borderDefaults,
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
}

const focusBorderDefaults = {
  ...borderDefaults,
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
}

const disabledBorderDefaults = {
  ...borderDefaults,
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
}

const focusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

export const dataviewPaginatorButtonShape = z.object({
  border: border.optional(),
  focusRing: borderWithShadow.optional(),
  icon: icon.optional(),
  hover: z.object({ border: border.optional(), icon: icon.pick({ color: true }).optional() }).optional(),
  focus: z.object({ border: border.optional(), focusRing: borderWithShadow.optional() }).optional(),
  disabled: z.object({ border: border.optional(), icon: icon.pick({ color: true }).optional() }).optional(),
})

export const dataviewPaginatorButtonDefaults = {
  border: borderDefaults,
  focusRing: focusRingDefaults,
  icon: {
    size: '{{primitives.iconSizes.sm}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    content: '',
    url: '',
  },
  hover: {
    border: hoverBorderDefaults,
    icon: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}' },
  },
  focus: { border: focusBorderDefaults, focusRing: focusRingDefaults },
  disabled: {
    border: disabledBorderDefaults,
    icon: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}' },
  },
}

export const dataviewPaginatorButton = applyDefaultsRecursive(
  dataviewPaginatorButtonShape,
  dataviewPaginatorButtonDefaults
).register(themeSchemaRegistry, { id: 'dataviewPaginatorButton' })
