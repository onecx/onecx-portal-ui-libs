import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectCheckboxSchema } from './checkbox'
import { MultiselectInputSchema } from './input'
import { icon, withRef } from '../primitives'

/**
 * Filter component schema inside multiselect overlay.
 */
export class MultiselectFilterSchema {
  private static readonly tokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  private static readonly defaultFilterIcon = {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      checkbox: (MultiselectCheckboxSchema.schema as typeof MultiselectCheckboxSchema.schema).prefault({}),
      input: (MultiselectInputSchema.schema as typeof MultiselectInputSchema.schema).prefault({}),
      filterIcon: icon.default({
        ...this.defaultFilterIcon,
      }),
    })
    .register(themeSchemaRegistry, { id: 'multiselectFilter' })
}
