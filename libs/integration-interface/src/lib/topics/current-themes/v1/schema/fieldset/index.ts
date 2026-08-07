import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { FieldsetSettingsSchema } from './settings'
import { bg, withRef } from '../primitives'
import { LegendSchema } from './legend'

export class FieldsetSchema {
  static readonly token = {
    backgroundColor: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'),
    border: z
      .object({
        color: z
          .union([z.string(), withRef(z.string())])
          .default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
        radius: z
          .union([z.string(), withRef(z.string())])
          .default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}'),
      })
      .prefault({}),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    transition: z
      .object({
        duration: withRef(z.string()).default('{{primitives.transition.duration}}'),
      })
      .prefault({}),
    font: z
      .object({
        family: withRef(z.string()).default('{{primitives.font.family}}'),
        size: withRef(z.string()).default('{{primitives.font.size}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight}}'),
      })
      .prefault({}),
  }

  static schema = z
    .object({
      ...this.token,
      settings: FieldsetSettingsSchema.schema.prefault({}),
      legend: LegendSchema.schema.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'fieldset' })
}
