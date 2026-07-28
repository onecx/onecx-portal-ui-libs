import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'
import { PicklistControlButtonSchema } from './controlbutton'

/**
 * Schema for picklist control buttons. Picklist control buttons are the buttons that allow users to move items between the source and target lists in the picklist component
 */
export class PicklistControlButtonsSchema {
  private static readonly tokens = {
    // Gap between control buttons.
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
  }
  static readonly schema = z
    .object({
      ...this.tokens,
      button: (PicklistControlButtonSchema.schema as typeof PicklistControlButtonSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'picklistControlButtons' })
}
