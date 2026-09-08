import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { PageHeaderSettingsSchema } from './settings'
import { PageHeaderTitleBarSchema } from './title-bar'
import { withRef, bg, borderWithShadow } from '../primitives'
import { PageHeaderContentSchema } from './content'

export class PageHeaderSchema {
  private static readonly tokens = {
    border: borderWithShadow.pick({ width: true, color: true, radius: true, shadow: true }).default({
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    marginX: withRef(z.string()).default('{{primitives.space.md}}'),
    marginY: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      settings: (PageHeaderSettingsSchema.schema as typeof PageHeaderSettingsSchema.schema).prefault({}),
      breadcrumbWrapper: z
        .object({
          padding: withRef(z.string()).optional().default('{{primitives.space.md}}'),
          margin: withRef(z.string()).optional().default('{{primitives.space.md}}'),
        })
        .prefault({}),
      header: (PageHeaderTitleBarSchema.schema as typeof PageHeaderTitleBarSchema.schema).prefault({}),
      content: (PageHeaderContentSchema.schema as typeof PageHeaderContentSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'pageHeader' })
}
