import type { DataTableColumn } from './data-table-column.model'
import type { Row } from '../components/data-table/data-table.component'

export interface DataTableRowGroupingConfig {
  columnId: string
  groupKeyPath?: string
}

export interface DataTableGroupCellContext {
  groupKey: string | number
  label: string
  memberCount: number
  rowObject: Row
  column: DataTableColumn
}
