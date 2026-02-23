import {
  Component,
  DestroyRef,
  EventEmitter,
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
import { Observable, ReplaySubject, combineLatest, map, startWith, timestamp } from 'rxjs'
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
  private readonly destroyRef = inject(DestroyRef)

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

  childTableCell = contentChild<TemplateRef<any> | undefined>('tableCell')
  primeNgTableCell = computed(() => {
    const templates = this.templates()
    const tableCellTemplate = templates.find((t) => t.getType() === 'tableCell')
    return tableCellTemplate?.template ?? undefined
  })
  _tableCell = computed(() => {
    const primeNgTableCell = this.primeNgTableCell()
    const childTableCell = this.childTableCell()
    return primeNgTableCell ?? childTableCell ?? undefined
  })

  childDateTableCell = contentChild<TemplateRef<any> | undefined>('dateTableCell')
  primeNgDateTableCell = computed(() => {
    const templates = this.templates()
    const dateTableCellTemplate = templates.find((t) => t.getType() === 'dateTableCell')
    return dateTableCellTemplate?.template ?? undefined
  })
  _dateTableCell = computed(() => {
    const primeNgDateTableCell = this.primeNgDateTableCell()
    const childDateTableCell = this.childDateTableCell()
    return primeNgDateTableCell ?? childDateTableCell ?? undefined
  })

  childRelativeDateTableCell = contentChild<TemplateRef<any> | undefined>('relativeDateTableCell')
  primeNgRelativeDateTableCell = computed(() => {
    const templates = this.templates()
    const relativeDateTableCellTemplate = templates.find((t) => t.getType() === 'relativeDateTableCell')
    return relativeDateTableCellTemplate?.template ?? undefined
  })
  _relativeDateTableCell = computed(() => {
    const primeNgRelativeDateTableCell = this.primeNgRelativeDateTableCell()
    const childRelativeDateTableCell = this.childRelativeDateTableCell()
    return primeNgRelativeDateTableCell ?? childRelativeDateTableCell ?? undefined
  })

  childTranslationKeyTableCell = contentChild<TemplateRef<any> | undefined>('translationKeyTableCell')
  primeNgTranslationKeyTableCell = computed(() => {
    const templates = this.templates()
    const translationKeyTableCellTemplate = templates.find((t) => t.getType() === 'translationKeyTableCell')
    return translationKeyTableCellTemplate?.template ?? undefined
  })
  _translationKeyTableCell = computed(() => {
    const primeNgTranslationKeyTableCell = this.primeNgTranslationKeyTableCell()
    const childTranslationKeyTableCell = this.childTranslationKeyTableCell()
    return primeNgTranslationKeyTableCell ?? childTranslationKeyTableCell ?? undefined
  })

  childGridItemSubtitleLines = contentChild<TemplateRef<any> | undefined>('gridItemSubtitleLines')
  primeNgGridItemSubtitleLines = computed(() => {
    const templates = this.templates()
    const gridItemSubtitleLinesTemplate = templates.find((t) => t.getType() === 'gridItemSubtitleLines')
    return gridItemSubtitleLinesTemplate?.template ?? undefined
  })
  _gridItemSubtitleLines = computed(() => {
    const primeNgGridItemSubtitleLines = this.primeNgGridItemSubtitleLines()
    const childGridItemSubtitleLines = this.childGridItemSubtitleLines()
    return primeNgGridItemSubtitleLines ?? childGridItemSubtitleLines ?? undefined
  })

  childListItemSubtitleLines = contentChild<TemplateRef<any> | undefined>('listItemSubtitleLines')
  primeNgListItemSubtitleLines = computed(() => {
    const templates = this.templates()
    const listItemSubtitleLinesTemplate = templates.find((t) => t.getType() === 'listItemSubtitleLines')
    return listItemSubtitleLinesTemplate?.template ?? undefined
  })
  _listItemSubtitleLines = computed(() => {
    const primeNgListItemSubtitleLines = this.primeNgListItemSubtitleLines()
    const childListItemSubtitleLines = this.childListItemSubtitleLines()
    return primeNgListItemSubtitleLines ?? childListItemSubtitleLines ?? undefined
  })

  childStringTableCell = contentChild<TemplateRef<any> | undefined>('stringTableCell')
  primeNgStringTableCell = computed(() => {
    const templates = this.templates()
    const stringTableCellTemplate = templates.find((t) => t.getType() === 'stringTableCell')
    return stringTableCellTemplate?.template ?? undefined
  })
  _stringTableCell = computed(() => {
    const primeNgStringTableCell = this.primeNgStringTableCell()
    const childStringTableCell = this.childStringTableCell()
    return primeNgStringTableCell ?? childStringTableCell ?? undefined
  })

  childNumberTableCell = contentChild<TemplateRef<any> | undefined>('numberTableCell')
  primeNgNumberTableCell = computed(() => {
    const templates = this.templates()
    const numberTableCellTemplate = templates.find((t) => t.getType() === 'numberTableCell')
    return numberTableCellTemplate?.template ?? undefined
  })
  _numberTableCell = computed(() => {
    const primeNgNumberTableCell = this.primeNgNumberTableCell()
    const childNumberTableCell = this.childNumberTableCell()
    return primeNgNumberTableCell ?? childNumberTableCell ?? undefined
  })

  childGridItem = contentChild<TemplateRef<any> | undefined>('gridItem')
  primeNgGridItem = computed(() => {
    const templates = this.templates()
    const gridItemTemplate = templates.find((t) => t.getType() === 'gridItem')
    return gridItemTemplate?.template ?? undefined
  })
  _gridItem = computed(() => {
    const primeNgGridItem = this.primeNgGridItem()
    const childGridItem = this.childGridItem()
    return primeNgGridItem ?? childGridItem ?? undefined
  })

  childListItem = contentChild<TemplateRef<any> | undefined>('listItem')
  primeNgListItem = computed(() => {
    const templates = this.templates()
    const listItemTemplate = templates.find((t) => t.getType() === 'listItem')
    return listItemTemplate?.template ?? undefined
  })
  _listItem = computed(() => {
    const primeNgListItem = this.primeNgListItem()
    const childListItem = this.childListItem()
    return primeNgListItem ?? childListItem ?? undefined
  })

  childTopCenter = contentChild<TemplateRef<any> | undefined>('topCenter')
  primeNgTopCenter = computed(() => {
    const templates = this.templates()
    const topCenterTemplate = templates.find((t) => t.getType() === 'topCenter')
    return topCenterTemplate?.template ?? undefined
  })
  _topCenter = computed(() => {
    const primeNgTopCenter = this.primeNgTopCenter()
    const childTopCenter = this.childTopCenter()
    return primeNgTopCenter ?? childTopCenter ?? undefined
  })

  childListValue = contentChild<TemplateRef<any> | undefined>('listValue')
  primeNgListValue = computed(() => {
    const templates = this.templates()
    const listValueTemplate = templates.find((t) => t.getType() === 'listValue')
    return listValueTemplate?.template ?? undefined
  })
  _listValue = computed(() => {
    const primeNgListValue = this.primeNgListValue()
    const childListValue = this.childListValue()
    return primeNgListValue ?? childListValue ?? undefined
  })

  childTranslationKeyListValue = contentChild<TemplateRef<any> | undefined>('translationKeyListValue')
  primeNgTranslationKeyListValue = computed(() => {
    const templates = this.templates()
    const translationKeyListValueTemplate = templates.find((t) => t.getType() === 'translationKeyListValue')
    return translationKeyListValueTemplate?.template ?? undefined
  })
  _translationKeyListValue = computed(() => {
    const primeNgTranslationKeyListValue = this.primeNgTranslationKeyListValue()
    const childTranslationKeyListValue = this.childTranslationKeyListValue()
    return primeNgTranslationKeyListValue ?? childTranslationKeyListValue ?? undefined
  })

  childNumberListValue = contentChild<TemplateRef<any> | undefined>('numberListValue')
  primeNgNumberListValue = computed(() => {
    const templates = this.templates()
    const numberListValueTemplate = templates.find((t) => t.getType() === 'numberListValue')
    return numberListValueTemplate?.template ?? undefined
  })
  _numberListValue = computed(() => {
    const primeNgNumberListValue = this.primeNgNumberListValue()
    const childNumberListValue = this.childNumberListValue()
    return primeNgNumberListValue ?? childNumberListValue ?? undefined
  })

  childRelativeDateListValue = contentChild<TemplateRef<any> | undefined>('relativeDateListValue')
  primeNgRelativeDateListValue = computed(() => {
    const templates = this.templates()
    const relativeDateListValueTemplate = templates.find((t) => t.getType() === 'relativeDateListValue')
    return relativeDateListValueTemplate?.template ?? undefined
  })
  _relativeDateListValue = computed(() => {
    const primeNgRelativeDateListValue = this.primeNgRelativeDateListValue()
    const childRelativeDateListValue = this.childRelativeDateListValue()
    return primeNgRelativeDateListValue ?? childRelativeDateListValue ?? undefined
  })

  childStringListValue = contentChild<TemplateRef<any> | undefined>('stringListValue')
  primeNgStringListValue = computed(() => {
    const templates = this.templates()
    const stringListValueTemplate = templates.find((t) => t.getType() === 'stringListValue')
    return stringListValueTemplate?.template ?? undefined
  })
  _stringListValue = computed(() => {
    const primeNgStringListValue = this.primeNgStringListValue()
    const childStringListValue = this.childStringListValue()
    return primeNgStringListValue ?? childStringListValue ?? undefined
  })

  childDateListValue = contentChild<TemplateRef<any> | undefined>('dateListValue')
  primeNgDateListValue = computed(() => {
    const templates = this.templates()
    const dateListValueTemplate = templates.find((t) => t.getType() === 'dateListValue')
    return dateListValueTemplate?.template ?? undefined
  })
  _dateListValue = computed(() => {
    const primeNgDateListValue = this.primeNgDateListValue()
    const childDateListValue = this.childDateListValue()
    return primeNgDateListValue ?? childDateListValue ?? undefined
  })

  childTableFilterCell = contentChild<TemplateRef<any> | undefined>('tableFilterCell')
  primeNgTableFilterCell = computed(() => {
    const templates = this.templates()
    const tableFilterCellTemplate = templates.find((t) => t.getType() === 'tableFilterCell')
    return tableFilterCellTemplate?.template ?? undefined
  })
  _tableFilterCell = computed(() => {
    const primeNgTableFilterCell = this.primeNgTableFilterCell()
    const childTableFilterCell = this.childTableFilterCell()
    return primeNgTableFilterCell ?? childTableFilterCell ?? undefined
  })

  childDateTableFilterCell = contentChild<TemplateRef<any> | undefined>('dateTableFilterCell')
  primeNgDateTableFilterCell = computed(() => {
    const templates = this.templates()
    const dateTableFilterCellTemplate = templates.find((t) => t.getType() === 'dateTableFilterCell')
    return dateTableFilterCellTemplate?.template ?? undefined
  })
  _dateTableFilterCell = computed(() => {
    const primeNgDateTableFilterCell = this.primeNgDateTableFilterCell()
    const childDateTableFilterCell = this.childDateTableFilterCell()
    return primeNgDateTableFilterCell ?? childDateTableFilterCell ?? undefined
  })

  childRelativeDateTableFilterCell = contentChild<TemplateRef<any> | undefined>('relativeDateTableFilterCell')
  primeNgRelativeDateTableFilterCell = computed(() => {
    const templates = this.templates()
    const relativeDateTableFilterCellTemplate = templates.find((t) => t.getType() === 'relativeDateTableFilterCell')
    return relativeDateTableFilterCellTemplate?.template ?? undefined
  })
  _relativeDateTableFilterCell = computed(() => {
    const primeNgRelativeDateTableFilterCell = this.primeNgRelativeDateTableFilterCell()
    const childRelativeDateTableFilterCell = this.childRelativeDateTableFilterCell()
    return primeNgRelativeDateTableFilterCell ?? childRelativeDateTableFilterCell ?? undefined
  })

  childTranslationKeyTableFilterCell = contentChild<TemplateRef<any> | undefined>('translationKeyTableFilterCell')
  primeNgTranslationKeyTableFilterCell = computed(() => {
    const templates = this.templates()
    const translationKeyTableFilterCellTemplate = templates.find((t) => t.getType() === 'translationKeyTableFilterCell')
    return translationKeyTableFilterCellTemplate?.template ?? undefined
  })
  _translationKeyTableFilterCell = computed(() => {
    const primeNgTranslationKeyTableFilterCell = this.primeNgTranslationKeyTableFilterCell()
    const childTranslationKeyTableFilterCell = this.childTranslationKeyTableFilterCell()
    return primeNgTranslationKeyTableFilterCell ?? childTranslationKeyTableFilterCell ?? undefined
  })

  childStringTableFilterCell = contentChild<TemplateRef<any> | undefined>('stringTableFilterCell')
  primeNgStringTableFilterCell = computed(() => {
    const templates = this.templates()
    const stringTableFilterCellTemplate = templates.find((t) => t.getType() === 'stringTableFilterCell')
    return stringTableFilterCellTemplate?.template ?? undefined
  })
  _stringTableFilterCell = computed(() => {
    const primeNgStringTableFilterCell = this.primeNgStringTableFilterCell()
    const childStringTableFilterCell = this.childStringTableFilterCell()
    return primeNgStringTableFilterCell ?? childStringTableFilterCell ?? undefined
  })

  childNumberTableFilterCell = contentChild<TemplateRef<any> | undefined>('numberTableFilterCell')
  primeNgNumberTableFilterCell = computed(() => {
    const templates = this.templates()
    const numberTableFilterCellTemplate = templates.find((t) => t.getType() === 'numberTableFilterCell')
    return numberTableFilterCellTemplate?.template ?? undefined
  })
  _numberTableFilterCell = computed(() => {
    const primeNgNumberTableFilterCell = this.primeNgNumberTableFilterCell()
    const childNumberTableFilterCell = this.childNumberTableFilterCell()
    return primeNgNumberTableFilterCell ?? childNumberTableFilterCell ?? undefined
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
  @Output() groupSelectionChangedSlotEmitter = observableOutput<ColumnGroupData | undefined>()

  // Internal EventEmitter for handling slot's groupSelectionChanged output
  // Used for communication between the slot component and this component's internal logic
  readonly slotGroupSelectionChangeListener = new EventEmitter<ColumnGroupData | undefined>()

  constructor() {
    this.isColumnGroupSelectionComponentDefined$ = this.slotService
      .isSomeComponentDefinedForSlot(this.columnGroupSlotName)
      .pipe(startWith(true))

    this.isColumnGroupSelectionComponentDefined = toSignal(this.isColumnGroupSelectionComponentDefined$)

    const subscription = this.slotGroupSelectionChangeListener.subscribe((event) => {
      this.triggerGroupSelectionChanged(event)
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe())

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

  }

  /**
   * Triggers the group selection changed logic. This method should be called
   * when the column group selection changes, either from the UI or programmatically.
   * It updates the displayed columns, selected group key, and emits the change event.
   * 
   * @param event The column group data, or undefined to use current state
   */
  triggerGroupSelectionChanged(event: ColumnGroupData | undefined): void {
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
    this.groupSelectionChangedSlotEmitter.emit(event)
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
