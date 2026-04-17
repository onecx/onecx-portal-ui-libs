import { formatDate } from '@angular/common'
import {
  Component,
  Input,
  Injector,
  LOCALE_ID,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core'
import { computedPrevious } from 'ngxtension/computed-previous'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { isValidDate } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'
import { PrimeTemplate, SelectItem } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { MultiSelectItem } from 'primeng/multiselect'
import { Observable, combineLatest, debounceTime, filter, firstValueFrom, map, mergeMap, of, switchMap } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter, FilterType } from '../../model/filter.model'
import { ObjectUtils } from '../../utils/objectutils'
import { findTemplate } from '../../utils/template.utils'
import { PermissionInput } from '../../model/permission.model'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { observableOutput } from '../../utils/observable-output.utils'
import { toObservable } from '@angular/core/rxjs-interop'
import equal from 'fast-deep-equal'
import { handleAction, handleActionSync } from '../../utils/action-router.utils'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

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
  expandedRows?: Row[]
  activePage?: number
  pageSize?: number
}

@Component({
  standalone: false,
  selector: 'ocx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  providers: [
    {
      provide: InteractiveDataViewService,
      useFactory: (parentService: InteractiveDataViewService | null) => parentService ?? new InteractiveDataViewService(),
      deps: [[new Optional(), new SkipSelf(), InteractiveDataViewService]],
    },
  ]
})
export class DataTableComponent extends DataSortBase implements OnInit {
  private readonly router = inject(Router)
  private readonly injector = inject(Injector)
  private readonly userService = inject(UserService)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  private readonly liveAnnouncer = inject(LiveAnnouncer)
  stateService = inject(InteractiveDataViewService)

  FilterType = FilterType
  TemplateType = TemplateType

  rows = model<Row[]>([])
  previousRows = computedPrevious(this.rows)
  selectedRows = this.stateService.selectedRows
  selectedIds = signal<Array<string | number>>([])

  filters = this.stateService.filters
  previousFilters = computedPrevious(this.filters)
  sortDirection = this.stateService.sortDirection
  sortColumn = this.stateService.sortColumn
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  columnFilterTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  columns = model<DataTableColumn[]>([])
  clientSideFiltering = input(true)
  clientSideSorting = input(true)
  sortStates = input<DataSortDirection[]>([DataSortDirection.ASCENDING, DataSortDirection.DESCENDING])

  pageSizes = model<number[]>([10, 25, 50])

  @Input()
  get pageSize(): number {
    return this.stateService.pageSize()
  }
  set pageSize(value: number) {
    this.stateService.setPageSize(value)
  }

  @Input()
  get page(): number {
    return this.stateService.activePage()
  }
  set page(value: number) {
    this.stateService.setActivePage(value)
  }

  displayedPageSize = computed(() => {
    const pageSize = this.pageSize
    const pageSizes = this.pageSizes()

    return pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50
  })

  emptyResultsMessage = input<string | undefined>(undefined)
  name = model<string>('')
  deletePermission = input<PermissionInput>(undefined)
  viewPermission = input<PermissionInput>(undefined)
  editPermission = input<PermissionInput>(undefined)
  deleteActionVisibleField = input<string | undefined>(undefined)
  deleteActionEnabledField = input<string | undefined>(undefined)
  viewActionVisibleField = input<string | undefined>(undefined)
  viewActionEnabledField = input<string | undefined>(undefined)
  editActionVisibleField = input<string | undefined>(undefined)
  editActionEnabledField = input<string | undefined>(undefined)
  selectionEnabledField = input<string | undefined>(undefined)
  allowSelectAll = input<boolean>(true)
  paginator = input<boolean>(true)

  tableStyle = input<{ [klass: string]: any } | undefined>(undefined)
  totalRecordsOnServer = input<number | undefined>(undefined)
  currentPageShowingKey = input<string>('OCX_DATA_TABLE.SHOWING')
  currentPageShowingWithTotalOnServerKey = input<string>('OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER')
  params = computed(() => {
    const totalRecordsOnServer = this.totalRecordsOnServer()
    return {
      currentPage: '{currentPage}',
      totalPages: '{totalPages}',
      rows: '{rows}',
      first: '{first}',
      last: '{last}',
      totalRecords: '{totalRecords}',
      totalRecordsOnServer,
    }
  })

  stringCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  stringCellChildTemplate = contentChild<TemplateRef<any>>('stringCell')
  stringCell = computed(() => {
    return this.stringCellTemplate() || this.stringCellChildTemplate()
  })

  numberCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  numberCellChildTemplate = contentChild<TemplateRef<any>>('numberCell')
  numberCell = computed(() => {
    return this.numberCellTemplate() || this.numberCellChildTemplate()
  })

  dateCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  dateCellChildTemplate = contentChild<TemplateRef<any>>('dateCell')
  dateCell = computed(() => {
    return this.dateCellTemplate() || this.dateCellChildTemplate()
  })

  relativeDateCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  relativeDateCellChildTemplate = contentChild<TemplateRef<any>>('relativeDateCell')
  relativeDateCell = computed(() => {
    return this.relativeDateCellTemplate() || this.relativeDateCellChildTemplate()
  })

  cellTemplate = input<TemplateRef<any> | undefined>(undefined)
  cellChildTemplate = contentChild<TemplateRef<any>>('cell')
  cell = computed(() => {
    return this.cellTemplate() || this.cellChildTemplate()
  })

  translationKeyCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  translationKeyCellChildTemplate = contentChild<TemplateRef<any>>('translationKeyCell')
  translationKeyCell = computed(() => {
    return this.translationKeyCellTemplate() || this.translationKeyCellChildTemplate()
  })

  stringFilterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  stringFilterCellChildTemplate = contentChild<TemplateRef<any>>('stringFilterCell')
  stringFilterCell = computed(() => {
    return this.stringFilterCellTemplate() || this.stringFilterCellChildTemplate()
  })

  numberFilterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  numberFilterCellChildTemplate = contentChild<TemplateRef<any>>('numberFilterCell')
  numberFilterCell = computed(() => {
    return this.numberFilterCellTemplate() || this.numberFilterCellChildTemplate()
  })

  dateFilterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  dateFilterCellChildTemplate = contentChild<TemplateRef<any>>('dateFilterCell')
  dateFilterCell = computed(() => {
    return this.dateFilterCellTemplate() || this.dateFilterCellChildTemplate()
  })

  relativeDateFilterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  relativeDateFilterCellChildTemplate = contentChild<TemplateRef<any>>('relativeDateFilterCell')
  relativeDateFilterCell = computed(() => {
    return this.relativeDateFilterCellTemplate() || this.relativeDateFilterCellChildTemplate()
  })

  filterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  filterCellChildTemplate = contentChild<TemplateRef<any>>('filterCell')
  filterCell = computed(() => {
    return this.filterCellTemplate() || this.filterCellChildTemplate()
  })

  translationKeyFilterCellTemplate = input<TemplateRef<any> | undefined>(undefined)
  translationKeyFilterCellChildTemplate = contentChild<TemplateRef<any>>('translationKeyFilterCell')
  translationKeyFilterCell = computed(() => {
    return this.translationKeyFilterCellTemplate() || this.translationKeyFilterCellChildTemplate()
  })

  additionalActions = model<DataAction[]>([])
  frozenActionColumn = this.stateService.ActionColumnConfigFrozen
  actionColumnPosition = this.stateService.ActionColumnConfigPosition

  expandedRows = this.stateService.expandedRows
  expandedRowIds = computed<(string | number)[]>(() =>
    (this.expandedRows() ?? [])
      .filter((row): row is Row | string | number => row !== null && row !== undefined)
      .map((row): string | number => (typeof row === 'object' ? row.id : row))
  )
  expandedRowKeys = computed<Record<string, boolean>>(() =>
    Object.fromEntries(this.expandedRowIds().map((id) => [id, true]))
  )

  expandable = input<boolean>(false)
  frozenExpandColumn = input<boolean>(false)

  @Output() viewTableRow = observableOutput<Row>()
  @Output() editTableRow = observableOutput<Row>()
  @Output() deleteTableRow = observableOutput<Row>()
  @Output() selectionChanged = observableOutput<Row[]>()
  @Output() rowExpanded = observableOutput<Row>()
  @Output() rowCollapsed = observableOutput<Row>()

  pageChange = output<number>()
  pageSizeChange = output<number>()

  pageChanged = output<number>()
  pageSizeChanged = output<number>()

  displayedRows$ = combineLatest([
    toObservable(this.rows),
    toObservable(this.filters),
    toObservable(this.sortColumn),
    toObservable(this.sortDirection),
    toObservable(this.columns),
    toObservable(this.clientSideFiltering),
    toObservable(this.clientSideSorting),
  ]).pipe(
    map(([rows, filters, sortColumn, sortDirection, columns, clientSideFiltering, clientSideSorting]) => {
      return { rows, filters, sortColumn, sortDirection, columns, clientSideFiltering, clientSideSorting }
    }),
    mergeMap((params) =>
      this.translateItems(params.rows, params.columns, params.clientSideFiltering, params.clientSideSorting).pipe(
        map((translations) => ({ ...params, translations }))
      )
    ),
    map((params) => ({
      ...params,
      rows: this.filterItems([params.rows, params.filters, params.translations], params.clientSideFiltering),
    })),
    map((params) => ({
      ...params,
      rows: this.sortItems(
        [params.rows, params.sortColumn, params.sortDirection, params.translations],
        params.columns,
        params.clientSideSorting
      ),
    })),
    map(({ rows }) => this.flattenItems(rows))
  )

  selectedFilteredRows = computed(() => {
    const selectionIds = this.selectedIds()
    const rows = this.rows()
    // Include page to force fresh array references on page navigation
    // to satisfy PrimeNG DataTable selection tracking, because it needs new object references to detect changes
    void this.page
    return selectionIds.map((rowId) => rows.find((r) => r.id === rowId)).filter((row): row is Row => row !== undefined)
  })

  currentFilterColumn = signal<DataTableColumn | null>(null)
  currentEqualFilterOptions$ = combineLatest([
    toObservable(this.rows),
    toObservable(this.currentFilterColumn),
    toObservable(this.filters),
    toObservable(this.columns),
  ]).pipe(
    filter(
      ([_, currentFilterColumn, __, ___]) =>
        !currentFilterColumn?.filterType || currentFilterColumn.filterType === FilterType.EQUALS
    ),
    mergeMap(([rows, currentFilterColumn, filters, columns]) => {
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
        columns.find((c) => c.id === currentFilterColumn?.id)?.columnType === ColumnType.TRANSLATION_KEY
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

  currentEqualSelectedFilters = computed(() => {
    const filters = this.filters()
    const currentFilterColumn = this.currentFilterColumn()
    return filters
      .filter(
        (filter) =>
          filter.columnId === currentFilterColumn?.id &&
          (!currentFilterColumn.filterType || currentFilterColumn.filterType === FilterType.EQUALS)
      )
      .map((filter) => filter.value)
  })

  currentTruthySelectedFilters = computed(() => {
    const filters = this.filters()
    const currentFilterColumn = this.currentFilterColumn()
    return filters
      .filter(
        (filter) =>
          filter.columnId === currentFilterColumn?.id && currentFilterColumn.filterType === FilterType.IS_NOT_EMPTY
      )
      .map((filter) => filter.value)
  })

  filterAmounts = computed<Record<string, number>>(() => {
    const filters = this.filters()
    return filters
      .map((filter) => filter.columnId)
      .map((columnId) => ({ [columnId]: filters.filter((filter) => filter.columnId === columnId).length }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  })

  overflowActions = computed(() => {
    return this.additionalActions().filter((action) => action.showAsOverflow)
  })
  overflowActions$ = toObservable(this.overflowActions)
  inlineActions = computed(() => {
    return this.additionalActions().filter((action) => !action.showAsOverflow)
  })
  currentMenuRow = signal<Row | null>(null)

  overflowMenuItems$ = combineLatest([toObservable(this.overflowActions), toObservable(this.currentMenuRow)]).pipe(
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

  templates = contentChildren<PrimeTemplate>(PrimeTemplate)
  templates$ = toObservable(this.templates)

  viewTemplates = viewChildren<PrimeTemplate>(PrimeTemplate)
  viewTemplates$ = toObservable(this.viewTemplates)

  parentTemplates = model<PrimeTemplate[] | null | undefined>(undefined)
  parentTemplates$ = toObservable(this.parentTemplates)

  expansionTemplate = computed<PrimeTemplate | undefined>(() => {
    const all = [...this.templates(), ...this.viewTemplates(), ...(this.parentTemplates() ?? [])].filter(
      (t, index, self) => self.findIndex((pt) => pt.getType() === t.getType()) === index
    )

    return all.find((t) => t.getType() === 'expansion')
  })

  get viewTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed() || this.viewTableRow.observed()
  }
  get editTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed() || this.editTableRow.observed()
  }
  get deleteTableRowObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed() || this.deleteTableRow.observed()
  }
  get anyRowActionObserved(): boolean {
    return this.viewTableRowObserved || this.editTableRowObserved || this.deleteTableRowObserved
  }

  get actionColumnVisible(): boolean {
    return this.anyRowActionObserved || this.additionalActions().length > 0
  }

  getRowColspan(hasExpansionTemplate: boolean): number {
    return (
      this.columns().length +
      (this.selectionChangedObserved ? 1 : 0) +
      (this.expandable() && hasExpansionTemplate ? 1 : 0) +
      (this.actionColumnVisible ? 1 : 0)
    )
  }

  get selectionChangedObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.selectionChangedObserved || dv?.selectionChanged.observed() || this.selectionChanged.observed()
  }

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)

    effect(() => {
      const rows = this.rows()

      // Not track previousRows change to avoid the trigger
      untracked(() => {
        const previousRows = this.previousRows()
        if (previousRows.length && rows.length < previousRows.length) {
          this.page = 0
        }
      })

      const currentResults = rows.length
      const newStatus =
        currentResults === 0 ? 'OCX_DATA_TABLE.NO_SEARCH_RESULTS_FOUND' : 'OCX_DATA_TABLE.SEARCH_RESULTS_FOUND'

      firstValueFrom(this.translateService.get(newStatus, { results: currentResults })).then(
        (translatedText: string) => {
          this.liveAnnouncer.announce(translatedText)
        }
      )
    })

    effect(() => {
      const filters = this.filters()
      // Not track previousFilters change to avoid the trigger
      untracked(() => {
        const previousFilters = this.previousFilters()
        if (previousFilters.length && !equal(filters, previousFilters)) {
          this.page = 0
        }
      })
    })

    effect(() => {
      const columns = this.columns()
      const obs = columns.map((c) => this.getTemplate(c, TemplateType.CELL))
      const filterObs = columns.map((c) => this.getTemplate(c, TemplateType.FILTERCELL))
      this.columnTemplates$ = combineLatest(obs).pipe(
        map((values) => Object.fromEntries(columns.map((c, i) => [c.id, values[i]]))),
        debounceTime(50)
      )
      this.columnFilterTemplates$ = combineLatest(filterObs).pipe(
        map((values) => Object.fromEntries(columns.map((c, i) => [c.id, values[i]])))
      )
    })

    effect(() => {
      const selectedRows = this.selectedRows()
      const selectedIds = selectedRows.map((row) => {
        if (typeof row === 'object') {
          return row.id
        }
        return row
      })
      this.selectedIds.set(selectedIds)
    })

    effect(() => {
      this.emitSelectionChanged()
    })

    effect(() => {
      const page = this.page
      this.pageChange.emit(page)
      this.pageChanged.emit(page)
    })

    effect(() => {
      const pageSize = this.pageSize
      this.pageSizeChange.emit(pageSize)
      this.pageSizeChanged.emit(pageSize)
    })

    this.rowSelectable = this.rowSelectable.bind(this)
  }

  ngOnInit(): void {
    this.name.set(this.name() || this.router.url.replace(/[^A-Za-z0-9]/, '_'))
  }

  translateColumnValues(columnValues: string[]): Observable<any> {
    return columnValues.length ? this.translateService.get(columnValues as string[]) : of({})
  }

  emitSelectionChanged() {
    this.selectionChanged.emit(this.rows().filter((row) => this.selectedIds().includes(row.id)))
  }

  onRowExpand(event: any) {
    if (!this.expandedRowIds().includes(event.data.id)) {
      const expandedRows = this.expandedRows()
      this.stateService.setExpandedRows([...(expandedRows ?? []), event.data] as Row[])
    }
    this.rowExpanded.emit(event.data)
  }

  onRowCollapse(event: any) {
    const expandedRows = this.expandedRows()
    const updatedExpandedRows = (expandedRows ?? []).filter((r) =>
      typeof r === 'object' ? (r as Row).id !== event.data.id : r !== event.data.id
    ) as Row[] | string[] | number[]
    this.stateService.setExpandedRows(updatedExpandedRows)
    this.rowCollapsed.emit(event.data)
  }

  isRowExpanded(row: Row): boolean {
    return this.expandedRowIds().includes(row.id)
  }

  toggleRowExpansion(row: Row) {
    if (this.isRowExpanded(row)) {
      this.onRowCollapse({ data: row })
    } else {
      this.onRowExpand({ data: row })
    }
  }

  onSortColumnClick(sortColumn: string) {
    const newSortDirection = this.columnNextSortDirection(sortColumn)

    this.stateService.setSortColumn(sortColumn)
    this.stateService.setSortDirection(newSortDirection)
  }

  columnNextSortDirection(sortColumn: string) {
    const sortStates = this.sortStates()
    return sortColumn === this.sortColumn()
      ? sortStates[(sortStates.indexOf(this.sortDirection()) + 1) % sortStates.length]
      : sortStates[0]
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
    this.currentFilterColumn.set(column)
  }

  onMultiselectFilterChange(column: DataTableColumn, event: any) {
    const filters = this.filters()
      .filter((filter) => filter.columnId !== column.id)
      .concat(
        event.value.map((value: Primitive) => ({
          columnId: column.id,
          value,
          filterType: column.filterType,
        }))
      )
    if (this.clientSideFiltering()) {
      this.stateService.setFilters(filters)
    }
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

  isRowSelectionDisabled(rowObject: Row) {
    return !!this.selectionEnabledField() && !this.fieldIsTruthy(rowObject, this.selectionEnabledField())
  }

  rowSelectable(event: any) {
    return !this.isRowSelectionDisabled(event.data)
  }

  onSelectionChange(selection: Row[]) {
    let newSelectionIds = selection.map((row) => row.id)
    const rows = this.rows()

    if (this.selectionEnabledField()) {
      const disabledRowIds = rows
        .filter((r) => !this.fieldIsTruthy(r, this.selectionEnabledField()))
        .map((row) => row.id)
      if (disabledRowIds.length > 0) {
        newSelectionIds = this.mergeWithDisabledKeys(newSelectionIds, disabledRowIds)
      }
    }

    this.selectedIds.set(newSelectionIds)
  }

  mergeWithDisabledKeys(newSelectionIds: (string | number)[], disabledRowIds: (string | number)[]) {
    const previousSelectionIds = this.selectedIds()
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
    return this.selectedIds().includes(row.id)
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageSize = event.rows
  }

  fieldIsTruthy(object: any, key: any) {
    return !!ObjectUtils.resolveFieldData(object, key)
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow.set(row)
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

  private readonly cellTemplatesData: TemplatesData = {
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

  private readonly filterTemplatesData: TemplatesData = {
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

  private readonly templatesDataMap: Record<TemplateType, TemplatesData> = {
    [TemplateType.CELL]: this.cellTemplatesData,
    [TemplateType.FILTERCELL]: this.filterTemplatesData,
  }

  getColumnTypeTemplate(templates: PrimeTemplate[], columnType: ColumnType, templateType: TemplateType) {
    let template: TemplateRef<any> | undefined

    switch (templateType) {
      case TemplateType.CELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this.dateCell()
            break
          case ColumnType.NUMBER:
            template = this.numberCell()
            break
          case ColumnType.RELATIVE_DATE:
            template = this.relativeDateCell()
            break
          case ColumnType.TRANSLATION_KEY:
            template = this.translationKeyCell()
            break
          default:
            template = this.stringCell()
        }
        break
      case TemplateType.FILTERCELL:
        switch (columnType) {
          case ColumnType.DATE:
            template = this.dateFilterCell()
            break
          case ColumnType.NUMBER:
            template = this.numberFilterCell()
            break
          case ColumnType.RELATIVE_DATE:
            template = this.relativeDateFilterCell()
            break
          case ColumnType.TRANSLATION_KEY:
            template = this.translationKeyFilterCell()
            break
          default:
            template = this.stringFilterCell()
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
