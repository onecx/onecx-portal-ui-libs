import { Component, computed, effect, input, model, output } from '@angular/core'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataColumnNameId } from '../../model/data-column-name-id.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { SelectChangeEvent } from 'primeng/select'

export type ListGridSort = { sortColumn: string; sortDirection: DataSortDirection }
export interface DataListGridSortingComponentState {
  sorting?: ListGridSort
}

@Component({
  standalone: false,
  selector: 'ocx-data-list-grid-sorting',
  templateUrl: './data-list-grid-sorting.component.html',
  styleUrls: ['./data-list-grid-sorting.component.scss'],
})
export class DataListGridSortingComponent {
  readonly columns = input<DataTableColumn[]>([])
  readonly sortStates = input<DataSortDirection[]>([DataSortDirection.ASCENDING, DataSortDirection.DESCENDING])

  readonly sortDirection = model<DataSortDirection>(DataSortDirection.NONE)
  readonly sortField = model<string>('')

  readonly sortChange = output<string>()
  readonly sortDirectionChange = output<DataSortDirection>()
  readonly componentStateChanged = output<DataListGridSortingComponentState>()
  readonly columnsChange = output<string[]>()

  readonly dropdownOptions = computed<DataColumnNameId[]>(() => {
    return this.columns()
      .filter((c) => !!c.sortable)
      .map((c) => ({ columnId: c.id, columnName: c.nameKey }))
  })

  readonly selectedSortingOption = computed<DataColumnNameId | undefined>(() => {
    const sortField = this.sortField()
    return this.dropdownOptions().find((e) => e.columnId === sortField)
  })

  constructor() {
    effect(() => {
      this.componentStateChanged.emit({
        sorting: {
          sortColumn: this.sortField(),
          sortDirection: this.sortDirection(),
        },
      })
    })
  }

  selectSorting(event: SelectChangeEvent): void {
    this.sortField.set(event.value.columnId)
    this.sortChange.emit(event.value.columnId)
  }

  sortDirectionChanged(): void {
    const newSortDirection = this.nextSortDirection()
    this.sortDirection.set(newSortDirection)
    this.sortDirectionChange.emit(newSortDirection)
  }

  nextSortDirection(): DataSortDirection {
    const states = this.sortStates()
    return states[(states.indexOf(this.sortDirection()) + 1) % states.length]
  }

  sortIcon(): string {
    switch (this.sortDirection()) {
      case DataSortDirection.ASCENDING:
        return 'pi-sort-amount-up'
      case DataSortDirection.DESCENDING:
        return 'pi-sort-amount-down'
      default:
        return 'pi-sort-alt'
    }
  }

  sortIconTitle(): string {
    return this.sortDirectionToTitle(this.nextSortDirection())
  }

  sortDirectionToTitle(sortDirection: DataSortDirection): string {
    switch (sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TOOLTIP'
      case DataSortDirection.DESCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TOOLTIP'
      default:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TOOLTIP'
    }
  }
}
