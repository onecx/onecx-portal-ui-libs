import z from 'zod';
import { withRef, bg, color, font, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataListGridSortingFloatLabelSchema {
  private static readonly defaultTokens = {
    font: font.pick({ weight: true }).default({
      weight: '{{primitives.font.weight}}',
    }),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  }

  private static readonly focusTokens = {
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  }

  private static readonly activeBorderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly activeTokens = {
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    font: font.pick({ size: true, weight: true }).default({
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
    border: border.default(this.activeBorderTokens),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      focus: z.object({
        ...this.focusTokens,
      }).prefault({}),
      active: z.object({
        ...this.activeTokens,
      }).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataListGridSortingFloatLabel' });
}

export const dataListGridSortingFloatLabel = DataListGridSortingFloatLabelSchema.schema;
