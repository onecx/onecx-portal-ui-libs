import z from 'zod'
import { bg, withRef, color, border, font } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// TODO: Refactor to relevant tokens from button usage tokens
/**
 * Navigation selector buttons in the calendar header panel (e.g. selectMonth, selectYear) schema.
 */
export class CalendarNavigationSelectorSchema {
  private static readonly commonTokens = {
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    font: font.pick({ weight: true, size: true }).default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    }),
    border: border.default({
      width: '{{primitives.border.width.none}}',
    }),
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  }

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z.union([bg, withRef(z.string())]).default('{{primitives.defaultVariant.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.hover.defaultSeverity.contrast}}'),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z.union([bg, withRef(z.string())]).default('{{primitives.defaultVariant.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.focus.defaultSeverity.contrast}}'),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarNavigationSelector' })
}
