import * as z from 'zod'
import { withRef } from '../primitives'

/**
 * Shape reused by both `sm` and `lg` size overrides. Only content padding, text font size,
 * icon size, and close icon size scale with size — gap has no size variant.
 */
export const messageSizeShape = z.object({
  content: z.object({ padding: withRef(z.string()).optional() }).prefault({}),
  text: z
    .object({
      font: z.object({ size: withRef(z.string()).optional() }).prefault({}),
    })
    .prefault({}),
  icon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
  closeIcon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
})

export const messageSmDefaults = {
  content: { padding: '{{primitives.space.xs}}' },
  // font has no size scale in primitives — same flat token reused across all size tiers (see badge.ts)
  text: { font: { size: '{{primitives.font.size}}' } },
  icon: { size: '{{primitives.icon.sm}}' },
  closeIcon: { size: '{{primitives.icon.sm}}' },
}

export const messageLgDefaults = {
  content: { padding: '{{primitives.space.md}}' },
  text: { font: { size: '{{primitives.font.size}}' } },
  icon: { size: '{{primitives.icon.lg}}' },
  closeIcon: { size: '{{primitives.icon.lg}}' },
}
