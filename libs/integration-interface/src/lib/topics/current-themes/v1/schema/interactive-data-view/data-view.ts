import { DataListGridSchema } from '../data-list-grid/data-list-grid';
import { dataTable } from '../data-table/data-table';
import { DataviewSchema } from '../dataview/dataview';
import { themeSchemaRegistry } from '../registry';

export class DataViewSchema {
  static readonly schema = DataviewSchema.schema.extend({
      dataListGrid: (
        DataListGridSchema.schema as typeof DataListGridSchema.schema
      ).prefault({}),
      dataTable: (dataTable as typeof dataTable).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataView' });
}

export const dataView = DataViewSchema.schema;
