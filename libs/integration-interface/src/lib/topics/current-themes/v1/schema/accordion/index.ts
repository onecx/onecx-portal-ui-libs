import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { AccordionSettingsSchema } from './settings'
import { AccordionHeaderSchema } from './header'
import { AccordionContentSchema } from './content'
import { AccordionPanelSchema } from './panel'
import { border, transition, withRef } from '../primitives'

export class AccordionSchema {
  static readonly token = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    border: border.pick({ width: true, color: true, style: true }).default({
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
    transition: transition.pick({ duration: true }).default({
      duration: '{{primitives.transition.duration}}',
    }),
  }

  static schema = z
    .object({
      ...this.token,
      settings: AccordionSettingsSchema.schema.prefault({}),
      panel: AccordionPanelSchema.schema.prefault({}),
      header: AccordionHeaderSchema.schema.prefault({}),
      content: AccordionContentSchema.schema.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'accordion' })
}
