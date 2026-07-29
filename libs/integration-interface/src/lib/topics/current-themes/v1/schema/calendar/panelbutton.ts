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
    color: color.default('{{primitives.area.overlay.defaultState.defaultVariant.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultVariant.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
  }

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.hover.defaultVariant.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.hover.defaultVariant.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.area.overlay.state.focus.defaultVariant.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.state.focus.defaultVariant.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.width}}',
      offset: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.offset}}',
      shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}',
      radius: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.radius}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarPanelButton' })
}
