import z from 'zod';
import { withRef, color, bg, border } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { DataListGridItemCardSchema } from './data-list-grid-item-card';
import { DataListGridItemRowSchema } from './data-list-grid-item-row';

export class DataListGridSchema {
  private static readonly borderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly tokens = {
    border: border.default(this.borderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    justifyContent: withRef(z.string()).default("flex-start")
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      itemCard: (
        DataListGridItemCardSchema.schema as typeof DataListGridItemCardSchema.schema
      ).prefault({}),
      itemRow: (
        DataListGridItemRowSchema.schema as typeof DataListGridItemRowSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataListGrid' });
}

export const dataListGrid = DataListGridSchema.schema;
