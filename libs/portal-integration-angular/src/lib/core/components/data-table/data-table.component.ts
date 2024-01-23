import { Component, ContentChild, EventEmitter, Inject, Injector, Input, LOCALE_ID, OnInit, Output, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SelectItem } from 'primeng/api'
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of } from 'rxjs'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { ColumnType } from '../../../model/column-type.model'
import { DataAction } from '../../../model/data-action'
import { DataSortBase } from '../data-sort-base/data-sort-base'

type Primitive = number | string | boolean | bigint | Date
export type Row = {
  id: string | number
  [columnId: string]: unknown
}

export type Filter = { columnId: string; value: string }
export type Sort = { sortColumn: string; sortDirection: DataSortDirection }

@Component({
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DataSortBase implements OnInit {
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
  @Input() name = ''
  @Input() deletePermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() paginator = true

  @Input() stringCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringCell') stringCellChildTemplate: TemplateRef<any> | undefined
  get _stringCell(): TemplateRef<any> | undefined {
    return this.stringCellTemplate || this.stringCellChildTemplate
  }

  @Input() numberCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberCell') numberCellChildTemplate: TemplateRef<any> | undefined
  get _numberCell(): TemplateRef<any> | undefined {
    return this.numberCellTemplate || this.numberCellChildTemplate
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

  displayedRows$: Observable<unknown[]> | undefined

  currentFilterColumn$ = new BehaviorSubject<DataTableColumn | null>(null)
  currentFilterOptions$: Observable<SelectItem[]> | undefined
  currentSelectedFilters$: Observable<string[]> | undefined
  filterAmounts$: Observable<Record<string, number>> | undefined
  get viewTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed || this.viewTableRow.observed
  }
  get editTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed || this.editTableRow.observed
  }
  get deleteTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed || this.deleteTableRow.observed
  }

  constructor(@Inject(LOCALE_ID) locale: string, translateService: TranslateService, private router: Router, private injector: Injector) {
    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
  }

  ngOnInit(): void {
    this.displayedRows$ = combineLatest([this._rows$, this._filters$, this._sortColumn$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([rows]) => this.flattenItems(rows,))
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

  getSelectedFilters(columnId: string): string[] | undefined {
    return this.filters.filter((filter) => filter.columnId === columnId).map((filter) => filter.value)
  }

  sortIconTitle() {
    switch (this.sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TITLE'
      case DataSortDirection.DESCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TITLE'
      default:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TITLE'
    }
  }
}