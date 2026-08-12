import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { FieldsetSettingsSchema } from './settings'
import { bg, border, font, transition, withRef } from '../primitives'
import { LegendSchema } from './legend'

export class FieldsetSchema {
  static readonly token = {
    backgroundColor: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    border: border.pick({ color: true, radius: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    transition: transition.pick({ duration: true }).default({
      duration: '{{primitives.transition.duration}}',
    }),
  }

  static readonly content = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ weight: true, family: true, size: true }).default({
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      family: '{{primitives.font.family}}',
    }),
  }

  static schema = z
    .object({
      ...this.token,
      content: z
        .object({
          ...this.content,
        })
        .prefault({}),
      settings: FieldsetSettingsSchema.schema.prefault({}),
      legend: LegendSchema.schema.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'fieldset' })
}
