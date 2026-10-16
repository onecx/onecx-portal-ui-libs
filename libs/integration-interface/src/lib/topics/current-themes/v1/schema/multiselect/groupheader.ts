/**
 * Group header schema for multiselect list items when grouped.
 * Flat — no variant/state/severity axis (a group header has a single static look).
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { color, font, withRef } from '../primitives'

export const multiselectGroupHeaderShape = z
  .object({
    background: z.union([z.string(), z.object({ color: z.string() }), withRef(z.string())]).optional(),
    color: color.optional(),
    font: font.pick({ weight: true, size: true, style: true }).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectGroupHeaderShape' })

export const multiselectGroupHeaderDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  font: {
    weight: '{{primitives.font.weight}}',
    size: '{{primitives.font.size}}',
    // Fixed: previously referenced `primitives.font.color` (no such primitive) instead of
    // `primitives.font.style` — a copy-paste bug found during the Step 5 audit.
    style: '{{primitives.font.style}}',
  },
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
}
