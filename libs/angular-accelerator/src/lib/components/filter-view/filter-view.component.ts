import {
  Component,
  computed,
  effect,
  input,
  model,
  output,
  QueryList,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core'
import { Filter, FilterType } from '../../model/filter.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import type { Observable } from 'rxjs'
import { combineLatest, debounceTime, map } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { PrimeTemplate } from 'primeng/api'
import { findTemplate } from '../../utils/template.utils'
import { ObjectUtils } from '../../utils/objectutils'
import { limit } from '../../utils/filter.utils'
import { Popover } from 'primeng/popover'
import { Row } from '../data-table/data-table.component'
import { toObservable } from '@angular/core/rxjs-interop'
import { Button } from 'primeng/button'

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
})
export class FilterViewComponent {
  ColumnType = ColumnType
  FilterType = FilterType

  readonly filters = model<Filter[]>([])
  readonly columns = model<DataTableColumn[]>([])
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

  readonly filterViewNoSelection = signal<TemplateRef<any> | undefined>(undefined)
  readonly filterViewChipContent = signal<TemplateRef<any> | undefined>(undefined)
  readonly filterViewShowMoreChip = signal<TemplateRef<any> | undefined>(undefined)

  readonly templates = input<readonly PrimeTemplate[] | null | undefined>(undefined)
  readonly templates$ = toObservable(this.templates)

  readonly columnFilterDataRows = computed(() => {
    const filters = this.filters()
    const columns = this.columns()

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

  private chipIdSuffix: Array<string> = ['IdFilterChip', 'IdTableFilterCell', 'IdTableCell']
  private chipTemplateNames: Record<ColumnType, Array<string>> = {
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
  private chipTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  private tableIdSuffix: Array<string> = ['IdFilterViewCell', 'IdTableFilterCell', 'IdTableCell']
  private tableTemplateNames: Record<ColumnType, Array<string>> = {
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
  private tableTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

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
      const cols = this.columns()
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
      const filters = this.filters()
      this.filtered.emit(filters)
      this.componentStateChanged.emit({ filters })
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
    this.filters.set([])
  }

  onChipRemove(filter: Filter) {
    const filters = this.filters().filter((f) => f.value !== filter.value)
    this.filters.set(filters)
  }

  onFilterDelete(row: Row) {
    const filters = this.filters().filter((f) => !(f.columnId === row['valueColumnId'] && f.value === row['value']))
    this.filters.set(filters)
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
}
