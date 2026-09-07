import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'

export class DataviewPaginatorSchema {
  private static readonly focusRingTokens = {
    color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}"),
    style: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}"),
    width: withRef(z.string()).default("{{primitives.focusRing.width.none}}"),
    radius: withRef(z.string()).default("{{primitives.focusRing.radius.none}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset.none}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow.none}}"),
  }

  private static readonly tokens = {
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.border.radius.none}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    focusRing: z.object({...this.focusRingTokens,}).prefault({}),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}"),
    color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'dataviewPaginator' })
}
