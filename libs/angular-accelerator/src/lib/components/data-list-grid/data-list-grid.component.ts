import {
  Component,
  Injector,
  LOCALE_ID,
  OnInit,
  Output,
  TemplateRef,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MfeInfo } from '@onecx/integration-interface'
import { MenuItem, PrimeIcons, PrimeTemplate } from 'primeng/api'
import { Menu } from 'primeng/menu'
import { Observable, combineLatest, debounceTime, firstValueFrom, map, mergeMap, of, switchMap } from 'rxjs'
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
import { observableOutput, ObservableOutputEmitterRef } from '../../utils/observable-output.utils'
import { toObservable } from '@angular/core/rxjs-interop'
import { computedPrevious } from 'ngxtension/computed-previous'

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
export class DataListGridComponent extends DataSortBase implements OnInit {
  private userService = inject(UserService)
  private router = inject(Router)
  private injector = inject(Injector)
  private appStateService = inject(AppStateService)
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  private readonly liveAnnouncer = inject(LiveAnnouncer)

  titleLineId = input<string>()
  subtitleLineIds = input<string[]>()
  clientSideSorting = input<boolean>(true)
  clientSideFiltering = input<boolean>(true)
  sortStates = input<DataSortDirection[]>([])

  pageSize = model<number | undefined>(undefined)
  pageSizes = input<number[]>([10, 25, 50])

  displayedPageSize = computed(() => {
    const pageSize = this.pageSize()
    const pageSizes = this.pageSizes()

    return pageSize ?? pageSizes.find((val): val is number => typeof val === 'number') ?? 50
  })

  emptyResultsMessage = input<string | undefined>(undefined)
  fallbackImage = input<string>('placeholder.png')
  layout = input<'grid' | 'list'>('grid')
  viewPermission = input<string | string[] | undefined>(undefined)
  editPermission = input<string | string[] | undefined>(undefined)
  deletePermission = input<string | string[] | undefined>(undefined)
  deleteActionVisibleField = input<string | undefined>(undefined)
  deleteActionEnabledField = input<string | undefined>(undefined)
  viewActionVisibleField = input<string | undefined>(undefined)
  viewActionEnabledField = input<string | undefined>(undefined)
  editActionVisibleField = input<string | undefined>(undefined)
  editActionEnabledField = input<string | undefined>(undefined)
  viewMenuItemKey = input<string | undefined>(undefined)
  editMenuItemKey = input<string | undefined>(undefined)
  deleteMenuItemKey = input<string | undefined>(undefined)
  paginator = input<boolean>(true)
  page = model<number>(0)
  columnTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  columns = input<DataTableColumn[]>([])
  filteredColumns = computed(() => {
    const subtitleLineIds = this.subtitleLineIds() ?? []
    let ids: string[] = [...subtitleLineIds]
    const titleLineId = this.titleLineId()
    if (titleLineId) {
      ids.unshift(titleLineId)
    }
    return this.columns().filter((c) => !ids.includes(c.id))
  })

  name = model<string | undefined>(undefined)
  totalRecordsOnServer = input<number | undefined>(undefined)
  currentPageShowingKey = input<string>('OCX_DATA_TABLE.SHOWING')
  currentPageShowingWithTotalOnServerKey = input<string>('OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER')
  params = computed(() => {
    const totalRecordsOnServer = this.totalRecordsOnServer()
    return {
      currentPage: '{currentPage}',
      totalPages: '{totalPages}',
      rows: '{rows}',
      first: '{first}',
      last: '{last}',
      totalRecords: '{totalRecords}',
      totalRecordsOnServer,
    }
  })

  data = input<RowListGridData[]>([])
  previousData = computedPrevious(this.data)

  filters = input<Filter[]>([])
  previousFilters = computedPrevious(this.filters)

  sortDirection = input<DataSortDirection>(DataSortDirection.NONE)
  sortField = input<string>('')

  private permissions$ = this.getPermissions()

  gridItemSubtitleLinesTemplate = input<TemplateRef<any> | undefined>(undefined)
  gridItemSubtitleLinesChildTemplate = contentChild<TemplateRef<any>>('gridItemSubtitleLines')
  get gridItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.gridItemSubtitleLinesTemplate() || this.gridItemSubtitleLinesChildTemplate()
  }

  listItemSubtitleLinesTemplate = input<TemplateRef<any> | undefined>(undefined)
  listItemSubtitleLinesChildTemplate = contentChild<TemplateRef<any>>('listItemSubtitleLines')
  get listItemSubtitleLines(): TemplateRef<any> | undefined {
    return this.listItemSubtitleLinesTemplate() || this.listItemSubtitleLinesChildTemplate()
  }

  listItemTemplate = input<TemplateRef<any> | undefined>(undefined)
  listItemChildTemplate = contentChild<TemplateRef<any>>('listItem')
  get listItem(): TemplateRef<any> | undefined {
    return this.listItemTemplate() || this.listItemChildTemplate()
  }

  gridItemTemplate = input<TemplateRef<any> | undefined>(undefined)
  gridItemChildTemplate = contentChild<TemplateRef<any>>('gridItem')
  get gridItem(): TemplateRef<any> | undefined {
    return this.gridItemTemplate() || this.gridItemChildTemplate()
  }

  listValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  listValueChildTemplate = contentChild<TemplateRef<any>>('listValue')
  get listValue(): TemplateRef<any> | undefined {
    return this.listValueTemplate() || this.listValueChildTemplate()
  }

  translationKeyListValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  translationKeyListValueChildTemplate = contentChild<TemplateRef<any>>('translationKeyListValue')
  get translationKeyListValue(): TemplateRef<any> | undefined {
    return this.translationKeyListValueTemplate() || this.translationKeyListValueChildTemplate()
  }

  numberListValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  numberListValueChildTemplate = contentChild<TemplateRef<any>>('numberListValue')
  get numberListValue(): TemplateRef<any> | undefined {
    return this.numberListValueTemplate() || this.numberListValueChildTemplate()
  }

  relativeDateListValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  relativeDateListValueChildTemplate = contentChild<TemplateRef<any>>('relativeDateListValue')
  get relativeDateListValue(): TemplateRef<any> | undefined {
    return this.relativeDateListValueTemplate() || this.relativeDateListValueChildTemplate()
  }

  stringListValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  stringListValueChildTemplate = contentChild<TemplateRef<any>>('stringListValue')
  get stringListValue(): TemplateRef<any> | undefined {
    return this.stringListValueTemplate() || this.stringListValueChildTemplate()
  }

  dateListValueTemplate = input<TemplateRef<any> | undefined>(undefined)
  dateListValueChildTemplate = contentChild<TemplateRef<any>>('dateListValue')
  get dateListValue(): TemplateRef<any> | undefined {
    return this.dateListValueTemplate() || this.dateListValueChildTemplate()
  }

  additionalActions = input<DataAction[]>([])
  inlineListActions = computed(() => {
    return this.additionalActions().filter((action) => !action.showAsOverflow)
  })
  overflowListActions = computed(() => {
    return this.additionalActions().filter((action) => action.showAsOverflow)
  })
  overflowListActions$ = toObservable(this.overflowListActions)
  currentMenuRow = signal<Row | null>(null)
  overflowListMenuItems$ = combineLatest([
    toObservable(this.overflowListActions),
    toObservable(this.currentMenuRow),
    this.permissions$,
  ]).pipe(
    map(([actions, row, permissions]) => ({
      actions: this.filterActionsBasedOnPermissions(actions, permissions),
      row,
    })),
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
            command: () => a.callback(row),
          }))
        })
      )
    })
  )

  @Output() viewItem = observableOutput<ListGridData | undefined>()
  @Output() editItem = observableOutput<ListGridData | undefined>()
  @Output() deleteItem = observableOutput<ListGridData | undefined>()
  pageChanged = output<number>()
  pageSizeChanged = output<number>()
  componentStateChanged = output<DataListGridComponentState>()

  get viewItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.viewItemObserved || dv?.viewItem.observed() || this.viewItem.observed()
  }
  get editItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.editItemObserved || dv?.editItem.observed() || this.editItem.observed()
  }
  get deleteItemObserved(): boolean {
    const dv = this.injector.get('DataViewComponent', null)
    return dv?.deleteItemObserved || dv?.deleteItem.observed() || this.deleteItem.observed()
  }

  observedOutputs = computed(() => {
    return (this.viewItemObserved ? 1 : 0) + (this.deleteItemObserved ? 1 : 0) + (this.editItemObserved ? 1 : 0)
  })

  get sortDirectionNumber(): number {
    if (this.sortDirection() === DataSortDirection.ASCENDING) return 1
    if (this.sortDirection() === DataSortDirection.DESCENDING) return -1
    return 0
  }

  selectedItem = signal<ListGridData | undefined>(undefined)

  permittedAdditionalActions$ = combineLatest([this.permissions$, toObservable(this.additionalActions)]).pipe(
    map(([permissions, additionalActions]) => {
      return this.filterActionsBasedOnPermissions(additionalActions, permissions)
    })
  )

  gridMenuState$ = combineLatest([
    // Trigger the whole chain to recalculate when data changes, to update the enabled/visible state of menu items based on the selected row
    toObservable(this.data),
    this.permissions$,
    this.permittedAdditionalActions$,
    toObservable(this.selectedItem),
    toObservable(this.observedOutputs),
    toObservable(this.viewMenuItemKey),
    toObservable(this.editMenuItemKey),
    toObservable(this.deleteMenuItemKey),
    toObservable(this.viewPermission),
    toObservable(this.editPermission),
    toObservable(this.deletePermission),
    toObservable(this.viewActionEnabledField),
    toObservable(this.editActionEnabledField),
    toObservable(this.deleteActionEnabledField),
    toObservable(this.viewActionVisibleField),
    toObservable(this.editActionVisibleField),
    toObservable(this.deleteActionVisibleField),
  ]).pipe(
    map(
      ([
        _data,
        permissions,
        additionalActions,
        selectedItem,
        _observedOutputs,
        viewMenuItemKey,
        editMenuItemKey,
        deleteMenuItemKey,
        viewPermission,
        editPermission,
        deletePermission,
        viewActionEnabledField,
        editActionEnabledField,
        deleteActionEnabledField,
        viewActionVisibleField,
        editActionVisibleField,
        deleteActionVisibleField,
      ]) => {
        return {
          permissions,
          additionalActions,
          selectedItem,
          viewMenuItemKey: viewMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.VIEW',
          editMenuItemKey: editMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.EDIT',
          deleteMenuItemKey: deleteMenuItemKey || 'OCX_DATA_LIST_GRID.MENU.DELETE',
          viewPermission,
          editPermission,
          deletePermission,
          viewActionEnabledField,
          editActionEnabledField,
          deleteActionEnabledField,
          viewActionVisibleField,
          editActionVisibleField,
          deleteActionVisibleField,
        }
      }
    )
  )

  gridMenuItems$ = this.gridMenuState$.pipe(
    switchMap((params) => {
      return this.getGridActionsTranslations(params.additionalActions, {
        viewMenuItem: params.viewMenuItemKey,
        editMenuItem: params.editMenuItemKey,
        deleteMenuItem: params.deleteMenuItemKey,
      }).pipe(map((translations) => ({ ...params, translations })))
    }),
    map((params) =>
      this.mapGridMenuItems(
        params.permissions,
        params.additionalActions,
        params.selectedItem,
        params.translations,
        {
          viewMenuItem: params.viewMenuItemKey,
          editMenuItem: params.editMenuItemKey,
          deleteMenuItem: params.deleteMenuItemKey,
        },
        {
          viewPermission: params.viewPermission,
          editPermission: params.editPermission,
          deletePermission: params.deletePermission,
        },
        {
          viewAction: params.viewActionVisibleField,
          editAction: params.editActionVisibleField,
          deleteAction: params.deleteActionVisibleField,
        },
        {
          viewAction: params.viewActionEnabledField,
          editAction: params.editActionEnabledField,
          deleteAction: params.deleteActionEnabledField,
        }
      )
    )
  )

  displayedItems$ = combineLatest([
    toObservable(this.data),
    toObservable(this.filters),
    toObservable(this.sortField),
    toObservable(this.sortDirection),
    toObservable(this.columns),
    toObservable(this.clientSideFiltering),
    toObservable(this.clientSideSorting),
  ]).pipe(
    map(([data, filters, sortField, sortDirection, columns, clientSideFiltering, clientSideSorting]) => {
      return { data, filters, sortField, sortDirection, columns, clientSideFiltering, clientSideSorting }
    }),
    mergeMap((params) =>
      this.translateItems(params.data, params.columns, params.clientSideFiltering, params.clientSideSorting).pipe(
        map((translatedItems) => ({ ...params, translatedItems }))
      )
    ),
    map((params) => ({
      ...params,
      data: this.filterItems([params.data, params.filters, params.translatedItems], params.clientSideFiltering),
    })),
    map((params) => ({
      ...params,
      data: this.sortItems(
        [params.data, params.sortField, params.sortDirection, params.translatedItems],
        params.columns,
        params.clientSideSorting
      ),
    })),
    map(({ data }) => data)
  )
  fallbackImagePath$!: Observable<string>

  templates = contentChildren<PrimeTemplate>(PrimeTemplate)
  templates$ = toObservable(this.templates)

  viewTemplates = viewChildren<PrimeTemplate>(PrimeTemplate)
  viewTemplates$ = toObservable(this.viewTemplates)

  parentTemplates = model<PrimeTemplate[] | null | undefined>(undefined)
  parentTemplates$ = toObservable(this.parentTemplates)

  columnType = ColumnType
  private templatesObservables: Record<string, Observable<TemplateRef<any> | null>> = {}
  hasViewPermission$ = toObservable(this.viewPermission).pipe(
    map((permission) => {
      if (!permission) return []
      return Array.isArray(permission) ? permission : [permission]
    }),
    switchMap((permissionArray) => {
      if (permissionArray.length === 0) {
        return of(true)
      }
      return this.permissions$.pipe(map((permissions) => permissionArray.every((p) => permissions.includes(p))))
    })
  )

  constructor() {
    const locale = inject(LOCALE_ID)
    const translateService = inject(TranslateService)

    super(locale, translateService)

    effect(() => {
      const data = this.data()
      // Not track previousData change to avoid the trigger
      untracked(() => {
        const previousData = this.previousData()
        if (previousData.length) {
          this.page.set(0)
        }
      })

      const currentResults = data.length
      const newStatus =
        currentResults === 0 ? 'OCX_DATA_LIST_GRID.NO_SEARCH_RESULTS_FOUND' : 'OCX_DATA_LIST_GRID.SEARCH_RESULTS_FOUND'

      firstValueFrom(this.translateService.get(newStatus, { results: currentResults })).then(
        (translatedText: string) => {
          this.liveAnnouncer.announce(translatedText)
        }
      )
    })

    effect(() => {
      const columns = this.columns()
      const obs = columns.map((c) => this.getTemplate(c))
      this.columnTemplates$ = combineLatest(obs).pipe(
        map((values) => Object.fromEntries(columns.map((c, i) => [c.id, values[i]]))),
        debounceTime(50)
      )
    })

    effect(() => {
      this.filters()
      // Not track previousFilters change to avoid the trigger
      untracked(() => {
        const previousFilters = this.previousFilters()
        if (previousFilters.length) {
          this.page.set(0)
        }
      })
    })

    this.fallbackImagePath$ = this.appStateService.currentMfe$.pipe(
      map((currentMfe) => this.getFallbackImagePath(currentMfe))
    )

    effect(() => {
      this.emitComponentStateChanged()
    })

    effect(() => {
      this.pageChanged.emit(this.page())
    })

    effect(() => {
      const pageSize = this.pageSize()
      if (pageSize === undefined) {
        return
      }
      this.pageSizeChanged.emit(pageSize)
    })
  }

  ngOnInit(): void {
    this.name.set(this.name() || this.router.url.replace(/[^A-Za-z0-9]/, '_'))
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
    this.selectedItem.set(item)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  emitComponentStateChanged() {
    this.componentStateChanged.emit({
      pageSize: this.displayedPageSize(),
      activePage: this.page(),
    })
  }

  onPageChange(event: any) {
    const page = event.first / event.rows
    this.page.set(page)
    this.pageSize.set(event.rows)
  }

  fieldIsTruthy(object: any, key: any) {
    return !!this.resolveFieldData(object, key)
  }

  hasVisibleOverflowMenuItems(row: any) {
    return combineLatest([this.overflowListActions$, this.permissions$]).pipe(
      map(([actions, permission]) => this.filterActionsBasedOnPermissions(actions, permission)),
      map((actions) => actions.some((a) => !a.actionVisibleField || this.fieldIsTruthy(row, a.actionVisibleField)))
    )
  }

  toggleOverflowMenu(event: MouseEvent, menu: Menu, row: Row) {
    this.currentMenuRow.set(row)
    menu.toggle(event)
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
                this.dateListValue ??
                this.findTemplate(templates, ['dateListValue', 'defaultDateListValue'])?.template ??
                null
              )
            case ColumnType.NUMBER:
              return (
                this.numberListValue ??
                this.findTemplate(templates, ['numberListValue', 'defaultNumberListValue'])?.template ??
                null
              )
            case ColumnType.RELATIVE_DATE:
              return (
                this.relativeDateListValue ??
                this.findTemplate(templates, ['relativeDateListValue', 'defaultRelativeDateListValue'])?.template ??
                null
              )
            case ColumnType.TRANSLATION_KEY:
              return (
                this.translationKeyListValue ??
                this.findTemplate(templates, ['translationKeyListValue', 'defaultTranslationKeyListValue'])?.template ??
                null
              )
            default:
              return (
                this.stringListValue ??
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
    translations: Record<string, string>,
    keys: {
      viewMenuItem: string
      editMenuItem: string
      deleteMenuItem: string
    },
    actionPermissions: {
      viewPermission: string | string[] | undefined
      editPermission: string | string[] | undefined
      deletePermission: string | string[] | undefined
    },
    visibleField: {
      viewAction?: string
      editAction?: string
      deleteAction?: string
    },
    enableField: {
      viewAction?: string
      editAction?: string
      deleteAction?: string
    }
  ): MenuItem[] {
    let deleteDisabled = false
    let editDisabled = false
    let viewDisabled = false

    let deleteVisible = true
    let editVisible = true
    let viewVisible = true

    if (selectedItem) {
      viewDisabled = !!enableField.viewAction && !this.fieldIsTruthy(selectedItem, enableField.viewAction)
      editDisabled = !!enableField.editAction && !this.fieldIsTruthy(selectedItem, enableField.editAction)
      deleteDisabled = !!enableField.deleteAction && !this.fieldIsTruthy(selectedItem, enableField.deleteAction)

      viewVisible = !visibleField.viewAction || this.fieldIsTruthy(selectedItem, visibleField.viewAction)
      editVisible = !visibleField.editAction || this.fieldIsTruthy(selectedItem, visibleField.editAction)
      deleteVisible = !visibleField.deleteAction || this.fieldIsTruthy(selectedItem, visibleField.deleteAction)
    }

    const menuItems: MenuItem[] = []
    const automationId = 'data-grid-action-button'
    const automationIdHidden = 'data-grid-action-button-hidden'
    if (this.shouldDisplayAction(actionPermissions.viewPermission, this.viewItem, permissions)) {
      menuItems.push({
        label: translations[keys.viewMenuItem],
        icon: PrimeIcons.EYE,
        command: () => this.viewItem.emit(selectedItem),
        disabled: viewDisabled,
        visible: viewVisible,
        automationId: viewVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(actionPermissions.editPermission, this.editItem, permissions)) {
      menuItems.push({
        label: translations[keys.editMenuItem],
        icon: PrimeIcons.PENCIL,
        command: () => this.editItem.emit(selectedItem),
        disabled: editDisabled,
        visible: editVisible,
        automationId: editVisible ? automationId : automationIdHidden,
      })
    }
    if (this.shouldDisplayAction(actionPermissions.deletePermission, this.deleteItem, permissions)) {
      menuItems.push({
        label: translations[keys.deleteMenuItem],
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
          command: () => a.callback(selectedItem),
          automationId: isVisible ? automationId : automationIdHidden,
        }
      })
    )
    return val
  }

  private getGridActionsTranslations(
    additionalActions: DataAction[],
    keys: {
      viewMenuItem: string
      editMenuItem: string
      deleteMenuItem: string
    }
  ): Observable<Record<string, string>> {
    return this.translateService.get([
      keys.viewMenuItem,
      keys.editMenuItem,
      keys.deleteMenuItem,
      ...additionalActions.map((a) => a.labelKey || ''),
    ])
  }

  private shouldDisplayAction(
    permission: string | string[] | undefined,
    emitter: ObservableOutputEmitterRef<any>,
    userPermissions: string[]
  ): boolean {
    const permissions = Array.isArray(permission) ? permission : permission ? [permission] : []
    return emitter.observed() && permissions.every((p) => userPermissions.includes(p))
  }

  private filterActionsBasedOnPermissions(actions: DataAction[], permissions: string[]): DataAction[] {
    return actions.filter((action) => {
      const actionPermissions = Array.isArray(action.permission) ? action.permission : [action.permission]
      return actionPermissions.every((p) => permissions.includes(p))
    })
  }

  private getPermissions(): Observable<string[]> {
    if (this.hasPermissionChecker?.getPermissions) {
      return this.hasPermissionChecker.getPermissions()
    }

    return this.userService.getPermissions()
  }
}
