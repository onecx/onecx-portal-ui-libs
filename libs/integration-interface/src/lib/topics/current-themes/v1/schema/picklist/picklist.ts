import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, color, withRef } from '../primitives'
import { PicklistSettingsSchema } from './settings'
import { PicklistPanelSchema } from './panel'
import { PicklistControlButtonsSchema } from './controlbuttons'

/**
 * Picklist component schema.
 */
export class PicklistSchema {
  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    // Gap between controls/lists elements.
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      settings: (PicklistSettingsSchema.schema as typeof PicklistSettingsSchema.schema).optional(),
      panel: (PicklistPanelSchema.schema as typeof PicklistPanelSchema.schema).prefault({}),
      sourceControlButtons: (
        PicklistControlButtonsSchema.schema as typeof PicklistControlButtonsSchema.schema
      ).prefault({}),
      transferControlButtons: (
        PicklistControlButtonsSchema.schema as typeof PicklistControlButtonsSchema.schema
      ).prefault({}),
      targetControlButtons: (
        PicklistControlButtonsSchema.schema as typeof PicklistControlButtonsSchema.schema
      ).prefault({}),
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'picklist', kind: 'child' })
}
