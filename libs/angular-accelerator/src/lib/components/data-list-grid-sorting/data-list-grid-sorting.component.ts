import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataColumnNameId } from '../../model/data-column-name-id.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { DropdownChangeEvent } from 'primeng/dropdown'

export type ListGridSort = { sortColumn: string; sortDirection: DataSortDirection }
export interface DataListGridSortingComponentState {
  sorting?: ListGridSort
}

@Component({
  selector: 'ocx-data-list-grid-sorting',
  templateUrl: './data-list-grid-sorting.component.html',
  styleUrls: ['./data-list-grid-sorting.component.scss'],
})
export class DataListGridSortingComponent implements OnInit {
  @Input() columns: DataTableColumn[] = []
  @Input() sortStates: DataSortDirection[] = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
  _sortDirection$ = new BehaviorSubject<DataSortDirection>(DataSortDirection.NONE)
  @Input()
  get sortDirection(): DataSortDirection {
    return this._sortDirection$.getValue()
  }
  set sortDirection(value: DataSortDirection) {
    this._sortDirection$.next(value)
  }
  _sortField$ = new BehaviorSubject<string>('')
  @Input()
  get sortField(): string {
    return this?._sortField$.getValue()
  }
  set sortField(value: string) {
    this._sortField$.next(value)
  }

  @Output() sortChange: EventEmitter<string> = new EventEmitter()
  @Output() sortDirectionChange: EventEmitter<DataSortDirection> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DataListGridSortingComponentState> = new EventEmitter()
  @Output() columnsChange: EventEmitter<string[]> = new EventEmitter()
  selectedSortingOption: DataColumnNameId | undefined
  dropdownOptions: DataColumnNameId[] = []

  ngOnInit(): void {
    this.columns.forEach((element) => this.dropdownOptions.push({ columnId: element.id, columnName: element.nameKey }))
    this.selectedSortingOption = this.dropdownOptions.find((e) => e.columnId === this?.sortField)
    this.emitComponentStateChange()
  }

  selectSorting(event: DropdownChangeEvent): void {
    this._sortField$.next(event.value.columnId)
    this.sortChange.emit(event.value.columnId)
    this.emitComponentStateChange()
  }
  sortDirectionChanged(): void {
    const newSortDirection = this.nextSortDirection()
    this._sortDirection$.next(newSortDirection)
    this.sortDirectionChange.emit(newSortDirection)
    this.emitComponentStateChange()
  }

  nextSortDirection() {
    return this.sortStates[(this.sortStates.indexOf(this.sortDirection) + 1) % this.sortStates.length]
  }

  emitComponentStateChange() {
    this.componentStateChanged.emit({
      sorting: {
        sortColumn: this.sortField,
        sortDirection: this.sortDirection
      }
    })
  }

  sortIcon() {
    switch (this.sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'pi-sort-amount-up'
      case DataSortDirection.DESCENDING:
        return 'pi-sort-amount-down'
      default:
        return 'pi-sort-alt'
    }
  }

  sortIconTitle() {
    return this.sortDirectionToTitle(this.sortDirection)
  }

  sortDirectionToTitle(sortDirection: DataSortDirection) {
    switch (sortDirection) {
      case DataSortDirection.ASCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.ASCENDING_TITLE'
      case DataSortDirection.DESCENDING:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DESCENDING_TITLE'
      default:
        return 'OCX_LIST_GRID_SORT.TOGGLE_BUTTON.DEFAULT_TITLE'
    }
  }
}
