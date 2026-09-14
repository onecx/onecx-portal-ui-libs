import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { border, color, bg, withRef } from '../primitives'
import { DataviewSettingsSchema } from './settings'
import { DataviewHeaderSchema } from './header'
import { DataviewContentSchema } from './content'
import { DataviewFooterSchema } from './footer'

export class DataviewSchema {
  static readonly tokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
    background: z
          .union([bg, withRef(z.string())])
          .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.border.radius.none}}',
      offset: '{{primitives.border.offset.none}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      settings: (DataviewSettingsSchema.schema as typeof DataviewSettingsSchema.schema).optional(),
      header: (DataviewHeaderSchema.schema as typeof DataviewHeaderSchema.schema).prefault({}),
      content: (DataviewContentSchema.schema as typeof DataviewContentSchema.schema).prefault({}),
      footer: (DataviewFooterSchema.schema as typeof DataviewFooterSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataview' })
}
