import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, withRef } from '../primitives'
import { PicklistPanelItemSchema } from './item'

/**
 * List of items within the picklist panel schema.
 */
export class PicklistPanelItemsSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    // Gap between controls/lists elements.
    gap: withRef(z.string()).default('{{primitives.space.none}}'),
  }
  static readonly schema = z
    .object({
      item: (PicklistPanelItemSchema.schema as typeof PicklistPanelItemSchema.schema).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'picklistPanelItems', kind: 'child' })
}
