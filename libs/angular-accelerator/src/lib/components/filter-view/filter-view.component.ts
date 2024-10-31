import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { Filter, ColumnFilterData, FilterType } from '../../model/filter.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { BehaviorSubject, Observable, combineLatest, debounceTime, map } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { PrimeTemplate } from 'primeng/api'
import { findTemplate } from '../../utils/template.utils'
import { ObjectUtils } from '../../utils/objectutils'
import { limit } from '../../utils/filter.utils'
import { OverlayPanel } from 'primeng/overlaypanel'
import { Row } from '../data-table/data-table.component'

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
  _filters$ = new BehaviorSubject<Filter[]>([])
  @Input()
  get filters(): Filter[] {
    return this._filters$.getValue()
  }
  set filters(value: Filter[]) {
    this._filters$.next(value)
  }
  _columns$ = new BehaviorSubject<DataTableColumn[]>([])
  @Input()
  get columns(): DataTableColumn[] {
    return this._columns$.getValue()
  }
  set columns(value: DataTableColumn[]) {
    this._columns$.next(value)
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

  @Input() showChips: boolean = false
  @Input() selectDisplayedChips: (filters: ColumnFilterData[]) => ColumnFilterData[] = (filters) =>
    limit(filters, 3, { reverse: true })
  @Input() chipStyleClass: string = ''
  @Input() pageSize: number | undefined
  @Input() pageSizes: number[] = [5, 10, 25]
  @Input() paginator: boolean = true

  @Output() filtered: EventEmitter<Filter[]> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<FilterViewComponentState> = new EventEmitter()

  columnFilterDataRows$: BehaviorSubject<Row[]> = new BehaviorSubject<Row[]>([])
  columnFilterDataList$: BehaviorSubject<ColumnFilterData[]> = new BehaviorSubject<ColumnFilterData[]>([])

  columnFilterTableColumns: DataTableColumn[] = [
    {
      id: 'column',
      columnType: ColumnType.TRANSLATION_KEY,
      nameKey: 'OCX_FILTER_VIEW.TABLE.COLUMN_NAME',
      sortable: true,
      filterable: true,
    },
    { id: 'value', columnType: ColumnType.STRING, nameKey: 'OCX_FILTER_VIEW.TABLE.VALUE' },
  ]

  @ViewChild(OverlayPanel) panel!: OverlayPanel

  @ViewChild('chipTemplate') chipTemplate: TemplateRef<any> | undefined
  get _chipTemplate(): TemplateRef<any> | undefined {
    return this.chipTemplate
  }

  @ViewChild('tableValueTemplate') tableValueTemplate: TemplateRef<any> | undefined
  get _tableValueTemplate(): TemplateRef<any> | undefined {
    return this.tableValueTemplate
  }

  @ViewChild('filterTablePanel') filterTablePanel: TemplateRef<any> | undefined
  get _filterTablePanel(): TemplateRef<any> | undefined {
    return this.filterTablePanel
  }

  @ViewChild('truthyTemplate') truthyTemplate: TemplateRef<any> | undefined
  get _truthyTemplate(): TemplateRef<any> | undefined {
    return this.truthyTemplate
  }

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

  ngOnInit(): void {
    combineLatest([this._filters$, this._columns$])
      .pipe(
        map(([filters, columns]): ColumnFilterData[] => {
          return filters
            .map((f) => {
              return {
                column: columns.find((c) => c.id === f.columnId),
                filter: f,
              }
            })
            .filter((v): v is ColumnFilterData => !!v.column)
        })
      )
      .subscribe(this.columnFilterDataList$)

    this.columnFilterDataList$
      .pipe(
        map((data) => {
          return data.map((v) => {
            return {
              id: `${v.column.id}-${v.filter.value}`,
              columnId: v.column.id,
              column: v.column.nameKey,
              value: v.filter.value,
            }
          })
        })
      )
      .subscribe(this.columnFilterDataRows$)
  }

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

  onChipRemove(columnFilter: ColumnFilterData) {
    const filters = this.filters.filter(
      (f) => !(f.columnId === columnFilter.column.id && f.value === columnFilter.filter.value)
    )
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  onFilterDelete(row: Row) {
    const filters = this.filters.filter((f) => !(f.columnId === row['columnId'] && f.value === row['value']))
    this.filters = filters
    this.filtered.emit(filters)
    this.componentStateChanged.emit({
      filters: filters,
    })
  }

  showPanel(event: any) {
    this.panel.toggle(event)
  }

  getColumnByNameKey(nameKey: string) {
    return this.columns.find((c) => c.nameKey === nameKey)
  }

  resolveFieldData(object: any, key: any) {
    return ObjectUtils.resolveFieldData(object, key)
  }

  getRowObjectFromFiterData(columnFilter: ColumnFilterData) {
    return {
      [columnFilter.column.id]: columnFilter.filter.value,
    }
  }
}
