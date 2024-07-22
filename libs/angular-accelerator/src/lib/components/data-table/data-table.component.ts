import {
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { MenuItem, SelectItem } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { ObjectUtils } from '../../utils/objectutils'
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
  _selection$ = new BehaviorSubject<Row[]>([])
  @Input()
  get selectedRows(): Row[] {
    return this._selection$.getValue()
  }
  set selectedRows(value: Row[]) {
    this._selection$.next(value)
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

  displayedPageSizes$: Observable<(number | { showAll: string })[]>
  _pageSizes$ = new BehaviorSubject<(number | { showAll: string })[]>([10, 25, 50])
  @Input()
  get pageSizes(): (number | { showAll: string })[] {
    return this._pageSizes$.getValue()
  }
  set pageSizes(value: (number | { showAll: string })[]) {
    this._pageSizes$.next(value)
  }
  displayedPageSize$: Observable<number>
  _pageSize$ = new BehaviorSubject<number | undefined>(undefined)
  @Input()
  get pageSize(): number | undefined {
    return this._pageSize$.getValue()
  }
  set pageSize(value: number | undefined) {
    this._pageSize$.next(value)
  }

  @Input() emptyResultsMessage: string | undefined
  @Input() name = ''
  @Input() deletePermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() paginator = true
  @Input() page = 0
  @Input()
  get totalRecordsOnServer(): number | undefined {
    return this.params['totalRecordsOnServer'] ? Number(this.params['totalRecordsOnServer']) : undefined
  }
  set totalRecordsOnServer(value: number | undefined) {
    this.params['totalRecordsOnServer'] = value?.toString() ?? '0'
  }
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  params: { [key: string]: string } = {
    currentPage: '{currentPage}',
    totalPages: '{totalPages}',
    rows: '{rows}',
    first: '{first}',
    last: '{last}',
    totalRecords: '{totalRecords}',
  }

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

  @Input() customCellTemplate: TemplateRef<any> | undefined
  @ContentChild('customCell') customCellChildTemplate: TemplateRef<any> | undefined
  get _customCell(): TemplateRef<any> | undefined {
    return this.customCellTemplate || this.customCellChildTemplate
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

  _additionalActions$ = new BehaviorSubject<DataAction[]>([])
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions$.getValue()
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions$.next(value)
  }
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() viewTableRow = new EventEmitter<Row>()
  @Output() editTableRow = new EventEmitter<Row>()
  @Output() deleteTableRow = new EventEmitter<Row>()
  @Output() selectionChanged = new EventEmitter<Row[]>()
  @Output() pageChanged = new EventEmitter<number>()

  displayedRows$: Observable<unknown[]> | undefined
  selectedRows$: Observable<unknown[]> | undefined

  currentFilterColumn$ = new BehaviorSubject<DataTableColumn | null>(null)
  currentFilterOptions$: Observable<SelectItem[]> | undefined
  currentSelectedFilters$: Observable<string[]> | undefined
  filterAmounts$: Observable<Record<string, number>> | undefined

  overflowActions$: Observable<DataAction[]>
  inlineActions$: Observable<DataAction[]>
  overflowMenuItems$: Observable<MenuItem[]>
  currentMenuRow$ = new BehaviorSubject<Row | null>(null)

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
  get anyRowActionObserved(): boolean {
    return this.viewTableRowObserved || this.editTableRowObserved || this.deleteTableRowObserved
  }

  get selectionChangedObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.selectionChangedObserved || dv?.selectionChanged.observed || this.selectionChanged.observed
  }

  constructor(
    @Inject(LOCALE_ID) locale: string,
    translateService: TranslateService,
    private router: Router,
    private injector: Injector,
    private userService: UserService
  ) {
    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    this.displayedPageSizes$ = combineLatest([this._pageSizes$, this.translateService.get('OCX_DATA_TABLE.ALL')]).pipe(
      map(([pageSizes, translation]) => pageSizes.concat({ showAll: translation }))
    )
    this.displayedPageSize$ = combineLatest([this._pageSize$, this._pageSizes$]).pipe(
      map(([pageSize, pageSizes]) => pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50)
    )
    this.overflowActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => action.showAsOverflow))
    )
    this.inlineActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => !action.showAsOverflow))
    )
    this.overflowMenuItems$ = combineLatest([this.overflowActions$, this.currentMenuRow$]).pipe(
      mergeMap(([actions, row]) =>
        this.translateService.get([...actions.map((a) => a.labelKey || '')]).pipe(
          map((translations) => {
            return actions
              .filter((a) => this.userService.hasPermission(a.permission))
              .map((a) => ({
                label: translations[a.labelKey || ''],
                icon: a.icon,
                styleClass: (a.classes || []).join(' '),
                disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(row, a.actionEnabledField)),
                visible: !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField),
                command: () => a.callback(row),
              }))
          })
        )
      )
    )
  }

  ngOnInit(): void {
    this.displayedRows$ = combineLatest([this._rows$, this._filters$, this._sortColumn$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([rows]) => this.flattenItems(rows))
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
    this.mapSelectionToRows()
  }

  onSortColumnClick(sortColumn: string) {
    const newSortDirection = this.columnNextSortDirection(sortColumn)

    this._sortColumn$.next(sortColumn)
    this._sortDirection$.next(newSortDirection)

    this.sorted.emit({ sortColumn: sortColumn, sortDirection: newSortDirection })
  }

  columnNextSortDirection(sortColumn: string) {
    return sortColumn !== this.sortColumn
      ? this.sortStates[0]
      : this.sortStates[(this.sortStates.indexOf(this.sortDirection) + 1) % this.sortStates.length]
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

  sortIconTitle(sortColumn: string) {
    return this.sortDirectionToTitle(
      sortColumn !== this.sortDirection
        ? DataSortDirection.NONE
        : this.sortStates[this.sortStates.indexOf(this.sortDirection) % this.sortStates.length]
    )
  }

  sortDirectionToTitle(sortDirection: DataSortDirection) {
    switch (sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.ASCENDING_TITLE'
      case DataSortDirection.DESCENDING:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.DESCENDING_TITLE'
      default:
        return 'OCX_DATA_TABLE.TOGGLE_BUTTON.DEFAULT_TITLE'
    }
  }

  mapSelectionToRows() {
    this.selectedRows$ = combineLatest([this._selection$, this._rows$]).pipe(
      map(([selectedRows, rows]) => {
        return selectedRows.map((row) => {
          return rows.find((r) => r.id === row.id)
        })
      })
    )
  }

  onSelectionChange(event: Row[]) {
    this.selectionChanged.emit(event)
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageChanged.emit(page)
  }

  fieldIsTruthy(object: any, key: any) {
    return !!ObjectUtils.resolveFieldData(object, key)
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow$.next(row)
    menu.toggle(event)
  }

  hasVisibleOverflowMenuItems(row: any) {
    return this.overflowActions$.pipe(
      map((actions) =>
        actions.some(
          (a) =>
            (!a.actionVisibleField || (this.fieldIsTruthy(row, a.actionVisibleField)) &&
            this.userService.hasPermission(a.permission))
        )
      )
    )
  }
}
