import z from 'zod';
import { withRef, bg, color, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataListGridItemRowSchema {
  private static readonly defaultBorderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly hoverBorderTokens = {
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly focusBorderTokens = {
    color: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly focusRingTokens = {
    color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}"),
    style: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}"),
    width: withRef(z.string()).default("{{primitives.focusRing.width.none}}"),
    radius: withRef(z.string()).default("{{primitives.focusRing.radius.none}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset.none}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow.none}}"),
  }

  private static readonly defaultTokens = {
    border: border.default(this.defaultBorderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
  }

  private static readonly hoverTokens = {
    border: border.default(this.hoverBorderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  }

  private static readonly focusTokens = {
    border: border.default(this.focusBorderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    focusRing: z.object({
      ...this.focusRingTokens,
    }).prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      hover: z.object({
        ...this.hoverTokens,
      }).prefault({}),
      focus: z.object({
        ...this.focusTokens,
      }).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataListGridItemRow' });
}

export const dataListGridItemRow = DataListGridItemRowSchema.schema;
