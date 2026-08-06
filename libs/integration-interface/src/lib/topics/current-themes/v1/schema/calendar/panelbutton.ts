import z from 'zod'
import { bg, withRef, color, border, borderWithShadow } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// TODO: Refactor to relevant tokens from button usage tokens
/**
 * Panel buttons in the calendar panel (e.g. navigation buttons in panel header) schema.
 */
export class CalendarPanelButtonSchema {
  private static readonly commonTokens = {
    width: withRef(z.string()).default('2.5rem'),
    height: withRef(z.string()).default('2.5rem'),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
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
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.hover.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
    }),
  })

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.focus.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
    }),
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
    .register(themeSchemaRegistry, { id: 'calendarPanelButton' })
}