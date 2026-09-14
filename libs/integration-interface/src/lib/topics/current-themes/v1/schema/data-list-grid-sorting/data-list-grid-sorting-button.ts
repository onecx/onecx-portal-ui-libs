import z from 'zod';
import { border, color, withRef, icon } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataListGridSortingButtonSchema {
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
    focusRing: z.object({
      ...this.focusRingTokens,
    }).prefault({}),
    icon: icon.default({
      size: "{{primitives.iconSizes.sm}}",
      color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
      content: "",
      url: "",
    }),
  }

  private static readonly hoverTokens = {
    border: border.default(this.hoverBorderTokens),
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
    }),
  }

  private static readonly focusTokens = {
    border: border.default(this.focusBorderTokens),
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
    .register(themeSchemaRegistry, { id: 'dataListGridSortingButton' });
}

export const dataListGridSortingButton = DataListGridSortingButtonSchema.schema;
