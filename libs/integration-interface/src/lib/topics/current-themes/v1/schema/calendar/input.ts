import z from 'zod'
import { bg, withRef, color, border, font, borderWithShadow } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// TODO: Refactor to relevant tokens from input usage tokens
/**
 * Input field in the calendar header panel schema.
 */
export class CalendarInputSchema {
  private static readonly commonTokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    shadow: withRef(z.string()).default('{{primitives.shadow.md}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    sm: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.sm}}'),
        fontSize: withRef(z.string()).default('{{primitives.font.size}}'),
      })
      .optional(),
    lg: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.lg}}'),
        fontSize: withRef(z.string()).default('{{primitives.font.size}}'),
      })
      .optional(),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.md}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
    }),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
  }

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
    }),
    placeholderColor: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
    }),
    placeholderColor: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
    focusRing: borderWithShadow.default({
      color: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.width}}',
      offset: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.offset}}',
      shadow: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.shadow}}',
      radius: '{{primitives.variant.primary.state.focus.defaultSeverity.focusRing.radius}}',
    }),
  })

  private static readonly disabledTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.style}}',
    }),
    placeholderColor: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
  })

  private static readonly invalidTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.style}}',
    }),
    placeholderColor: color.default('{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}'),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
      invalid: this.invalidTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarInput' })
}
