import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectListItemSchema } from './listitem'
import { withRef } from '../primitives'
import { MultiselectGroupHeaderSchema } from './groupheader'

/**
 * Multiselect listItems schema.
 */
export class MultiselectListItemsSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      item: (MultiselectListItemSchema.schema as typeof MultiselectListItemSchema.schema).prefault({}),
      groupHeader: (MultiselectGroupHeaderSchema.schema as typeof MultiselectGroupHeaderSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'multiselectListItems' })
}
