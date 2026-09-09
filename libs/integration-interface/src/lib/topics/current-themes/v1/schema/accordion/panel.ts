import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { border, withRef } from '../primitives'

export class AccordionPanelSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.pick({ color: true, width: true, style: true }).default({
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'accordionPanel' })
}
