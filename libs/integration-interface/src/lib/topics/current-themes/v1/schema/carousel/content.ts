import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Shape for the carousel's content (the items container / slide track).
 * No states of its own — a single flat token group.
 * All keys are optional — defaults are applied at the carousel schema level.
 */
export const carouselContentShape = z.object({
  gap: withRef(z.string()).optional(),
})

/**
 * Default tokens for the carousel content.
 */
export const carouselContentDefaults = {
  gap: '{{primitives.space.md}}',
}
