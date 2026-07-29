import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef, font, bg, color, border, borderWithShadow } from '../primitives'

// TODO: Refactor to relevant tokens from input usage tokens
/**
 * Input field in the filter component of the multiselect overlay schema.
 */
export class MultiselectInputSchema {
  private static readonly commonTokens = {
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ family: true, size: true, weight: true }).default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
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
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
  }

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    focusRing: borderWithShadow.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.shadow}}',
    }),
  })

  private static readonly activeTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      active: this.activeTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectInput' })
}
