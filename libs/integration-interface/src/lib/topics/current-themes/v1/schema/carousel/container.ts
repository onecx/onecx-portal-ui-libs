import * as z from 'zod'
import { bg, border, color, withRef } from '../primitives'

/**
 * Shape for the carousel's root container.
 * No states of its own — a single flat token group (specific child of the
 * carousel's `defaultVariant`), analogous to the calendar's multi-month divider.
 * All keys are optional — defaults are applied at the carousel schema level.
 */
export const carouselContainerShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  padding: withRef(z.string()).optional(),
  border: border.optional(),
})

/**
 * Default tokens for the carousel container.
 */
export const carouselContainerDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  padding: '{{primitives.space.md}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.md}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  },
}
