import z from 'zod';
import { border, focusRingShape, icon } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class FilterViewChipRemoveIconButtonSchema {
  private static readonly borderCommonTokens = {
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
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.focusRing.radius}}",
    offset: "{{primitives.focusRing.offset}}",
    shadow: "{{primitives.focusRing.shadow}}",
  }

  private static readonly defaultTokens = {
    border: border.default(this.borderCommonTokens),
    focusRing: focusRingShape.default(this.focusRingTokens),
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
    focusRing: focusRingShape.default(this.focusRingTokens),
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
    .register(themeSchemaRegistry, { id: 'filterViewChipRemoveIconButton' });
}

export const filterViewChipRemoveIconButton = FilterViewChipRemoveIconButtonSchema.schema;
