import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'

export class AccordionContentSchema {
  private static readonly tokens = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
import { bg, border, withRef } from '../primitives'

export class AccordionContentSchema {
  private static readonly tokens = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    border: border.pick({ width: true, color: true, style: true }).default({
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'accordionContent' })
}
