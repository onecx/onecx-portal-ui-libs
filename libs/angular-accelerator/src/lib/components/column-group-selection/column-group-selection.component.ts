import { Component, OnInit, computed, effect, input, model, output } from '@angular/core'
import { DataTableColumn } from '../../model/data-table-column.model'

export type GroupSelectionChangedEvent = { activeColumns: DataTableColumn[]; groupKey: string }
export interface ColumnGroupSelectionComponentState {
  activeColumnGroupKey?: string
  displayedColumns?: DataTableColumn[]
}

@Component({
  standalone: false,
  templateUrl: './column-group-selection.component.html',
  selector: 'ocx-column-group-selection',
  styleUrls: ['./column-group-selection.component.scss'],
})
export class ColumnGroupSelectionComponent implements OnInit {
  readonly selectedGroupKey = model<string>('')

  readonly columns = input<DataTableColumn[]>([])
  readonly placeholderKey = input<string>('')
  readonly defaultGroupKey = input<string>('')
  readonly customGroupKey = input<string>('')

  readonly groupSelectionChanged = output<GroupSelectionChangedEvent>()
  readonly componentStateChanged = output<ColumnGroupSelectionComponentState>()

  readonly allGroupKeys = computed<string[]>(() => {
    const columns = this.columns()
    const selectedGroupKey = this.selectedGroupKey()

    return columns
      .map((c) => c.predefinedGroupKeys || [])
      .flat()
      .concat([this.defaultGroupKey()])
      .concat([selectedGroupKey])
      .filter((value) => !!value)
      .filter((value, index, self) => self.indexOf(value) === index && value != null)
  })

  constructor() {
    effect(() => {
      const selected = this.selectedGroupKey()
      const custom = this.customGroupKey()

      if (selected === custom) {
        this.componentStateChanged.emit({
          activeColumnGroupKey: selected,
        })
      }
    })
  }

  ngOnInit() {
    const selected = this.selectedGroupKey()

    if (selected === this.customGroupKey()) {
      this.componentStateChanged.emit({
        activeColumnGroupKey: selected,
      })
      return
    }

    const activeColumns = this.columns().filter((c) =>
      c.predefinedGroupKeys?.includes(selected ?? this.defaultGroupKey())
    )

    this.componentStateChanged.emit({
      activeColumnGroupKey: selected,
      displayedColumns: activeColumns,
    })
  }

  changeGroupSelection(event: { value: string }) {
    if (event.value === this.customGroupKey()) {
      return
    }

    // keep ngModel / model() in sync (PrimeNG also updates via ngModel)
    this.selectedGroupKey.set(event.value)

    const activeColumns = this.columns().filter((c) => c.predefinedGroupKeys?.includes(event.value))

    this.groupSelectionChanged.emit({ activeColumns, groupKey: event.value })
    this.componentStateChanged.emit({
      activeColumnGroupKey: event.value,
      displayedColumns: activeColumns,
    })
  }
}
