import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

/**
 * PanelMenu settings shape.
 * Controls component-level behavior.
 */
export const panelMenuSettingsShape = z
  .object({
    multiple: withRef(z.boolean()).default(false),
  })
  .register(themeSchemaRegistry, { id: 'panelmenuSettings' })
