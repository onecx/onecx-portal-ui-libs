import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { font, withRef } from '../primitives'

/**
 * Group header schema for multiselect list items when grouped.
 */
export class MultiselectGroupHeaderSchema {
  static readonly schema = z
    .object({
      background: z
        .union([z.string(), z.object({ color: z.string() })])
        .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
      font: font.pick({ weight: true, size: true, style: true }).default({
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
        style: '{{primitives.font.color}}',
      }),
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
    })
    .register(themeSchemaRegistry, { id: 'multiselectGroupHeader' })
}
