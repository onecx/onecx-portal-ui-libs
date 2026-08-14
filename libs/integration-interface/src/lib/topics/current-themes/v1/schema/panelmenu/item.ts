import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

/**
 * PanelMenu item schema.
 * Represents individual menu items within the panel content.
 */
export class PanelMenuItemSchema {
  private static readonly commonTokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
  }

  private static readonly iconDefaults = {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly iconHoverDefaults = {
    color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly iconActiveDefaults = {
    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly iconFocusDefaults = {
    color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly iconDisabledDefaults = {
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    icon: z
      .object({
        color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.iconDefaults),
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.hover.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
    }),
    icon: z
      .object({
        color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.iconHoverDefaults),
  })

  static readonly activeTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
    }),
    icon: z
      .object({
        color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.iconActiveDefaults),
  })

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.focus.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
    }),
    icon: z
      .object({
        color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.iconFocusDefaults),
  })

  static readonly disabledTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    icon: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.iconDisabledDefaults),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      active: this.activeTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'panelmenuItem' })
}
