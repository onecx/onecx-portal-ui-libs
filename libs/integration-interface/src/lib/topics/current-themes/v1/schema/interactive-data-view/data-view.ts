import z from 'zod';
import { border, withRef, bg, color } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { DataListGridSchema } from './data-list-grid';
import { DataViewContentSchema } from './data-view-content';
import { dataTable } from '../data-table/data-table';

export class DataViewSchema {
  private static readonly tokens = {
    border: border.default({
      color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
      style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
      width: "{{primitives.border.width.none}}",
      radius: "{{primitives.border.radius.none}}",
      offset: "{{primitives.border.offset.none}}",
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      dataListGrid: (
        DataListGridSchema.schema as typeof DataListGridSchema.schema
      ).prefault({}),
      dataViewContent: (DataViewContentSchema.schema as typeof DataViewContentSchema.schema).prefault({}),
      dataTable: (dataTable as typeof dataTable).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataView' });
}

export const dataView = DataViewSchema.schema;
