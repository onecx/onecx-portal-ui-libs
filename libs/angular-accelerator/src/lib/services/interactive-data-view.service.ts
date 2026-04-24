import { Injectable, signal } from '@angular/core'
import { Filter } from '../model/filter.model'
import { DataTableColumn } from '../model/data-table-column.model'
import { Row } from '../components/data-table/data-table.component'
import { DataSortDirection } from '../model/data-sort-direction'
import { InteractiveExpandedRows, ViewLayout } from '../model/view-layout.model'

export interface InteractiveDataView {
  layout?: ViewLayout
  activeColumnGroupKey?: string
  displayedColumns?: DataTableColumn[]
  actionColumnConfig?: { frozen: boolean; position: 'left'|'right' }
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
export class InteractiveDataViewService {
  layout = signal<ViewLayout>('table')
  activeColumnGroupKey = signal<string | undefined>(undefined)
  displayedColumns = signal<DataTableColumn[]>([])
  ActionColumnConfigFrozen = signal<boolean>(false)
  ActionColumnConfigPosition = signal<'left' | 'right'>('right')
  sortColumn = signal<string>('')
  sortDirection = signal<DataSortDirection>(DataSortDirection.NONE)
  filters = signal<Filter[]>([])
  selectedRows = signal<Row[]>([])
  expandedRows = signal<InteractiveExpandedRows>([])
  activePage = signal<number>(0)
  pageSize = signal<number>(10)
  listGridPaginator = signal<boolean>(true)
  tablePaginator = signal<boolean>(true)

   setLayout(layout: ViewLayout) {
    this.layout.set(layout)
  }

  setActiveColumnGroupKey(columnGroupKey: string | undefined) {
    this.activeColumnGroupKey.set(columnGroupKey)
  }

  setDisplayedColumns(activeColumns: DataTableColumn[]) {
    this.displayedColumns.set(activeColumns)
  }

  setActionColumnConfig(frozen: boolean, position: 'left' | 'right') {
    this.ActionColumnConfigFrozen.set(frozen)
    this.ActionColumnConfigPosition.set(position)
  }

  setSortColumn(sortColumn: string) {
    this.sortColumn.set(sortColumn)
  }

  setSortDirection(sortDirection: DataSortDirection) {
    this.sortDirection.set(sortDirection)
  }

  setFilters(filters: Filter[]) {
    this.filters.set(filters)
  }

  setSelectedRows(rows: Row[]): void {
    this.selectedRows.set(rows)
  }

  setExpandedRows(rows: InteractiveExpandedRows): void {
    this.expandedRows.set(rows)
  }
  
  setActivePage(page: number) {
    this.activePage.set(page)
  }

  setPageSize(size: number) {
    this.pageSize.set(size)
  }

  setListGridPaginator(enabled: boolean): void {
    this.listGridPaginator.set(enabled)
  }

  setTablePaginator(enabled: boolean): void {
    this.tablePaginator.set(enabled)
  }
}
