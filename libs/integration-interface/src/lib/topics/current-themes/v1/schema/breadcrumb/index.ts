import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { BreadcrumbSettingsSchema } from './settings'
import { BreadcrumbItemSchema } from './item'
import { withRef } from '../primitives'

export class BreadcrumbSchema {
  private static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    transition: z.object({
      duration: withRef(z.string()).default('{{primitives.transition.duration}}'),
    }).prefault({}),
  }

  static readonly seperator = z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  }).prefault({})

  static readonly schema = z
    .object({
      ...this.tokens,
      settings: (BreadcrumbSettingsSchema.schema as typeof BreadcrumbSettingsSchema.schema).prefault({}),
      breadcrumb: (BreadcrumbItemSchema.schema as typeof BreadcrumbItemSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumb' })
}
