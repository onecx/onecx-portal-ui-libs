import z from 'zod';
import { font } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataTableColumnTitleSchema {
  private static readonly tokens = {
    font: font.pick({ weight: true }).default({
      weight: '{{primitives.font.weight}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'dataTableColumnTitle' });
}

export const dataTableColumnTitle = DataTableColumnTitleSchema.schema;
