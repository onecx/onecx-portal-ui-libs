import z from 'zod'
import { bg, withRef, color, border, font, borderWithShadow } from '../primitives'
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
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
  })

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
  })

  private static readonly focusRingTokens = {
    focusRing: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
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
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarNavigationSelector' })
}