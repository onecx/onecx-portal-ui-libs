import { ColumnType } from './column-type.model'
import { FilterType } from './filter.model'

export interface DataTableColumn {
  columnType: ColumnType
  nameKey: string
  id: string
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  predefinedGroupKeys?: string[]
  dateFormat?: string
}
