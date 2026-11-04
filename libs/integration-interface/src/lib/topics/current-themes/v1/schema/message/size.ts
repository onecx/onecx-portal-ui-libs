import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shape reused by both `sm` and `lg` size overrides. Only content padding, text font size,
 * icon size, and close icon size scale with size — gap has no size variant.
 *
 * `sm`/`lg` are pure size overrides, not severity-bearing named variants, but they sit as direct
 * root siblings of the variant keys (`defaultVariant`/`outlined`/`simple`). Registered
 * `axis: 'none'` so the root's variant axis does not classify them as variant members.
 */
export const messageSizeShape = z
  .object({
    content: z.object({ padding: withRef(z.string()).optional() }).prefault({}),
    text: z
      .object({
        font: z.object({ size: withRef(z.string()).optional() }).prefault({}),
      })
      .prefault({}),
    icon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
    closeIcon: z.object({ size: withRef(z.string()).optional() }).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'messageSizeShape', axis: 'none' })

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
