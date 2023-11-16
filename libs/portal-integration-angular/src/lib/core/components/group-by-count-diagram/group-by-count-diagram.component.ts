import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ColumnType } from '../../../model/column-type.model'
import { DiagramColumn } from '../../../model/diagram-column'
import { ObjectUtils } from '../../utils/objectutils'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { DiagramData } from '../../../model/diagram-data'

@Component({
  selector: 'ocx-group-by-count-diagram',
  templateUrl: './group-by-count-diagram.component.html',
})
export class GroupByCountDiagramComponent implements OnInit {
  @Input() sumKey = 'SEARCH.SUMMARY_TITLE'
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

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.diagramData$ = combineLatest([this._data$, this._columnField$, this._columnType$]).pipe(
      mergeMap(([data, columnField, columnType]) => {
        const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField))
        const occurences = columnData.reduce((acc, current) => {
          return acc.some((e: { label: any }) => e.label === current)
            ? (acc.find((e: { label: any }) => e.label === current).value++, acc)
            : [...acc, { label: current, value: 1 }]
        }, [])
        if (columnType === ColumnType.TRANSLATION_KEY) {
          return this.translateService
            .get(occurences.map((o: { label: any }) => o.label))
            .pipe(
              map((translations: { [x: string]: any }) =>
                occurences.map((o: { label: string; value: any }) => ({ label: translations[o.label], value: o.value }))
              )
            )
        } else {
          return of(occurences)
        }
      })
    )
  }

  dataClicked(event: any) {
    this.dataSelected.emit(event)
  }
}
