import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { borderWithShadow, withRef } from '../primitives'
import { de } from 'zod/v4/locales'

export class BreadcrumbItemSchema {
  private static readonly tokens = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'),
    border: z
      .object({
        radius: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}'),
      })
      .prefault({}),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
    icon: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
        hover: z
          .object({
            color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
          })
          .prefault({}),
      })
      .prefault({}),
    label: z
      .object({
        font: z
          .object({
            weight: withRef(z.string()).default('{{primitives.font.weight}}'),
            size: withRef(z.string()).default('{{primitives.font.size.md}}'),
          })
          .prefault({}),
        textDecoration: withRef(z.string()).default('none'),
      })
      .prefault({}),
  }

  static readonly focusRing = borderWithShadow.default({
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    width: '{{primitives.focusRing.width.md}}',
    offset: '{{primitives.focusRing.offset.md}}',
    radius: '{{primitives.focusRing.radius.md}}',
    shadow: '{{primitives.focusRing.shadow.md}}',
  })

  static readonly itemHover = z.object({
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    textDecoration: withRef(z.string()).default('underline'),
  })

  static readonly itemFocus = z.object({
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    focusRing: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}'),
      })
      .prefault({}),
    textDecoration: withRef(z.string()).default('underline'),
  })

  static readonly itemActive = z.object({
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    textDecoration: withRef(z.string()).default('underline'),
  })

  static readonly itemDisabled = z.object({
    backgroundColor: withRef(z.string()).default(
      '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}'
    ),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default(
          '{{primitives.defaultVariant.state.disableda.defaultSeverity.border.color}}'
        ),
      })
      .prefault({}),
    textDecoration: withRef(z.string()).default('underline'),
  })
  
  static readonly schema = z
    .object({
      ...this.tokens,
      hover: (this.itemHover as typeof this.itemHover).prefault({}),
      focus: (this.itemFocus as typeof this.itemFocus).prefault({}),
      disabled: (this.itemDisabled as typeof this.itemDisabled).prefault({}),
      active: (this.itemActive as typeof this.itemActive).prefault({}),
      focusRing: (this.focusRing as typeof this.focusRing).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'breadcrumbItem' })
}
