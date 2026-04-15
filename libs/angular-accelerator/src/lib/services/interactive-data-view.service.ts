import { Injectable, signal } from "@angular/core";
import { Filter } from "../model/filter.model";
import { DataTableColumn } from "../model/data-table-column.model";
import { Row } from "../components/data-table/data-table.component";
import { DataSortDirection } from "../model/data-sort-direction";

export interface InteractiveDataView {
  layout?: 'grid'|'list'|'table'
  activeColumnGroupKey?: string
  displayedColumns?: DataTableColumn[]
  actionColumnConfig?: { frozen: boolean; position: 'left'|'right' }
  sorting?: { sortColumn: string, sortDirection: DataSortDirection }
  filters?: Filter[]
  selectedRows?: Row[]
  expandedRows?: Row[] | string[] | number[]
  activePage?: number
  pageSize?: number
  listGridPaginator?: boolean
  tablePaginator?: boolean
}

@Injectable()
export class InteractiveDataViewService {
    layout = signal<'grid' | 'list' | 'table'>('table')
    activeColumnGroupKey = signal<string>('')
    displayedColumns = signal< DataTableColumn[]>([])
    ActionColumnConfigFrozen = signal<boolean>(false)
    ActionColumnConfigPosition = signal<'left' | 'right'>('right')
    sortColumn = signal<string>('')
    sortDirection = signal<DataSortDirection>(DataSortDirection.NONE)
    filters = signal<Filter[]>([])
    selectedRows = signal<Row[]>([])
    expandedRows = signal<Row[] | string[] | number[]>([])
    activePage = signal<number>(0)
    pageSize = signal<number>(10)
    listGridPaginator = signal<boolean>(true)
    tablePaginator = signal<boolean>(true)

    
    setFilters(filters: Filter[]) {
      this.filters.set(filters)
    }

    setPageSize(size: number) {
      this.pageSize.set(size)
    }

    setActivePage(page: number) {
      this.activePage.set(page)
    }
    
    setActiveColumnGroupKey(columnGroupKey: string) {
      this.activeColumnGroupKey.set(columnGroupKey)
    }

    setDisplayedColumns(activeColumns: DataTableColumn[]) {
      this.displayedColumns.set(activeColumns);
    }

    setActionColumnConfig(frozen: boolean, position: 'left' | 'right') {
      this.ActionColumnConfigFrozen.set(frozen)
      this.ActionColumnConfigPosition.set(position)
    }

    setLayout(layout: 'grid' | 'list' | 'table') {
      this.layout.set(layout)
    }

    setSortDirection(sortDirection: DataSortDirection) {
      this.sortDirection.set(sortDirection)
    }

    setSortColumn(sortColumn: string) {
      this.sortColumn.set(sortColumn)
    }

    setListGridPaginator(enabled: boolean): void {
      this.listGridPaginator.set(enabled)
    }

    setTablePaginator(enabled: boolean): void {
      this.tablePaginator.set(enabled)
    }

    setSelectedRows(rows: Row[]): void {
      this.selectedRows.set(rows)
    }

    setExpandedRows(rows: Row[] | string[] | number[]): void {
      this.expandedRows.set(rows)
    }
  }
