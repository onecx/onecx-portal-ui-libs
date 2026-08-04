import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'

// TODO: Pick relevant tokens from button usage tokens
/**
 * Schema for picklist control button allowing users to move items between the source and target lists in the picklist component.
 */
export class PicklistControlButtonSchema {
  static readonly schema = z.object({}).register(themeSchemaRegistry, { id: 'picklistControlButton' })
}
