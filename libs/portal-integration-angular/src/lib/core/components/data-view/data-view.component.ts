import {
  Component,
  ContentChild,
  DoCheck,
  EventEmitter,
  Inject,
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
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
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

  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number = this.pageSizes?.[0] || 50

  @Input() standardTableCellTemplate: TemplateRef<any> | undefined
  @ContentChild('standardTableCell') standardTableCellChildTemplate: TemplateRef<any> | undefined
  get _standardTableCell(): TemplateRef<any> | undefined {
    return this.standardTableCellTemplate || this.standardTableCellChildTemplate
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
  isFilteredObserved: boolean | undefined
  isSortedObserved: boolean | undefined
  isDeleteItemObserved: boolean | undefined
  isViewItemObserved: boolean | undefined
  IsEditItemObserved: boolean | undefined
  firstColumnId: string | undefined

  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) {}
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
      if (this.filtered.observed) {
        this.isFilteredObserved = true
        if (!this._dataTableComponent?.filtered.observed) {
          this._dataTableComponent?.filtered.subscribe((event) => {
            this.filtering(event)
          })
        }
      }
      if (this.sorted.observed) {
        this.isSortedObserved = true
        if (!this._dataTableComponent?.sorted.observed) {
          this._dataTableComponent?.sorted.subscribe((event) => {
            this.sorting(event)
          })
        }
      }
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
    }
  }
  filtering(event: any) {
    if (this.isFilteredObserved) {
      this.filtered.emit(event)
    }
  }

  sorting(event: any) {
    if (this.isSortedObserved) {
      this.sorted.emit(event)
    }
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
}
