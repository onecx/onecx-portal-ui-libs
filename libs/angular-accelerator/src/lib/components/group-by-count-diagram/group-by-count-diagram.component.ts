import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DiagramColumn } from '../../model/diagram-column'
import { ObjectUtils } from '../../utils/objectutils'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'

export interface GroupByCountDiagramComponentState {
  activeDiagramType?: DiagramType
}

@Component({
  selector: 'ocx-group-by-count-diagram',
  templateUrl: './group-by-count-diagram.component.html',
})
export class GroupByCountDiagramComponent implements OnInit {
  @Input() sumKey = 'SEARCH.SUMMARY_TITLE'
  @Input() diagramType = DiagramType.PIE
  /**
   * @deprecated Will be replaced by diagramType
   */
  @Input()
  get type(): DiagramType {
    return this.diagramType
  }
  set type(value: DiagramType) {
    this.diagramType = value
  }
  @Input() supportedDiagramTypes: DiagramType[] = []
  private _data$ = new BehaviorSubject<unknown[]>([])
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

  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<GroupByCountDiagramComponentState> = new EventEmitter()

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.diagramData$ = combineLatest([this._data$, this._columnField$, this._columnType$]).pipe(
      mergeMap(([data, columnField, columnType]) => {
        const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField))
        const occurrences = columnData.reduce((acc, current) => {
          return acc.some((e: { label: any }) => e.label === current)
            ? (acc.find((e: { label: any }) => e.label === current).value++, acc)
            : [...acc, { label: current, value: 1 }]
        }, [])
        if (columnType === ColumnType.TRANSLATION_KEY && occurrences.length > 0) {
          return this.translateService.get(occurrences.map((o: { label: any }) => o.label)).pipe(
            map((translations: { [x: string]: any }) =>
              occurrences.map((o: { label: string; value: any }) => ({
                label: translations[o.label],
                value: o.value,
              }))
            )
          )
        } else {
          return of(occurrences)
        }
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
      activeDiagramType: newDiagramType
    })
  }
}
