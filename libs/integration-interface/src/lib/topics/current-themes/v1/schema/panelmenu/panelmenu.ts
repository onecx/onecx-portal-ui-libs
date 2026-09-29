import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'
import { PanelMenuSettingsSchema } from './settings'
import { PanelMenuHeaderSchema } from './header'
import { PanelMenuContentSchema } from './content'

/**
 * PanelMenu component schema.
 * Provides hierarchical navigation menu with collapsible panels.
 */
export class PanelMenuSchema {
  static readonly schema = z
    .object({
      settings: (PanelMenuSettingsSchema.schema as typeof PanelMenuSettingsSchema.schema).optional(),
      gap: withRef(z.string()).default('{{primitives.space.sm}}'),
      color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
      background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
      border: border.default({
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.none}}',
        radius: '{{primitives.border.radius.md}}',
      }),
      header: PanelMenuHeaderSchema.schema.prefault({}),
      content: PanelMenuContentSchema.schema.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'panelmenu' })
}
