import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// State-content groups carried inside each header state (unmarked, so their tokens fall back
// within the header's state scope, like the input's per-state static tokens).
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
  font: font.pick({ weight: true, size: true }).optional(),
  border: border.pick({ radius: true, width: true, color: true }).optional(),
  toggleIcon: accordionToggleIconShape.prefault({}),
  first: accordionHeaderPositionShape.prefault({}),
  last: accordionHeaderPositionShape.prefault({}),
})

// Header is a child component (re-roots the fallback) whose single `defaultVariant` key is the
// default variant member. Its `defaultVariant` slot holds the states (axis: 'state'); `focusRing`
// is a static sibling of those states and opts out (axis: 'none').
export const accordionHeaderShape = z
  .object({
    defaultVariant: z
      .object({
        focusRing: borderWithShadow
          .extend({})
          .register(themeSchemaRegistry, { id: 'accordion.header.focusRing', axis: 'none' })
          .optional(),
        defaultState: accordionHeaderStateShape.prefault({}),
        hover: accordionHeaderStateShape.prefault({}),
      })
      .register(themeSchemaRegistry, { id: 'accordion.header.defaultVariant', axis: 'state' })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'accordion.header', axis: 'variant', child: true })

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
