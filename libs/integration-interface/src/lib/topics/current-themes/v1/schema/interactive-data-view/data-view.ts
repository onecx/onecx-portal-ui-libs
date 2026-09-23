import * as z from 'zod'
import { DataListGridSchema, dataListGridShape } from './data-list-grid/data-list-grid'
import { dataTable } from '../data-table/data-table'
import { DataviewSchema, dataviewShape } from '../dataview/dataview'
import { themeSchemaRegistry } from '../registry'

const dataTableShape = z.object(dataTable.shape)

export const dataViewShape = dataviewShape.extend({
  dataListGrid: dataListGridShape.optional(),
  dataTable: dataTableShape.optional(),
})

const dataViewWithDefaults = DataviewSchema.schema.extend({
  dataListGrid: (DataListGridSchema.schema as typeof DataListGridSchema.schema).prefault({}),
  dataTable: (dataTable as typeof dataTable).prefault({}),
})

export class DataViewSchema {
  static readonly schema = dataViewWithDefaults.register(themeSchemaRegistry, { id: 'dataView' })
}

export const dataView = DataViewSchema.schema
