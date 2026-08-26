import z from 'zod';
import { bg, border, color, font, withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataTableStylesSchema {
  private static readonly borderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly fontTokens = {
    family: "{{primitives.font.family}}",
    size: "{{primitives.font.size}}",
    weight: "{{primitives.font.weight}}",
    lineHeight: "{{primitives.font.lineHeight}}",
    letterSpacing: "{{primitives.font.letterSpacing}}",
    style: "{{primitives.font.style}}",
  }

  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.surface.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    border: border.default(this.borderTokens),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.default(this.fontTokens),
    textAlign: withRef(z.string()).default('left'),
    borderCollapse: withRef(z.enum(['collapse', 'separate'])).default('separate'),
    shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'dataTableStyles' });
}

export const dataTableStyles = DataTableStylesSchema.schema;
