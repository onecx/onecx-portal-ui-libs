import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

// Behavioral options with no visual tokens; `axis: 'setting'` opts the block out of any enclosing
// axis so it is never classified as an axis member.
export class BreadcrumbSettingsSchema {
  static readonly schema = z
    .object({
      homeIcon: withRef(z.string()).default('home'),
      showTooltip: withRef(z.boolean()).default(true),
      separator: withRef(z.string()).default('/'),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumbSettings', axis: 'setting' })
    .prefault({})
}
