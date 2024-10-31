import { DataTableColumn } from './data-table-column.model'

export interface ColumnFilterDataSelectOptions {
  reverse: boolean
}

export interface ColumnFilterData {
  column: DataTableColumn
  filter: Filter
}

export type Filter = { columnId: string; value: unknown; filterType?: FilterType }

export enum FilterType {
  EQUAL = 'EQUAL',
  TRUTHY = 'TRUTHY',
}
