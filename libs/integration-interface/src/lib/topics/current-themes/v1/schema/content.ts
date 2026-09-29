import * as z from 'zod'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const contentTitle = z
  .object({
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size.lg}}',
      weight: '{{primitives.font.weight.medium}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'contentTitle' })
export const content = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.surface.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
    marginX: withRef(z.string()).default('0'),
    marginY: withRef(z.string()).default('{{primitives.space.xl}}'),
    border: border.default({
      color: '{{primitives.area.surface.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.surface.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    shadow: withRef(z.string()).default('{{primitives.shadow.md}}'),
    title: (contentTitle as typeof contentTitle).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'content' })
