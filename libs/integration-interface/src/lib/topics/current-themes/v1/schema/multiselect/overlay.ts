import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { border, withRef } from '../primitives'
import { MultiselectFilterSchema } from './filter'
import { MultiselectListItemsSchema } from './listitems'

/**
 * Multiselect overlay schema.
 */
export class MultiselectOverlaySchema {
  private static readonly tokens = {
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    shadow: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.shadow}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      filter: (MultiselectFilterSchema.schema as typeof MultiselectFilterSchema.schema).prefault({}),
      listItems: (MultiselectListItemsSchema.schema as typeof MultiselectListItemsSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'multiselectOverlay' })
}
