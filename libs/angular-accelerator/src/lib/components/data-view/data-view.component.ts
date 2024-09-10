import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { DataListGridComponent, DataListGridComponentState, ListGridData } from '../data-list-grid/data-list-grid.component'
import { Row, Filter, Sort, DataTableComponent, DataTableComponentState } from '../data-table/data-table.component'
import { DataTableColumn } from '../../model/data-table-column.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataAction } from '../../model/data-action'
import { BehaviorSubject, ReplaySubject, timestamp, combineLatest, map, Observable, startWith } from 'rxjs'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import { PrimeTemplate } from 'primeng/api'

export type RowListGridData = ListGridData & Row

export type DataViewComponentState = DataListGridComponentState & DataTableComponentState

@Component({
  selector: 'ocx-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  providers: [{ provide: 'DataViewComponent', useExisting: DataViewComponent }],
})
export class DataViewComponent implements DoCheck, OnInit, AfterContentInit {
  _dataListGridComponent: DataListGridComponent | undefined
  @ViewChild(DataListGridComponent) set listGrid(ref: DataListGridComponent | undefined) {
    this._dataListGridComponent = ref
    this.registerEventListenerForListGrid()
  }
  get listGrid(): DataListGridComponent | undefined {
    return this._dataListGridComponent
  }

  _dataTableComponent: DataTableComponent | undefined
  @ViewChild(DataTableComponent) set dataTable(ref: DataTableComponent | undefined) {
    this._dataTableComponent = ref
    this.registerEventListenerForDataTable()
  }
  get dataTable(): DataTableComponent | undefined {
    return this._dataTableComponent
  }

  dataTableComponentState$ = new ReplaySubject<DataTableComponentState>(1)
  dataListGridComponentState$ = new ReplaySubject<DataListGridComponentState>(1)

  @Input() deletePermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() data: RowListGridData[] = []
  @Input() name = 'Data table'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() layout: any = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() fallbackImage = 'placeholder.png'
  @Input() filters: Filter[] = []
  @Input() sortField: any = ''
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @Input() page = 0
  @Input() totalRecordsOnServer: number | undefined
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  @Input() selectedRows: Row[] = []
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Input()
  get paginator(): boolean {
    return this.listGridPaginator && this.tablePaginator
  }
  set paginator(value: boolean) {
    this.listGridPaginator = value
    this.tablePaginator = value
  }

  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number | undefined

  @Input() stringTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringTableCell') stringTableCellChildTemplate: TemplateRef<any> | undefined
  get _stringTableCell(): TemplateRef<any> | undefined {
    return this.stringTableCellTemplate || this.stringTableCellChildTemplate
  }

  @Input() numberTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberTableCell') numberTableCellChildTemplate: TemplateRef<any> | undefined
  get _numberTableCell(): TemplateRef<any> | undefined {
    return this.numberTableCellTemplate || this.numberTableCellChildTemplate
  }
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdTableCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableCell"
   */
  @Input() customTableCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdTableCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableCell"
   */
  @ContentChild('customTableCell') customTableCellChildTemplate: TemplateRef<any> | undefined
  get _customTableCell(): TemplateRef<any> | undefined {
    return this.customTableCellTemplate || this.customTableCellChildTemplate
  }

  @Input() dateTableCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be replaced by dateTableCellTemplate
   */
  @Input()
  get tableDateCellTemplate(): TemplateRef<any> | undefined {
    return this.dateTableCellTemplate
  }
  set tableDateCellTemplate(value: TemplateRef<any> | undefined) {
    this.dateTableCellTemplate = value
  }
  /**
   * @deprecated Will be replaced by dateTableCellChildTemplate
   */
  @ContentChild('tableDateCell') tableDateCellChildTemplate: TemplateRef<any> | undefined
  @ContentChild('dateTableCell') dateTableCellChildTemplate: TemplateRef<any> | undefined
  get _dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCellTemplate || this.dateTableCellChildTemplate || this.tableDateCellChildTemplate
  }

  @Input() tableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableCell') tableCellChildTemplate: TemplateRef<any> | undefined
  get _tableCell(): TemplateRef<any> | undefined {
    return this.tableCellTemplate || this.tableCellChildTemplate
  }

  @Input() translationKeyTableCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be replaced by translationKeyTableCellTemplate
   */
  @Input()
  get tableTranslationKeyCellTemplate(): TemplateRef<any> | undefined {
    return this.translationKeyTableCellTemplate
  }
  set tableTranslationKeyCellTemplate(value: TemplateRef<any> | undefined) {
    this.translationKeyTableCellTemplate = value
  }
  /**
   * @deprecated Will be replaced by translationKeyTableCellChildTemplate
   */
  @ContentChild('tableTranslationKeyCell') tableTranslationKeyCellChildTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableCell') translationKeyTableCellChildTemplate: TemplateRef<any> | undefined
  get _translationKeyTableCell(): TemplateRef<any> | undefined {
    return (
      this.translationKeyTableCellTemplate ||
      this.translationKeyTableCellChildTemplate ||
      this.tableTranslationKeyCellChildTemplate
    )
  }

  @Input() gridItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate || this.gridItemSubtitleLinesChildTemplate
  }

  @Input() listItemSubtitleLinesTemplate: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLinesChildTemplate: TemplateRef<any> | undefined
  get _listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate || this.listItemSubtitleLinesChildTemplate
  }
  @Input() gridItemTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItemChildTemplate: TemplateRef<any> | undefined
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate || this.gridItemChildTemplate
  }

  @Input() listItemTemplate: TemplateRef<any> | undefined
  @ContentChild('listItem') listItemChildTemplate: TemplateRef<any> | undefined
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate || this.listItemChildTemplate
  }

  @Input() relativeDateTableCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be replaced by relativeDateTableCellTemplate
   */
  @Input()
  get tableRelativeDateCellTemplate(): TemplateRef<any> | undefined {
    return this.relativeDateTableCellTemplate
  }
  set tableRelativeDateCellTemplate(value: TemplateRef<any> | undefined) {
    this.relativeDateTableCellTemplate = value
  }
  /**
   * @deprecated Will be replace by relativeDateTableCellChildTemplate
   */
  @ContentChild('tableRelativeDateCell') tableRelativeDateCellChildTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableCell') relativeDateTableCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateTableCell(): TemplateRef<any> | undefined {
    return (
      this.relativeDateTableCellTemplate ||
      this.relativeDateTableCellChildTemplate ||
      this.tableRelativeDateCellChildTemplate
    )
  }

  @Input() listValueTemplate: TemplateRef<any> | undefined
  @ContentChild('listValue') listValueChildTemplate: TemplateRef<any> | undefined
  get _listValue(): TemplateRef<any> | undefined {
    return this.listValueTemplate || this.listValueChildTemplate
  }
  @Input() translationKeyListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyListValue') translationKeyListValueChildTemplate: TemplateRef<any> | undefined
  get _translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValueTemplate || this.translationKeyListValueChildTemplate
  }
  @Input() numberListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('numberListValue') numberListValueChildTemplate: TemplateRef<any> | undefined
  get _numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValueTemplate || this.numberListValueChildTemplate
  }
  @Input() relativeDateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateListValue') relativeDateListValueChildTemplate: TemplateRef<any> | undefined
  get _relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValueTemplate || this.relativeDateListValueChildTemplate
  }
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdListValue
   * e.g. for a column with the id 'status' in DataListGrid use pTemplate="statusIdListValue"
   */
  @Input() customListValueTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column
   * use the new approach instead by following the naming convention column id + IdListValue
   * e.g. for a column with the id 'status' DataListGrid use pTemplate="statusIdListValue"
   */
  @ContentChild('customListValue') customListValueChildTemplate: TemplateRef<any> | undefined
  get _customListValue(): TemplateRef<any> | undefined {
    return this.customListValueTemplate || this.customListValueChildTemplate
  }
  @Input() stringListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('stringListValue') stringListValueChildTemplate: TemplateRef<any> | undefined
  get _stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValueTemplate || this.stringListValueChildTemplate
  }
  @Input() dateListValueTemplate: TemplateRef<any> | undefined
  @ContentChild('dateListValue') dateListValueChildTemplate: TemplateRef<any> | undefined
  get _dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValueTemplate || this.dateListValueChildTemplate
  }
  @Input() tableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableFilterCell') tableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _tableFilterCell(): TemplateRef<any> | undefined {
    return this.tableFilterCellTemplate || this.tableFilterCellChildTemplate
  }
  @Input() dateTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('dateFilterCell') dateTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _dateTableFilterCell(): TemplateRef<any> | undefined {
    return this.dateTableFilterCellTemplate || this.dateTableFilterCellChildTemplate
  }
  @Input() relativeDateTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('relativeDateTableFilterCell') relativeDateTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _relativeDateTableFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableFilterCellTemplate || this.relativeDateTableFilterCellChildTemplate
  }
  @Input() translationKeyTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('translationKeyTableFilterCell') translationKeyTableFilterCellChildTemplate:
    | TemplateRef<any>
    | undefined
  get _translationKeyTableFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableFilterCellTemplate || this.translationKeyTableFilterCellChildTemplate
  }
  @Input() stringTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('stringTableFilterCell') stringTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _stringTableFilterCell(): TemplateRef<any> | undefined {
    return this.stringTableFilterCellTemplate || this.stringTableFilterCellChildTemplate
  }
  @Input() numberTableFilterCellTemplate: TemplateRef<any> | undefined
  @ContentChild('numberTableFilterCell') numberTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _numberTableFilterCell(): TemplateRef<any> | undefined {
    return this.numberTableFilterCellTemplate || this.numberTableFilterCellChildTemplate
  }
  /**
   * @deprecated Will be removed and instead to change the template of a specific column filter
   * use the new approach instead by following the naming convention column id + IdTableFilterCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableFilterCell"
   */
  @Input() customTableFilterCellTemplate: TemplateRef<any> | undefined
  /**
   * @deprecated Will be removed and instead to change the template of a specific column filter
   * use the new approach instead by following the naming convention column id + IdTableFilterCell
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdTableFilterCell"
   */
  @ContentChild('customTableFilterCell') customTableFilterCellChildTemplate: TemplateRef<any> | undefined
  get _customTableFilterCell(): TemplateRef<any> | undefined {
    return this.customTableFilterCellTemplate || this.customTableFilterCellChildTemplate
  }

  @Input() additionalActions: DataAction[] = []

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() selectionChanged = new EventEmitter<Row[]>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataViewComponentState>()
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  IsEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  templatesForChildren$: Observable<QueryList<PrimeTemplate> | undefined> = combineLatest([
    this.templates$,
    this.parentTemplates$,
  ]).pipe(
    map(([t, pt]) => {
      const ql = new QueryList<PrimeTemplate>()
      ql.reset([...(t?.toArray() ?? []), ...(pt?.toArray() ?? [])])
      return ql
    })
  )

  get viewItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.viewItem.observed || this.viewItem.observed
  }
  get editItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.editItem.observed || this.editItem.observed
  }
  get deleteItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.deleteItem.observed || this.deleteItem.observed
  }
  get selectionChangedObserved(): boolean {
    return (
      this.injector.get('InteractiveDataViewComponent', null)?.selectionChanged.observed ||
      this.selectionChanged.observed
    )
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.firstColumnId = this.columns[0]?.id

    let dataTableComponentState$: Observable<DataTableComponentState | Record<string, never>> = this.dataTableComponentState$
    let dataListGridComponentState$: Observable<DataListGridComponentState | Record<string, never>> = this.dataListGridComponentState$
    if (this.layout === 'table') {
      dataListGridComponentState$ = dataListGridComponentState$.pipe(startWith({}))
    } else {
      dataTableComponentState$ = dataTableComponentState$.pipe(startWith({}))
    }

    combineLatest([
      dataTableComponentState$.pipe(timestamp()),
      dataListGridComponentState$.pipe(timestamp()),
    ])
      .pipe(
        map((componentStates) => {
          return orderAndMergeValuesByTimestamp(componentStates)
        })
      )
      .subscribe((val) => {this.componentStateChanged.emit(val)})
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
        case 'stringTableCell':
          this.stringTableCellChildTemplate = item.template
          break
        case 'numberTableCell':
          this.numberTableCellChildTemplate = item.template
          break
        case 'customTableCell':
          this.customTableCellChildTemplate = item.template
          break
        case 'tableDateCell':
          this.tableDateCellChildTemplate = item.template
          break
        case 'dateTableCell':
          this.dateTableCellChildTemplate = item.template
          break
        case 'tableCell':
          this.tableCellChildTemplate = item.template
          break
        case 'tableTranslationKeyCell':
          this.tableTranslationKeyCellChildTemplate = item.template
          break
        case 'translationKeyTableCell':
          this.translationKeyTableCellChildTemplate = item.template
          break
        case 'gridItemSubtitleLines':
          this.gridItemSubtitleLinesChildTemplate = item.template
          break
        case 'listItemSubtitleLines':
          this.listItemSubtitleLinesChildTemplate = item.template
          break
        case 'gridItem':
          this.gridItemChildTemplate = item.template
          break
        case 'listItem':
          this.listItemChildTemplate = item.template
          break
        case 'tableRelativeDateCell':
          this.tableRelativeDateCellChildTemplate = item.template
          break
        case 'relativeDateTableCell':
          this.relativeDateTableCellChildTemplate = item.template
          break
        case 'listValue':
          this.listValueChildTemplate = item.template
          break
        case 'translationKeyListValue':
          this.translationKeyListValueChildTemplate = item.template
          break
        case 'numberListValue':
          this.numberListValueChildTemplate = item.template
          break
        case 'relativeDateListValue':
          this.relativeDateListValueChildTemplate = item.template
          break
        case 'customListValue':
          this.customListValueChildTemplate = item.template
          break
        case 'stringListValue':
          this.stringListValueChildTemplate = item.template
          break
        case 'dateListValue':
          this.dateListValueChildTemplate = item.template
          break
        case 'tableFilterCell':
          this.tableFilterCellChildTemplate = item.template
          break
        case 'dateTableFilterCell':
          this.dateTableFilterCellChildTemplate = item.template
          break
        case 'relativeDateTableFilterCell':
          this.relativeDateTableFilterCellChildTemplate = item.template
          break
        case 'translationKeyTableFilterCell':
          this.translationKeyTableFilterCellChildTemplate = item.template
          break
        case 'stringTableFilterCell':
          this.stringTableFilterCellChildTemplate = item.template
          break
        case 'numberTableFilterCell':
          this.numberTableFilterCellChildTemplate = item.template
          break
        case 'customTableFilterCell':
          this.customTableFilterCellChildTemplate = item.template
          break
      }
    })
  }

  ngDoCheck(): void {
    this.registerEventListenerForDataTable()
    this.registerEventListenerForListGrid()
  }

  registerEventListenerForListGrid() {
    if (this.layout !== 'table') {
      if (this.deleteItem.observed) {
        this.isDeleteItemObserved = true
        if (!this._dataListGridComponent?.deleteItem.observed) {
          this._dataListGridComponent?.deleteItem.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed) {
        this.isViewItemObserved = true
        if (!this._dataListGridComponent?.viewItem.observed) {
          this._dataListGridComponent?.viewItem.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed) {
        this.IsEditItemObserved = true
        if (!this._dataListGridComponent?.editItem.observed) {
          this._dataListGridComponent?.editItem.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
    }
  }

  registerEventListenerForDataTable() {
    if (this.layout === 'table') {
      if (this.deleteItem.observed) {
        this.isDeleteItemObserved = true
        if (!this._dataTableComponent?.deleteTableRow.observed) {
          this._dataTableComponent?.deleteTableRow.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed) {
        this.isViewItemObserved = true
        if (!this._dataTableComponent?.viewTableRow.observed) {
          this._dataTableComponent?.viewTableRow.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed) {
        this.IsEditItemObserved = true
        if (!this._dataTableComponent?.editTableRow.observed) {
          this._dataTableComponent?.editTableRow.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
      if (this.selectionChangedObserved) {
        if (!this._dataTableComponent?.selectionChanged.observed) {
          this._dataTableComponent?.selectionChanged.subscribe((event) => {
            this.onRowSelectionChange(event)
          })
        }
      }
    }
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

  deletingElement(event: any) {
    if (this.isDeleteItemObserved) {
      this.deleteItem.emit(event)
    }
  }

  viewingElement(event: any) {
    if (this.isViewItemObserved) {
      this.viewItem.emit(event)
    }
  }
  editingElement(event: any) {
    if (this.IsEditItemObserved) {
      this.editItem.emit(event)
    }
  }

  onRowSelectionChange(event: Row[]) {
    if (this.selectionChangedObserved) {
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
