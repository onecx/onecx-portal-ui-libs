import { Component, computed, inject, input } from '@angular/core'
import { DataTableColumn } from '../../model/data-table-column.model'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service';

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
export class ColumnGroupSelectionComponent {
  private stateService = inject(InteractiveDataViewService)
  readonly selectedGroupKey = this.stateService.activeColumnGroupKey

  readonly columns = input<DataTableColumn[]>([])
  readonly placeholderKey = input<string>('')
  readonly defaultGroupKey = input<string>('')
  readonly customGroupKey = input<string>('')

  readonly allGroupKeys = computed<string[]>(() => {
    const columns = this.columns()
    const selectedGroupKey = this.selectedGroupKey()
    const defaultGroupKey = this.defaultGroupKey()

    return columns
      .flatMap((c) => c.predefinedGroupKeys || [])
      .concat([defaultGroupKey])
      .concat([selectedGroupKey])
      .filter((value) => !!value)
      .filter((value, index, self) => self.indexOf(value) === index && value != null)
  })

  changeGroupSelection(event: { value: string }) {
    if (event.value === this.customGroupKey()) {
      return
    }

    const activeColumns = this.columns().filter((c) => c.predefinedGroupKeys?.includes(event.value))

    this.stateService.setActiveColumnGroupKey(event.value)
    this.stateService.setDisplayedColumns(activeColumns)
  }
}
