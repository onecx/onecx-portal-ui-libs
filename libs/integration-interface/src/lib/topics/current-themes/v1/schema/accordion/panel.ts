import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class AccordionPanelSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: z
      .object({
        width: withRef(z.string()).default('{{primitives.border.width.md}}'),
        style: withRef(z.string()).default('{{primitives.border.style.solid}}'),
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
      })
      .prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'accordionPanel' })
}
