import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { BreadcrumbSettingsSchema } from './settings'
import { BreadcrumbItemSchema } from './item'
import { bg, withRef } from '../primitives'

export class BreadcrumbSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    transition: z
      .object({
        duration: withRef(z.string()).default('{{primitives.transition.duration}}'),
      })
      .prefault({}),
  }

  static readonly separator = z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
  })

  static readonly schema = z
    .object({
      ...this.tokens,
      settings: (BreadcrumbSettingsSchema.schema as typeof BreadcrumbSettingsSchema.schema).prefault({}), // done
      item: (BreadcrumbItemSchema.schema as typeof BreadcrumbItemSchema.schema).prefault({}), // done
      separator: this.separator.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumb' })
}
