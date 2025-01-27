import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { Filter, FilterType } from '../../model/filter.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { BehaviorSubject, Observable, combineLatest, debounceTime, map } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { PrimeTemplate } from 'primeng/api'
import { findTemplate } from '../../utils/template.utils'
import { ObjectUtils } from '../../utils/objectutils'
import { limit } from '../../utils/filter.utils'
import { OverlayPanel } from 'primeng/overlaypanel'
import { Row } from '../data-table/data-table.component'
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
  selector: 'ocx-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss'],
})
export class FilterViewComponent implements OnInit {
  ColumnType = ColumnType
  FilterType = FilterType
  filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this.filters$.getValue()
  }
  set filters(value: Filter[]) {
    this.filters$.next(value)
  }
  columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this.columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this.columns$.next(value)
    const chipObs = value.map((c) => this.getTemplate(c, this.chipTemplateNames, this.chipTemplates, this.chipIdSuffix))
    this.chipTemplates$ = combineLatest(chipObs).pipe(
      map((values) => Object.fromEntries(value.map((c, i) => [c.id, values[i]])))
    )

    const tableTemplateColumns = value.concat(this.columnFilterTableColumns)
    this.tableTemplates$ = combineLatest(
      tableTemplateColumns.map((c) =>
        this.getTemplate(c, this.tableTemplateNames, this.tableTemplates, this.tableIdSuffix)
      )
    ).pipe(map((values) => Object.fromEntries(tableTemplateColumns.map((c, i) => [c.id, values[i]]))))
  }

  columnFilterDataRows$: Observable<FilterViewRowDisplayData[]> | undefined

  @Input() displayMode: FilterViewDisplayMode = 'button'
  @Input() selectDisplayedChips: (filters: Filter[], columns: DataTableColumn[]) => Filter[] = (filters) =>
    limit(filters, 3, { reverse: true })
  @Input() chipStyleClass = ''
  @Input() tableStyle: { [klass: string]: any } = { 'max-height': '50vh' }
  @Input() panelStyle: { [klass: string]: any } = { 'max-width': '90%' }

  @Output() filtered: EventEmitter<Filter[]> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<FilterViewComponentState> = new EventEmitter()

  columnFilterTableColumns: DataTableColumn[] = [
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
  ]

  ngOnInit(): void {
    this.columnFilterDataRows$ = combineLatest([this.filters$, this.columns$]).pipe(
      map(([filters, columns]) => {
        const columnIds = columns.map((c) => c.id)
        return filters
          .map((f) => {
            const filterColumn = this.getColumnForFilter(f, columns)
            if (!filterColumn) return undefined
            return {
              id: `${f.columnId}-${f.value}`,
              column: filterColumn.nameKey,
              value: f.value,
              valueColumnId: filterColumn.id,
            } satisfies FilterViewRowDetailData
          })
          .filter((v): v is FilterViewRowDetailData => v !== undefined)
          .slice()
          .sort((a, b) => columnIds.indexOf(a.valueColumnId) - columnIds.indexOf(b.valueColumnId))
      })
    )
    this.componentStateChanged.emit({
      filters: this.filters,
    })
  }

  @ViewChild(OverlayPanel) panel!: OverlayPanel
  @ViewChild('manageButton') manageButton!: Button
  trigger: HTMLElement | undefined

  fitlerViewNoSelection: TemplateRef<any> | undefined
  get _fitlerViewNoSelection(): TemplateRef<any> | undefined {
    return this.fitlerViewNoSelection
  }

  filterViewChipContent: TemplateRef<any> | undefined
  get _filterViewChipContent(): TemplateRef<any> | undefined {
    return this.filterViewChipContent
  }

  filterViewShowMoreChip: TemplateRef<any> | undefined
  get _filterViewShowMoreChip(): TemplateRef<any> | undefined {
    return this.filterViewShowMoreChip
  }

  defaultTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | undefined
  >(undefined)
  @ViewChildren(PrimeTemplate)
  set defaultTemplates(value: QueryList<PrimeTemplate> | undefined) {
    this.defaultTemplates$.next(value)
  }

  parentTemplates$: BehaviorSubject<QueryList<PrimeTemplate> | null | undefined> = new BehaviorSubject<
    QueryList<PrimeTemplate> | null | undefined
  >(undefined)
  @Input()
  set templates(value: QueryList<PrimeTemplate> | null | undefined) {
    this.parentTemplates$.next(value)
    value?.forEach((item) => {
      switch (item.getType()) {
        case 'fitlerViewNoSelection':
          this.fitlerViewNoSelection = item.template
          break
        case 'filterViewChipContent':
          this.filterViewChipContent = item.template
          break
        case 'filterViewShowMoreChip':
          this.filterViewShowMoreChip = item.template
          break
      }
    })
  }

  chipTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined
  tableTemplates$: Observable<Record<string, TemplateRef<any> | null>> | undefined

  chipIdSuffix: Array<string> = ['IdFilterChip', 'IdTableFilterCell', 'IdTableCell']
  chipTemplateNames: Record<ColumnType, Array<string>> = {
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
    [ColumnType.CUSTOM]: ['customFilterChipValue', 'customTableFilterCell', 'customTableCell', 'defaultCustomValue'],
    [ColumnType.STRING]: ['stringFilterChipValue', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  chipTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  tableIdSuffix: Array<string> = ['IdFilterViewCell', 'IdTableFilterCell', 'IdTableCell']
  tableTemplateNames: Record<ColumnType, Array<string>> = {
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
    [ColumnType.CUSTOM]: ['customFilterViewCell', 'customTableFilterCell', 'customTableCell', 'defaultCustomValue'],
    [ColumnType.STRING]: ['stringFilterViewCell', 'stringTableFilterCell', 'stringTableCell', 'defaultStringValue'],
  }
  tableTemplates: Record<string, Observable<TemplateRef<any> | null>> = {}

  getTemplate(
    column: DataTableColumn,
    templateNames: Record<ColumnType, Array<string>>,
    templates: Record<string, Observable<TemplateRef<any> | null>>,
    idSuffix: Array<string>
  ): Observable<TemplateRef<any> | null> {
    if (!templates[column.id]) {
      templates[column.id] = combineLatest([this.defaultTemplates$, this.parentTemplates$]).pipe(
        map(([dt, t]) => {
          const templates = [...(dt ?? []), ...(t ?? [])]
          const columnTemplate = findTemplate(
            templates,
            idSuffix.map((suffix) => column.id + suffix)
          )?.template
          if (columnTemplate) {
            return columnTemplate
          }
          return findTemplate(templates, templateNames[column.columnType])?.template ?? null
        }),
        debounceTime(50)
      )
    }
    return templates[column.id]
  }

  onResetFilersClick() {
    this.filters = []
    this.filtered.emit([])
    this.componentStateChanged.emit({
      filters: [],
    })
  }

  onChipRemove(filter: Filter) {
    const filters = this.filters.filter((f) => f.value !== filter.value)
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  onFilterDelete(row: Row) {
    const filters = this.filters.filter((f) => !(f.columnId === row['valueColumnId'] && f.value === row['value']))
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  focusTrigger() {
    if (this.trigger?.id === 'ocxFilterViewShowMore') {
      this.trigger?.focus()
    } else {
      this.manageButton.el.nativeElement.firstChild.focus()
    }
  }

  showPanel(event: any) {
    this.trigger = event.srcElement
    this.panel.toggle(event)
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

  getRowObjectFromFiterData(filter: Filter) {
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
