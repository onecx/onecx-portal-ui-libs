/**
 * Schema for the empty message displayed in the multiselect overlay when no options are available.
 * Flat — no variant/state/severity axis (the empty message has a single static look).
 */
import * as z from 'zod'
import { color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

export const multiselectEmptyMessageShape = z
  .object({
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    font: font.pick({ weight: true, size: true, style: true }).optional(),
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectEmptyMessageShape' })

export const multiselectEmptyMessageDefaults = {
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  font: {
    weight: '{{primitives.font.weight}}',
    size: '{{primitives.font.size}}',
    style: '{{primitives.font.style}}',
  },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
}
