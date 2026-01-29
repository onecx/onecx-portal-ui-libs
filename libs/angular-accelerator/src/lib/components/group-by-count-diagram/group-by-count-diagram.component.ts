import { Component, EventEmitter, Input, OnInit, Output, effect, inject, input, output, signal } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable, combineLatest, map, mergeMap, of } from 'rxjs'
import { ColumnType } from '../../model/column-type.model'
import { DiagramColumn } from '../../model/diagram-column'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ObjectUtils } from '../../utils/objectutils'
import { toObservable } from '@angular/core/rxjs-interop'

export interface GroupByCountDiagramComponentState {
  activeDiagramType?: DiagramType
}

@Component({
  standalone: false,
  selector: 'ocx-group-by-count-diagram',
  templateUrl: './group-by-count-diagram.component.html',
})
export class GroupByCountDiagramComponent {
  private translateService = inject(TranslateService)

  sumKey = input<string>('SEARCH.SUMMARY_TITLE')
  diagramType = input<DiagramType>(DiagramType.PIE)
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  fillMissingColors = input<boolean>(true)
  supportedDiagramTypes = input<DiagramType[]>([])

  _effectiveData = signal<unknown[]>([])
  data = input<unknown[]>([])

  _effectiveColumnType = signal<ColumnType>(ColumnType.STRING)
  columnType = input<ColumnType>(ColumnType.STRING)

  _effectiveColumnField = signal<string>('')
  columnField = input<string>('')

  column = input<DiagramColumn>()

  _effectiveColors = signal<Record<string, string>>({})
  colors = input<Record<string, string>>({})

  dataSelected = output<any>()
  diagramTypeChanged = output<DiagramType>()
  componentStateChanged = output<GroupByCountDiagramComponentState>()

  diagramData$ = combineLatest([
    toObservable(this._effectiveData),
    toObservable(this._effectiveColumnField),
    toObservable(this._effectiveColumnType),
    toObservable(this._effectiveColors),
  ]).pipe(
    mergeMap(([data, columnField, columnType, colors]) => {
      const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField))
      const occurrences = columnData.reduce((acc, current) => {
        return acc.some((e: { label: any }) => e.label === current)
          ? (acc.find((e: { label: any }) => e.label === current).value++, acc)
          : [...acc, { label: current, value: 1, backgroundColor: colors[current.toString()] }]
      }, [])
      if (columnType === ColumnType.TRANSLATION_KEY && occurrences.length > 0) {
        return this.translateService.get(occurrences.map((o: { label: any }) => o.label)).pipe(
          map((translations: { [x: string]: any }) =>
            occurrences.map((o: { label: string; value: any; backgroundColor: string | undefined }) => ({
              label: translations[o.label],
              value: o.value,
              backgroundColor: o.backgroundColor,
            }))
          )
        )
      } else {
        return of(occurrences)
      }
    })
  )

  constructor() {
    effect(() => {
      this._effectiveData.set(this.data())
    })
    effect(() => {
      this._effectiveColumnType.set(this.columnType())
    })
    effect(() => {
      this._effectiveColumnField.set(this.columnField())
    })
    effect(() => {
      const column = this.column()
      if (column) {
        this._effectiveColumnType.set(column.columnType)
        this._effectiveColumnField.set(column.id)
      }
    })
    effect(() => {
      this._effectiveColors.set(this.colors())
    })
  }

  dataClicked(event: any) {
    this.dataSelected.emit(event)
  }

  onDiagramTypeChanged(newDiagramType: DiagramType) {
    this.diagramTypeChanged.emit(newDiagramType)
    this.componentStateChanged.emit({
      activeDiagramType: newDiagramType,
    })
  }
}
