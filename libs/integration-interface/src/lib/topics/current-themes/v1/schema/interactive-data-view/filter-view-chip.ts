import z from 'zod';
import { withRef, bg, color, border, focusRingShape, icon, font } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { FilterViewChipRemoveIconButtonSchema } from './filter-view-chip-remove-icon-button';

export class FilterViewChipSchema {
  private static readonly filterViewChipSettings = z.object({
    unstyled: withRef(z.boolean()).default(false),
    disabled: withRef(z.boolean()).default(false),
    removable: withRef(z.boolean()).default(false)
  })

  private static readonly borderTokens = {
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

  private static readonly disabledBorderTokens = {
    color: "{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}",
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

  private static readonly iconFontTokens = {
    family: "{{primitives.font.family}}",
    size: "{{primitives.font.size}}",
    weight: "{{primitives.font.weight}}",
    lineHeight: "{{primitives.font.lineHeight}}",
    letterSpacing: "{{primitives.font.letterSpacing}}",
    style: "{{primitives.font.style}}",
  }

  private static readonly iconTokens = {
    size: "{{primitives.iconSizes.sm}}",
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
    font: this.iconFontTokens,
    content: "",
    url: "",
  }

  private static readonly defaultTokens = {
    settings: this.filterViewChipSettings.prefault({}),
    border: border.default(this.borderTokens),
    focusRing: focusRingShape.default(this.focusRingTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
    icon: icon.default(this.iconTokens),
  }

  private static readonly hoverTokens = {
    border: border.default(this.hoverBorderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    cursor: withRef(z.string()).default("pointer")
  }

  private static readonly disabledTokens = {
    border: border.default(this.disabledBorderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    cursor: withRef(z.string()).default("not-allowed")
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      removeIconButton: (
        FilterViewChipRemoveIconButtonSchema.schema as typeof FilterViewChipRemoveIconButtonSchema.schema
      ).prefault({}),
      hover: z.object({...this.hoverTokens,}).prefault({}),
      disabled: z.object({...this.disabledTokens,}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'filterViewChip' });
}

export const filterViewChip = FilterViewChipSchema.schema;
