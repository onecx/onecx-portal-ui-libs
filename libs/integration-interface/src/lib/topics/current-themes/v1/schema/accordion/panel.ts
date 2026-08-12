import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { border, withRef } from '../primitives'

export class AccordionPanelSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.pick({ width: true, color: true, style: true }).default({
      width: '{{primitives.border.width.md}}',
      style: '{{primitives.border.style}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'accordionPanel' })
}
