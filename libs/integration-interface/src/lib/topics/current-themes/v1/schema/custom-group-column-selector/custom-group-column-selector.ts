import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

const buttonShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  hover: z.object({ background: z.union([bg, withRef(z.string())]).optional(), color: color.optional() }).optional(),
  active: z.object({ background: z.union([bg, withRef(z.string())]).optional(), color: color.optional() }).optional(),
  disabled: z.object({ background: z.union([bg, withRef(z.string())]).optional(), color: color.optional() }).optional(),
})

export const customGroupColumnSelectorShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  button: buttonShape.optional(),
})

export const customGroupColumnSelectorDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  button: {
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    hover: {
      background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
    active: {
      background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
    },
    disabled: {
      background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    },
  },
}

export const customGroupColumnSelector = applyDefaultsRecursive(
  customGroupColumnSelectorShape,
  customGroupColumnSelectorDefaults
).register(themeSchemaRegistry, { id: 'customGroupColumnSelector' })

export class CustomGroupColumnSelectorSchema {
  static readonly schema = customGroupColumnSelector
}