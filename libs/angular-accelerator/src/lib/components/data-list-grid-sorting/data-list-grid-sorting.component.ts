import { Component, computed, effect, inject, Input, input, output } from '@angular/core'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataColumnNameId } from '../../model/data-column-name-id.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { SelectChangeEvent } from 'primeng/select'
import { DataViewStateService } from '../../services/data-view-state.service'

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
  readonly stateService = inject(DataViewStateService)
  
  @Input()
  set columns(value: DataTableColumn[]) {
    this.stateService.columns.set(value)
  }
  
  readonly sortStates = input<DataSortDirection[]>([DataSortDirection.ASCENDING, DataSortDirection.DESCENDING])

  @Input()
  set sortDirection(value: DataSortDirection) {
    this.stateService.sortDirection.set(value)
  }

  @Input()
  set sortField(value: string) {
    this.stateService.sortColumn.set(value)
  }

  readonly sortChange = output<string>()
  readonly sortDirectionChange = output<DataSortDirection>()
  readonly componentStateChanged = output<DataListGridSortingComponentState>()
  readonly columnsChange = output<string[]>()

  readonly dropdownOptions = computed<DataColumnNameId[]>(() => {
    return this.stateService.columns()
      .filter((c) => !!c.sortable)
      .map((c) => ({ columnId: c.id, columnName: c.nameKey }))
  })

  readonly selectedSortingOption = computed<DataColumnNameId | undefined>(() => {
    const sortField = this.stateService.sortColumn()
    return this.dropdownOptions().find((e) => e.columnId === sortField)
  })

  constructor() {
    effect(() => {
      this.componentStateChanged.emit({
        sorting: {
          sortColumn: this.stateService.sortColumn(),
          sortDirection: this.stateService.sortDirection(),
        },
      })
    })
  }

  selectSorting(event: SelectChangeEvent): void {
    this.sortField = event.value.columnId
    this.sortChange.emit(event.value.columnId)
  }

  sortDirectionChanged(): void {
    const newSortDirection = this.nextSortDirection()
    this.sortDirection = newSortDirection
    this.sortDirectionChange.emit(newSortDirection)
  }

  nextSortDirection(): DataSortDirection {
    const states = this.sortStates()
    return states[(states.indexOf(this.stateService.sortDirection()) + 1) % states.length]
  }

  sortIcon(): string {
    switch (this.stateService.sortDirection()) {
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
