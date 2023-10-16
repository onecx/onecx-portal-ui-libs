import { Component, ContentChild, EventEmitter, Injector, Input, OnInit, Output, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SelectItem } from 'primeng/api'
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of } from 'rxjs'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { ColumnType } from '../../../model/column-type.model'
import { DataAction } from '../../../model/data-action'

type Primitive = number | string | boolean | bigint | Date
export type Row = {
  id: string | number
  [columnId: string]: Primitive
}
export type Filter = { columnId: string; value: string }
export type Sort = { sortColumn: string; sortDirection: DataSortDirection }

@Component({
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  _rows$ = new BehaviorSubject<Row[]>([])
  @Input()
  get rows(): Row[] {
    return this._rows$.getValue()
  }
  set rows(value: Row[]) {
    this._rows$.next(value)
  }
  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    this._filters$.next(value)
  }
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    this._sortDirection$.next(value)
  }
  _sortColumn$ = new BehaviorSubject<string>('')
  @Input()
  get sortColumn(): string {
    return this?._sortColumn$.getValue()
  }
  set sortColumn(value: string) {
    this?._sortColumn$.next(value)
  }
  @Input() columns: DataTableColumn[] = []
  @Input() clientSideFiltering = true
  @Input() clientSideSorting = true
  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number = this.pageSizes[0] || 50
  @Input() emptyResultsMessage: string | undefined
  @Input() name = 'Data table'
  @Input() deletePermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() editPermission: string | undefined

  @Input() standardCellTemplate: TemplateRef<any> | undefined
  @ContentChild('standardCell') standardCellChildTemplate: TemplateRef<any> | undefined
  get _standardCell(): TemplateRef<any> | undefined {
    return this.standardCellTemplate || this.standardCellChildTemplate
  }

  @Input() dateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateCell') dateCellChildTemplate: TemplateRef<any> | undefined
  get _dateCell(): TemplateRef<any> | undefined {
    return this.dateCellTemplate || this.dateCellChildTemplate
  }

  @Input() relativeDateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateCell') relativeDateCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateCell(): TemplateRef<any> | undefined {
    return this.relativeDateCellTemplate || this.relativeDateCellChildTemplate
  }

  @Input() cellTemplate: TemplateRef<any> | undefined
  @ContentChild('cell') cellChildTemplate: TemplateRef<any> | undefined
  get _cell(): TemplateRef<any> | undefined {
    return this.cellTemplate || this.cellChildTemplate
  }
  @Input() translationKeyCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyCell') translationKeyCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyCell(): TemplateRef<any> | undefined {
    return this.translationKeyCellTemplate || this.translationKeyCellChildTemplate
  }

  @Input() additionalActions: DataAction[] = []

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() viewTableRow = new EventEmitter<Row>()
  @Output() editTableRow = new EventEmitter<Row>()
  @Output() deleteTableRow = new EventEmitter<Row>()

  displayedRows$: Observable<Row[]> | undefined

  currentFilterColumn$ = new BehaviorSubject<DataTableColumn | null>(null)
  currentFilterOptions$: Observable<SelectItem[]> | undefined
  currentSelectedFilters$: Observable<string[]> | undefined
  filterAmounts$: Observable<Record<string, number>> | undefined
  get sortedObserved(): boolean {
    return this.injector.get('DataViewComponent')?.sorted.observed || this.sorted.observed
  }
  get filteredObserved(): boolean {
    return this.injector.get('DataViewComponent')?.filtered.observed || this.filtered.observed
  }

  constructor(private translateService: TranslateService, private router: Router, private injector: Injector) {
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
  }

  ngOnInit(): void {
    this.displayedRows$ = combineLatest([this._rows$, this._filters$, this._sortColumn$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateColumns(params)),
      map((params) => this.filterRows(params)),
      map((params) => this.sortRows(params)),
      map(([rows]) => rows)
    )
    this.currentSelectedFilters$ = combineLatest([this._filters$, this.currentFilterColumn$]).pipe(
      map(([filters, currentFilterColumn]) => {
        return filters.filter((filter) => filter.columnId === currentFilterColumn?.id).map((filter) => filter.value)
      })
    )
    this.currentFilterOptions$ = combineLatest([this._rows$, this.currentFilterColumn$, this._filters$]).pipe(
      mergeMap(([rows, currentFilterColumn, filters]) => {
        if (!currentFilterColumn?.id) {
          return of([])
        }
        const currentFilters = filters
          .filter((filter) => filter.columnId === currentFilterColumn?.id)
          .map((filter) => filter.value)

        const columnValues = rows.map((row) => row[currentFilterColumn?.id])
        const translateObservable =
          this.columns.find((c) => c.id === currentFilterColumn?.id)?.columnType === ColumnType.TRANSLATION_KEY
            ? this.translateService.get(columnValues as string[])
            : of(Object.fromEntries(columnValues.map((cv) => [cv, cv])))
        return translateObservable.pipe(
          map((translatedValues) => {
            return Object.values(translatedValues)
              .concat(currentFilters)
              .filter((value, index, self) => self.indexOf(value) === index && value != null)
              .map(
                (filterOption) =>
                  ({
                    label: filterOption,
                    value: filterOption,
                  } as SelectItem)
              )
          })
        )
      })
    )
    this.filterAmounts$ = this._filters$.pipe(
      map((filters) =>
        filters
          .map((filter) => filter.columnId)
          .map((columnId) => [columnId, filters.filter((filter) => filter.columnId === columnId).length])
      ),
      map((amounts) => Object.fromEntries(amounts))
    )
  }

  onSortColumnClick(sortColumn: string) {
    const newSortDirection =
      sortColumn !== this.sortColumn
        ? this.sortStates[0]
        : this.sortStates[(this.sortStates.indexOf(this.sortDirection) + 1) % this.sortStates.length]

    this._sortColumn$.next(sortColumn)
    this._sortDirection$.next(newSortDirection)

    this.sorted.emit({ sortColumn: sortColumn, sortDirection: newSortDirection })
  }

  onDeleteRow(selectedTableRow: Row) {
    this.deleteTableRow.emit(selectedTableRow)
  }

  onViewRow(selectedTableRow: Row) {
    this.viewTableRow.emit(selectedTableRow)
  }

  onEditRow(selectedTableRow: Row) {
    this.editTableRow.emit(selectedTableRow)
  }

  onFilterClick(column: DataTableColumn) {
    this.currentFilterColumn$.next(column)
  }

  onFilterChange(column: DataTableColumn, event: any) {
    const filters = this.filters
      .filter((filter) => filter.columnId !== column.id)
      .concat(
        event.value.map((value: Primitive) => ({
          columnId: column.id,
          value,
        }))
      )
    if (this.clientSideFiltering) {
      this.filters = filters
    }
    this.filtered.emit(filters)
  }

  private translateColumns([rows, filters, sortColumn, sortDirection]: [
    Row[],
    Filter[],
    string,
    DataSortDirection
  ]): Observable<[Row[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>]> {
    if (this.clientSideFiltering || this.clientSideSorting) {
      let translationKeys: string[] = []
      const translatedColumns = this.columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
      translatedColumns.forEach((c) => {
        translationKeys = [...translationKeys, ...rows.map((r) => r[c.id]?.toString())]
      })
      if (translationKeys.length) {
        return this.translateService.get(translationKeys).pipe(
          map((translatedValues: Record<string, string>) => {
            const translations: Record<string, Record<string, string>> = {}
            translatedColumns.forEach((c) => {
              translations[c.id] = Object.fromEntries(
                rows.map((r) => [r[c.id]?.toString() || '', translatedValues[r[c.id]?.toString()]])
              )
            })
            return [rows, filters, sortColumn, sortDirection, translations]
          })
        )
      }
    }
    return of([rows, filters, sortColumn, sortDirection, {}])
  }

  private filterRows([rows, filters, sortColumn, sortDirection, translations]: [
    Row[],
    Filter[],
    string,
    DataSortDirection,
    Record<string, Record<string, string>>
  ]): [Row[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>] {
    if (!this.clientSideFiltering) {
      return [rows, filters, sortColumn, sortDirection, translations]
    }
    return [
      rows.filter((row) =>
        filters
          .map((filter) => filter.columnId)
          .filter((value, index, self) => self.indexOf(value) === index && value != null)
          .every((filterColumnId) =>
            filters
              .filter((filter) => filter.columnId === filterColumnId)
              .some(
                (filter) =>
                  (
                    translations[filter.columnId]?.[row[filter.columnId].toString()] || row[filter.columnId]
                  ).toString() === filter.value.toString()
              )
          )
      ),
      filters,
      sortColumn,
      sortDirection,
      translations,
    ]
  }

  private sortRows([rows, filters, sortColumn, sortDirection, translations]: [
    Row[],
    Filter[],
    string,
    DataSortDirection,
    Record<string, Record<string, string>>
  ]): [Row[], Filter[], string, DataSortDirection, Record<string, Record<string, string>>] {
    if (!this.clientSideSorting || sortColumn === '') {
      return [rows, filters, sortColumn, sortDirection, translations]
    }
    let translatedColValues: Record<string, string> = Object.fromEntries(
      rows.map((r) => [r[sortColumn]?.toString(), r[sortColumn]?.toString()])
    )
    if (this.columns.find((h) => h.id === sortColumn)?.columnType === ColumnType.TRANSLATION_KEY) {
      translatedColValues = translations[sortColumn]
    }
    return [
      [...rows].sort(this.createCompareFunction(translatedColValues, sortColumn, sortDirection)),
      filters,
      sortColumn,
      sortDirection,
      translations,
    ]
  }

  private createCompareFunction(
    translatedColValues: Record<string, string>,
    sortColumn: string,
    sortDirection: DataSortDirection
  ): (a: Record<string, any>, b: Record<string, any>) => number {
    let direction = 0
    if (sortDirection === DataSortDirection.ASCENDING) {
      direction = 1
    } else if (sortDirection === DataSortDirection.DESCENDING) {
      direction = -1
    }

    return (data1, data2) => {
      if (direction === 0) {
        return 0
      }
      let result
      const value1 = translatedColValues[data1[sortColumn]]
      const value2 = translatedColValues[data2[sortColumn]]

      if (value1 == null && value2 != null) result = -1
      else if (value1 != null && value2 == null) result = 1
      else if (value1 == null && value2 == null) result = 0
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2, ['en', 'de'], { numeric: true })
      else {
        if (value1 < value2) {
          result = -1
        } else if (value1 > value2) {
          result = 1
        } else {
          result = 0
        }
      }
      return direction * result
    }
  }

  getSelectedFilters(columnId: string): string[] | undefined {
    return this.filters.filter((filter) => filter.columnId === columnId).map((filter) => filter.value)
  }
}
