import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core'
import { SlotService } from '@onecx/angular-remote-components'
import { PrimeTemplate } from 'primeng/api'
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  startWith,
  timestamp,
  withLatestFrom,
} from 'rxjs'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { limit } from '../../utils/filter.utils'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import {
  ColumnGroupSelectionComponentState,
  GroupSelectionChangedEvent,
} from '../column-group-selection/column-group-selection.component'
import {
  ActionColumnChangedEvent,
  ColumnSelectionChangedEvent,
  CustomGroupColumnSelectorComponentState,
} from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponentState } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponentState } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { Row, Sort } from '../data-table/data-table.component'
import { DataViewComponent, DataViewComponentState, RowListGridData } from '../data-view/data-view.component'
import { FilterViewComponentState, FilterViewDisplayMode } from '../filter-view/filter-view.component'

export type InteractiveDataViewComponentState = ColumnGroupSelectionComponentState &
  CustomGroupColumnSelectorComponentState &
  DataLayoutSelectionComponentState &
  DataListGridSortingComponentState &
  DataViewComponentState &
  FilterViewComponentState

export interface ColumnGroupData {
  activeColumns: DataTableColumn[]
  groupKey: string
}
@Component({
  standalone: false,
  selector: 'ocx-interactive-data-view',
  templateUrl: './interactive-data-view.component.html',
  styleUrls: ['./interactive-data-view.component.css'],
  providers: [{ provide: 'InteractiveDataViewComponent', useExisting: InteractiveDataViewComponent }],
})
export class InteractiveDataViewComponent implements OnInit, AfterContentInit {
  private readonly slotService = inject(SlotService)

  _dataViewComponent: DataViewComponent | undefined
  @ViewChild(DataViewComponent) set dataView(ref: DataViewComponent | undefined) {
    this._dataViewComponent = ref
    this.registerEventListenerForDataView()
  }
  get dataView(): DataViewComponent | undefined {
    return this._dataViewComponent
  }

  columnGroupSelectionComponentState$ = new ReplaySubject<ColumnGroupSelectionComponentState>(1)
  customGroupColumnSelectorComponentState$ = new ReplaySubject<CustomGroupColumnSelectorComponentState>(1)
  dataLayoutComponentState$ = new ReplaySubject<DataLayoutSelectionComponentState>(1)
  dataListGridSortingComponentState$ = new ReplaySubject<DataListGridSortingComponentState>(1)
  dataViewComponentState$ = new ReplaySubject<DataViewComponentState>(1)
  filterViewComponentState$ = new ReplaySubject<FilterViewComponentState>(1)

  @Input() searchConfigPermission: string | string[] | undefined
  @Input() deletePermission: string | string[] | undefined
  @Input() editPermission: string | string[] | undefined
  @Input() viewPermission: string | string[] | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() tableSelectionEnabledField: string | undefined
  @Input() tableAllowSelectAll = true
  @Input() name = 'Data'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() supportedViewLayouts: ('grid' | 'list' | 'table')[] = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() fallbackImage = 'placeholder.png'
  @Input() filters: Filter[] = []
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() sortField: any = ''
  @Input() sortStates: DataSortDirection[] = [
    DataSortDirection.ASCENDING,
    DataSortDirection.DESCENDING,
    DataSortDirection.NONE,
  ]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number | undefined
  @Input() totalRecordsOnServer: number | undefined
  @Input() layout: 'grid' | 'list' | 'table' = 'table'
  @Input() defaultGroupKey = ''
  @Input() customGroupKey = 'OCX_INTERACTIVE_DATA_VIEW.CUSTOM_GROUP'
  @Input() groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  @Input() additionalActions: DataAction[] = []
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @Input() disableFilterView = true
  @Input() filterViewDisplayMode: FilterViewDisplayMode = 'button'
  @Input() filterViewChipStyleClass = ''
  @Input() filterViewTableStyle: { [klass: string]: any } = { 'max-height': '50vh' }
  @Input() filterViewPanelStyle: { [klass: string]: any } = { 'max-width': '90%' }
  @Input() selectDisplayedChips: (filters: Filter[], columns: DataTableColumn[]) => Filter[] = (filters) =>
    limit(filters, 3, { reverse: true })
  @Input() page = 0
  @Input() selectedRows: Row[] = []
  displayedColumnKeys$ = new BehaviorSubject<string[]>([])
  displayedColumns$: Observable<DataTableColumn[]> | undefined
  @Input()
  get displayedColumnKeys(): string[] {
    return this.displayedColumnKeys$.getValue()
  }
  set displayedColumnKeys(value: string[]) {
    this.displayedColumnKeys$.next(value)
  }
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'
  @Input() headerStyleClass: string | undefined
  @Input() contentStyleClass: string | undefined
  @ContentChild('tableCell') tableCell: TemplateRef<any> | undefined
  primeNgTableCell: TemplateRef<any> | undefined
  @ContentChild('dateTableCell') dateTableCell: TemplateRef<any> | undefined
  primeNgDateTableCell: TemplateRef<any> | undefined

  @ContentChild('relativeDateTableCell') relativeDateTableCell: TemplateRef<any> | undefined
  primeNgRelativeDateTableCell: TemplateRef<any> | undefined

  @ContentChild('translationKeyTableCell') translationKeyTableCell: TemplateRef<any> | undefined
  primeNgTranslationKeyTableCell: TemplateRef<any> | undefined

  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLines: TemplateRef<any> | undefined
  primeNgGridItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLines: TemplateRef<any> | undefined
  primeNgListItemSubtitleLines: TemplateRef<any> | undefined
  // TODO: Implement same fix for other templates and child components
  @ContentChild('stringTableCell') stringTableCell: TemplateRef<any> | undefined
  primeNgStringTableCell: TemplateRef<any> | undefined
  @ContentChild('numberTableCell') numberTableCell: TemplateRef<any> | undefined
  primeNgNumberTableCell: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItem: TemplateRef<any> | undefined
  primeNgGridItem: TemplateRef<any> | undefined
  @ContentChild('listItem') listItem: TemplateRef<any> | undefined
  primeNgListItem: TemplateRef<any> | undefined
  @ContentChild('topCenter') topCenter: TemplateRef<any> | undefined
  primeNgTopCenter: TemplateRef<any> | undefined
  @ContentChild('listValue') listValue: TemplateRef<any> | undefined
  primeNgListValue: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValue: TemplateRef<any> | undefined
  primeNgTranslationKeyListValue: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValue: TemplateRef<any> | undefined
  primeNgNumberListValue: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValue: TemplateRef<any> | undefined
  primeNgRelativeDateListValue: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValue: TemplateRef<any> | undefined
  primeNgStringListValue: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValue: TemplateRef<any> | undefined
  primeNgDateListValue: TemplateRef<any> | undefined
  @ContentChild('tableFilterCell') tableFilterCell: TemplateRef<any> | undefined
  primeNgTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('dateTableFilterCell') dateTableFilterCell: TemplateRef<any> | undefined
  primeNgDateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableFilterCell') relativeDateTableFilterCell: TemplateRef<any> | undefined
  primeNgRelativeDateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableFilterCell') translationKeyTableFilterCell: TemplateRef<any> | undefined
  primeNgTranslationKeyTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('stringTableFilterCell') stringTableFilterCell: TemplateRef<any> | undefined
  primeNgStringTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('numberTableFilterCell') numberTableFilterCell: TemplateRef<any> | undefined
  primeNgNumberTableFilterCell: TemplateRef<any> | undefined

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() dataViewLayoutChange = new EventEmitter<'grid' | 'list' | 'table'>()
  @Output() displayedColumnKeysChange = new EventEmitter<string[]>()
  @Output() selectionChanged: EventEmitter<Row[]> = new EventEmitter()

  @Output() pageChanged: EventEmitter<number> = new EventEmitter()
  @Output() pageSizeChanged = new EventEmitter<number>()

  @Output() componentStateChanged = new EventEmitter<InteractiveDataViewComponentState>()

  selectedGroupKey$ = new BehaviorSubject<string | undefined>('')
  get selectedGroupKey(): string | undefined {
    return this.selectedGroupKey$.getValue()
  }
  set selectedGroupKey(value: string | undefined) {
    this.selectedGroupKey$.next(value)
  }
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  isEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

  @Input()
  get paginator(): boolean {
    return this.listGridPaginator && this.tablePaginator
  }
  set paginator(value: boolean) {
    this.listGridPaginator = value
    this.tablePaginator = value
  }

  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLines
  }
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLines
  }
  get _tableCell(): TemplateRef<any> | undefined {
    return this.tableCell
  }
  get _stringTableCell(): TemplateRef<any> | undefined {
    return this.stringTableCell
  }
  get _numberTableCell(): TemplateRef<any> | undefined {
    return this.numberTableCell
  }
  get _dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCell
  }
  get _relativeDateTableCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCell
  }
  get _translationKeyTableCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableCell
  }
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItem
  }
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItem
  }
  get _listValue(): TemplateRef<any> | undefined {
    return this.listValue
  }
  get _translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValue
  }
  get _numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValue
  }
  get _relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValue
  }
  get _stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValue
  }
  get _dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValue
  }
  get _tableFilterCell(): TemplateRef<any> | undefined {
    return this.tableFilterCell
  }
  get _dateTableFilterCell(): TemplateRef<any> | undefined {
    return this.dateTableFilterCell
  }
  get _relativeDateTableFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableFilterCell
  }
  get _translationKeyTableFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableFilterCell
  }
  get _stringTableFilterCell(): TemplateRef<any> | undefined {
    return this.stringTableFilterCell
  }
  get _numberTableFilterCell(): TemplateRef<any> | undefined {
    return this.numberTableFilterCell
  }

  _data: RowListGridData[] = []
  @Input()
  get data(): RowListGridData[] {
    return this._data
  }
  set data(value: RowListGridData[]) {
    this._data = value
  }

  columnGroupSlotName = 'onecx-column-group-selection'
  isColumnGroupSelectionComponentDefined$: Observable<boolean>
  groupSelectionChangedSlotEmitter = new EventEmitter<ColumnGroupData | undefined>()

  constructor() {
    this.isColumnGroupSelectionComponentDefined$ = this.slotService
      .isSomeComponentDefinedForSlot(this.columnGroupSlotName)
      .pipe(startWith(true))

    this.groupSelectionChangedSlotEmitter.subscribe((event: ColumnGroupData | undefined) => {
      event ??= {
        activeColumns: this.getDisplayedColumns(),
        groupKey: this.selectedGroupKey ?? this.defaultGroupKey,
      }
      this.displayedColumnKeys$.next(event.activeColumns.map((col) => col.id))
      this.selectedGroupKey$.next(event.groupKey)
      this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
      this.columnGroupSelectionComponentState$.next({
        activeColumnGroupKey: event.groupKey,
        displayedColumns: event.activeColumns,
      })
    })

    this.dataViewLayoutChange
      .pipe(withLatestFrom(this.isColumnGroupSelectionComponentDefined$))
      .subscribe(([_, columnGroupComponentDefined]) => {
        if (columnGroupComponentDefined) {
          if (
            !(
              this.columns.find((c) => c.nameKey === this.selectedGroupKey) ||
              this.selectedGroupKey === this.customGroupKey
            )
          ) {
            this.selectedGroupKey$.next(undefined)
          }
        }
      })
  }

  ngOnInit(): void {
    this.selectedGroupKey = this.defaultGroupKey
    if (this.defaultGroupKey && this.defaultGroupKey !== this.customGroupKey) {
      this.displayedColumnKeys = this.columns
        .filter((column) => column.predefinedGroupKeys?.includes(this.defaultGroupKey))
        .map((column) => column.id)
    }
    // TODO: Clarify if we want this behavior or not.
    else {
      this.displayedColumnKeys = this.columns.map((column) => column.id)
    }
    this.displayedColumns$ = this.displayedColumnKeys$.pipe(
      distinctUntilChanged((prev, curr) => prev.length === curr.length && prev.every((v, i) => curr[i] === v)),
      map(
        (columnKeys) =>
          (columnKeys.map((key) => this.columns.find((col) => col.id === key)).filter((d) => d) as DataTableColumn[]) ??
          []
      )
    )
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
    if (!this.groupSelectionNoGroupSelectedKey) {
      this.groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
    }
    this.firstColumnId = this.columns[0]?.id

    let dataListGridSortingComponentState$: Observable<DataListGridSortingComponentState | Record<string, never>> =
      this.dataListGridSortingComponentState$
    let columnGroupSelectionComponentState$: Observable<ColumnGroupSelectionComponentState | Record<string, never>> =
      this.columnGroupSelectionComponentState$
    let customGroupColumnSelectorComponentState$: Observable<
      CustomGroupColumnSelectorComponentState | Record<string, never>
    > = this.customGroupColumnSelectorComponentState$

    if (this.layout === 'table') {
      dataListGridSortingComponentState$ = dataListGridSortingComponentState$.pipe(startWith({}))
    } else {
      columnGroupSelectionComponentState$ = columnGroupSelectionComponentState$.pipe(
        startWith({
          activeColumnGroupKey: this.selectedGroupKey,
          displayedColumns: this.getDisplayedColumns(),
        })
      )
      customGroupColumnSelectorComponentState$ = customGroupColumnSelectorComponentState$.pipe(
        startWith({
          actionColumnConfig: {
            frozen: this.frozenActionColumn,
            position: this.actionColumnPosition,
          },
          displayedColumns: this.getDisplayedColumns(),
          activeColumnGroupKey: this.selectedGroupKey,
        })
      )
    }

    let filterViewComponentState$: Observable<FilterViewComponentState | Record<string, never>> =
      this.filterViewComponentState$
    if (this.disableFilterView) {
      filterViewComponentState$ = filterViewComponentState$.pipe(
        startWith({
          filters: this.filters,
        })
      )
    }

    combineLatest([
      columnGroupSelectionComponentState$.pipe(timestamp()),
      customGroupColumnSelectorComponentState$.pipe(timestamp()),
      this.dataLayoutComponentState$.pipe(timestamp()),
      dataListGridSortingComponentState$.pipe(timestamp()),
      this.dataViewComponentState$.pipe(timestamp()),
      filterViewComponentState$.pipe(timestamp()),
    ])
      .pipe(
        map((componentStates) => {
          return orderAndMergeValuesByTimestamp(componentStates)
        })
      )
      .subscribe((val) => {
        this.componentStateChanged.emit(val)
      })
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'tableCell':
          this.primeNgTableCell = item.template
          break
        case 'dateTableCell':
          this.primeNgDateTableCell = item.template
          break
        case 'relativeDateTableCell':
          this.primeNgRelativeDateTableCell = item.template
          break
        case 'translationKeyTableCell':
          this.primeNgTranslationKeyTableCell = item.template
          break
        case 'gridItemSubtitleLines':
          this.primeNgGridItemSubtitleLines = item.template
          break
        case 'listItemSubtitleLines':
          this.primeNgListItemSubtitleLines = item.template
          break
        case 'stringTableCell':
          this.primeNgStringTableCell = item.template
          break
        case 'numberTableCell':
          this.primeNgNumberTableCell = item.template
          break
        case 'gridItem':
          this.primeNgGridItem = item.template
          break
        case 'listItem':
          this.primeNgListItem = item.template
          break
        case 'topCenter':
          this.primeNgTopCenter = item.template
          break
        case 'listValue':
          this.primeNgListValue = item.template
          break
        case 'translationKeyListValue':
          this.primeNgTranslationKeyListValue = item.template
          break
        case 'numberListValue':
          this.primeNgNumberListValue = item.template
          break
        case 'relativeDateListValue':
          this.primeNgRelativeDateListValue = item.template
          break
        case 'stringListValue':
          this.primeNgStringListValue = item.template
          break
        case 'dateListValue':
          this.primeNgDateListValue = item.template
          break
        case 'tableFilterCell':
          this.primeNgTableFilterCell = item.template
          break
        case 'dateTableFilterCell':
          this.primeNgDateTableFilterCell = item.template
          break
        case 'relativeDateTableFilterCell':
          this.primeNgRelativeDateTableFilterCell = item.template
          break
        case 'translationKeyTableFilterCell':
          this.primeNgTranslationKeyTableFilterCell = item.template
          break
        case 'stringTableFilterCell':
          this.primeNgStringTableFilterCell = item.template
          break
        case 'numberTableFilterCell':
          this.primeNgNumberTableFilterCell = item.template
          break
      }
    })
  }

  filtering(event: any) {
    this.filters = event
    this.filtered.emit(event)
  }

  sorting(event: any) {
    this.sortDirection = event.sortDirection
    this.sortField = event.sortColumn
    this.sorted.emit(event)
  }

  onDeleteElement(element: RowListGridData) {
    if (this.isDeleteItemObserved) {
      this.deleteItem.emit(element)
    }
  }

  onViewElement(element: RowListGridData) {
    if (this.isViewItemObserved) {
      this.viewItem.emit(element)
    }
  }

  onEditElement(element: RowListGridData) {
    if (this.isEditItemObserved) {
      this.editItem.emit(element)
    }
  }

  onDataViewLayoutChange(layout: 'grid' | 'list' | 'table') {
    this.layout = layout
    this.dataViewLayoutChange.emit(layout)
  }

  onSortChange($event: any) {
    this.sortField = $event
    this.sorted.emit({ sortColumn: this.sortField, sortDirection: this.sortDirection })
  }

  onSortDirectionChange($event: any) {
    this.sortDirection = $event
    this.sorted.emit({ sortColumn: this.sortField, sortDirection: this.sortDirection })
  }

  onColumnGroupSelectionChange(event: GroupSelectionChangedEvent) {
    this.displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.selectedGroupKey = event.groupKey
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
  }

  registerEventListenerForDataView() {
    if (this.deleteItem.observed) {
      this.isDeleteItemObserved = true
      if (!this._dataViewComponent?.deleteItem.observed) {
        this._dataViewComponent?.deleteItem.subscribe((event) => {
          this.onDeleteElement(event)
        })
      }
    }
    if (this.viewItem.observed) {
      this.isViewItemObserved = true
      if (!this._dataViewComponent?.viewItem.observed) {
        this._dataViewComponent?.viewItem.subscribe((event) => {
          this.onViewElement(event)
        })
      }
    }
    if (this.editItem.observed) {
      this.isEditItemObserved = true
      if (!this._dataViewComponent?.editItem.observed) {
        this._dataViewComponent?.editItem.subscribe((event) => {
          this.onEditElement(event)
        })
      }
    }
    if (this.selectionChanged.observed) {
      if (!this._dataViewComponent?.selectionChanged.observed) {
        this._dataViewComponent?.selectionChanged.subscribe((event) => {
          this.onRowSelectionChange(event)
        })
      }
    }
  }

  onColumnSelectionChange(event: ColumnSelectionChangedEvent) {
    this.displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.selectedGroupKey = this.customGroupKey
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
  }

  onActionColumnConfigChange(event: ActionColumnChangedEvent) {
    this.frozenActionColumn = event.frozenActionColumn
    this.actionColumnPosition = event.actionColumnPosition
  }

  onRowSelectionChange(event: Row[]) {
    if (this.selectionChanged.observed) {
      this.selectionChanged.emit(event)
    }
  }

  onPageChange(event: number) {
    this.page = event
    this.pageChanged.emit(event)
  }

  onPageSizeChange(event: number) {
    this.pageSize = event
    this.pageSizeChanged.emit(event)
  }

  getDisplayedColumns(): DataTableColumn[] {
    return (
      (this.displayedColumnKeys
        .map((key) => this.columns.find((c) => c.id === key))
        .filter((d) => d) as DataTableColumn[]) ?? []
    )
  }
}
