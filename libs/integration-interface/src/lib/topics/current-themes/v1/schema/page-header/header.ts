import z from 'zod'
import { withRef, color, bg, font } from '../primitives'

export class PageHeaderSchema {
  static readonly tokens = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    backgroundColor: bg.pick({color: true}).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z.object({
    ...this.tokens,
    title: z
      .object({
        font: font.pick({family: true, size: true, weight: true}).default({
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        }),
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
      })
      .optional(),
    subtitle: z.object({
        font: font.pick({family: true, size: true, weight: true}).default({
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        }),
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
    }).optional(),
    titleIcon: z.object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      icon: z.object({
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
        width: withRef(z.string()).default('1rem'),
        height: withRef(z.string()).default('1rem'),
      }),
      image: z.object({
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
        width: withRef(z.string()).default('1rem'),
        height: withRef(z.string()).default('1rem'),
      })
    }).optional(),
    actionPanel: z.object({}).optional(), // TODO: visit this once everything else is done
  })
}
