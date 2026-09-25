import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, borderWithShadow, color, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const chipSettingsShape = z.object({
  unstyled: withRef(z.boolean()).optional(),
  disabled: withRef(z.boolean()).optional(),
  removable: withRef(z.boolean()).optional(),
})

const borderDefaults = {
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

const disabledBorderDefaults = {
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
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

const iconFontDefaults = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

export const chipShape = z.object({
  settings: chipSettingsShape.optional(),
  border: border.optional(),
  focusRing: borderWithShadow.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  icon: icon.optional(),
  hover: z
    .object({
      border: border.optional(),
      background: z.union([bg, withRef(z.string())]).optional(),
      color: color.optional(),
      cursor: withRef(z.string()).optional(),
    })
    .optional(),
  disabled: z
    .object({
      border: border.optional(),
      background: z.union([bg, withRef(z.string())]).optional(),
      color: color.optional(),
      cursor: withRef(z.string()).optional(),
    })
    .optional(),
})

export const chipDefaults = {
  settings: { unstyled: false, disabled: false, removable: false },
  border: borderDefaults,
  focusRing: focusRingDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.xs}}',
  icon: {
    size: '{{primitives.iconSizes.sm}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    font: iconFontDefaults,
    content: '',
    url: '',
  },
  hover: {
    border: hoverBorderDefaults,
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    cursor: 'pointer',
  },
  disabled: {
    border: disabledBorderDefaults,
    background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    cursor: 'not-allowed',
  },
}

export const chip = applyDefaultsRecursive(chipShape, chipDefaults).register(themeSchemaRegistry, { id: 'chip' })

export class ChipSchema {
  static readonly schema = chip
}