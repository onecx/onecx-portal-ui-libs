import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, font, icon, withRef } from '../primitives'

export class BreadcrumbItemSchema {
  private static readonly tokens = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' }),
    border: border.pick({ radius: true, width: true, color: true }).default({
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
    icon: icon.pick({ color: true, size: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      size: '{{primitives.icon.md}}',
    }),
    label: z
      .object({
        font: font.pick({ weight: true, size: true }).default({
          weight: '{{primitives.font.weight}}',
          size: '{{primitives.font.size}}',
        }),
      })
      .prefault({}),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      width: '{{primitives.focusRing.width.md}}',
      offset: '{{primitives.focusRing.offset.md}}',
      radius: '{{primitives.focusRing.radius.md}}',
      shadow: '{{primitives.focusRing.shadow.md}}',
    }),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly itemHover = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemFocus = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemActive = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
    }),
  })

  static readonly itemDisabled = z.object({
    background: bg
      .pick({ color: true })
      .default({ color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' }),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    }),
    icon: icon.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.tokens,
      hover: (this.itemHover as typeof this.itemHover).prefault({}),
      focus: (this.itemFocus as typeof this.itemFocus).prefault({}),
      disabled: (this.itemDisabled as typeof this.itemDisabled).prefault({}),
      active: (this.itemActive as typeof this.itemActive).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumbItem' })
}
