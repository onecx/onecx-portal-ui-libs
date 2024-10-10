import { FilterType } from '../components/data-table/data-table.component'
import { ColumnType } from './column-type.model'

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
