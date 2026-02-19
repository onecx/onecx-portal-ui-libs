import { formatDate } from '@angular/common'
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
  inject,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { isValidDate } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeTemplate, SelectItem } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { MultiSelectItem } from 'primeng/multiselect'
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  filter,
  first,
  firstValueFrom,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter, FilterType } from '../../model/filter.model'
import { ObjectUtils } from '../../utils/objectutils'
import { findTemplate } from '../../utils/template.utils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { handleAction, handleActionSync } from '../../utils/action-router.utils'

export type Primitive = number | string | boolean | bigint | Date
export type Row = {
  id: string | number
  [columnId: string]: unknown
}

export enum TemplateType {
  CELL = 'CELL',
  FILTERCELL = 'FILTERCELL',
}

interface TemplatesData {
  templatesObservables: Record<string, Observable<TemplateRef<any> | null>>
  idSuffix: Array<string>
  templateNames: Record<ColumnType, Array<string>>
}

export type Sort = { sortColumn: string; sortDirection: DataSortDirection }

export interface DataTableComponentState {
  filters?: Filter[]
  sorting?: Sort
  selectedRows?: Row[]
  activePage?: number
  pageSize?: number
}

@Component({
  standalone: false,
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DataSortBase implements OnInit, AfterContentInit {
  router = inject(Router)
  private readonly injector = inject(Injector)
  private readonly userService = inject(UserService)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  private readonly liveAnnouncer = inject(LiveAnnouncer)

  FilterType = FilterType
  TemplateType = TemplateType
  checked = true

  _rows$ = new BehaviorSubject<Row[]>([])
  @Input()
  get rows(): Row[] {
    return this._rows$.getValue()
  }
  set rows(value: Row[]) {
    if (this._rows$.getValue().length > value.length ) {
      this.resetPage();
    }
    this._rows$.next(value)

    const currentResults = value.length
    const newStatus =
      currentResults === 0 ? 'OCX_DATA_TABLE.NO_SEARCH_RESULTS_FOUND' : 'OCX_DATA_TABLE.SEARCH_RESULTS_FOUND'

    firstValueFrom(this.translateService.get(newStatus, { results: currentResults })).then((translatedText: string) => {
      this.liveAnnouncer.announce(translatedText)
    })
  }

  _selectionIds$ = new BehaviorSubject<(string | number)[]>([])
  @Input()
  set selectedRows(value: Row[] | string[] | number[]) {
    this._selectionIds$.next(
      value.map((row) => {
        if (typeof row === 'object') {
          return row.id
        }
        return row
      })
    )
  }

  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    if (this._filters$.getValue().length) {
      this.resetPage();
    }
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
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  columnFilterTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
    const obs = value.map((c) => this.getTemplate(c, TemplateType.CELL))
    const filterObs = value.map((c) => this.getTemplate(c, TemplateType.FILTERCELL))
    this.columnTemplates$ = combineLatest(obs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]]))),
      debounceTime(50)
    )
    this.columnFilterTemplates$ = combineLatest(filterObs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]])))
    )
  }
  @Input() clientSideFiltering = true
  @Input() clientSideSorting = true
  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]

  _pageSizes$ = new BehaviorSubject<number[]>([10, 25, 50])
  @Input()
  get pageSizes(): number[] {
    return this._pageSizes$.getValue()
  }
  set pageSizes(value: number[]) {
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
  @Input() deletePermission: string | string[] | undefined
  @Input() viewPermission: string | string[] | undefined
  @Input() editPermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() selectionEnabledField: string | undefined
  @Input() allowSelectAll = true
  @Input() paginator = true

  _page$ = new BehaviorSubject<number>(0)
  @Input()
  get page(): number {
    return this._page$.getValue()
  }
  set page(value: number) {
    this._page$.next(value)
  }

  @Input() tableStyle: { [klass: string]: any } | undefined
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
  @Input() stringFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringFilterCell') stringFilterCellChildTemplate: TemplateRef<any> | undefined
  get _stringFilterCell(): TemplateRef<any> | undefined {
    return this.stringFilterCellTemplate || this.stringFilterCellChildTemplate
  }
  @Input() numberFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberFilterCell') numberFilterCellChildTemplate: TemplateRef<any> | undefined
  get _numberFilterCell(): TemplateRef<any> | undefined {
    return this.numberFilterCellTemplate || this.numberFilterCellChildTemplate
  }
  @Input() dateFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateFilterCell') dateFilterCellChildTemplate: TemplateRef<any> | undefined
  get _dateFilterCell(): TemplateRef<any> | undefined {
    return this.dateFilterCellTemplate || this.dateFilterCellChildTemplate
  }
  @Input() relativeDateFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateFilterCell') relativeDateFilterCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateFilterCellTemplate || this.relativeDateFilterCellChildTemplate
  }
  @Input() filterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('filterCell') filterCellChildTemplate: TemplateRef<any> | undefined
  get _filterCell(): TemplateRef<any> | undefined {
    return this.filterCellTemplate || this.filterCellChildTemplate
  }
  @Input() translationKeyFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyFilterCell') translationKeyFilterCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyFilterCellTemplate || this.translationKeyFilterCellChildTemplate
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
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataTableComponentState>()

  displayedRows$: Observable<unknown[]> | undefined
  selectedRows$: Observable<unknown[]> | undefined

  currentFilterColumn$ = new BehaviorSubject<DataTableColumn | null>(null)
  currentEqualFilterOptions$: Observable<{ options: SelectItem[]; column: DataTableColumn | undefined }> | undefined
  currentEqualSelectedFilters$: Observable<unknown[]> | undefined
  truthyFilterOptions = [
    {
      key: 'OCX_DATA_TABLE.FILTER_YES',
      value: true,
    },
    {
      key: 'OCX_DATA_TABLE.FILTER_NO',
      value: false,
    },
  ]
  currentTruthySelectedFilters$: Observable<unknown[]> | undefined
  filterAmounts$: Observable<Record<string, number>> | undefined

  overflowActions$: Observable<DataAction[]>
  inlineActions$: Observable<DataAction[]>
  overflowMenuItems$: Observable<MenuItem[]>
  currentMenuRow$ = new BehaviorSubject<Row | null>(null)

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  viewTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set viewTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.viewTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

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

  templatesObservables: Record<string, Observable<TemplateRef<any> | null>> = {}

  private cachedOverflowActions$: Observable<DataAction[]>
  private cachedOverflowMenuItemsVisibility$: Observable<boolean> | undefined

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
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
      switchMap(([actions, row]) =>
        this.filterActionsBasedOnPermissions(actions).pipe(
          map((permittedActions) => ({ actions: permittedActions, row: row }))
        )
      ),
      mergeMap(({ actions, row }) => {
        if (actions.length === 0) {
          return of([])
        }

        return this.translateService.get([...actions.map((a) => a.labelKey || '')]).pipe(
          map((translations) => {
            return actions.map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(row, a.actionEnabledField)),
              visible: !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField),
              command: this.createMenuItemCommand(a, row),
            }))
          })
        )
      })
    )

    this.rowSelectable = this.rowSelectable.bind(this)

    this.cachedOverflowActions$ = this.overflowActions$.pipe(
      shareReplay(1) // Cache the last emitted value
    )
  }

  ngOnInit(): void {
    this.displayedRows$ = combineLatest([this._rows$, this._filters$, this._sortColumn$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([rows]) => this.flattenItems(rows))
    )
    this.currentTruthySelectedFilters$ = combineLatest([this._filters$, this.currentFilterColumn$]).pipe(
      map(([filters, currentFilterColumn]) => {
        return filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id && currentFilterColumn.filterType === FilterType.IS_NOT_EMPTY
          )
          .map((filter) => filter.value)
      })
    )
    this.currentEqualSelectedFilters$ = combineLatest([this._filters$, this.currentFilterColumn$]).pipe(
      map(([filters, currentFilterColumn]) => {
        return filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id &&
              (!currentFilterColumn.filterType || currentFilterColumn.filterType === FilterType.EQUALS)
          )
          .map((filter) => filter.value)
      })
    )
    this.currentEqualFilterOptions$ = combineLatest([this._rows$, this.currentFilterColumn$, this._filters$]).pipe(
      filter(
        ([_, currentFilterColumn, __]) =>
          !currentFilterColumn?.filterType || currentFilterColumn.filterType === FilterType.EQUALS
      ),
      mergeMap(([rows, currentFilterColumn, filters]) => {
        if (!currentFilterColumn?.id) {
          return of({ options: [], column: undefined })
        }

        const currentFilters = filters
          .filter(
            (filter) =>
              filter.columnId === currentFilterColumn?.id &&
              (!currentFilterColumn.filterType || currentFilterColumn.filterType === FilterType.EQUALS)
          )
          .map((filter) => filter.value)

        const columnValues = rows
          .map((row) => row[currentFilterColumn?.id])
          .filter((value) => value !== null && value !== undefined && value !== '')

        if (currentFilterColumn.columnType === ColumnType.DATE) {
          return of({
            options: columnValues.map(
              (c) =>
                ({
                  label: c,
                  value: c,
                  toFilterBy: formatDate(`${c}`, currentFilterColumn.dateFormat ?? 'medium', this.locale),
                }) as SelectItem
            ),
            column: currentFilterColumn,
          })
        }

        const translateObservable =
          this.columns.find((c) => c.id === currentFilterColumn?.id)?.columnType === ColumnType.TRANSLATION_KEY
            ? this.translateColumnValues(columnValues as string[])
            : of(Object.fromEntries(columnValues.map((cv) => [cv, cv])))
        return translateObservable.pipe(
          map((translatedValues) => {
            return Object.values(translatedValues)
              .concat(currentFilters)
              .filter((value, index, self) => self.indexOf(value) === index && value !== null && value !== '')
              .map(
                (filterOption) =>
                  ({
                    label: filterOption,
                    value: filterOption,
                    toFilterBy: filterOption,
                  }) as SelectItem
              )
          }),
          map((options) => {
            return {
              options: options,
              column: currentFilterColumn,
            }
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
    this.emitComponentStateChanged()
  }

  translateColumnValues(columnValues: string[]): Observable<any> {
    return columnValues.length ? this.translateService.get(columnValues as string[]) : of({})
  }

  emitComponentStateChanged(state: DataTableComponentState = {}) {
    this.displayedPageSize$
      .pipe(withLatestFrom(this._selectionIds$, this._rows$), first())
      .subscribe(([pageSize, selectedIds, rows]) => {
        this.componentStateChanged.emit({
          filters: this.filters,
          sorting: {
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection,
          },
          pageSize,
          activePage: this.page,
          selectedRows: rows.filter((row) => selectedIds.includes(row.id)),
          ...state,
        })
      })
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'stringCell':
          this.stringCellChildTemplate = item.template
          break
        case 'numberCell':
          this.numberCellChildTemplate = item.template
          break
        case 'dateCell':
          this.dateCellChildTemplate = item.template
          break
        case 'relativeDateCell':
          this.relativeDateCellChildTemplate = item.template
          break
        case 'cellTemplate':
          this.cellChildTemplate = item.template
          break
        case 'translationKeyCell':
          this.translationKeyCellChildTemplate = item.template
          break
        case 'stringFilterCell':
          this.stringFilterCellChildTemplate = item.template
          break
        case 'numberFilterCell':
          this.numberFilterCellChildTemplate = item.template
          break
        case 'dateFilterCell':
          this.dateFilterCellChildTemplate = item.template
          break
        case 'relativeDateFilterCell':
          this.relativeDateFilterCellChildTemplate = item.template
          break
        case 'filterCellTemplate':
          this.filterCellChildTemplate = item.template
          break
        case 'translationKeyFilterCell':
          this.translationKeyFilterCellChildTemplate = item.template
          break
      }
    })
  }

  onSortColumnClick(sortColumn: string) {
    const newSortDirection = this.columnNextSortDirection(sortColumn)

    this._sortColumn$.next(sortColumn)
    this._sortDirection$.next(newSortDirection)

    this.sorted.emit({ sortColumn: sortColumn, sortDirection: newSortDirection })
    this.emitComponentStateChanged({
      sorting: {
        sortColumn: sortColumn,
        sortDirection: newSortDirection,
      },
    })
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

  onFilterChosen(column: DataTableColumn) {
    this.currentFilterColumn$.next(column)
  }

  onMultiselectFilterChange(column: DataTableColumn, event: any) {
    const filters = this.filters
      .filter((filter) => filter.columnId !== column.id)
      .concat(
        event.value.map((value: Primitive) => ({
          columnId: column.id,
          value,
          filterType: column.filterType,
        }))
      )
    if (this.clientSideFiltering) {
      this.filters = filters
    }
    this.filtered.emit(filters)
    this.emitComponentStateChanged({
      filters,
    })
    this.resetPage()
  }

  getSelectedFilters(columnId: string): unknown[] | undefined {
    return this.filters.filter((filter) => filter.columnId === columnId).map((filter) => filter.value)
  }

  sortIconTitle(sortColumn: string) {
    return this.sortDirectionToTitle(this.columnNextSortDirection(sortColumn))
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
    // Include _page$ to force fresh array references on page navigation
    // to satisfy PrimeNG DataTable selection tracking, because it needs new object references to detect changes
    this.selectedRows$ = combineLatest([this._selectionIds$, this._rows$, this._page$]).pipe(
      map(([selectedRowIds, rows, _]) => {
        return selectedRowIds
          .map((rowId) => rows.find((r) => r.id === rowId))
          .filter((row): row is Row => row !== undefined)
      })
    )
  }

  isRowSelectionDisabled(rowObject: Row) {
    return !!this.selectionEnabledField && !this.fieldIsTruthy(rowObject, this.selectionEnabledField)
  }

  rowSelectable(event: any) {
    return !this.isRowSelectionDisabled(event.data)
  }

  onSelectionChange(selection: Row[]) {
    let newSelectionIds = selection.map((row) => row.id)
    const rows = this._rows$.getValue()

    if (this.selectionEnabledField) {
      const disabledRowIds = rows.filter((r) => !this.fieldIsTruthy(r, this.selectionEnabledField)).map((row) => row.id)
      if (disabledRowIds.length > 0) {
        newSelectionIds = this.mergeWithDisabledKeys(newSelectionIds, disabledRowIds)
      }
    }

    this._selectionIds$.next(newSelectionIds)
    this.emitSelectionChanged()
    this.emitComponentStateChanged()
  }

  emitSelectionChanged() {
    this.selectionChanged.emit(this._rows$.getValue().filter((row) => this._selectionIds$.getValue().includes(row.id)))
  }

  mergeWithDisabledKeys(newSelectionIds: (string | number)[], disabledRowIds: (string | number)[]) {
    const previousSelectionIds = this._selectionIds$.getValue()
    const previouslySelectedAndDisabled = previousSelectionIds.filter((id) => disabledRowIds.includes(id))
    const disabledAndPreviouslyDeselected = disabledRowIds.filter((id) => !previousSelectionIds.includes(id))
    const updatedSelection = [...newSelectionIds]

    previouslySelectedAndDisabled.forEach((id) => {
      if (!updatedSelection.includes(id)) {
        updatedSelection.push(id)
      }
    })

    disabledAndPreviouslyDeselected.forEach((id) => {
      const index = updatedSelection.indexOf(id)
      if (index > -1) {
        updatedSelection.splice(index, 1)
      }
    })

    return updatedSelection
  }

  isSelected(row: Row) {
    return this._selectionIds$.getValue().includes(row.id)
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageSize = event.rows
    this.pageChanged.emit(page)
    this.pageSizeChanged.emit(event.rows)
    this.emitComponentStateChanged({
      activePage: page,
      pageSize: event.rows,
    })
  }

  resetPage() {
    this.page = 0
    this.pageChanged.emit(this.page)
    this.emitComponentStateChanged()
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
      switchMap((actions) => this.filterActionsBasedOnPermissions(actions)),
      map((actions) => actions.some((a) => !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField)))
    )
  }

  isDate(value: Date | string | number) {
    if (value instanceof Date) {
      return true
    }
    const d = new Date(value)
    return isValidDate(d)
  }

  cellTemplatesData: TemplatesData = {
    templatesObservables: {},
    idSuffix: ['IdTableCell', 'IdCell'],
    templateNames: {
      [ColumnType.DATE]: ['dateCell', 'dateTableCell', 'defaultDateCell'],
      [ColumnType.NUMBER]: ['numberCell', 'numberTableCell', 'defaultNumberCell'],
      [ColumnType.RELATIVE_DATE]: ['relativeDateCell', 'relativeDateTableCell', 'defaultRelativeDateCell'],
      [ColumnType.TRANSLATION_KEY]: ['translationKeyCell', 'translationKeyTableCell', 'defaultTranslationKeyCell'],
      [ColumnType.STRING]: ['stringCell', 'stringTableCell', 'defaultStringCell'],
    },
  }

  filterTemplatesData: TemplatesData = {
    templatesObservables: {},
    idSuffix: ['IdTableFilterCell', 'IdFilterCell', 'IdTableCell', 'IdCell'],
    templateNames: {
      [ColumnType.DATE]: ['dateFilterCell', 'dateTableFilterCell', 'dateCell', 'dateTableCell', 'defaultDateCell'],
      [ColumnType.NUMBER]: [
        'numberFilterCell',
        'numberTableFilterCell',
        'numberCell',
        'numberTableCell',
        'defaultNumberCell',
      ],
      [ColumnType.RELATIVE_DATE]: [
        'relativeDateFilterCell',
        'relativeDateTableFilterCell',
        'relativeDateCell',
        'relativeDateTableCell',
        'defaultRelativeDateCell',
      ],
      [ColumnType.TRANSLATION_KEY]: [
        'translationKeyFilterCell',
        'translationKeyTableFilterCell',
        'defaultTranslationKeyCell',
        'translationKeyCell',
        'translationKeyTableCell',
      ],
      [ColumnType.STRING]: [
        'stringFilterCell',
        'stringTableFilterCell',
        'stringCell',
        'stringTableCell',
        'defaultStringCell',
      ],
    },
  }

  templatesDataMap: Record<TemplateType, TemplatesData> = {
    [TemplateType.CELL]: this.cellTemplatesData,
    [TemplateType.FILTERCELL]: this.filterTemplatesData,
  }

  getColumnTypeTemplate(templates: PrimeTemplate[], columnType: ColumnType, templateType: TemplateType) {
    let template: TemplateRef<any> | undefined

    switch (templateType) {
      case TemplateType.CELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this._dateCell
            break
          case ColumnType.NUMBER:
            template = this._numberCell
            break
          case ColumnType.RELATIVE_DATE:
            template = this._relativeDateCell
            break
          case ColumnType.TRANSLATION_KEY:
            template = this._translationKeyCell
            break
          default:
            template = this._stringCell
        }
        break
      case TemplateType.FILTERCELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this._dateFilterCell
            break
          case ColumnType.NUMBER:
            template = this._numberFilterCell
            break
          case ColumnType.RELATIVE_DATE:
            template = this._relativeDateFilterCell
            break
          case ColumnType.TRANSLATION_KEY:
            template = this._translationKeyFilterCell
            break
          default:
            template = this._stringFilterCell
        }
        break
    }

    return (
      template ??
      findTemplate(templates, this.templatesDataMap[templateType].templateNames[columnType])?.template ??
      null
    )
  }

  getTemplate(column: DataTableColumn, templateType: TemplateType): Observable<TemplateRef<any> | null> {
    const templatesData = this.templatesDataMap[templateType]

    if (!templatesData.templatesObservables[column.id]) {
      templatesData.templatesObservables[column.id] = combineLatest([
        this.templates$,
        this.viewTemplates$,
        this.parentTemplates$,
      ]).pipe(
        map(([t, vt, pt]) => {
          const templates = [...(t ?? []), ...(vt ?? []), ...(pt ?? [])]
          const columnTemplate = findTemplate(
            templates,
            templatesData.idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return this.getColumnTypeTemplate(templates, column.columnType, templateType)
        })
      )
    }
    return templatesData.templatesObservables[column.id]
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromMultiselectItem(value: MultiSelectItem, column: DataTableColumn): Record<string, string | undefined> {
    return {
      [column.id]: value.label,
    }
  }

  rowTrackByFunction = (index: number, item: any) => {
    return item.id
  }

  private filterActionsBasedOnPermissions(actions: DataAction[]): Observable<DataAction[]> {
    const getPermissions =
      this.hasPermissionChecker?.getPermissions?.bind(this.hasPermissionChecker) ||
      this.userService.getPermissions.bind(this.userService)

    return getPermissions().pipe(
      map((permissions) => {
        return actions.filter((action) => {
          const actionPermissions = Array.isArray(action.permission) ? action.permission : [action.permission]
          return actionPermissions.every((p) => permissions.includes(p))
        })
      })
    )
  }

  async onActionClick(action: DataAction, rowObject: any): Promise<void> {
    await handleAction(this.router, action, rowObject)
  }
  
  private createMenuItemCommand(action: DataAction, row: any): () => void {
    return () => handleActionSync(this.router, action, row)
  }
}