import z from 'zod'
import { color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Schema for the empty message displayed in the multiselect overlay when no options are available.
 */
export class MultiselectEmptyMessageSchema {
  static readonly schema = z
    .object({
      paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
      paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
      font: font.pick({ weight: true, size: true, style: true }).default({
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
        style: '{{primitives.font.style}}',
      }),
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    })
    .register(themeSchemaRegistry, { id: 'multiselectEmptyMessage' })
}
