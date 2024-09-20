import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { isValidDate } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeTemplate, SelectItem } from 'primeng/api'
import { Menu } from 'primeng/menu'
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  first,
  map,
  mergeMap,
  of,
  withLatestFrom,
} from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { ObjectUtils } from '../../utils/objectutils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { MultiSelectItem } from 'primeng/multiselect'

type Primitive = number | string | boolean | bigint | Date
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

export type Filter = { columnId: string; value: string }
export type Sort = { sortColumn: string; sortDirection: DataSortDirection }

export interface DataTableComponentState {
  filters?: Filter[]
  sorting?: Sort
  selectedRows?: Row[]
  activePage?: number
  pageSize?: number
}

@Component({
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends DataSortBase implements OnInit, AfterContentInit {
  TemplateType = TemplateType
  checked = true
  _rows$ = new BehaviorSubject<Row[]>([])
  @Input()
  get rows(): Row[] {
    return this._rows$.getValue()
  }
  set rows(value: Row[]) {
    !this._rows$.getValue().length ?? this.resetPage()
    this._rows$.next(value)
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
    !this._filters$.getValue().length ?? this.resetPage()
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
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
    const obs = value.map((c) => this.getTemplate(c, TemplateType.CELL))
    this.columnTemplates$ = combineLatest(obs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]])))
    )
  }
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
  @Input() selectionEnabledField: string | undefined
  @Input() allowSelectAll = true
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

  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdCell
   * e.g. for a column with the id 'status' use pTemplate="statusIdCell"
   */
  @Input() customCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdCell
   * e.g. for a column with the id 'status' use pTemplate="statusIdCell"
   */
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
  /**
   * @deprecated Will be removed and instead to change the template of a specific column filter
   * use the new approach instead by following the naming convention column id + IdFilterCell
   * e.g. for a column with the id 'status' use pTemplate="statusIdFilterCell"
   */
  @Input() customFilterCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column filter
   * use the new approach instead by following the naming convention column id + IdFilterCell
   * e.g. for a column with the id 'status' use pTemplate="statusIdFilterCell"
   */
  @ContentChild('customFilterCell') customFilterCellChildTemplate: TemplateRef<any> | undefined
  get _customFilterCell(): TemplateRef<any> | undefined {
    return this.customFilterCellTemplate || this.customFilterCellChildTemplate
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
  currentFilterOptions$: Observable<SelectItem[]> | undefined
  currentSelectedFilters$: Observable<string[]> | undefined
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
                  }) as SelectItem
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
    this.emitComponentStateChanged()
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
        case 'customCell':
          this.customCellChildTemplate = item.template
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
        case 'customFilterCell':
          this.customFilterCellChildTemplate = item.template
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
    this.emitComponentStateChanged({
      filters,
    })
    this.resetPage()
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
    this.selectedRows$ = combineLatest([this._selectionIds$, this._rows$]).pipe(
      map(([selectedRowIds, rows]) => {
        return selectedRowIds.map((rowId) => {
          return rows.find((r) => r.id === rowId)
        })
      })
    )
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
    this.selectionChanged.emit(this._rows$.getValue().filter((row) => newSelectionIds.includes(row.id)))
    this.emitComponentStateChanged()
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
      map((actions) =>
        actions.some(
          (a) =>
            !a.actionVisibleField ||
            (this.fieldIsTruthy(row, a.actionVisibleField) && this.userService.hasPermission(a.permission))
        )
      )
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
      [ColumnType.CUSTOM]: ['customCell', 'customTableCell', 'defaultCustomCell'],
      [ColumnType.STRING]: ['stringCell', 'stringTableCell', 'defaultStringCell'],
    },
  }

  filterTemplatesData: TemplatesData = {
    templatesObservables: {},
    idSuffix: ['IdTableFilterCell', 'IdFilterCell'],
    templateNames: {
      [ColumnType.DATE]: ['dateFilterCell', 'dateTableFilterCell', 'defaultDateCell'],
      [ColumnType.NUMBER]: ['numberFilterCell', 'numberTableFilterCell', 'defaultNumberCell'],
      [ColumnType.RELATIVE_DATE]: ['relativeDateFilterCell', 'relativeDateTableFilterCell', 'defaultRelativeDateCell'],
      [ColumnType.TRANSLATION_KEY]: [
        'translationKeyFilterCell',
        'translationKeyTableFilterCell',
        'defaultTranslationKeyCell',
      ],
      [ColumnType.CUSTOM]: ['customFilterCell', 'customTableFilterCell', 'defaultCustomCell'],
      [ColumnType.STRING]: ['stringFilterCell', 'stringTableFilterCell', 'defaultStringCell'],
    },
  }

  templatesDataMap: Record<TemplateType, TemplatesData> = {
    [TemplateType.CELL]: this.cellTemplatesData,
    [TemplateType.FILTERCELL]: this.filterTemplatesData,
  }

  findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
    for (let index = 0; index < names.length; index++) {
      const name = names[index]
      const template = templates.find((template) => template.name === name)
      if (template) {
        return template
      }
    }
    return undefined
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
          case ColumnType.CUSTOM:
            template = this._customCell
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
          case ColumnType.CUSTOM:
            template = this._customFilterCell
            break
          default:
            template = this._stringFilterCell
        }
        break
    }

    return (
      template ??
      this.findTemplate(templates, this.templatesDataMap[templateType].templateNames[columnType])?.template ??
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
          const columnTemplate = this.findTemplate(
            templates,
            templatesData.idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return this.getColumnTypeTemplate(templates, column.columnType, templateType)
        }),
        debounceTime(50)
      )
    }
    return templatesData.templatesObservables[column.id]
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromMultiselectItem(value: MultiSelectItem, column: DataTableColumn) {
    return {
      [column.id]: value.label,
    }
  }
}
