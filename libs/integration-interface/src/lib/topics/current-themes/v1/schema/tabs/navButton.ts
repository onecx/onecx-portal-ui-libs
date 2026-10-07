import * as z from 'zod'
import { bg, color, focusRingShape, withRef } from '../primitives'

const navButtonStateShape = z.object({
  nextIcon: withRef(z.string()).optional(),
  prevIcon: withRef(z.string()).optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  width: withRef(z.string()).optional(),
  focusRing: focusRingShape.optional(),
})

export const tabsNavButtonShape = z.object({
  defaultState: navButtonStateShape.prefault({}),
  hover: navButtonStateShape.prefault({}),
})

export const tabsNavButtonDefaults = {
  defaultState: {
    nextIcon: '{{primitives.icon.arrowRight}}',
    prevIcon: '{{primitives.icon.arrowLeft}}',
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    width: '2.5rem',
    focusRing: {
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    },
  },
  hover: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  },
}
