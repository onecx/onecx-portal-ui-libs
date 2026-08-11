import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class AccordionContentSchema {
  private static readonly tokens = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'),
    border: z
      .object({
        width: withRef(z.string()).default('{{primitives.border.width.md}}'),
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
        style: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}'),
      })
      .prefault({}),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'accordionContent' })
}
