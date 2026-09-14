import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, color, font, border, withRef } from '../primitives'

/**
 * Top section of the picklist panel that typically contains the title or label of the panel schema.
 */
export class PicklistPanelHeaderSchema {
  static readonly schema = z
    .object({
      background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
      paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
      border: border.default({
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.sm}}',
        radius: '{{primitives.border.radius.none}}',
      }),
      font: font.pick({ weight: true }).default({
        weight: '{{primitives.font.weight}}',
      }),
    })
    .register(themeSchemaRegistry, { id: 'picklistPanelHeader' })
}
