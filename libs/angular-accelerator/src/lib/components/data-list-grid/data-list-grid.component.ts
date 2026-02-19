import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
  inject,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MfeInfo } from '@onecx/integration-interface'
import { MenuItem, PrimeIcons, PrimeTemplate } from 'primeng/api'
import { Menu } from 'primeng/menu'
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  first,
  firstValueFrom,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { ObjectUtils } from '../../utils/objectutils'
import { DataSortBase } from '../data-sort-base/data-sort-base'
import { Row } from '../data-table/data-table.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { handleAction, handleActionSync } from '../../utils/action-router.utils'

export type ListGridData = {
  id: string | number
  imagePath: string | number
  [columnId: string]: unknown
}

type RowListGridData = ListGridData & Row

export interface ListGridDataMenuItem extends MenuItem {
  permission: string
}

export interface DataListGridComponentState {
  activePage?: number
  pageSize?: number
}

@Component({
  standalone: false,
  selector: 'ocx-data-list-grid',
  templateUrl: './data-list-grid.component.html',
  styleUrls: ['./data-list-grid.component.scss'],
})
export class DataListGridComponent extends DataSortBase implements OnInit, DoCheck, AfterContentInit {
  private userService = inject(UserService)
  private router = inject(Router)
  private injector = inject(Injector)
  private appStateService = inject(AppStateService)
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  private readonly liveAnnouncer = inject(LiveAnnouncer)

  @Input() titleLineId: string | undefined
  @Input() subtitleLineIds: string[] = []
  @Input() clientSideSorting = true
  @Input() clientSideFiltering = true
  @Input() sortStates: DataSortDirection[] = []

  _pageSizes$ = new BehaviorSubject<number[]>([10, 25, 50])
  @Input()
  get pageSizes(): number[] {
    return this._pageSizes$.getValue()
  }
  set pageSizes(value: number[]) {
    this._pageSizes$.next(value)
  }

  displayedPageSize$: Observable<number>
  _pageSize$ = new BehaviorSubject<number | undefined>(undefined)
  @Input()
  get pageSize(): number | undefined {
    return this._pageSize$.getValue()
  }
  set pageSize(value: number | undefined) {
    this._pageSize$.next(value)
  }

  @Input() emptyResultsMessage: string | undefined
  @Input() fallbackImage = 'placeholder.png'
  @Input() layout: 'grid' | 'list' = 'grid'
  _viewPermission$ = new BehaviorSubject<string | string[] | undefined>(undefined)
  @Input()
  get viewPermission(): string | string[] | undefined {
    return this._viewPermission$.getValue()
  }
  set viewPermission(value: string | string[] | undefined) {
    this._viewPermission$.next(value)
  }
  @Input() editPermission: string | string[] | undefined
  @Input() deletePermission: string | string[] | undefined
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
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
    const obs = value.map((c) => this.getTemplate(c))
    this.columnTemplates$ = combineLatest(obs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]]))),
      debounceTime(50)
    )
  }
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
    if (this._data$.getValue().length) this.resetPage()
    this._originalData = [...value]
    this._data$.next([...value])

    const currentResults = value.length
    const newStatus =
      currentResults === 0 ? 'OCX_DATA_LIST_GRID.NO_SEARCH_RESULTS_FOUND' : 'OCX_DATA_LIST_GRID.SEARCH_RESULTS_FOUND'

    firstValueFrom(this.translateService.get(newStatus, { results: currentResults })).then((translatedText: string) => {
      this.liveAnnouncer.announce(translatedText)
    })
  }

  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    if (this._filters$.getValue().length) this.resetPage()
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

  inlineListActions$: Observable<DataAction[]>
  overflowListActions$: Observable<DataAction[]>
  overflowListMenuItems$: Observable<MenuItem[]>
  currentMenuRow$ = new BehaviorSubject<Row | null>(null)
  _additionalActions$ = new BehaviorSubject<DataAction[]>([])
  @Input()
  get additionalActions(): DataAction[] {
    return this._additionalActions$.getValue()
  }
  set additionalActions(value: DataAction[]) {
    this._additionalActions$.next(value)
  }

  @Output() viewItem = new EventEmitter<ListGridData>()
  @Output() editItem = new EventEmitter<ListGridData>()
  @Output() deleteItem = new EventEmitter<ListGridData>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() componentStateChanged = new EventEmitter<DataListGridComponentState>()

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

  gridMenuItems$: Observable<MenuItem[]>
  _selectedItem$ = new BehaviorSubject<ListGridData | undefined>(undefined)
  observedOutputs$ = new BehaviorSubject<number>(0)

  displayedItems$: Observable<unknown[]> | undefined
  fallbackImagePath$!: Observable<string>

  templates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ContentChildren(PrimeTemplate)
  set templates(value: QueryList<PrimeTemplate> | undefined) {
    this.templates$.next(value)
  }

  viewTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set viewTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.viewTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set parentTemplates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
  }

  columnType = ColumnType
  templatesObservables: Record<string, Observable<TemplateRef<any> | null>> = {}
  hasViewPermission$: Observable<boolean>

  private cachedOverflowMenuItemsVisibility$: Observable<boolean> | undefined

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)
    this.name = this.name || this.router.url.replace(/[^A-Za-z0-9]/, '_')
    this.fallbackImagePath$ = this.appStateService.currentMfe$.pipe(
      map((currentMfe) => this.getFallbackImagePath(currentMfe))
    )
    this.displayedPageSize$ = combineLatest([this._pageSize$, this._pageSizes$]).pipe(
      map(([pageSize, pageSizes]) => pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50)
    )
    this.inlineListActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => !action.showAsOverflow))
    )
    this.overflowListActions$ = this._additionalActions$.pipe(
      map((actions) => actions.filter((action) => action.showAsOverflow))
    )
    this.overflowListMenuItems$ = combineLatest([this.overflowListActions$, this.currentMenuRow$]).pipe(
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
    this.hasViewPermission$ = this._viewPermission$.pipe(
      map((permission) => {
        if (!permission) return []
        return Array.isArray(permission) ? permission : [permission]
      }),
      switchMap((permissionArray) => {
        if (permissionArray.length === 0) {
          return of(true)
        }
        return this.getPermissions().pipe(map((permissions) => permissionArray.every((p) => permissions.includes(p))))
      })
    )
    this.gridMenuItems$ = combineLatest([
      this.getPermissions(),
      this._additionalActions$.asObservable(),
      this._selectedItem$.asObservable(),
      this.observedOutputs$.asObservable(),
    ]).pipe(
      switchMap(([permissions, additionalActions, selectedItem, _observedOutputs]) =>
        this.filterActionsBasedOnPermissions(additionalActions, permissions).pipe(
          map((permittedActions) => ({ permissions, additionalActions: permittedActions, selectedItem }))
        )
      ),
      switchMap(({ permissions, additionalActions, selectedItem }) => {
        return this.getGridActionsTranslations(additionalActions, permissions).pipe(
          map((translations) => ({ permissions, additionalActions, selectedItem, translations }))
        )
      }),
      map(({ permissions, additionalActions, selectedItem, translations }) =>
        this.mapGridMenuItems(permissions, additionalActions, selectedItem, translations)
      )
    )
  }

  ngDoCheck(): void {
    const observedOutputs = <any>this.viewItem.observed + <any>this.deleteItem.observed + <any>this.editItem.observed
    if (this.observedOutputs$.getValue() !== observedOutputs) {
      this.observedOutputs$.next(observedOutputs)
    }
  }

  ngOnInit(): void {
    this.displayedItems$ = combineLatest([this._data$, this._filters$, this._sortField$, this._sortDirection$]).pipe(
      mergeMap((params) => this.translateItems(params, this.columns, this.clientSideFiltering, this.clientSideSorting)),
      map((params) => this.filterItems(params, this.clientSideFiltering)),
      map((params) => this.sortItems(params, this.columns, this.clientSideSorting)),
      map(([items]) => items)
    )

    this.emitComponentStateChanged()
  }

  ngAfterContentInit() {
    this.templates$.value?.forEach((item) => {
      switch (item.getType()) {
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
        case 'stringListValue':
          this.stringListValueChildTemplate = item.template
          break
        case 'dateListValue':
          this.dateListValueChildTemplate = item.template
          break
      }
    })
  }

  onDeleteRow(element: ListGridData) {
    this.deleteItem.emit(element)
  }

  onViewRow(element: ListGridData) {
    this.viewItem.emit(element)
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

  setSelectedItem(item: ListGridData) {
    this._selectedItem$.next(item)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  emitComponentStateChanged(state: DataListGridComponentState = {}) {
    this.displayedPageSize$.pipe(first()).subscribe((pageSize) => {
      this.componentStateChanged.emit({
        pageSize,
        activePage: this.page,
        ...state,
      })
    })
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page = page
    this.pageSize = event.rows
    this.pageChanged.emit(page)
    this.pageSizeChanged.emit(event.rows)
    this.emitComponentStateChanged({
      activePage: page,
      pageSize: event.rows,
    })
  }

  resetPage() {
    this.page = 0
    this.pageChanged.emit(this.page)
    this.emitComponentStateChanged()
  }

  fieldIsTruthy(object: any, key: any) {
    return !!this.resolveFieldData(object, key)
  }

  hasVisibleOverflowMenuItems(row: any) {
    return this.overflowListActions$.pipe(
      switchMap((actions) => this.filterActionsBasedOnPermissions(actions)),
      map((actions) => actions.some((a) => !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField)))
    )
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow$.next(row)
    menu.toggle(event)
  }

  getFilteredColumns() {
    let ids: string[] = [...(this.subtitleLineIds ?? [])]
    if (this.titleLineId) {
      ids = [this.titleLineId, ...(this.subtitleLineIds ?? [])]
    }
    return this.columns.filter((c) => !ids.includes(c.id))
  }

  findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
    for (let index = 0; index < names.length; index++) {
      const name = names[index]
      const template = templates.find((template) => template.name === name)
      if (template) {
        return template
      }
    }
    return undefined
  }

  getTemplate(column: DataTableColumn): Observable<TemplateRef<any> | null> {
    if (!this.templatesObservables[column.id]) {
      this.templatesObservables[column.id] = combineLatest([
        this.templates$,
        this.viewTemplates$,
        this.parentTemplates$,
      ]).pipe(
        map(([t, vt, pt]) => {
          const templates = [...(t ?? []), ...(vt ?? []), ...(pt ?? [])]
          const columnTemplate = templates.find((template) => template.name === column.id + 'IdListValue')?.template
          if (columnTemplate) {
            return columnTemplate
          }
          switch (column.columnType) {
            case ColumnType.DATE:
              return (
                this._dateListValue ??
                this.findTemplate(templates, ['dateListValue', 'defaultDateListValue'])?.template ??
                null
              )
            case ColumnType.NUMBER:
              return (
                this._numberListValue ??
                this.findTemplate(templates, ['numberListValue', 'defaultNumberListValue'])?.template ??
                null
              )
            case ColumnType.RELATIVE_DATE:
              return (
                this._relativeDateListValue ??
                this.findTemplate(templates, ['relativeDateListValue', 'defaultRelativeDateListValue'])?.template ??
                null
              )
            case ColumnType.TRANSLATION_KEY:
              return (
                this._translationKeyListValue ??
                this.findTemplate(templates, ['translationKeyListValue', 'defaultTranslationKeyListValue'])?.template ??
                null
              )
            default:
              return (
                this._stringListValue ??
                this.findTemplate(templates, ['stringListValue', 'defaultStringListValue'])?.template ??
                null
              )
          }
        })
      )
    }
    return this.templatesObservables[column.id]
  }

  private mapGridMenuItems(
    permissions: string[],
    additionalActions: DataAction[],
    selectedItem: ListGridData | undefined,
    translations: Record<string, string>
  ): MenuItem[] {
    let deleteDisabled = false
    let editDisabled = false
    let viewDisabled = false

    let deleteVisible = true
    let editVisible = true
    let viewVisible = true

    if (selectedItem) {
      viewDisabled = !!this.viewActionEnabledField && !this.fieldIsTruthy(selectedItem, this.viewActionEnabledField)
      editDisabled = !!this.editActionEnabledField && !this.fieldIsTruthy(selectedItem, this.editActionEnabledField)
      deleteDisabled =
        !!this.deleteActionEnabledField && !this.fieldIsTruthy(selectedItem, this.deleteActionEnabledField)

      viewVisible = !this.viewActionVisibleField || this.fieldIsTruthy(selectedItem, this.viewActionVisibleField)
      editVisible = !this.editActionVisibleField || this.fieldIsTruthy(selectedItem, this.editActionVisibleField)
      deleteVisible = !this.deleteActionVisibleField || this.fieldIsTruthy(selectedItem, this.deleteActionVisibleField)
    }

    const menuItems: MenuItem[] = []
    const automationId = 'data-grid-action-button'
    const automationIdHidden = 'data-grid-action-button-hidden'
    if (this.shouldDisplayAction(this.viewPermission, this.viewItem, permissions)) {
      menuItems.push({
        label: translations[this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW'],
        icon: PrimeIcons.EYE,
        command: () => this.viewItem.emit(selectedItem),
        disabled: viewDisabled,
        visible: viewVisible,
        automationId: viewVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(this.editPermission, this.editItem, permissions)) {
      menuItems.push({
        label: translations[this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT'],
        icon: PrimeIcons.PENCIL,
        command: () => this.editItem.emit(selectedItem),
        disabled: editDisabled,
        visible: editVisible,
        automationId: editVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(this.deletePermission, this.deleteItem, permissions)) {
      menuItems.push({
        label: translations[this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE'],
        icon: PrimeIcons.TRASH,
        command: () => this.deleteItem.emit(selectedItem),
        disabled: deleteDisabled,
        visible: deleteVisible,
        automationId: deleteVisible ? automationId : automationIdHidden,
      })
    }
    const val = menuItems.concat(
      additionalActions.map((a) => {
        const isVisible = !a.actionVisibleField || this.fieldIsTruthy(selectedItem, a.actionVisibleField)
        return {
          label: translations[a.labelKey || ''],
          icon: a.icon,
          styleClass: (a.classes || []).join(' '),
          disabled: a.disabled || (!!a.actionEnabledField && !this.fieldIsTruthy(selectedItem, a.actionEnabledField)),
          visible: isVisible,
          command: () => handleActionSync(this.router, a, selectedItem),
          automationId: isVisible ? automationId : automationIdHidden,
        }
      })
    )
    return val
  }

  private getGridActionsTranslations(
    additionalActions: DataAction[],
    permissions: string[]
  ): Observable<Record<string, string>> {
    return this.translateService.get([
      this.viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
      this.editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
      this.deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
      ...additionalActions
        .filter((action) => {
          const permissionsArray = Array.isArray(action.permission) ? action.permission : [action.permission]
          return permissionsArray.every((p) => permissions.includes(p))
        })
        .map((a) => a.labelKey || ''),
    ])
  }

  private shouldDisplayAction(
    permission: string | string[] | undefined,
    emitter: EventEmitter<any>,
    userPermissions: string[]
  ): boolean {
    const permissions = Array.isArray(permission) ? permission : permission ? [permission] : []
    return emitter.observed && permissions.every((p) => userPermissions.includes(p))
  }

  private filterActionsBasedOnPermissions(actions: DataAction[], permissions?: string[]): Observable<DataAction[]> {
    const permissions$ = permissions ? of(permissions) : this.getPermissions()
    return permissions$.pipe(
      map((permissions) => {
        return actions.filter((action) => {
          const actionPermissions = Array.isArray(action.permission) ? action.permission : [action.permission]
          return actionPermissions.every((p) => permissions.includes(p))
        })
      })
    )
  }

  private getPermissions(): Observable<string[]> {
    if (this.hasPermissionChecker?.getPermissions) {
      return this.hasPermissionChecker.getPermissions()
    }

    return this.userService.getPermissions()
  }

  async onActionClick(action: DataAction, item: any): Promise<void> {
    await handleAction(this.router, action, item)
  }

  private createMenuItemCommand(action: DataAction, row: any): () => void {
    return () => handleActionSync(this.router, action, row)
  }
}
