import {
  Component,
  ContentChild,
  DoCheck,
  EventEmitter,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core'
import { DataSortDirection } from '../../../model/data-sort-direction'
import { MenuItem } from 'primeng/api'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE, MFE_INFO } from '../../../api/injection-tokens'
import { MfeInfo } from '../../../model/mfe-info.model'
import { DataAction } from '../../../model/data-action'
import { TranslateService } from '@ngx-translate/core'
import { ObjectUtils } from '../../utils/objectutils'
import { Filter, Row } from '../data-table/data-table.component'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { BehaviorSubject, combineLatest, map, mergeMap, Observable } from 'rxjs'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { Router } from '@angular/router'

export type ListGridData = {
  id: string | number
  imagePath: string | number
  [columnId: string]: unknown
}

type RowListGridData = ListGridData & Row

export interface ListGridDataMenuItem extends MenuItem {
  permission: string
}

@Component({
  selector: 'ocx-data-list-grid',
  templateUrl: './data-list-grid.component.html',
  styleUrls: ['./data-list-grid.component.scss'],
})
export class DataListGridComponent extends DataSortBase implements OnInit, DoCheck {
  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() sortStates: DataSortDirection[] = []
  @Input() pageSizes: number[] = [10, 25, 50]
  @Input() pageSize: number = this.pageSizes[0] || 50
  @Input() emptyResultsMessage: string | undefined
  @Input() fallbackImage = 'placeholder.png'
  @Input() layout: 'grid' | 'list' = 'grid'
  @Input() viewPermission: string | undefined
  @Input() editPermission: string | undefined
  @Input() deletePermission: string | undefined
  @Input() viewMenuItemKey: string | undefined
  @Input() editMenuItemKey: string | undefined
  @Input() deleteMenuItemKey: string | undefined
  @Input() paginator = true
  @Input() columns: DataTableColumn[] = []
  @Input() name = ''
  @Input() totalRecordsOnServer: number | undefined 
  totalRecordsOnServerStr:string = ''
  currentPageReportTemplateShowing: string = "OCX_DATA_TABLE.SHOWING"
  params: { [key: string]: string } = {}

  _data$ = new BehaviorSubject<RowListGridData[]>([])
  @Input()
  get data(): RowListGridData[] {
    return this._data$.getValue()
  }
  set data(value: RowListGridData[]) {
    this._originalData = [...value]
    this._data$.next([...value])
  }
  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    this._filters$.next(value)
  }
  _originalData: RowListGridData[] = []
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    if (value === DataSortDirection.NONE) {
      this._data$.next([...this._originalData])
    }
    this._sortDirection$.next(value)
  }
  _sortField$ = new BehaviorSubject<string>('')
  @Input()
  get sortField(): string {
    return this?._sortField$.getValue()
  }
  set sortField(value: string) {
    this._sortField$.next(value)
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

  @Input() listItemTemplate: TemplateRef<any> | undefined
  @ContentChild('listItem') listItemChildTemplate: TemplateRef<any> | undefined
  get _listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate || this.listItemChildTemplate
  }

  @Input() gridItemTemplate: TemplateRef<any> | undefined
  @ContentChild('gridItem') gridItemChildTemplate: TemplateRef<any> | undefined
  get _gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate || this.gridItemChildTemplate
  }

  _additionalActions: DataAction[] = []
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions = value
    this.updateGridMenuItems()
  }

  @Output() viewItem = new EventEmitter<ListGridData>()
  @Output() editItem = new EventEmitter<ListGridData>()
  @Output() deleteItem = new EventEmitter<ListGridData>()

  get viewItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed || this.viewItem.observed
  }
  get editItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed || this.editItem.observed
  }
  get deleteItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed || this.deleteItem.observed
  }

  get sortDirectionNumber(): number {
    if (this.sortDirection === DataSortDirection.ASCENDING) return 1
    if (this.sortDirection === DataSortDirection.DESCENDING) return -1
    return 0
  }

  showMenu = false
  gridMenuItems: MenuItem[] = []
  selectedItem: ListGridData | undefined
  observedOutputs = 0
  
  displayedItems$: Observable<unknown[]> | undefined

  constructor(
    @Inject(LOCALE_ID) locale: string,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(MFE_INFO) private mfeInfo: MfeInfo,
    translateService: TranslateService,
    private router: Router,
    private injector: Injector
  ) {
    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    
  }

  ngDoCheck(): void {
    const observedOutputs = <any>this.viewItem.observed + <any>this.deleteItem.observed + <any>this.editItem.observed
    if (this.observedOutputs !== observedOutputs) {
      this.updateGridMenuItems()
      this.observedOutputs = observedOutputs
    }
  }

  ngOnInit(): void {
    this.displayedItems$ = combineLatest([this._data$, this._filters$, this._sortField$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([items]) => (items))
    )
  
    this.showMenu =
      (!!this.viewPermission && this.authService.hasPermission(this.viewPermission)) ||
      (!!this.editPermission && this.authService.hasPermission(this.editPermission)) ||
      (!!this.deletePermission && this.authService.hasPermission(this.deletePermission))
      if(this.totalRecordsOnServer){
        this.totalRecordsOnServerStr = '' + this.totalRecordsOnServer
        this.params = 
        {
          totalRecordsOnServer : this.totalRecordsOnServerStr,
          currentPage : '{currentPage}',
          totalPages : '{totalPages}',
          rows: '{rows}',
          first: '{first}',
          last : '{last}',
          totalRecords : '{totalRecords}'
        }
        this.currentPageReportTemplateShowing = "OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER"
      }
  }

  onDeleteRow(element: ListGridData) {
    this.deleteItem.emit(element)
  }

  onViewRow(element: ListGridData) {
    if (!!this.viewPermission && this.authService.hasPermission(this.viewPermission)) {
      this.viewItem.emit(element)
    }
  }

  onEditRow(element: ListGridData) {
    this.editItem.emit(element)
  }

  imgError(event: Event) {
    if (!!this.fallbackImage && (<any>event?.target)?.src != this.fallbackImage) {
      ;(<any>event.target).src = this.getFallbackImagePath(this.mfeInfo)
    }
  }

  getFallbackImagePath(mfeInfo: MfeInfo) {
    return mfeInfo?.remoteBaseUrl
      ? `${mfeInfo.remoteBaseUrl}/onecx-portal-lib/assets/images/${this.fallbackImage}`
      : `./onecx-portal-lib/assets/images/${this.fallbackImage}`
  }

  updateGridMenuItems(): void {
    this.translateService
      .get([
        this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
        this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
        this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
        ...this.additionalActions.map((a) => a.labelKey || ''),
      ])
      .subscribe((translations) => {
        let menuItems: MenuItem[] = []
        if (this.viewItem.observed && this.authService.hasPermission(this.viewPermission || '')) {
          menuItems.push({
            label: translations[this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW'],
            icon: 'pi pi-eye',
            command: () => this.viewItem.emit(this.selectedItem),
          })
        }
        if (this.editItem.observed && this.authService.hasPermission(this.editPermission || '')) {
          menuItems.push({
            label: translations[this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT'],
            icon: 'pi pi-pencil',
            command: () => this.editItem.emit(this.selectedItem),
          })
        }
        if (this.deleteItem.observed && this.authService.hasPermission(this.deletePermission || '')) {
          menuItems.push({
            label: translations[this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE'],
            icon: 'pi pi-trash',
            command: () => this.deleteItem.emit(this.selectedItem),
          })
        }
        menuItems = menuItems.concat(
          this.additionalActions
            .filter((a) => this.authService.hasPermission(a.permission))
            .map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled: a.disabled,
              command: () => a.callback(this.selectedItem),
            }))
        )
        this.gridMenuItems = menuItems
      })
  }

  setSelectedItem(item: ListGridData) {
    this.selectedItem = item
  }
  
  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }
}
