import {
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { Filter, Sort } from '../data-table/data-table.component'
import { DataViewComponent, RowListGridData } from '../data-view/data-view.component'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { IAuthService } from '../../../api/iauth.service'
import { GroupSelectionChangedEvent } from '../column-group-selection/column-group-selection.component'
import { ColumnSelectionChangedEvent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataAction } from '../../../model/data-action'

@Component({
  selector: 'ocx-interactive-data-view',
  templateUrl: './interactive-data-view.component.html',
  styleUrls: ['./interactive-data-view.component.css'],
  providers: [{ provide: 'InteractiveDataViewComponent', useExisting: InteractiveDataViewComponent }],
})
export class InteractiveDataViewComponent implements OnInit {
  _dataViewComponent: DataViewComponent | undefined
  @ViewChild(DataViewComponent) set dataView(ref: DataViewComponent | undefined) {
    this._dataViewComponent = ref
    this.registerEventListenerForDataView()
  }
  get dataView(): DataViewComponent | undefined {
    return this._dataViewComponent
  }

  @Input() deletePermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() viewPermission: string | undefined
  @Input() name = 'Data'
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() supportedViewLayouts: ('grid' | 'list' | 'table')[] = ['grid', 'list', 'table']
  @Input() columns: DataTableColumn[] = []
  @Input() emptyResultsMessage: string | undefined
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
  @Input() pageSize: number = this.pageSizes[0] || 50
  @Input() layout: 'grid' | 'list' | 'table' = 'table'
  @Input() defaultGroupKey = ''
  @Input() customGroupKey = 'OCX_INTERACTIVE_DATA_VIEW.CUSTOM_GROUP'
  @Input() groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
  @Input() additionalActions: DataAction[] = []
  @Input() listGridPaginator = true
  @Input() tablePaginator = true
  @ContentChild('tableCell') tableCell: TemplateRef<any> | undefined
  @ContentChild('tableDateCell') tableDateCell: TemplateRef<any> | undefined
  @ContentChild('tableRelativeDateCell') tableRelativeDateCell: TemplateRef<any> | undefined
  @ContentChild('tableTranslationKeyCell') tableTranslationKeyCell: TemplateRef<any> | undefined
  @ContentChild('gridItemSubtitleLines') gridItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('listItemSubtitleLines') listItemSubtitleLines: TemplateRef<any> | undefined
  @ContentChild('standardTableCell') standardTableCell: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItem: TemplateRef<any> | undefined
  @ContentChild('listItem') listItem: TemplateRef<any> | undefined

  @Output() filtered = new EventEmitter<Filter[]>()
  @Output() sorted = new EventEmitter<Sort>()
  @Output() deleteItem = new EventEmitter<RowListGridData>()
  @Output() viewItem = new EventEmitter<RowListGridData>()
  @Output() editItem = new EventEmitter<RowListGridData>()
  @Output() dataViewLayoutChange: EventEmitter<any> = new EventEmitter()
  displayedColumns: DataTableColumn[] = []
  selectedGroupKey = ''
  isFilteredObserved: boolean | undefined
  isSortedObserved: boolean | undefined
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
  get _standardTableCell(): TemplateRef<any> | undefined {
    return this.standardTableCell
  }
  get _tableDateCell(): TemplateRef<any> | undefined {
    return this.tableDateCell
  }
  get _tableRelativeDateCell(): TemplateRef<any> | undefined {
    return this.tableRelativeDateCell
  }
  get _tableTranslationKeyCell(): TemplateRef<any> | undefined {
    return this.tableTranslationKeyCell
  }
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItem
  }
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItem
  }

  _data: RowListGridData[] = []
  @Input()
  get data(): RowListGridData[] {
    return this._data
  }
  set data(value: RowListGridData[]) {
    this._data = value
  }

  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) {}

  ngOnInit(): void {
    this.selectedGroupKey = this.defaultGroupKey
    this.displayedColumns = this.columns
    if (this.defaultGroupKey) {
      this.displayedColumns = this.columns.filter((column) =>
        column.predefinedGroupKeys?.includes(this.defaultGroupKey)
      )
    }
    if (!this.groupSelectionNoGroupSelectedKey) {
      this.groupSelectionNoGroupSelectedKey = 'OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED'
    }
    this.firstColumnId = this.columns[0]?.id
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
  }

  onSortDirectionChange($event: any) {
    this.sortDirection = $event
  }

  onSorted($event: Sort) {
    this.sortDirection = $event.sortDirection
    this.sortField = $event.sortColumn
  }

  onColumnGroupSelectionChange(event: GroupSelectionChangedEvent) {
    this.displayedColumns = event.activeColumns
    this.selectedGroupKey = event.groupKey
  }

  registerEventListenerForDataView() {
    if (this.filtered.observed) {
      this.isFilteredObserved = true
      if (!this._dataViewComponent?.filtered.observed) {
        this._dataViewComponent?.filtered.subscribe((event) => {
          this.filtering(event)
        })
      }
    }
    if (this.sorted.observed) {
      this.isSortedObserved = true
      if (!this._dataViewComponent?.sorted.observed) {
        this._dataViewComponent?.sorted.subscribe((event) => {
          this.sorting(event)
        })
      }
    }
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
  }

  onColumnSelectionChange(event: ColumnSelectionChangedEvent) {
    this.displayedColumns = event.activeColumns
    this.selectedGroupKey = this.customGroupKey
  }
}
