import z from 'zod';
import { themeSchemaRegistry } from '../registry';
import { DataTableStylesSchema } from './data-table-styles';
import { dataTableSettings } from './data-table-settings';
import { DataTableHeaderRowSchema } from './data-table-header-row';
import { DataTableFooterRowSchema } from './data-table-footer-row';
import { DataTableRowSchema } from './data-table-row';
import { DataTableColumnTitleSchema } from './data-table-column-title';

export class DataTableSchema {
  static readonly schema = z
    .object({
      settings: (dataTableSettings as typeof dataTableSettings).prefault({}),
      base: (
        DataTableStylesSchema.schema as typeof DataTableStylesSchema.schema
      ).prefault({}),
      header: (
        DataTableHeaderRowSchema.schema as typeof DataTableHeaderRowSchema.schema
      ).prefault({}),
      footer: (
        DataTableFooterRowSchema.schema as typeof DataTableFooterRowSchema.schema
      ).prefault({}),
      row: (
        DataTableRowSchema.schema as typeof DataTableRowSchema.schema
      ).prefault({}),
      columnTitle: (
        DataTableColumnTitleSchema.schema as typeof DataTableColumnTitleSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTable' });
}

export const dataTable = DataTableSchema.schema;
