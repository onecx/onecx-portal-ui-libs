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
} from '@angular/core'
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, map, startWith, timestamp } from 'rxjs'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import {
  ColumnGroupSelectionComponentState,
  GroupSelectionChangedEvent,
} from '../column-group-selection/column-group-selection.component'
import { PrimeTemplate } from 'primeng/api'
import {
  ActionColumnChangedEvent,
  ColumnSelectionChangedEvent,
  CustomGroupColumnSelectorComponentState,
} from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponentState } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponentState } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { Filter, Row, Sort } from '../data-table/data-table.component'
import { DataViewComponent, DataViewComponentState, RowListGridData } from '../data-view/data-view.component'

export type InteractiveDataViewComponentState = ColumnGroupSelectionComponentState &
  CustomGroupColumnSelectorComponentState &
  DataLayoutSelectionComponentState &
  DataListGridSortingComponentState &
  DataViewComponentState
@Component({
  selector: 'ocx-interactive-data-view',
  templateUrl: './interactive-data-view.component.html',
  styleUrls: ['./interactive-data-view.component.css'],
  providers: [{ provide: 'InteractiveDataViewComponent', useExisting: InteractiveDataViewComponent }],
})
export class InteractiveDataViewComponent implements OnInit, AfterContentInit {
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

  @Input() deletePermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
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
  /**
   * @deprecated Use `displayedColumnKeys` and pass in column ids instead of `DataTableColumn` objects
   */
  @Input()
  get displayedColumns(): DataTableColumn[] {
      return (
        (this.displayedColumnKeys
          .map((d) => this.columns.find((c) => c.id === d))
          .filter((d) => d) as DataTableColumn[]) ?? []
      );
  }
  set displayedColumns(value: DataTableColumn[]) {
    this.displayedColumnKeys$.next(value.map((d) => d.id))
  }
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'
  @ContentChild('tableCell') tableCell: TemplateRef<any> | undefined
  /**
   * @deprecated Will be replaced by dateTableCell
   */
  @ContentChild('tableDateCell') tableDateCell: TemplateRef<any> | undefined
  @ContentChild('dateTableCell') dateTableCell: TemplateRef<any> | undefined

  /**
   * @deprecated Will be replaced by relativeDateTableCell
   */
  @ContentChild('tableRelativeDateCell') tableRelativeDateCell: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableCell') relativeDateTableCell: TemplateRef<any> | undefined

  /**
   * @deprecated Will be replaced by translationKeyTableCell
   */
  @ContentChild('tableTranslationKeyCell') tableTranslationKeyCell: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableCell') translationKeyTableCell: TemplateRef<any> | undefined

  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('stringTableCell') stringTableCell: TemplateRef<any> | undefined
  @ContentChild('numberTableCell') numberTableCell: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdTableCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableCell"
   */
  @ContentChild('customTableCell') customTableCell: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItem: TemplateRef<any> | undefined
  @ContentChild('listItem') listItem: TemplateRef<any> | undefined
  @ContentChild('topCenter') topCenter: TemplateRef<any> | undefined
  @ContentChild('listValue') listValue: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValue: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValue: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValue: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdListValue
   * e.g. for a column with the id 'status' DataListGrid use pTemplate="statusIdListValue"
   */
  @ContentChild('customListValue') customListValue: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValue: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValue: TemplateRef<any> | undefined
  @ContentChild('tableFilterCell') tableFilterCell: TemplateRef<any> | undefined
  @ContentChild('dateTableFilterCell') dateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableFilterCell') relativeDateTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableFilterCell') translationKeyTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('stringTableFilterCell') stringTableFilterCell: TemplateRef<any> | undefined
  @ContentChild('numberTableFilterCell') numberTableFilterCell: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column filter
   * use the new approach instead by following the naming convention column id + IdTableFilterCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableFilterCell"
   */
  @ContentChild('customTableFilterCell') customTableFilterCell: TemplateRef<any> | undefined

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
  // TODO: Remove following line once displayedColumns (deprecated) has been removed
  @Output() displayedColumnsChange = new EventEmitter<DataTableColumn[]>()
  @Output() displayedColumnKeysChange = new EventEmitter<string[]>()
  @Output() selectionChanged: EventEmitter<Row[]> = new EventEmitter()

  @Output() pageChanged: EventEmitter<number> = new EventEmitter()
  @Output() pageSizeChanged = new EventEmitter<number>()

  @Output() componentStateChanged = new EventEmitter<InteractiveDataViewComponentState>()

  selectedGroupKey = ''
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
  get _customTableCell(): TemplateRef<any> | undefined {
    return this.customTableCell
  }
  get _tableDateCell(): TemplateRef<any> | undefined {
    return this.dateTableCell ?? this.tableDateCell
  }
  get _dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCell
  }
  get _tableRelativeDateCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCell ?? this.tableRelativeDateCell
  }
  get _relativeDateTableCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCell
  }
  get _tableTranslationKeyCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableCell ?? this.tableTranslationKeyCell
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
  get _customListValue(): TemplateRef<any> | undefined {
    return this.customListValue
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
  get _customTableFilterCell(): TemplateRef<any> | undefined {
    return this.customTableFilterCell
  }

  _data: RowListGridData[] = []
  @Input()
  get data(): RowListGridData[] {
    return this._data
  }
  set data(value: RowListGridData[]) {
    this._data = value
  }

  ngOnInit(): void {
    this.selectedGroupKey = this.defaultGroupKey
    if(!this.displayedColumns || this.displayedColumns.length === 0) {
      this.displayedColumnKeys = this.columns.map((column) => column.id)
    }
    if (this.defaultGroupKey) {
      this.displayedColumnKeys = this.columns.filter((column) =>
        column.predefinedGroupKeys?.includes(this.defaultGroupKey)
      ).map((column) => column.id)
    }
    this.displayedColumns$ = this.displayedColumnKeys$.pipe(map((columnKeys) => (
      (columnKeys
        .map((key) => this.columns.find((col) => col.id === key))
        .filter((d) => d) as DataTableColumn[]) ?? []
    )))
    // TODO: Remove following line once displayedColumns (deprecated) has been removed
    this.displayedColumnsChange.emit(this.displayedColumns)
    this.displayedColumnKeysChange.emit(this.displayedColumnKeys)
    if (!this.groupSelectionNoGroupSelectedKey) {
      this.groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
    }
    this.firstColumnId = this.columns[0]?.id

    let dataListGridSortingComponentState$: Observable<DataListGridSortingComponentState | Record<string, never>> =
      this.dataListGridSortingComponentState$
    if (this.layout === 'table') {
      dataListGridSortingComponentState$ = dataListGridSortingComponentState$.pipe(startWith({}))
    }
    combineLatest([
      this.columnGroupSelectionComponentState$.pipe(timestamp()),
      this.customGroupColumnSelectorComponentState$.pipe(timestamp()),
      this.dataLayoutComponentState$.pipe(timestamp()),
      dataListGridSortingComponentState$.pipe(timestamp()),
      this.dataViewComponentState$.pipe(timestamp()),
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
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case 'tableCell':
          this.tableCell = item.template
          break
        case 'tableDateCell':
          this.tableDateCell = item.template
          break
        case 'dateTableCell':
          this.dateTableCell = item.template
          break
        case 'tableRelativeDateCell':
          this.tableRelativeDateCell = item.template
          break
        case 'relativeDateTableCell':
          this.relativeDateTableCell = item.template
          break
        case 'tableTranslationKeyCell':
          this.tableTranslationKeyCell = item.template
          break
        case 'translationKeyTableCell':
          this.translationKeyTableCell = item.template
          break
        case 'gridItemSubtitleLines':
          this.gridItemSubtitleLines = item.template
          break
        case 'listItemSubtitleLines':
          this.listItemSubtitleLines = item.template
          break
        case 'stringTableCell':
          this.stringTableCell = item.template
          break
        case 'numberTableCell':
          this.numberTableCell = item.template
          break
        case 'customTableCell':
          this.customTableCell = item.template
          break
        case 'gridItem':
          this.gridItem = item.template
          break
        case 'listItem':
          this.listItem = item.template
          break
        case 'topCenter':
          this.topCenter = item.template
          break
        case 'listValue':
          this.listValue = item.template
          break
        case 'translationKeyListValue':
          this.translationKeyListValue = item.template
          break
        case 'numberListValue':
          this.numberListValue = item.template
          break
        case 'relativeDateListValue':
          this.relativeDateListValue = item.template
          break
        case 'customListValue':
          this.customListValue = item.template
          break
        case 'stringListValue':
          this.stringListValue = item.template
          break
        case 'dateListValue':
          this.dateListValue = item.template
          break
        case 'tableFilterCell':
          this.tableFilterCell = item.template
          break
        case 'dateTableFilterCell':
          this.dateTableFilterCell = item.template
          break
        case 'relativeDateTableFilterCell':
          this.relativeDateTableFilterCell = item.template
          break
        case 'translationKeyTableFilterCell':
          this.translationKeyTableFilterCell = item.template
          break
        case 'stringTableFilterCell':
          this.stringTableFilterCell = item.template
          break
        case 'numberTableFilterCell':
          this.numberTableFilterCell = item.template
          break
        case 'customTableFilterCell':
          this.customTableFilterCell = item.template
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
    // TODO: Remove following line once displayedColumns (deprecated) has been removed
    this.displayedColumnsChange.emit(this.displayedColumns)
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
    // TODO: Remove following line once displayedColumns (deprecated) has been removed
    this.displayedColumnsChange.emit(this.displayedColumns)
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

}
