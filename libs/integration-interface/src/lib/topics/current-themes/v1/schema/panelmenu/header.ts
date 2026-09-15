import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

/**
 * PanelMenu header (panel header) schema.
 * Represents the collapsible panel header with toggle icon.
 */
export class PanelMenuHeaderSchema {
  private static readonly commonTokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }

  private static readonly toggleIconDefaults = {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly toggleIconHoverDefaults = {
    color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly toggleIconActiveDefaults = {
    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly toggleIconFocusDefaults = {
    color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
    rotate: '0deg',
  }

  private static readonly toggleIconDisabledDefaults = {
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
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    toggleIcon: z
      .object({
        color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.toggleIconDefaults),
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
    toggleIcon: z
      .object({
        color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.toggleIconHoverDefaults),
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
    toggleIcon: z
      .object({
        color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.toggleIconActiveDefaults),
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
    toggleIcon: z
      .object({
        color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.toggleIconFocusDefaults),
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
    toggleIcon: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
      })
      .default(this.toggleIconDisabledDefaults),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      active: this.activeTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'panelmenuHeader' })
}
