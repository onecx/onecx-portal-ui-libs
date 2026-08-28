import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, transition, withRef } from '../primitives'
import { MenuItemSchema } from './item'
import { MenuSettingsSchema } from './settings'

export class MenuSchema {
  static readonly tokens = {
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    border: borderWithShadow.pick({ color: true, radius: true, shadow: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    transition: transition.pick({ duration: true }).default({ duration: '{{primitives.transition.duration}}' }),
    padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
    gap: withRef(z.string()).default('{{primitives.spacing.sm}}'),
  }

  static readonly submenuLabel = z.object({
    padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
    font: z
      .object({
        weight: withRef(z.string()).default('{{primitives.font.weight.normal}}'),
        size: withRef(z.string()).default('{{primitives.font.size}}'),
      })
      .prefault({}),
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  })

  static readonly submenuIcon = z.object({
    size: withRef(z.string()).default('{{primitives.icon.md}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    focus: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })

  static readonly separator = z.object({
    border: border.pick({ color: true, width: true }).default({
      width: '{{primitives.border.width.sm}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.tokens,
      settings: (MenuSettingsSchema.schema as typeof MenuSettingsSchema.schema).prefault({}),
      item: (MenuItemSchema.schema as typeof MenuItemSchema.schema).prefault({}),
      submenuLabel: this.submenuLabel.prefault({}),
      submenuIcon: this.submenuIcon.prefault({}),
      separator: this.separator.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'menu' })
}
