import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { PicklistPanelHeaderSchema } from './header'
import { PicklistPanelItemsSchema } from './items'

/**
 * Picklist panel that contains the list of items and the header section schema.
 */
export class PicklistPanelSchema {
  static readonly schema = z
    .object({
      header: (PicklistPanelHeaderSchema.schema as typeof PicklistPanelHeaderSchema.schema).prefault({}),
      items: (PicklistPanelItemsSchema.schema as typeof PicklistPanelItemsSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'picklistPanel', kind: 'child' })
}
