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
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap } from 'rxjs'
import { MfeInfo } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'
import { UserService } from '@onecx/angular-integration-interface'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { ObjectUtils } from '../../utils/objectutils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { Filter, Row } from '../data-table/data-table.component'

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
  @Input() deleteActionVisibleField: string | undefined
  @Input() deleteActionEnabledField: string | undefined
  @Input() viewActionVisibleField: string | undefined
  @Input() viewActionEnabledField: string | undefined
  @Input() editActionVisibleField: string | undefined
  @Input() editActionEnabledField: string | undefined
  @Input() viewMenuItemKey: string | undefined
  @Input() editMenuItemKey: string | undefined
  @Input() deleteMenuItemKey: string | undefined
  @Input() paginator = true
  @Input() page = 0
  @Input() columns: DataTableColumn[] = []
  @Input() name = ''
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

  additionalListActions: DataAction[] = []
  additionalListOverflowActions: DataAction[] = []
  _additionalActions: DataAction[] = []
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions = value
    this.updateGridMenuItems()
    this.additionalListActions = value.filter((action) => !action.showAsOverflow)
    this.additionalListOverflowActions = value.filter((action) => action.showAsOverflow)
  }

  @Output() viewItem = new EventEmitter<ListGridData>()
  @Output() editItem = new EventEmitter<ListGridData>()
  @Output() deleteItem = new EventEmitter<ListGridData>()
  @Output() pageChanged = new EventEmitter<number>()

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
  fallbackImagePath$!: Observable<string>

  constructor(
    @Inject(LOCALE_ID) locale: string,
    translateService: TranslateService,
    private userService: UserService,
    private router: Router,
    private injector: Injector,
    private appStateService: AppStateService
  ) {
    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    this.fallbackImagePath$ = this.appStateService.currentMfe$.pipe(
      map((currentMfe) => this.getFallbackImagePath(currentMfe))
    )
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
      map(([items]) => items)
    )

    this.showMenu =
      (!!this.viewPermission && this.userService.hasPermission(this.viewPermission)) ||
      (!!this.editPermission && this.userService.hasPermission(this.editPermission)) ||
      (!!this.deletePermission && this.userService.hasPermission(this.deletePermission))
  }

  onDeleteRow(element: ListGridData) {
    this.deleteItem.emit(element)
  }

  onViewRow(element: ListGridData) {
    if (!!this.viewPermission && this.userService.hasPermission(this.viewPermission)) {
      this.viewItem.emit(element)
    }
  }

  onEditRow(element: ListGridData) {
    this.editItem.emit(element)
  }

  imgError(item: ListGridData) {
    item.imagePath = ''
  }

  getFallbackImagePath(mfeInfo: MfeInfo) {
    return mfeInfo?.remoteBaseUrl
      ? `${mfeInfo.remoteBaseUrl}/onecx-portal-lib/assets/images/${this.fallbackImage}`
      : `./onecx-portal-lib/assets/images/${this.fallbackImage}`
  }

  updateGridMenuItems(useSelectedItem = false): void {
    let deleteDisabled = false
    let editDisabled = false
    let viewDisabled = false

    let deleteVisible = true
    let editVisible = true
    let viewVisible = true

    if (useSelectedItem && this.selectedItem) {
      viewDisabled =
        !!this.viewActionEnabledField && !this.fieldIsTruthy(this.selectedItem, this.viewActionEnabledField)
      editDisabled =
        !!this.editActionEnabledField && !this.fieldIsTruthy(this.selectedItem, this.editActionEnabledField)
      deleteDisabled =
        !!this.deleteActionEnabledField && !this.fieldIsTruthy(this.selectedItem, this.deleteActionEnabledField)

      viewVisible = !this.viewActionVisibleField || this.fieldIsTruthy(this.selectedItem, this.viewActionVisibleField)
      editVisible = !this.editActionVisibleField || this.fieldIsTruthy(this.selectedItem, this.editActionVisibleField)
      deleteVisible =
        !this.deleteActionVisibleField || this.fieldIsTruthy(this.selectedItem, this.deleteActionVisibleField)
    }

    this.translateService
      .get([
        this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
        this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
        this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
        ...this.additionalActions.map((a) => a.labelKey || ''),
      ])
      .subscribe((translations) => {
        let menuItems: MenuItem[] = []
        const automationId = 'data-grid-action-button'
        const automationIdHidden = 'data-grid-action-button-hidden'
        if (this.viewItem.observed && this.userService.hasPermission(this.viewPermission || '')) {
          menuItems.push({
            label: translations[this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW'],
            icon: PrimeIcons.EYE,
            command: () => this.viewItem.emit(this.selectedItem),
            disabled: viewDisabled,
            visible: viewVisible,
            automationId: viewVisible ? automationId : automationIdHidden,
          })
        }
        if (this.editItem.observed && this.userService.hasPermission(this.editPermission || '')) {
          menuItems.push({
            label: translations[this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT'],
            icon: PrimeIcons.PENCIL,
            command: () => this.editItem.emit(this.selectedItem),
            disabled: editDisabled,
            visible: editVisible,
            automationId: editVisible ? automationId : automationIdHidden,
          })
        }
        if (this.deleteItem.observed && this.userService.hasPermission(this.deletePermission || '')) {
          menuItems.push({
            label: translations[this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE'],
            icon: PrimeIcons.TRASH,
            command: () => this.deleteItem.emit(this.selectedItem),
            disabled: deleteDisabled,
            visible: deleteVisible,
            automationId: deleteVisible ? automationId : automationIdHidden,
          })
        }
        menuItems = menuItems.concat(
          this.additionalActions
            .filter((a) => this.userService.hasPermission(a.permission))
            .map((a) => ({
              label: translations[a.labelKey || ''],
              icon: a.icon,
              styleClass: (a.classes || []).join(' '),
              disabled:
                a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(this.selectedItem, a.actionEnabledField)),
              visible: !a.actionVisibleField || this.fieldIsTruthy(this.selectedItem, a.actionVisibleField),
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

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageChanged.emit(page)
  }

  fieldIsTruthy(object: any, key: any) {
    return !!this.resolveFieldData(object, key)
  }

  hasVisibleOverflowMenuItems(item: any) {
    return this.additionalListOverflowActions.some(
      (a) =>
        (!a.actionVisibleField || this.fieldIsTruthy(item, a.actionVisibleField)) &&
        this.userService.hasPermission(a.permission)
    )
  }

  getOverflowMenuItems(item: any) {
    return this.translateService.get([...this.additionalListOverflowActions.map((a) => a.labelKey || '')]).pipe(
      map((translations) => {
        return this.additionalListOverflowActions
          .filter((a) => this.userService.hasPermission(a.permission))
          .map((a) => ({
            label: translations[a.labelKey || ''],
            icon: a.icon,
            styleClass: (a.classes || []).join(' '),
            disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(item, a.actionEnabledField)),
            visible: !a.actionVisibleField || this.fieldIsTruthy(item, a.actionVisibleField),
            command: () => a.callback(item),
          }))
      })
    )
  }
}
