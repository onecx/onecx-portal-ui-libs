import z from 'zod';
import { withRef, bg, color, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { FilterViewChipSchema } from './filter-view-chip';

export class FilterViewSchema {
  private static readonly settings = z.object({
    filterViewEnabled: withRef(z.boolean()).default(false),
    filterViewDisplayMode: withRef(z.enum(['chips', 'button'])).default('button'),
    maxDisplayedChips: withRef(z.number()).default(3),
  })

  private static readonly borderCommonTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly tokens = {
    settings: this.settings.prefault({}),
    border: border.default(this.borderCommonTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    justifyContent: withRef(z.string()).default('flex-end'),
    paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      chip: (FilterViewChipSchema.schema as typeof FilterViewChipSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'filterView' });
}

export const filterView = FilterViewSchema.schema;
