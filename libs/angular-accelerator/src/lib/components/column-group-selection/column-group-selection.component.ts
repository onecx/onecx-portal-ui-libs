import { Component, computed, effect, inject, Input, input, OnInit, output } from '@angular/core'
import { DataTableColumn } from '../../model/data-table-column.model'
import { DataViewStateService } from '../../services/data-view-state.service'

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
  readonly stateService = inject(DataViewStateService)

  @Input()
  set selectedGroupKey(value: string) {
    this.stateService.activeColumnGroupKey.set(value)
  }

  @Input()
  set columns(value: DataTableColumn[]) {
    this.stateService.availableColumns.set(value)
  }

  readonly placeholderKey = input<string>('')
  readonly defaultGroupKey = input<string>('')
  readonly customGroupKey = input<string>('')

  readonly groupSelectionChanged = output<GroupSelectionChangedEvent>()
  readonly componentStateChanged = output<ColumnGroupSelectionComponentState>()

  readonly allGroupKeys = computed<string[]>(() => {
    const columns = this.stateService.availableColumns()
    const selectedGroupKey = this.stateService.activeColumnGroupKey()
    const defaultGroupKey = this.defaultGroupKey()

    return columns
      .flatMap((c) => c.predefinedGroupKeys || [])
      .concat([defaultGroupKey])
      .concat(selectedGroupKey ? [selectedGroupKey] : [])
      .filter((value) => !!value)
      .filter((value, index, self) => self.indexOf(value) === index && value != null)
  })

  constructor() {
    effect(() => {
      const selected = this.stateService.activeColumnGroupKey()
      const custom = this.customGroupKey()

      if (selected === custom) {
        this.componentStateChanged.emit({
          activeColumnGroupKey: selected,
        })
      }
    })
  }

  ngOnInit() {
    const selected = this.stateService.activeColumnGroupKey()

    if (selected === this.customGroupKey()) {
      this.componentStateChanged.emit({
        activeColumnGroupKey: selected,
      })
      return
    }

    const activeColumns = this.stateService.availableColumns().filter((c) => c.predefinedGroupKeys?.includes(selected ?? this.defaultGroupKey()))
    
    this.componentStateChanged.emit({
      activeColumnGroupKey: selected,
      displayedColumns: activeColumns,
    })
  }

  changeGroupSelection(event: { value: string }) {
    if (event.value === this.customGroupKey()) {
      return
    }

    this.stateService.activeColumnGroupKey.set(event.value)

    const activeColumns = this.stateService.availableColumns().filter((c) => c.predefinedGroupKeys?.includes(event.value))

    this.groupSelectionChanged.emit({ activeColumns, groupKey: event.value })
    this.componentStateChanged.emit({
      activeColumnGroupKey: event.value,
      displayedColumns: activeColumns,
    })
  }
}
