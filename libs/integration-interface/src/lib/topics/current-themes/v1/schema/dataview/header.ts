import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'
import { DataviewPaginatorSchema } from './paginator'

export class DataviewHeaderSchema {
  private static readonly tokens = {
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
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      paginator: (DataviewPaginatorSchema.schema as typeof DataviewPaginatorSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataviewHeader' })
}
