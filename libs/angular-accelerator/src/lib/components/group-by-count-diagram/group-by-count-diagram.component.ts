import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DiagramColumn } from '../../model/diagram-column'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ObjectUtils } from '../../utils/objectutils'

export interface GroupByCountDiagramComponentState {
  activeDiagramType?: DiagramType
}

@Component({
  standalone: false,
  selector: 'ocx-group-by-count-diagram',
  templateUrl: './group-by-count-diagram.component.html',
})
export class GroupByCountDiagramComponent implements OnInit {
  private translateService = inject(TranslateService)
  private _data$ = new BehaviorSubject<unknown[]>([])
  @Input() sumKey = 'SEARCH.SUMMARY_TITLE'
  @Input() diagramType = DiagramType.PIE
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one.
   *  In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  @Input() fillMissingColors = true
  @Input() supportedDiagramTypes: DiagramType[] = [] 

  private readonly _allLabelKeys$ = new BehaviorSubject<string[]>([])
  @Input()
  get allLabelKeys(): string[] {
    return this._allLabelKeys$.getValue()
  }
  set allLabelKeys(value: string[]) {  
    this._allLabelKeys$.next(value)
  }

  private readonly _showAllLabels$ = new BehaviorSubject<boolean>(false)
  @Input()
  get showAllLabels(): boolean {
    return this._showAllLabels$.getValue()
  }
  set showAllLabels(value: boolean) {
    this._showAllLabels$.next(value)
  }
  
  @Input()
  get data(): unknown[] {
    return this._data$.getValue()
  }
  set data(value: unknown[]) {
    this._data$.next(value)
  }
  diagramData$: Observable<DiagramData[]> | undefined

  private _columnType$ = new BehaviorSubject<ColumnType>(ColumnType.STRING)
  @Input()
  get columnType(): ColumnType {
    return this._columnType$.getValue()
  }
  set columnType(value: ColumnType) {
    this._columnType$.next(value)
  }

  private _columnField$ = new BehaviorSubject<string>('')
  @Input()
  get columnField(): string {
    return this._columnField$.getValue()
  }
  set columnField(value: string) {
    this._columnField$.next(value)
  }

  @Input()
  get column(): DiagramColumn {
    return { columnType: this.columnType, id: this.columnField }
  }
  set column(value: DiagramColumn) {
    this.columnType = value.columnType
    this.columnField = value.id
  }

  private _colors$ = new BehaviorSubject<Record<string, string>>({})
  @Input()
  get colors(): Record<string, string> {
    return this._colors$.getValue()
  }
  set colors(value: Record<string, string>) {
    this._colors$.next(value)
  }

  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<GroupByCountDiagramComponentState> = new EventEmitter()

  ngOnInit(): void {
    this.diagramData$ = combineLatest([
      this._data$,
      this._columnField$,
      this._columnType$,
      this._colors$,
      this._allLabelKeys$,
      this._showAllLabels$,
    ]).pipe(
      mergeMap(([data, columnField, columnType, colors, allLabelKeys, showAllLabels]) => {
        const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField));
        let occurrences: DiagramData[] = [];

        if (showAllLabels && allLabelKeys.length > 0) {
          occurrences = allLabelKeys.map((label) => ({
            label: label,
            value: 0,
            backgroundColor: colors[label],
          }))

          columnData.forEach((current) => {
            const foundColumn = occurrences.find((e) => e.label === current);
            if (foundColumn) {
              foundColumn.value++;
            } else {
              occurrences.push({ label: current, value: 1, backgroundColor: colors[current.toString()] });
            }
          })
        } else {
          occurrences = columnData.reduce((acc, current) => {
            return acc.some((e: { label: string }) => e.label === current)
              ? (acc.find((e: { label: string }) => e.label === current).value++, acc)
              : [...acc, { label: current, value: 1, backgroundColor: colors[current.toString()] }]
          }, [])
        }

        if (columnType === ColumnType.TRANSLATION_KEY && occurrences.length > 0) {
          return this.translateService.get(occurrences.map((o) => o.label)).pipe(
            map((translations) =>
              occurrences.map((o) => ({
                label: translations[o.label],
                value: o.value,
                backgroundColor: o.backgroundColor,
              }))
            )
          )
        }
        return of(occurrences)
      })
    )
  }

  dataClicked(event: any) {
    this.dataSelected.emit(event)
  }

  onDiagramTypeChanged(newDiagramType: DiagramType) {
    this.diagramType = newDiagramType
    this.diagramTypeChanged.emit(newDiagramType)
    this.componentStateChanged.emit({
      activeDiagramType: newDiagramType,
    })
  }
}
