import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

/**
 * Tabs component settings schema.
 */
export class TabsSettingsSchema {
  static readonly schema = z
    .object({
        unstyled: withRef(z.boolean()).default(false),
        lazy: withRef(z.boolean()).default(false),
        selectOnFocus: withRef(z.boolean()).default(false),
        showNavigators: withRef(z.boolean()).default(true),
        scrollStrategy: withRef(z.union([z.enum(['nearest', 'center']), z.literal(false)])).default('nearest'),
    })
    .register(themeSchemaRegistry, { id: 'tabsSettings' })
}
