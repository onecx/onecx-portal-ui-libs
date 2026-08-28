import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, font, withRef } from '../primitives'

export class PageHeaderContentSchema {
  static readonly tokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    borderTop: border.pick({ width: true, color: true }).default({
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
  }

  static readonly detailInfoIcon = z.object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.md}}'),
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

  static readonly detailActionIcon = z.object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.md}}'),
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

  static readonly detailValue = z.object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    infoIcon: this.detailInfoIcon.prefault({}),
    actionIcon: this.detailActionIcon.prefault({}),
  })

  static readonly detailLabel = z.object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
  })

  static readonly objectPanel = {
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    value: this.detailValue.prefault({}),
    label: this.detailLabel.prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      ...this.objectPanel,
    })
    .register(themeSchemaRegistry, { id: 'pageHeaderContent' })
}
