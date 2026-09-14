import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

// TODO: Modify settings list once we have a better understanding of what settings are available for the picklist component
/**
 * Picklist component settings schema.
 */
export class PicklistSettingsSchema {
  static readonly schema = z
    .object({
      // responsive: withRef(z.boolean()).optional(),
      dragDrop: withRef(z.boolean()).optional(),
      showSourceControls: withRef(z.boolean()).optional(),
      showTargetControls: withRef(z.boolean()).optional(),
      filterMatchMode: withRef(z.string()).optional(),
      stripedRows: withRef(z.boolean()).optional(),
      // keepSelection: withRef(z.boolean()).optional(),
      scrollHeight: withRef(z.string()).optional(),
      autoOptionFocus: withRef(z.boolean()).optional(),
      breakpoint: withRef(z.string()).optional(),
    })
    .register(themeSchemaRegistry, { id: 'picklistSettings' })
}
