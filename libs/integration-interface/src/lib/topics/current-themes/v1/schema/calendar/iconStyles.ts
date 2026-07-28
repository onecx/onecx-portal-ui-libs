import z from 'zod'
import { bg, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Shared schema for icon styling (calendar icon)
 */
export class CalendarIconStylesSchema {
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

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
  })

  private static readonly activeTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      active: this.activeTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarIconStyles' })
}
