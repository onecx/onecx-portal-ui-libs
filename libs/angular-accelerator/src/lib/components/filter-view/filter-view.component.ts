import {
  Component,
  computed,
  effect,
  inject,
  Input,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core'
import { Filter, FilterType } from '../../model/filter.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import type { Observable } from 'rxjs'
import { combineLatest, debounceTime, firstValueFrom, map } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { PrimeTemplate } from 'primeng/api'
import { findTemplate } from '../../utils/template.utils'
import { ObjectUtils } from '../../utils/objectutils'
import { limit } from '../../utils/filter.utils'
import { Popover } from 'primeng/popover'
import { Row } from '../data-table/data-table.component'
import { toObservable } from '@angular/core/rxjs-interop'
import { Button } from 'primeng/button'
import { DataViewStateService } from '../../services/data-view-state.service'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { TranslateService } from '@ngx-translate/core'
import { AddFilterDialogComponent } from './add-filter-dialog/add-filter-dialog.component'
import { PortalDialogService } from '../../services/portal-dialog.service'

export type FilterViewDisplayMode = 'chips' | 'button'
export type FilterViewRowDisplayData = {
  id: string
  column: string
  value: unknown
}
export type FilterViewRowDetailData = FilterViewRowDisplayData & {
  valueColumnId: string
}

export interface FilterViewComponentState {
  filters?: Filter[]
}

@Component({
  standalone: false,
  selector: 'ocx-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss'],
  providers: [DataViewStateService],
})
export class FilterViewComponent {
  readonly translateService = inject(TranslateService)
  readonly liveAnnouncer = inject(LiveAnnouncer)
  
  ColumnType = ColumnType
  FilterType = FilterType

  private readonly ownService = inject(DataViewStateService)
  private readonly parentService = inject(DataViewStateService, { skipSelf: true, optional: true })
  readonly stateService = this.parentService ?? this.ownService

  @Input()
  set filters(value: Filter[]) {
    this.stateService.filters.set(value)
  }

  @Input()
  set columns(value: DataTableColumn[]) {
    this.stateService.availableColumns.set(value)
  }

  readonly displayMode = input<FilterViewDisplayMode>('button')
  readonly selectDisplayedChips = input<(filters: Filter[], columns: DataTableColumn[]) => Filter[]>((filters) =>
    limit(filters, 3, { reverse: true })
  )
  readonly chipStyleClass = input('')
  readonly tableStyle = input<{ [klass: string]: any }>({ 'max-height': '50vh' })
  readonly panelStyle = input<{ [klass: string]: any }>({ 'max-width': '90%' })

  readonly filtered = output<Filter[]>()
  readonly componentStateChanged = output<FilterViewComponentState>()

  readonly columnFilterTableColumns = signal<DataTableColumn[]>([
    {
      id: 'column',
      columnType: ColumnType.TRANSLATION_KEY,
      nameKey: 'OCX_FILTER_VIEW.TABLE.COLUMN_NAME',
    },
    { id: 'value', columnType: ColumnType.STRING, nameKey: 'OCX_FILTER_VIEW.TABLE.VALUE' },
    {
      id: 'actions',
      columnType: ColumnType.STRING,
      nameKey: 'OCX_FILTER_VIEW.TABLE.ACTIONS',
    },
  ])

  readonly panel = viewChild(Popover)
  readonly manageButton = viewChild<Button>('manageButton')

  readonly defaultTemplates = viewChildren(PrimeTemplate)
  readonly defaultTemplates$ = toObservable(this.defaultTemplates)

  readonly trigger = signal<HTMLElement | undefined>(undefined)

  private readonly portalDialogService = inject(PortalDialogService)

  readonly filterViewNoSelection = signal<TemplateRef<any> | undefined>(undefined)
  readonly filterViewChipContent = signal<TemplateRef<any> | undefined>(undefined)
  readonly filterViewShowMoreChip = signal<TemplateRef<any> | undefined>(undefined)

  /**
   * The columns offered to the "Add Filter" dialog: only those that are marked
   * {@link DataTableColumn.filterable} and whose {@link FilterType} the dialog can
   * produce a working filter for (unset/EQUALS or IS_NOT_EMPTY) - the same set the
   * dialog's column select offers. The Add Filter button (in both the chips and the
   * button/panel view) is only enabled when at least one such column exists, so a
   * user sees an empty filter state instead of a no-op click.
   */
  readonly filterableColumns = computed<DataTableColumn[]>(() =>
    this.stateService.availableColumns().filter(
      (column) =>
        column.filterable &&
        (column.filterType === undefined ||
          column.filterType === FilterType.EQUALS ||
          column.filterType === FilterType.IS_NOT_EMPTY)
    )
  )

  readonly templates = input<readonly PrimeTemplate[] | null | undefined>(undefined)
  readonly templates$ = toObservable(this.templates)

  readonly columnFilterDataRows = computed(() => {
    const filters = this.stateService.filters()
    const columns = this.stateService.availableColumns()

    const columnIds = columns.map((c: DataTableColumn) => c.id)
    return filters
      .map((f: Filter) => {
        const filterColumn = this.getColumnForFilter(f, columns)
        if (!filterColumn) return undefined
        return {
          id: `${f.columnId}-${f.value}`,
          column: filterColumn.nameKey,
          value: f.value,
          valueColumnId: filterColumn.id,
        } satisfies FilterViewRowDetailData
      })
      .filter((v: FilterViewRowDetailData | undefined): v is FilterViewRowDetailData => v !== undefined)
      .slice()
      .sort(
        (a: FilterViewRowDetailData, b: FilterViewRowDetailData) =>
          columnIds.indexOf(a.valueColumnId) - columnIds.indexOf(b.valueColumnId)
      )
  })

  chipTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  tableTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined

  private readonly chipIdSuffix: Array<string> = ['IdFilterChip', 'IdTableFilterCell', 'IdTableCell']
  private readonly chipTemplateNames: Record<ColumnType, Array<string>> = {
    [ColumnType.DATE]: ['dateFilterChipValue', 'dateTableFilterCell', 'dateTableCell', 'defaultDateValue'],
    [ColumnType.NUMBER]: ['numberFilterChipValue', 'numberTableFilterCell', 'numberTableCell', 'defaultNumberValue'],
    [ColumnType.RELATIVE_DATE]: [
      'relativeDateFilterChipValue',
      'relativeDateTableFilterCell',
      'relativeDateTableCell',
      'defaultRelativeDateValue',
    ],
    [ColumnType.TRANSLATION_KEY]: [
      'translationKeyFilterChipValue',
      'translationKeyTableFilterCell',
      'translationKeyTableCell',
      'defaultTranslationKeyValue',
    ],
    [ColumnType.STRING]: ['stringFilterChipValue', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  private readonly chipTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  private readonly tableIdSuffix: Array<string> = ['IdFilterViewCell', 'IdTableFilterCell', 'IdTableCell']
  private readonly tableTemplateNames: Record<ColumnType, Array<string>> = {
    [ColumnType.DATE]: ['dateFilterViewCell', 'dateTableFilterCell', 'dateTableCell', 'defaultDateValue'],
    [ColumnType.NUMBER]: ['numberFilterViewCell', 'numberTableFilterCell', 'numberTableCell', 'defaultNumberValue'],
    [ColumnType.RELATIVE_DATE]: [
      'relativeDateFilterViewCell',
      'relativeDateTableFilterCell',
      'relativeDateTableCell',
      'defaultRelativeDateValue',
    ],
    [ColumnType.TRANSLATION_KEY]: [
      'translationKey',
      'translationKeyTableFilterCell',
      'translationKeyTableCell',
      'defaultTranslationKeyValue',
    ],
    [ColumnType.STRING]: ['stringFilterViewCell', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  private readonly tableTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  constructor() {    
    effect(() => {
      const t = this.templates()

      t?.forEach((item) => {
        switch (item.getType()) {
          case 'filterViewNoSelection':
            this.filterViewNoSelection.set(item.template)
            break
          case 'filterViewChipContent':
            this.filterViewChipContent.set(item.template)
            break
          case 'filterViewShowMoreChip':
            this.filterViewShowMoreChip.set(item.template)
            break
        }
      })
    })

    effect(() => {
      const cols = this.stateService.availableColumns()
      const columnFilterTableColumns = this.columnFilterTableColumns()

      const chipObs = cols.map((c) =>
        this.getTemplate(c, this.chipTemplateNames, this.chipTemplates, this.chipIdSuffix)
      )
      this.chipTemplates$ = chipObs.length
        ? combineLatest(chipObs).pipe(map((values) => Object.fromEntries(cols.map((c, i) => [c.id, values[i]]))))
        : undefined

      const tableTemplateColumns = cols.concat(columnFilterTableColumns)
      const tableObs = tableTemplateColumns.map((c) =>
        this.getTemplate(c, this.tableTemplateNames, this.tableTemplates, this.tableIdSuffix)
      )
      this.tableTemplates$ = tableObs.length
        ? combineLatest(tableObs).pipe(
            map((values) => Object.fromEntries(tableTemplateColumns.map((c, i) => [c.id, values[i]])))
          )
        : undefined
    })

    effect(() => {
      const filters = this.stateService.filters()
      this.filtered.emit(filters)
      this.componentStateChanged.emit({ filters })
      this.annouceFilterCount()
    })
  }

  getTemplate(
    column: DataTableColumn,
    templateNames: Record<ColumnType, Array<string>>,
    templates: Record<string, Observable<TemplateRef<any> | null>>,
    idSuffix: Array<string>
  ): Observable<TemplateRef<any> | null> {
    if (!templates[column.id]) {
      templates[column.id] = combineLatest([this.defaultTemplates$, this.templates$]).pipe(
        map(([dt, t]) => {
          const allTemplates = [...(dt ?? []), ...(t ?? [])]
          const columnTemplate = findTemplate(
            allTemplates,
            idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return findTemplate(allTemplates, templateNames[column.columnType])?.template ?? null
        }),
        debounceTime(50)
      )
    }

    return templates[column.id]
  }

  onResetFilersClick() {
    this.stateService.filters.set([])
  }

  onChipRemove(filter: Filter) {
    const filters = this.stateService.filters().filter((f) => f.value !== filter.value)
    this.stateService.filters.set(filters)
  }

  onFilterDelete(row: Row) {
    const filters = this.stateService.filters().filter((f) => !(f.columnId === row['valueColumnId'] && f.value === row['value']))
    this.stateService.filters.set(filters)
  }

  /**
   * Opens the "Add Filter" dialog. Only columns whose {@link DataTableColumn.filterable}
   * flag is set are offered to the dialog - the same single source of truth the
   * Table mode uses for its column header filters - so a column can be filtered
   * here (List / Grid views) if and only if it is also filterable in the Table
   * view. If no column is filterable the dialog is not opened at all.
   */
  onAddFilter(columnId?: string, event?: Event) {
    const columns = this.filterableColumns()
    if (columns.length === 0) {
      return
    }

    // The element that opened the dialog (the add-filter chip or the manage-panel
    // button). Captured synchronously while the click/keydown is being dispatched so
    // that the PortalDialogService can return keyboard focus to it when the dialog
    // closes (it only does so when an initiatorRef and onCloseFocus: 'initiator'
    // are supplied).
    const initiatorRef = (event?.currentTarget ?? undefined) as HTMLElement | undefined

    // The PortalDialogService translates the title itself but treats closeAriaLabel as a
    // plain string, so resolve the translated label before opening the dialog.
    void firstValueFrom(this.translateService.get('OCX_FILTER_VIEW.ADD_FILTER.DIALOG.ARIA_CLOSE_LABEL')).then(
      (closeAriaLabel) => {
        this.portalDialogService
          .openDialog<Filter[]>(
            'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.TITLE',
            {
              type: AddFilterDialogComponent,
              inputs: {
                columns,
                data: this.stateService.data(),
                existingFilters: this.stateService.filters(),
                preselectColumnId: columnId,
              },
            },
            'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CONFIRM_BUTTON',
            'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CANCEL_BUTTON',
            {
              closeAriaLabel,
              // Keep the dialog readable with long column names and value labels, while
              // capping it to the viewport so it never overflows narrow/mobile screens.
              width: 'min(350px, 90vw)',
              // Return keyboard focus to the originating control once the dialog closes.
              initiatorRef,
              onCloseFocus: 'initiator',
            }
          )
          .subscribe((state) => {
            // Only the primary (confirm) button applies the filters. Closing via the
            // secondary (cancel) button, the X button or Escape must not apply the
            // dialog's result - the dialog pre-selects the column's existing values,
            // so its result is non-empty even when the user changed nothing.
            if (state?.button === 'primary' && state.result && state.result.length > 0) {
              this.applyFilters(state.result)
            }
          })
      }
    )
  }

  /**
   * Applies the filters produced by the Add Filter dialog. The dialog always
   * edits the value set of a single column and pre-selects that column's
   * existing filters in its value selector, so the produced filters are the
   * column's complete, updated set - the column's previous filters are
   * replaced outright. This mirrors the multi-select column header filter in
   * the Table mode, which likewise replaces a column's whole filter set.
   */
  applyFilters(newFilters: Filter[]) {
    const currentFilters = this.stateService.filters()
    const editedColumns = new Set(newFilters.map((f) => f.columnId))

    this.stateService.filters.set([
      ...currentFilters.filter((f) => !editedColumns.has(f.columnId)),
      ...newFilters,
    ])
  }

  focusTrigger() {
    const trigger = this.trigger()
    const manageButton = this.manageButton()
    if (trigger?.id === 'ocxFilterViewShowMore') {
      trigger.focus()
      return
    }

    manageButton?.el.nativeElement.firstChild.focus()
  }

  showPanel(event: any) {
    this.trigger.set(event.srcElement)
    this.panel()?.toggle(event)
  }

  getColumnForFilter(filter: Filter, columns: DataTableColumn[]) {
    return columns.find((c) => c.id === filter.columnId)
  }

  getColumn(colId: string, columns: DataTableColumn[]) {
    return columns.find((c) => c.id === colId)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromFiterData(filter: Filter): Record<string, unknown> {
    return {
      [filter.columnId]: filter.value,
    }
  }

  getRowForValueColumn(row: Row): Row {
    return {
      id: row.id,
      [row['valueColumnId'] as string]: row['value'],
    }
  }

  private annouceFilterCount() {
    const currentCount = this.stateService.filters()?.length ?? 0

    if (currentCount === 0) {
      firstValueFrom(this.translateService.get('OCX_FILTER_VIEW.NO_FILTERS')).then(
        (translatedText: string) => {
          this.liveAnnouncer.announce(translatedText)
        }
      )
      return
    }

    firstValueFrom(this.translateService.get('OCX_FILTER_VIEW.SELECTED_FILTERS_COUNT', { results: currentCount })).then(
      (translatedText: string) => {
        this.liveAnnouncer.announce(translatedText)
      }
    )
  }
}
