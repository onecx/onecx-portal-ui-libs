import z from 'zod'
import { withRef, color, bg, font } from '../primitives'

export class PageHeaderTitleBarSchema {
  static readonly tokens = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly title = z.object({
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  })

  static readonly subtitle = z.object({
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
  })

  static readonly titleIcon = z.object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg.pick({ color: true }).default({
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.bg.color}}',
    }),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.md}}'),
        width: withRef(z.string()).default('1rem'),
        height: withRef(z.string()).default('1rem'),
      })
      .prefault({}),
    image: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.md}}'),
        width: withRef(z.string()).default('1rem'),
        height: withRef(z.string()).default('1rem'),
      })
      .prefault({}),
  })

  static readonly titleWrap = z.object({
    alignItems: withRef(z.string()).default('flex-start'),
  })

  static readonly actionPanel = z.object({
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    alignment: z
      .object({
        horizontal: withRef(z.enum(['left', 'center', 'right'])).default('center'),
        vertical: withRef(z.enum(['top', 'middle', 'bottom'])).default('middle'),
      })
      .prefault({}),
  })

  static readonly schema = z.object({
    ...this.tokens,
    title: this.title.prefault({}),
    subtitle: this.subtitle.prefault({}),
    titleIcon: this.titleIcon.prefault({}),
    titleWrap: this.titleWrap.prefault({}),
    actionPanel: this.actionPanel.prefault({}),
  })
}
