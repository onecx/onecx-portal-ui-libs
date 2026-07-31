import z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Schema for icon styles used in the calendar input field.
 */
export class CalendarInputIconSchema {
  private static readonly commonTokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    width: withRef(z.string()).default('2.5rem'),
    height: withRef(z.string()).default('2.5rem'),
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
  })

  static readonly activeTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
  })

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
  })

  private static readonly focusRingTokens = {
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      shadow: '{{primitives.shadow.none}}',
      radius: '{{primitives.radius.md}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      ...this.focusRingTokens,
      hover: this.hoverTokens.prefault({}),
      active: this.activeTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarInputIcon' })
}
