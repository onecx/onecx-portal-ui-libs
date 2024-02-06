import {
  Component,
  ContentChild,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { DataListGridComponent, ListGridData } from '../data-list-grid/data-list-grid.component'
import { Row, Filter, Sort, DataTableComponent } from '../data-table/data-table.component'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { DataAction } from '../../../model/data-action'

export type RowListGridData = ListGridData & Row
@Component({
  selector: 'ocx-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  providers: [{ provide: 'DataViewComponent', useExisting: DataViewComponent }],
})
export class DataViewComponent implements DoCheck, OnInit {
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
  @Input() deletePermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() data: RowListGridData[] = []
  @Input() name = 'Data table'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() layout: any = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
  @Input() clientSideFiltering = true
  @Input() fallbackImage = 'placeholder.png'
  @Input() filters: Filter[] = []
  @Input() sortField: any = ''
  @Input() sortDirection: DataSortDirection = DataSortDirection.NONE
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @Input() totalRecordsOnServer: number | undefined 
  @Input() currentPageShowingKey = 'OCX_DATA_TABLE.SHOWING'
  @Input() currentPageShowingWithTotalOnServerKey = 'OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER'
  @Input() selectedRows: Row[] = []

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
  @Input() pageSize: number = this.pageSizes?.[0] || 50

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

  @Input() tableDateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableDateCell') tableDateCellChildTemplate: TemplateRef<any> | undefined
  get _tableDateCell(): TemplateRef<any> | undefined {
    return this.tableDateCellTemplate || this.tableDateCellChildTemplate
  }

  @Input() tableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableCell') tableCellChildTemplate: TemplateRef<any> | undefined
  get _tableCell(): TemplateRef<any> | undefined {
    return this.tableCellTemplate || this.tableCellChildTemplate
  }

  @Input() tableTranslationKeyCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableTranslationKeyCell') tableTranslationKeyCellChildTemplate: TemplateRef<any> | undefined
  get _tableTranslationKeyCell(): TemplateRef<any> | undefined {
    return this.tableTranslationKeyCellTemplate || this.tableTranslationKeyCellChildTemplate
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

  @Input() tableRelativeDateCellTemplate: TemplateRef<any> | undefined
  @ContentChild('tableRelativeDateCell') tableRelativeDateCellChildTemplate: TemplateRef<any> | undefined
  get _tableRelativeDateCell(): TemplateRef<any> | undefined {
    return this.tableRelativeDateCellTemplate || this.tableRelativeDateCellChildTemplate
  }

  @Input() additionalActions: DataAction[] = []

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() selectionChanged = new EventEmitter<Row[]>()
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  IsEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

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
    return this.injector.get('InteractiveDataViewComponent', null)?.selectionChanged.observed || this.selectionChanged.observed
  }

  constructor(private injector: Injector) {}
  
  ngOnInit(): void {
    this.firstColumnId = this.columns[0]?.id
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
      if(this.selectionChangedObserved) {
        if(!this._dataTableComponent?.selectionChanged.observed) {
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
    if(this.selectionChangedObserved){
      this.selectionChanged.emit(event)
    }
  }
}
