import * as z from 'zod'
import { bg, withRef, transition } from '../primitives'

/**
 * Tabs active bar shape. Represents the active-tab indicator bar.
 */
export const tabsActiveBarShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  height: withRef(z.string()).optional(),
  position: withRef(z.enum(['top', 'bottom', 'left', 'right'])).optional(),
  positionOffset: withRef(z.string()).optional(),
  transition: transition.optional(),
  shadow: withRef(z.string()).optional(),
})

export const tabsActiveBarDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  height: '{{primitives.border.width.sm}}',
  position: 'bottom',
  positionOffset: '{{primitives.space.none}}',
  transition: {
    duration: '{{primitives.transition.duration}}',
  },
  shadow: '{{primitives.shadow.none}}',
}
