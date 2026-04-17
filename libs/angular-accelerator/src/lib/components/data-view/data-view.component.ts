import {
  Component,
  Injector,
  Input,
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
  output,
  signal,
  viewChild,
} from '@angular/core'
import { PrimeTemplate } from 'primeng/api'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { InteractiveExpandedRows, ViewLayout } from '../../model/view-layout.model'
import {
  DataListGridComponent,
  DataListGridComponentState,
  ListGridData,
} from '../data-list-grid/data-list-grid.component'
import { DataTableComponent, DataTableComponentState, Row } from '../data-table/data-table.component'
import { observableOutput } from '../../utils/observable-output.utils'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

export type RowListGridData = ListGridData & Row

export type DataViewComponentState = DataListGridComponentState & DataTableComponentState

@Component({
  standalone: false,
  selector: 'ocx-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  providers: [
    { provide: 'DataViewComponent', useExisting: DataViewComponent }, 
    {
      provide: InteractiveDataViewService,
      useFactory: (parentService: InteractiveDataViewService | null) => parentService ?? new InteractiveDataViewService(),
      deps: [[new Optional(), new SkipSelf(), InteractiveDataViewService]],
    }
  ],
})
export class DataViewComponent implements OnInit {
  private readonly injector = inject(Injector)
  private readonly stateService = inject(InteractiveDataViewService)

  dataListGridComponent = viewChild(DataListGridComponent)

  dataTableComponent = viewChild(DataTableComponent)

  deletePermission = input<string | string[]>()
  editPermission = input<string | string[]>()
  viewPermission = input<string | string[]>()
  deleteActionVisibleField = input<string | undefined>()
  deleteActionEnabledField = input<string | undefined>()
  viewActionVisibleField = input<string | undefined>()
  viewActionEnabledField = input<string | undefined>()
  editActionVisibleField = input<string | undefined>()
  editActionEnabledField = input<string | undefined>()
  tableSelectionEnabledField = input<string | undefined>()
  tableAllowSelectAll = input<boolean>(true)
  data = input<RowListGridData[]>([])
  name = input<string>('')
  titleLineId = input<string | undefined>()
  subtitleLineIds = input<string[]>()
  columns = input<DataTableColumn[]>([])
  emptyResultsMessage = input<string | undefined>()
  clientSideSorting = input<boolean>(true)
  clientSideFiltering = input<boolean>(true)
  fallbackImage = input<string>()
  
  @Input()
  get layout(): ViewLayout {
    return this.stateService.layout()
  }
  set layout(value: ViewLayout) {
    this.stateService.setLayout(value)
  }

  @Input()
  get filters(): Filter[] {
    return this.stateService.filters()
  }
  set filters(value: Filter[]) {
    this.stateService.setFilters(value)
  }

  @Input()
  get sortField(): string {
    return this.stateService.sortColumn()
  }
  set sortField(value: string) {
    this.stateService.setSortColumn(value)
  }

  @Input()
  get sortDirection(): DataSortDirection {
    return this.stateService.sortDirection()
  }
  set sortDirection(value: DataSortDirection) {
    this.stateService.setSortDirection(value)
  }

  @Input()
  get listGridPaginator(): boolean {
    return this.stateService.listGridPaginator()
  }
  set listGridPaginator(value: boolean) {
    this.stateService.setListGridPaginator(value)
  }

  @Input()
  get tablePaginator(): boolean {
    return this.stateService.tablePaginator()
  }
  set tablePaginator(value: boolean) {
    this.stateService.setTablePaginator(value)
  }

  @Input()
  get paginator(): boolean {
    return this.listGridPaginator && this.tablePaginator
  }
  set paginator(value: boolean) {
    this.listGridPaginator = value
    this.tablePaginator = value
  }

  @Input()
  get page(): number {
    return this.stateService.activePage()
  }
  set page(value: number) {
    this.stateService.setActivePage(value)
  }

  @Input()
  get selectedRows(): Row[] {
    return this.stateService.selectedRows()
  }
  set selectedRows(value: Row[]) {
    this.stateService.setSelectedRows(value)
  }

  @Input()
  get expandedRows(): InteractiveExpandedRows {
    return this.stateService.expandedRows()
  }
  set expandedRows(value: InteractiveExpandedRows) {
    this.stateService.setExpandedRows(value)
  }

  @Input()
  get pageSize(): number {
    return this.stateService.pageSize()
  }
  set pageSize(value: number) {
    this.stateService.setPageSize(value)
  }

  totalRecordsOnServer = input<number | undefined>()
  currentPageShowingKey = input<string>('OCX_DATA_TABLE.SHOWING')
  currentPageShowingWithTotalOnServerKey = input<string>('OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER')
  frozenActionColumn = input<boolean>(false)
  actionColumnPosition = input<'left' | 'right'>('right')
  expandable = input<boolean>(false)
  frozenExpandColumn = input<boolean>(false)

  sortStates = input<DataSortDirection[]>([])
  pageSizes = input<number[]>([10, 25, 50])

  stringTableCellTemplate = input<TemplateRef<any> | undefined>()
  stringTableCellChildTemplate = contentChild<TemplateRef<any>>('stringTableCellTemplate')
  get stringTableCell(): TemplateRef<any> | undefined {
    return this.stringTableCellTemplate() || this.stringTableCellChildTemplate()
  }

  numberTableCellTemplate = input<TemplateRef<any> | undefined>()
  numberTableCellChildTemplate = contentChild<TemplateRef<any>>('numberTableCellTemplate')
  get numberTableCell(): TemplateRef<any> | undefined {
    return this.numberTableCellTemplate() || this.numberTableCellChildTemplate()
  }

  dateTableCellTemplate = input<TemplateRef<any> | undefined>()
  dateTableCellChildTemplate = contentChild<TemplateRef<any>>('dateTableCellTemplate')
  get dateTableCell(): TemplateRef<any> | undefined {
    return this.dateTableCellTemplate() || this.dateTableCellChildTemplate()
  }

  tableCellTemplate = input<TemplateRef<any> | undefined>()
  tableCellChildTemplate = contentChild<TemplateRef<any>>('tableCellTemplate')
  get tableCell(): TemplateRef<any> | undefined {
    return this.tableCellTemplate() || this.tableCellChildTemplate()
  }

  translationKeyTableCellTemplate = input<TemplateRef<any> | undefined>()
  translationKeyTableCellChildTemplate = contentChild<TemplateRef<any>>('translationKeyTableCellTemplate')
  get translationKeyTableCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableCellTemplate() || this.translationKeyTableCellChildTemplate()
  }

  gridItemSubtitleLinesTemplate = input<TemplateRef<any> | undefined>()
  gridItemSubtitleLinesChildTemplate = contentChild<TemplateRef<any>>('gridItemSubtitleLinesTemplate')
  get gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate() || this.gridItemSubtitleLinesChildTemplate()
  }

  listItemSubtitleLinesTemplate = input<TemplateRef<any> | undefined>()
  listItemSubtitleLinesChildTemplate = contentChild<TemplateRef<any>>('listItemSubtitleLinesTemplate')
  get listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate() || this.listItemSubtitleLinesChildTemplate()
  }
  gridItemTemplate = input<TemplateRef<any> | undefined>()
  gridItemChildTemplate = contentChild<TemplateRef<any>>('gridItemTemplate')
  get gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate() || this.gridItemChildTemplate()
  }

  listItemTemplate = input<TemplateRef<any> | undefined>()
  listItemChildTemplate = contentChild<TemplateRef<any>>('listItemTemplate')
  get listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate() || this.listItemChildTemplate()
  }

  relativeDateTableCellTemplate = input<TemplateRef<any> | undefined>()
  relativeDateTableCellChildTemplate = contentChild<TemplateRef<any>>('relativeDateTableCellTemplate')
  get relativeDateTableCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableCellTemplate() || this.relativeDateTableCellChildTemplate()
  }

  listValueTemplate = input<TemplateRef<any> | undefined>()
  listValueChildTemplate = contentChild<TemplateRef<any>>('listValueTemplate')
  get listValue(): TemplateRef<any> | undefined {
    return this.listValueTemplate() || this.listValueChildTemplate()
  }
  translationKeyListValueTemplate = input<TemplateRef<any> | undefined>()
  translationKeyListValueChildTemplate = contentChild<TemplateRef<any>>('translationKeyListValueTemplate')
  get translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValueTemplate() || this.translationKeyListValueChildTemplate()
  }
  numberListValueTemplate = input<TemplateRef<any> | undefined>()
  numberListValueChildTemplate = contentChild<TemplateRef<any>>('numberListValueTemplate')
  get numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValueTemplate() || this.numberListValueChildTemplate()
  }
  relativeDateListValueTemplate = input<TemplateRef<any> | undefined>()
  relativeDateListValueChildTemplate = contentChild<TemplateRef<any>>('relativeDateListValueTemplate')
  get relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValueTemplate() || this.relativeDateListValueChildTemplate()
  }
  stringListValueTemplate = input<TemplateRef<any> | undefined>()
  stringListValueChildTemplate = contentChild<TemplateRef<any>>('stringListValueTemplate')
  get stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValueTemplate() || this.stringListValueChildTemplate()
  }
  dateListValueTemplate = input<TemplateRef<any> | undefined>()
  dateListValueChildTemplate = contentChild<TemplateRef<any>>('dateListValueTemplate')
  get dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValueTemplate() || this.dateListValueChildTemplate()
  }
  tableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  tableFilterCellChildTemplate = contentChild<TemplateRef<any>>('tableFilterCellTemplate')
  get tableFilterCell(): TemplateRef<any> | undefined {
    return this.tableFilterCellTemplate() || this.tableFilterCellChildTemplate()
  }
  dateTableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  dateTableFilterCellChildTemplate = contentChild<TemplateRef<any>>('dateTableFilterCellTemplate')
  get dateTableFilterCell(): TemplateRef<any> | undefined {
    return this.dateTableFilterCellTemplate() || this.dateTableFilterCellChildTemplate()
  }
  relativeDateTableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  relativeDateTableFilterCellChildTemplate = contentChild<TemplateRef<any>>('relativeDateTableFilterCellTemplate')
  get relativeDateTableFilterCell(): TemplateRef<any> | undefined {
    return this.relativeDateTableFilterCellTemplate() || this.relativeDateTableFilterCellChildTemplate()
  }
  translationKeyTableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  translationKeyTableFilterCellChildTemplate = contentChild<TemplateRef<any>>('translationKeyTableFilterCellTemplate')
  get translationKeyTableFilterCell(): TemplateRef<any> | undefined {
    return this.translationKeyTableFilterCellTemplate() || this.translationKeyTableFilterCellChildTemplate()
  }
  stringTableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  stringTableFilterCellChildTemplate = contentChild<TemplateRef<any>>('stringTableFilterCellTemplate')
  get stringTableFilterCell(): TemplateRef<any> | undefined {
    return this.stringTableFilterCellTemplate() || this.stringTableFilterCellChildTemplate()
  }
  numberTableFilterCellTemplate = input<TemplateRef<any> | undefined>()
  numberTableFilterCellChildTemplate = contentChild<TemplateRef<any>>('numberTableFilterCellTemplate')
  get numberTableFilterCell(): TemplateRef<any> | undefined {
    return this.numberTableFilterCellTemplate() || this.numberTableFilterCellChildTemplate()
  }

  additionalActions = input<DataAction[]>([])

  @Output() deleteItem = observableOutput<RowListGridData>()
  @Output() viewItem = observableOutput<RowListGridData>()
  @Output() editItem = observableOutput<RowListGridData>()
  @Output() selectionChanged = observableOutput<Row[]>()
  @Output() rowExpanded = observableOutput<Row>()
  @Output() rowCollapsed = observableOutput<Row>()

  layoutChange = output<ViewLayout>()
  filtersChange = output<Filter[]>()
  sortFieldChange = output<string>()
  sortDirectionChange = output<DataSortDirection>()
  pageChange = output<number>()
  pageSizeChange = output<number>()

  firstColumnId = signal<string | undefined>(undefined)

  parentTemplates = input<readonly PrimeTemplate[] | null | undefined>()

  templates = contentChildren(PrimeTemplate)

  templatesForChildren = computed(() => {
    const t = this.templates()
    const pt = this.parentTemplates()

    return [...t, ...(pt ?? [])]
  })

  get viewItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.viewItem.observed() || this.viewItem.observed()
  }
  get editItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.editItem.observed() || this.editItem.observed()
  }
  get deleteItemObserved(): boolean {
    return this.injector.get('InteractiveDataViewComponent', null)?.deleteItem.observed() || this.deleteItem.observed()
  }
  get selectionChangedObserved(): boolean {
    return (
      this.injector.get('InteractiveDataViewComponent', null)?.selectionChanged.observed() ||
      this.selectionChanged.observed()
    )
  }

  constructor() {
    effect(() => {
      this.registerEventListenerForListGrid()
    })

    effect(() => {
      this.registerEventListenerForDataTable()
    })

    effect(() => {
      const selectedRows = this.selectedRows
      if (selectedRows && this.selectionChangedObserved) {
        this.selectionChanged.emit(selectedRows)
      }
    })

    effect(() => {
      this.stateService.setActionColumnConfig(this.frozenActionColumn(), this.actionColumnPosition())
    })
  }

  ngOnInit(): void {
    const columns = this.columns()
    if (columns && columns.length > 0) {
      this.firstColumnId.set(columns[0]?.id)
    }
  }

  registerEventListenerForListGrid() {
    if (this.layout !== 'table') {
      if (this.deleteItem.observed()) {
        if (!this.dataListGridComponent()?.deleteItem.observed()) {
          this.dataListGridComponent()?.deleteItem.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed()) {
        if (!this.dataListGridComponent()?.viewItem.observed()) {
          this.dataListGridComponent()?.viewItem.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed()) {
        if (!this.dataListGridComponent()?.editItem.observed()) {
          this.dataListGridComponent()?.editItem.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
    }
  }

  registerEventListenerForDataTable() {
    if (this.layout === 'table') {
      if (this.deleteItem.observed()) {
        if (!this.dataTableComponent()?.deleteTableRow.observed()) {
          this.dataTableComponent()?.deleteTableRow.subscribe((event) => {
            this.deletingElement(event)
          })
        }
      }
      if (this.viewItem.observed()) {
        if (!this.dataTableComponent()?.viewTableRow.observed()) {
          this.dataTableComponent()?.viewTableRow.subscribe((event) => {
            this.viewingElement(event)
          })
        }
      }
      if (this.editItem.observed()) {
        if (!this.dataTableComponent()?.editTableRow.observed()) {
          this.dataTableComponent()?.editTableRow.subscribe((event) => {
            this.editingElement(event)
          })
        }
      }
      if (this.selectionChangedObserved) {
        if (!this.dataTableComponent()?.selectionChanged.observed()) {
          this.dataTableComponent()?.selectionChanged.subscribe((event) => {
            this.onRowSelectionChange(event)
          })
        }
      }
    }
  }

  filtering(event: any) {
    this.filters = event.filters
    this.filtersChange.emit(this.filters)
  }

  sorting(event: any) {
    this.sortDirection = event.sortDirection
    this.sortField = event.sortColumn
    this.sortDirectionChange.emit(this.sortDirection)
    this.sortFieldChange.emit(this.sortField)
  }

  deletingElement(event: any) {
    if (this.deleteItemObserved) {
      this.deleteItem.emit(event)
    }
  }

  viewingElement(event: any) {
    if (this.viewItemObserved) {
      this.viewItem.emit(event)
    }
  }
  editingElement(event: any) {
    if (this.editItemObserved) {
      this.editItem.emit(event)
    }
  }

  onRowSelectionChange(event: Row[]) {
    this.selectedRows = event
  }

  onPageChange(event: number) {
    this.page = event
    this.pageChange.emit(this.page)
  }

  onPageSizeChange(event: number) {
    this.pageSize = event
    this.pageSizeChange.emit(this.pageSize)
  }
}
