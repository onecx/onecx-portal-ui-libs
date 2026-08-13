import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, font, withRef } from '../primitives'

export class PageHeaderContentSchema {
  static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    borderTop: border.pick({ width: true, color: true }).default({
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    backgroundColor: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }), // There can be a plain text as content
  }

  static readonly grid = {
    value: z.object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }),
    }),
    label: z.object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
      font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }),
      infoIcon: z
        .object({
          color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
          icon: z
            .object({
              size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
              width: withRef(z.string()).default('1rem'),
              height: withRef(z.string()).default('1rem'),
            })
            .prefault({}),
          padding: z
            .object({
              right: withRef(z.string()).default('{{primitives.space.md}}'),
            })
            .prefault({}),
        })
        .prefault({}),
      actionIcon: z
        .object({
          color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
          icon: z
            .object({
              size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
              width: withRef(z.string()).default('1rem'),
              height: withRef(z.string()).default('1rem'),
            })
            .prefault({}),
          padding: z
            .object({
              left: withRef(z.string()).default('{{primitives.space.md}}'),
            })
            .prefault({}),
        })
        .prefault({}),
    }),
  }

  static readonly list = {
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    value: z.object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }),
    }),
    label: z.object({
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      padding: withRef(z.string()).default('{{primitives.space.md}}'),
      gap: withRef(z.string()).default('{{primitives.space.md}}'),
      font: font.pick({ family: true, size: true, weight: true }).default({
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
      }),
      infoIcon: z
        .object({
          color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
          icon: z
            .object({
              size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
              width: withRef(z.string()).default('1rem'),
              height: withRef(z.string()).default('1rem'),
            })
            .prefault({}),
          padding: z
            .object({
              right: withRef(z.string()).default('{{primitives.space.md}}'),
            })
            .prefault({}),
        })
        .prefault({}),
      actionIcon: z
        .object({
          color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
          icon: z
            .object({
              size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
              width: withRef(z.string()).default('1rem'),
              height: withRef(z.string()).default('1rem'),
            })
            .prefault({}),
          padding: z
            .object({
              left: withRef(z.string()).default('{{primitives.space.md}}'),
            })
            .prefault({}),
        })
        .prefault({}),
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'pageHeaderContent' })
}
