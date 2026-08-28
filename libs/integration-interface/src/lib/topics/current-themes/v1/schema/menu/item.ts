import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, font, withRef } from '../primitives'

export class MenuItemSchema {
  static readonly iconFocus = {
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  }

  static readonly iconHover = {
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  }
  static readonly icon = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    focus: z
      .object({
        ...this.iconFocus,
      })
      .prefault({}),
    hover: z
      .object({
        ...this.iconHover,
      })
      .prefault({}),
    size: withRef(z.string()).default('{{primitives.icon.md}}'),
  }
  static readonly label = {
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight.normal}}',
    }),
  }

  static readonly separatorTokens = {
    border: border.pick({ color: true, width: true }).default({
      width: '{{primitives.border.width.sm}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
  }

  static readonly subMenuItemTokens = {
    padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight.normal}}',
    }),
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    icon: z
      .object({
        ...this.icon,
      })
      .prefault({}),
  }

  static readonly tokens = {
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
    gap: withRef(z.string()).default('{{primitives.spacing.sm}}'),
    border: border.pick({ color: true, radius: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.border.radius.md}}',
    }),
    label: z
      .object({
        ...this.label,
      })
      .prefault({}),
    separator: z
      .object({
        ...this.separatorTokens,
      })
      .prefault({}),
    subMenuItem: z
      .object({
        ...this.subMenuItemTokens,
      })
      .prefault({}),
    icon: z
      .object({
        ...this.icon,
      })
      .prefault({}),
  }

  static readonly focusTokens = {
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  }

  static readonly hoverTokens = {
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      focus: z
        .object({
          ...this.focusTokens,
        })
        .prefault({}),
      hover: z
        .object({
          ...this.hoverTokens,
        })
        .prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'menu-item' })
}
