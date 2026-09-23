import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

const accordionToggleIconShape = z.object({
  color: color.optional(),
})

const accordionHeaderPositionShape = z.object({
  border: border.pick({ radius: true, width: true }).optional(),
})

const accordionHeaderStateShape = z.object({
  color: color.optional(),
  background: bg.pick({ color: true }).optional(),
  padding: withRef(z.string()).optional(),
  font: font.pick({ weight: true }).optional(),
  border: border.pick({ radius: true, width: true, color: true }).optional(),
  toggleIcon: accordionToggleIconShape.prefault({}),
  first: accordionHeaderPositionShape.prefault({}),
  last: accordionHeaderPositionShape.prefault({}),
})

export const accordionHeaderShape = z.object({
  defaultVariant: z
    .object({
      focusRing: borderWithShadow.optional(),
      defaultState: accordionHeaderStateShape.prefault({}),
      hover: accordionHeaderStateShape.prefault({}),
    })
    .prefault({}),
})

export const accordionHeaderDefaults = {
  defaultVariant: {
    focusRing: {
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    },
    defaultState: {
      padding: '{{primitives.space.md}}',
      font: {
        weight: '{{primitives.font.weight.bold}}',
      },
      border: {
        radius: '{{primitives.border.radius.md}}',
        width: '{{primitives.border.width.md}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      },
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      background: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
      },
      toggleIcon: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      },
      first: {
        border: {
          radius: '{{primitives.border.radius.md}}',
          width: '{{primitives.border.width.md}}',
        },
      },
      last: {
        border: {
          radius: '{{primitives.border.radius.md}}',
          width: '{{primitives.border.width.md}}',
        },
      },
    },
    hover: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      background: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
      },
      toggleIcon: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      },
    },
  },
}
