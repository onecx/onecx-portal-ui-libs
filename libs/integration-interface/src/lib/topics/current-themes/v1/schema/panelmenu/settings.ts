import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

/**
 * PanelMenu settings schema.
 * Controls component-level behavior.
 */
export class PanelMenuSettingsSchema {
  static readonly schema = z
    .object({
      multiple: withRef(z.boolean()).default(false),
    })
    .register(themeSchemaRegistry, { id: 'panelmenuSettings' })
}
