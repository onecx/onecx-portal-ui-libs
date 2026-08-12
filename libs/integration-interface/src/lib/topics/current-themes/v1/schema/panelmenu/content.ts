import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'
import { PanelMenuItemSchema } from './item'

/**
 * PanelMenu content (panel content) schema.
 * Represents the container for menu items within an expanded panel.
 */
export class PanelMenuContentSchema {
  static readonly schema = z
    .object({
      paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
      paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
      color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
      background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
      border: border.default({
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.none}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.none}}',
      }),
      item: PanelMenuItemSchema.schema.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'panelmenuContent' })
}
