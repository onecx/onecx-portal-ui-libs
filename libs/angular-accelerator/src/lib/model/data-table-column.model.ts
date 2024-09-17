import { ColumnType } from './column-type.model'

export interface DataTableColumn {
  columnType: ColumnType
  nameKey: string
  id: string
  sortable?: boolean
  filterable?: boolean
  predefinedGroupKeys?: string[]
  dateFormat?: string
}
