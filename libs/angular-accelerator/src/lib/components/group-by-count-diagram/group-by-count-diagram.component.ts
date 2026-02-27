import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, map, mergeMap, of } from 'rxjs'
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
  diagramType = model<DiagramType>(DiagramType.PIE)
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one.
   *  In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  fillMissingColors = input<boolean>(true)
  supportedDiagramTypes = input<DiagramType[]>([])

  data = model<unknown[]>([])

  allLabelKeys = input<string[]>([])

  showAllLabels = input<boolean>(false)

  columnType = model<ColumnType>(ColumnType.STRING)

  columnField = model<string>('')

  column = input<DiagramColumn>()

  fullHeight = input<boolean>(false)
  
  colors = model<Record<string, string>>({})

  dataSelected = output<any>()
  diagramTypeChanged = output<DiagramType>()
  componentStateChanged = output<GroupByCountDiagramComponentState>()

  diagramData$ = combineLatest([
    toObservable(this.data),
    toObservable(this.columnField),
    toObservable(this.columnType),
    toObservable(this.colors),
    toObservable(this.allLabelKeys),
    toObservable(this.showAllLabels),
  ]).pipe(
    mergeMap(([data, columnField, columnType, colors, allLabelKeys, showAllLabels]) => {
      const columnData = data.map((d) => ObjectUtils.resolveFieldData(d, columnField))
      let occurrences: DiagramData[] = []

      if (showAllLabels && allLabelKeys.length > 0) {
        occurrences = allLabelKeys.map((label) => ({
          label: label,
          value: 0,
          backgroundColor: colors[label],
        }))

        columnData.forEach((current) => {
          const foundColumn = occurrences.find((e) => e.label === current)
          if (foundColumn) {
            foundColumn.value++
          } else {
            occurrences.push({ label: current, value: 1, backgroundColor: colors[current.toString()] })
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

  constructor() {
    effect(() => {
      const column = this.column()
      if (column) {
        this.columnType.set(column.columnType)
        this.columnField.set(column.id)
      }
    })
    effect(() => {
      this.colors.set(this.colors())
    })
  }

  dataClicked(event: any) {
    this.dataSelected.emit(event)
  }

  onDiagramTypeChanged(newDiagramType: DiagramType) {
    this.diagramType.set(newDiagramType)
    this.diagramTypeChanged.emit(newDiagramType)
    this.componentStateChanged.emit({
      activeDiagramType: newDiagramType,
    })
  }
}