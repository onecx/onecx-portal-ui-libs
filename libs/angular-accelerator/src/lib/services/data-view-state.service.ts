import { Injectable, signal } from '@angular/core'
import { Filter } from '../model/filter.model'
import { DataAction } from '../model/data-action'
import { DataTableColumn } from '../model/data-table-column.model'
import { Row } from '../components/data-table/data-table.component'
import { DataSortDirection } from '../model/data-sort-direction'
import { InteractiveExpandedRows, ViewLayout } from '../model/view-layout.model'
import { RowListGridData } from '../model/row-list-grid-data.model'

export interface InteractiveDataView {
  layout?: ViewLayout
  activeColumnGroupKey?: string
  columns?: DataTableColumn[]
  actionColumnConfig?: { frozen: boolean; position: 'left'|'right' }
  data?: Row[]
  additionalActions?: DataAction[]
  sorting?: { sortColumn: string, sortDirection: DataSortDirection }
  filters?: Filter[]
  selectedRows?: Row[]
  expandedRows?: InteractiveExpandedRows
  activePage?: number
  pageSize?: number
  listGridPaginator?: boolean
  tablePaginator?: boolean
}

@Injectable()
export class DataViewStateService {
  layout = signal<ViewLayout>('grid')
  activeColumnGroupKey = signal<string | undefined>(undefined)
  availableColumns = signal<DataTableColumn[]>([])
  columns = signal<DataTableColumn[]>([])
  actionColumnConfigFrozen = signal<boolean>(false)
  actionColumnConfigPosition = signal<'left' | 'right'>('right')
  data = signal<RowListGridData[]>([])
  additionalActions = signal<DataAction[]>([])
  sortColumn = signal<string>('')
  sortDirection = signal<DataSortDirection>(DataSortDirection.NONE)
  filters = signal<Filter[]>([])
  selectedRows = signal<Row[]>([])
  expandedRows = signal<InteractiveExpandedRows>([])
  activePage = signal<number>(0)
  pageSize = signal<number | undefined>(10)
  listGridPaginator = signal<boolean>(true)
  tablePaginator = signal<boolean>(true)
}
