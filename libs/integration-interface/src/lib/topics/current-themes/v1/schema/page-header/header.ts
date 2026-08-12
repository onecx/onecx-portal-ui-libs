import z from 'zod'
import { withRef } from '../primitives'

export class PageHeaderSchema {
  static readonly tokens = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z.object({
    title: z
      .object({
        font: z.object({
          family: withRef(z.string()).default('{{primitives.font.family}}'),
          size: withRef(z.string()).default('{{primitives.font.size}}'),
          weight: withRef(z.string()).default('{{primitives.font.weight}}'),
        }),
      })
      .optional(),
    subtitle: z.object({
        font: z.object({
          family: withRef(z.string()).default('{{primitives.font.family}}'),
          size: withRef(z.string()).default('{{primitives.font.size}}'),
          weight: withRef(z.string()).default('{{primitives.font.weight}}'),
        }),
    }).optional(),
    titleIcon: z.object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
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
    actionPanel: z.object({}).optional(),
  })
}
