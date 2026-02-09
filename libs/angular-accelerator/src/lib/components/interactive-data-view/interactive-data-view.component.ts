import {
  Component,
  Input,
  OnInit,
  Output,
  Signal,
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
  viewChild,
} from '@angular/core'
import { SlotService } from '@onecx/angular-remote-components'
import { PrimeTemplate } from 'primeng/api'
import { Observable, ReplaySubject, combineLatest, map, startWith, timestamp, withLatestFrom } from 'rxjs'
import { DataAction } from '../../model/data-action'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter } from '../../model/filter.model'
import { limit } from '../../utils/filter.utils'
import { orderAndMergeValuesByTimestamp } from '../../utils/rxjs-utils'
import {
  ColumnGroupSelectionComponentState,
  GroupSelectionChangedEvent,
} from '../column-group-selection/column-group-selection.component'
import {
  ActionColumnChangedEvent,
  ColumnSelectionChangedEvent,
  CustomGroupColumnSelectorComponentState,
} from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponentState } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponentState } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { Row, Sort } from '../data-table/data-table.component'
import { DataViewComponent, DataViewComponentState, RowListGridData } from '../data-view/data-view.component'
import { FilterViewComponentState, FilterViewDisplayMode } from '../filter-view/filter-view.component'
import { observableOutput } from '../../utils/observable-output.utils'
import { toSignal } from '@angular/core/rxjs-interop'
import { UntypedFormArray } from '@angular/forms'

export type InteractiveDataViewComponentState = ColumnGroupSelectionComponentState &
  CustomGroupColumnSelectorComponentState &
  DataLayoutSelectionComponentState &
  DataListGridSortingComponentState &
  DataViewComponentState &
  FilterViewComponentState

export interface ColumnGroupData {
  activeColumns: DataTableColumn[]
  groupKey: string
}
@Component({
  standalone: false,
  selector: 'ocx-interactive-data-view',
  templateUrl: './interactive-data-view.component.html',
  styleUrls: ['./interactive-data-view.component.css'],
  providers: [{ provide: 'InteractiveDataViewComponent', useExisting: InteractiveDataViewComponent }],
})
export class InteractiveDataViewComponent implements OnInit {
  private readonly slotService = inject(SlotService)

  dataViewComponent = viewChild(DataViewComponent)

  columnGroupSelectionComponentState$ = new ReplaySubject<ColumnGroupSelectionComponentState>(1)
  customGroupColumnSelectorComponentState$ = new ReplaySubject<CustomGroupColumnSelectorComponentState>(1)
  dataLayoutComponentState$ = new ReplaySubject<DataLayoutSelectionComponentState>(1)
  dataListGridSortingComponentState$ = new ReplaySubject<DataListGridSortingComponentState>(1)
  dataViewComponentState$ = new ReplaySubject<DataViewComponentState>(1)
  filterViewComponentState$ = new ReplaySubject<FilterViewComponentState>(1)

  searchConfigPermission = input<string | string[] | undefined>(undefined)
  deletePermission = input<string | string[] | undefined>(undefined)
  editPermission = input<string | string[] | undefined>(undefined)
  viewPermission = input<string | string[] | undefined>(undefined)
  deleteActionVisibleField = input<string | undefined>(undefined)
  deleteActionEnabledField = input<string | undefined>(undefined)
  viewActionVisibleField = input<string | undefined>(undefined)
  viewActionEnabledField = input<string | undefined>(undefined)
  editActionVisibleField = input<string | undefined>(undefined)
  editActionEnabledField = input<string | undefined>(undefined)
  tableSelectionEnabledField = input<string | undefined>(undefined)
  tableAllowSelectAll = input<boolean>(true)
  name = input<string>('Data')
  titleLineId = input<string | undefined>(undefined)
  subtitleLineIds = input<string[] | undefined>(undefined)
  supportedViewLayouts = input<('grid' | 'list' | 'table')[]>(['grid', 'list', 'table'])
  columns = input<DataTableColumn[]>([])
  emptyResultsMessage = input<string | undefined>(undefined)
  clientSideSorting = input<boolean>(true)
  clientSideFiltering = input<boolean>(true)
  fallbackImage = input<string>('placeholder.png')
  filters = model<Filter[]>([])
  sortDirection = model<DataSortDirection>(DataSortDirection.NONE)
  sortField = model<any>('')
  sortStates = input<DataSortDirection[]>([
    DataSortDirection.ASCENDING,
    DataSortDirection.DESCENDING,
    DataSortDirection.NONE,
  ])
  pageSizes = input<number[]>([10, 25, 50])
  pageSize = model<number | undefined>(undefined)
  totalRecordsOnServer = input<number | undefined>(undefined)
  layout = model<'grid' | 'list' | 'table'>('table')
  defaultGroupKey = input<string>('')
  customGroupKey = input<string>('OCX_INTERACTIVE_DATA_VIEW.CUSTOM_GROUP')
  groupSelectionNoGroupSelectedKey = input<string>('OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED')
  currentPageShowingKey = input<string>('OCX_DATA_TABLE.SHOWING')
  currentPageShowingWithTotalOnServerKey = input<string>('OCX_DATA_TABLE.SHOWING_WITH_TOTAL_ON_SERVER')
  additionalActions = input<DataAction[]>([])
  listGridPaginator = model<boolean>(true)
  tablePaginator = model<boolean>(true)
  @Input()
  get paginator(): boolean {
    return this.listGridPaginator() && this.tablePaginator()
  }
  set paginator(value: boolean) {
    this.listGridPaginator.set(value)
    this.tablePaginator.set(value)
  }
  disableFilterView = input<boolean>(true)
  filterViewDisplayMode = input<FilterViewDisplayMode>('button')
  filterViewChipStyleClass = input<string>('')
  filterViewTableStyle = input<{ [klass: string]: any }>({ 'max-height': '50vh' })
  filterViewPanelStyle = input<{ [klass: string]: any }>({ 'max-width': '90%' })
  selectDisplayedChips = input<(filters: Filter[], columns: DataTableColumn[]) => Filter[]>((filters) =>
    limit(filters, 3, { reverse: true })
  )
  page = model<number>(0)
  selectedRows = input<Row[]>([])
  displayedColumnKeys = model<string[]>([])
  displayedColumns = computed(() => {
    const columnKeys = this.displayedColumnKeys()
    return (
      (columnKeys.map((key) => this.columns().find((col) => col.id === key)).filter((d) => d) as DataTableColumn[]) ??
      []
    )
  })
  frozenActionColumn = model<boolean>(false)
  actionColumnPosition = model<'left' | 'right'>('right')
  headerStyleClass = input<string | undefined>(undefined)
  contentStyleClass = input<string | undefined>(undefined)

  tableCell = contentChild<TemplateRef<any> | undefined>('tableCell')
  primeNgTableCell = computed(() => {
    const templates = this.templates()
    const tableCellTemplate = templates.find((t) => t.getType() === 'tableCell')
    return tableCellTemplate?.template ?? undefined
  })

  dateTableCell = contentChild<TemplateRef<any> | undefined>('dateTableCell')
  primeNgDateTableCell = computed(() => {
    const templates = this.templates()
    const dateTableCellTemplate = templates.find((t) => t.getType() === 'dateTableCell')
    return dateTableCellTemplate?.template ?? undefined
  })

  relativeDateTableCell = contentChild<TemplateRef<any> | undefined>('relativeDateTableCell')
  primeNgRelativeDateTableCell = computed(() => {
    const templates = this.templates()
    const relativeDateTableCellTemplate = templates.find((t) => t.getType() === 'relativeDateTableCell')
    return relativeDateTableCellTemplate?.template ?? undefined
  })

  translationKeyTableCell = contentChild<TemplateRef<any> | undefined>('translationKeyTableCell')
  primeNgTranslationKeyTableCell = computed(() => {
    const templates = this.templates()
    const translationKeyTableCellTemplate = templates.find((t) => t.getType() === 'translationKeyTableCell')
    return translationKeyTableCellTemplate?.template ?? undefined
  })

  gridItemSubtitleLines = contentChild<TemplateRef<any> | undefined>('gridItemSubtitleLines')
  primeNgGridItemSubtitleLines = computed(() => {
    const templates = this.templates()
    const gridItemSubtitleLinesTemplate = templates.find((t) => t.getType() === 'gridItemSubtitleLines')
    return gridItemSubtitleLinesTemplate?.template ?? undefined
  })

  listItemSubtitleLines = contentChild<TemplateRef<any> | undefined>('listItemSubtitleLines')
  primeNgListItemSubtitleLines = computed(() => {
    const templates = this.templates()
    const listItemSubtitleLinesTemplate = templates.find((t) => t.getType() === 'listItemSubtitleLines')
    return listItemSubtitleLinesTemplate?.template ?? undefined
  })

  stringTableCell = contentChild<TemplateRef<any> | undefined>('stringTableCell')
  primeNgStringTableCell = computed(() => {
    const templates = this.templates()
    const stringTableCellTemplate = templates.find((t) => t.getType() === 'stringTableCell')
    return stringTableCellTemplate?.template ?? undefined
  })

  numberTableCell = contentChild<TemplateRef<any> | undefined>('numberTableCell')
  primeNgNumberTableCell = computed(() => {
    const templates = this.templates()
    const numberTableCellTemplate = templates.find((t) => t.getType() === 'numberTableCell')
    return numberTableCellTemplate?.template ?? undefined
  })

  gridItem = contentChild<TemplateRef<any> | undefined>('gridItem')
  primeNgGridItem = computed(() => {
    const templates = this.templates()
    const gridItemTemplate = templates.find((t) => t.getType() === 'gridItem')
    return gridItemTemplate?.template ?? undefined
  })

  listItem = contentChild<TemplateRef<any> | undefined>('listItem')
  primeNgListItem = computed(() => {
    const templates = this.templates()
    const listItemTemplate = templates.find((t) => t.getType() === 'listItem')
    return listItemTemplate?.template ?? undefined
  })

  topCenter = contentChild<TemplateRef<any> | undefined>('topCenter')
  primeNgTopCenter = computed(() => {
    const templates = this.templates()
    const topCenterTemplate = templates.find((t) => t.getType() === 'topCenter')
    return topCenterTemplate?.template ?? undefined
  })

  listValue = contentChild<TemplateRef<any> | undefined>('listValue')
  primeNgListValue = computed(() => {
    const templates = this.templates()
    const listValueTemplate = templates.find((t) => t.getType() === 'listValue')
    return listValueTemplate?.template ?? undefined
  })

  translationKeyListValue = contentChild<TemplateRef<any> | undefined>('translationKeyListValue')
  primeNgTranslationKeyListValue = computed(() => {
    const templates = this.templates()
    const translationKeyListValueTemplate = templates.find((t) => t.getType() === 'translationKeyListValue')
    return translationKeyListValueTemplate?.template ?? undefined
  })

  numberListValue = contentChild<TemplateRef<any> | undefined>('numberListValue')
  primeNgNumberListValue = computed(() => {
    const templates = this.templates()
    const numberListValueTemplate = templates.find((t) => t.getType() === 'numberListValue')
    return numberListValueTemplate?.template ?? undefined
  })

  relativeDateListValue = contentChild<TemplateRef<any> | undefined>('relativeDateListValue')
  primeNgRelativeDateListValue = computed(() => {
    const templates = this.templates()
    const relativeDateListValueTemplate = templates.find((t) => t.getType() === 'relativeDateListValue')
    return relativeDateListValueTemplate?.template ?? undefined
  })

  stringListValue = contentChild<TemplateRef<any> | undefined>('stringListValue')
  primeNgStringListValue = computed(() => {
    const templates = this.templates()
    const stringListValueTemplate = templates.find((t) => t.getType() === 'stringListValue')
    return stringListValueTemplate?.template ?? undefined
  })

  dateListValue = contentChild<TemplateRef<any> | undefined>('dateListValue')
  primeNgDateListValue = computed(() => {
    const templates = this.templates()
    const dateListValueTemplate = templates.find((t) => t.getType() === 'dateListValue')
    return dateListValueTemplate?.template ?? undefined
  })

  tableFilterCell = contentChild<TemplateRef<any> | undefined>('tableFilterCell')
  primeNgTableFilterCell = computed(() => {
    const templates = this.templates()
    const tableFilterCellTemplate = templates.find((t) => t.getType() === 'tableFilterCell')
    return tableFilterCellTemplate?.template ?? undefined
  })

  dateTableFilterCell = contentChild<TemplateRef<any> | undefined>('dateTableFilterCell')
  primeNgDateTableFilterCell = computed(() => {
    const templates = this.templates()
    const dateTableFilterCellTemplate = templates.find((t) => t.getType() === 'dateTableFilterCell')
    return dateTableFilterCellTemplate?.template ?? undefined
  })

  relativeDateTableFilterCell = contentChild<TemplateRef<any> | undefined>('relativeDateTableFilterCell')
  primeNgRelativeDateTableFilterCell = computed(() => {
    const templates = this.templates()
    const relativeDateTableFilterCellTemplate = templates.find((t) => t.getType() === 'relativeDateTableFilterCell')
    return relativeDateTableFilterCellTemplate?.template ?? undefined
  })

  translationKeyTableFilterCell = contentChild<TemplateRef<any> | undefined>('translationKeyTableFilterCell')
  primeNgTranslationKeyTableFilterCell = computed(() => {
    const templates = this.templates()
    const translationKeyTableFilterCellTemplate = templates.find((t) => t.getType() === 'translationKeyTableFilterCell')
    return translationKeyTableFilterCellTemplate?.template ?? undefined
  })

  stringTableFilterCell = contentChild<TemplateRef<any> | undefined>('stringTableFilterCell')
  primeNgStringTableFilterCell = computed(() => {
    const templates = this.templates()
    const stringTableFilterCellTemplate = templates.find((t) => t.getType() === 'stringTableFilterCell')
    return stringTableFilterCellTemplate?.template ?? undefined
  })

  numberTableFilterCell = contentChild<TemplateRef<any> | undefined>('numberTableFilterCell')
  primeNgNumberTableFilterCell = computed(() => {
    const templates = this.templates()
    const numberTableFilterCellTemplate = templates.find((t) => t.getType() === 'numberTableFilterCell')
    return numberTableFilterCellTemplate?.template ?? undefined
  })

  templates = contentChildren<PrimeTemplate>(PrimeTemplate)

  filtered = output<Filter[]>()
  sorted = output<Sort>()
  @Output() deleteItem = observableOutput<RowListGridData>()
  @Output() viewItem = observableOutput<RowListGridData>()
  @Output() editItem = observableOutput<RowListGridData>()
  @Output() selectionChanged = observableOutput<Row[]>()
  dataViewLayoutChange = output<'grid' | 'list' | 'table'>()
  displayedColumnKeysChange = output<string[]>()

  pageChanged = output<number>()
  pageSizeChanged = output<number>()

  componentStateChanged = output<InteractiveDataViewComponentState>()

  selectedGroupKey = signal<string | undefined>(undefined)

  data = input<RowListGridData[]>([])

  readonly columnGroupSlotName = 'onecx-column-group-selection'
  isColumnGroupSelectionComponentDefined$: Observable<boolean>
  isColumnGroupSelectionComponentDefined: Signal<boolean | undefined>
  groupSelectionChangedSlotEmitter = output<ColumnGroupData | undefined>()

  constructor() {
    this.isColumnGroupSelectionComponentDefined$ = this.slotService
      .isSomeComponentDefinedForSlot(this.columnGroupSlotName)
      .pipe(startWith(true))

    this.isColumnGroupSelectionComponentDefined = toSignal(this.isColumnGroupSelectionComponentDefined$)

    effect(() => {
      this.registerEventListenerForDataView()
    })

    effect(() => {
      const filters = this.filters()
      this.filtered.emit(filters)
    })

    effect(() => {
      const sortField = this.sortField()
      const sortDirection = this.sortDirection()
      this.sorted.emit({ sortColumn: sortField, sortDirection })
    })

    effect(() => {
      const layout = this.layout()
      this.dataViewLayoutChange.emit(layout)
    })

    effect(() => {
      const page = this.page()
      this.pageChanged.emit(page)
    })

    effect(() => {
      const pageSize = this.pageSize()
      if (!pageSize) {
        return
      }
      this.pageSizeChanged.emit(pageSize)
    })

    effect(() => {
      const displayedColumnKeys = this.displayedColumnKeys()
      this.displayedColumnKeysChange.emit(displayedColumnKeys)
    })

    effect(() => {
      this.layout()
      untracked(() => {
        const columnGroupComponentDefined = this.isColumnGroupSelectionComponentDefined()
        if (columnGroupComponentDefined) {
          if (
            !(
              this.columns().find((c) => c.nameKey === this.selectedGroupKey()) ||
              this.selectedGroupKey() === this.customGroupKey()
            )
          ) {
            this.selectedGroupKey.set(undefined)
          }
        }
      })
    })

    this.groupSelectionChangedSlotEmitter.subscribe((event: ColumnGroupData | undefined) => {
      event ??= {
        activeColumns: this.displayedColumns(),
        groupKey: this.selectedGroupKey() ?? this.defaultGroupKey(),
      }
      const displayedColumnKeys = event.activeColumns.map((col) => col.id)
      this.displayedColumnKeys.set(displayedColumnKeys)
      this.selectedGroupKey.set(event.groupKey)
      this.columnGroupSelectionComponentState$.next({
        activeColumnGroupKey: event.groupKey,
        displayedColumns: event.activeColumns,
      })
    })
  }

  ngOnInit(): void {
    this.selectedGroupKey.set(this.defaultGroupKey())

    if (this.defaultGroupKey() && this.defaultGroupKey() !== this.customGroupKey()) {
      this.displayedColumnKeys.set(
        this.columns()
          .filter((column) => column.predefinedGroupKeys?.includes(this.defaultGroupKey()))
          .map((column) => column.id)
      )
    }

    let dataListGridSortingComponentState$: Observable<DataListGridSortingComponentState | Record<string, never>> =
      this.dataListGridSortingComponentState$
    let columnGroupSelectionComponentState$: Observable<ColumnGroupSelectionComponentState | Record<string, never>> =
      this.columnGroupSelectionComponentState$
    let customGroupColumnSelectorComponentState$: Observable<
      CustomGroupColumnSelectorComponentState | Record<string, never>
    > = this.customGroupColumnSelectorComponentState$

    if (this.layout() === 'table') {
      dataListGridSortingComponentState$ = dataListGridSortingComponentState$.pipe(startWith({}))
    } else {
      columnGroupSelectionComponentState$ = columnGroupSelectionComponentState$.pipe(
        startWith({
          activeColumnGroupKey: this.selectedGroupKey(),
          displayedColumns: this.displayedColumns(),
        })
      )
      customGroupColumnSelectorComponentState$ = customGroupColumnSelectorComponentState$.pipe(
        startWith({
          actionColumnConfig: {
            frozen: this.frozenActionColumn(),
            position: this.actionColumnPosition(),
          },
          displayedColumns: this.displayedColumns(),
          activeColumnGroupKey: this.selectedGroupKey(),
        })
      )
    }

    let filterViewComponentState$: Observable<FilterViewComponentState | Record<string, never>> =
      this.filterViewComponentState$
    if (this.disableFilterView()) {
      filterViewComponentState$ = filterViewComponentState$.pipe(
        startWith({
          filters: this.filters(),
        })
      )
    }

    combineLatest([
      columnGroupSelectionComponentState$.pipe(timestamp()),
      customGroupColumnSelectorComponentState$.pipe(timestamp()),
      this.dataLayoutComponentState$.pipe(timestamp()),
      dataListGridSortingComponentState$.pipe(timestamp()),
      this.dataViewComponentState$.pipe(timestamp()),
      filterViewComponentState$.pipe(timestamp()),
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

  filtering(event: any) {
    this.filters.set(event)
  }

  sorting(event: any) {
    this.sortDirection.set(event.sortDirection)
    this.sortField.set(event.sortColumn)
  }

  onDeleteElement(element: RowListGridData) {
    if (this.deleteItem.observed()) {
      this.deleteItem.emit(element)
    }
  }

  onViewElement(element: RowListGridData) {
    if (this.viewItem.observed()) {
      this.viewItem.emit(element)
    }
  }

  onEditElement(element: RowListGridData) {
    if (this.editItem.observed()) {
      this.editItem.emit(element)
    }
  }

  onDataViewLayoutChange(layout: 'grid' | 'list' | 'table') {
    this.layout.set(layout)
  }

  onSortChange($event: any) {
    this.sortField.set($event)
  }

  onSortDirectionChange($event: any) {
    this.sortDirection.set($event)
  }

  onColumnGroupSelectionChange(event: GroupSelectionChangedEvent) {
    const displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.displayedColumnKeys.set(displayedColumnKeys)
    this.selectedGroupKey.set(event.groupKey)
  }

  registerEventListenerForDataView() {
    if (this.deleteItem.observed()) {
      if (!this.dataViewComponent()?.deleteItem.observed()) {
        this.dataViewComponent()?.deleteItem.subscribe((event) => {
          this.onDeleteElement(event)
        })
      }
    }
    if (this.viewItem.observed()) {
      if (!this.dataViewComponent()?.viewItem.observed()) {
        this.dataViewComponent()?.viewItem.subscribe((event) => {
          this.onViewElement(event)
        })
      }
    }
    if (this.editItem.observed()) {
      if (!this.dataViewComponent()?.editItem.observed()) {
        this.dataViewComponent()?.editItem.subscribe((event) => {
          this.onEditElement(event)
        })
      }
    }
    if (this.selectionChanged.observed()) {
      if (!this.dataViewComponent()?.selectionChanged.observed()) {
        this.dataViewComponent()?.selectionChanged.subscribe((event) => {
          this.onRowSelectionChange(event)
        })
      }
    }
  }

  onColumnSelectionChange(event: ColumnSelectionChangedEvent) {
    const displayedColumnKeys = event.activeColumns.map((col) => col.id)
    this.displayedColumnKeys.set(displayedColumnKeys)
    this.selectedGroupKey.set(this.customGroupKey())
  }

  onActionColumnConfigChange(event: ActionColumnChangedEvent) {
    this.frozenActionColumn.set(event.frozenActionColumn)
    this.actionColumnPosition.set(event.actionColumnPosition)
  }

  onRowSelectionChange(event: Row[]) {
    if (this.selectionChanged.observed()) {
      this.selectionChanged.emit(event)
    }
  }

  onPageChange(event: number) {
    this.page.set(event)
  }

  onPageSizeChange(event: number) {
    this.pageSize.set(event)
  }
}
