import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectCheckboxSchema } from './checkbox'
import { MultiselectInputSchema } from './input'
import { MultiselectIconButtonSchema } from './iconbutton'
import { withRef } from '../primitives'

/**
 * Filter component schema inside multiselect overlay.
 */
export class MultiselectFilterSchema {
  private static readonly tokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      checkbox: (MultiselectCheckboxSchema.schema as typeof MultiselectCheckboxSchema.schema).prefault({}),
      input: (MultiselectInputSchema.schema as typeof MultiselectInputSchema.schema).prefault({}),
      filterIconButton: (MultiselectIconButtonSchema.schema as typeof MultiselectIconButtonSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectFilter' })
}
