import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

/**
 * Multiselect component settings schema.
 */
export class MultiselectSettingsSchema {
  static readonly schema = z
    .object({
      variant: withRef(z.enum(['filled', 'outlined'])).optional(),
      scrollHeight: withRef(z.string()),
      filter: withRef(z.boolean()).optional(),
      filterLocale: withRef(z.string()).optional(),
      readonly: withRef(z.boolean()).optional(),
      showClear: withRef(z.boolean()).optional(),
      virtualScroll: withRef(z.boolean()).optional(),
      virtualScrollItemSize: withRef(z.number()).optional(),
      selectOnFocus: withRef(z.boolean()),
      autoOptionFocus: withRef(z.boolean()),
      display: withRef(z.enum(['chip', 'comma'])).optional(),
      maxSelectedLabels: withRef(z.number()).optional(),
    })
    .register(themeSchemaRegistry, { id: 'multiselectSettings' })
}
