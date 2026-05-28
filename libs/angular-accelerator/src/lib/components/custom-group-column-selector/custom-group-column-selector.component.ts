import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableColumn } from '../../model/data-table-column.model'

export type ColumnSelectionChangedEvent = { activeColumns: DataTableColumn[] }
export type ActionColumnChangedEvent = {
  frozenActionColumn: boolean
  actionColumnPosition: 'left' | 'right'
}

export interface CustomGroupColumnSelectorComponentState {
  actionColumnConfig?: {
    frozen: boolean
    position: 'left' | 'right'
  }
  displayedColumns?: DataTableColumn[]
  activeColumnGroupKey?: string
}

enum PickListDirection {
  TO_TARGET = 'toTarget',
  TO_SOURCE = 'toSource',
}

@Component({
  standalone: false,
  selector: 'ocx-custom-group-column-selector',
  templateUrl: './custom-group-column-selector.component.html',
  styleUrls: ['./custom-group-column-selector.component.scss'],
})
export class CustomGroupColumnSelectorComponent implements OnInit {
  private translate = inject(TranslateService)

  @Input() columns: DataTableColumn[] = []
  private _displayedColumns: DataTableColumn[] = []
  @Input()
  get displayedColumns() {
    return this._displayedColumns
  }
  set displayedColumns(value: DataTableColumn[]) {
    this._displayedColumns = value
    this.componentStateChanged.emit({
      actionColumnConfig: {
        frozen: this.frozenActionColumn,
        position: this.actionColumnPosition,
      },
      displayedColumns: this._displayedColumns,
    })
  }
  @Input() customGroupKey = ''
  @Input() dialogTitle = ''
  @Input() dialogTitleKey = ''
  @Input() openButtonTitle = ''
  @Input() openButtonTitleKey = ''
  @Input() openButtonAriaLabel = ''
  @Input() openButtonAriaLabelKey = ''
  @Input() saveButtonLabel = ''
  @Input() saveButtonLabelKey = ''
  @Input() saveButtonAriaLabel = ''
  @Input() saveButtonAriaLabelKey = ''
  @Input() cancelButtonLabel = ''
  @Input() cancelButtonLabelKey = ''
  @Input() cancelButtonAriaLabel = ''
  @Input() cancelButtonAriaLabelKey = ''
  @Input() activeColumnsLabel = ''
  @Input() activeColumnsLabelKey = ''
  @Input() inactiveColumnsLabel = ''
  @Input() inactiveColumnsLabelKey = ''
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()
  @Output() actionColumnConfigChanged: EventEmitter<ActionColumnChangedEvent> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<CustomGroupColumnSelectorComponentState> = new EventEmitter()

  @ViewChild('pickList') private pickListRef: any

  hiddenColumnsModel: DataTableColumn[] = []
  displayedColumnsModel: DataTableColumn[] = []
  frozenActionColumnModel = false
  actionColumnPositionModel: 'left' | 'right' = 'right'
  visible = false
  alignmentOptions = [
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.LEFT',
      value: 'left',
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.RIGHT',
      value: 'right',
    },
  ]

  frozenOptions = [
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.YES',
      value: true,
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.NO',
      value: false,
    },
  ]

  ngOnInit(): void {
    this.componentStateChanged.emit({
      actionColumnConfig: {
        frozen: this.frozenActionColumn,
        position: this.actionColumnPosition,
      },
      displayedColumns: this.displayedColumns,
    })
  }

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.displayedColumnsModel = [...this.displayedColumns]
    this.hiddenColumnsModel = this.columns.filter(
      (column) => !this.displayedColumnsModel.map((c) => c.id).includes(column.id)
    )
    this.frozenActionColumnModel = this.frozenActionColumn
    this.actionColumnPositionModel = this.actionColumnPosition
    this.visible = true
  }

  onSaveClick() {
    this.visible = false
    const colIdsBefore = this.displayedColumns.map((column) => column.id)
    const colIdsAfter = this.displayedColumnsModel.map((column) => column.id)

    if (!colIdsAfter.every((colId, i) => colId === colIdsBefore[i]) || colIdsAfter.length != colIdsBefore.length) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel] })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel],
      })
    }

    if (
      this.frozenActionColumn != this.frozenActionColumnModel ||
      this.actionColumnPosition != this.actionColumnPositionModel
    ) {
      this.actionColumnConfigChanged.emit({
        frozenActionColumn: this.frozenActionColumnModel,
        actionColumnPosition: this.actionColumnPositionModel,
      })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel],
        actionColumnConfig: {
          frozen: this.frozenActionColumnModel,
          position: this.actionColumnPositionModel,
        },
        activeColumnGroupKey: this.customGroupKey,
      })
    }
  }

  onCancelClick() {
    this.visible = false
  }

/*
Below code is added to handle primeng picklist bugs related to move and reorder operations in columns. 
Primeng Internaly Recreates the referenced array on move and reorder operations which causes the component to lose track of the current state of source and target lists.
So only the 1st operation we perform works and after that state becomes state for our passed arguments

So we hear the events and update the state refrencing the internal state of picklist source and target lists to keep in sync with the changes happening in the picklist.
source -> displayedColumnsModel
target -> hiddenColumnsModel

NOTE: This Bug is seen on on primeng version 19 (so the patch is only for libs v6)
This doesnt not appear on primeng version 20 as they migrated  signals 
*/

  private syncFromPickListState(movedItems: DataTableColumn[] = [], direction?: PickListDirection): void {
    const source = (this.pickListRef?.source as DataTableColumn[]) ?? [...this.displayedColumnsModel]
    const target = (this.pickListRef?.target as DataTableColumn[]) ?? [...this.hiddenColumnsModel]
    
    if (direction === PickListDirection.TO_TARGET && movedItems.length > 0) {
      this.hiddenColumnsModel = this.handleDataChanges(movedItems, target)
      this.replicateStateWithoutAnyChange(source, undefined)
    } else if (direction === PickListDirection.TO_SOURCE && movedItems.length > 0) {
      this.displayedColumnsModel = this.handleDataChanges(movedItems, source)
      this.replicateStateWithoutAnyChange(undefined, target)
    } else {
      this.replicateStateWithoutAnyChange(source, target)
    }
  }

  private handleDataChanges(movedItems: DataTableColumn[], movedTo: DataTableColumn[]): DataTableColumn[] {
    const movedItemIds = new Set(movedTo.map((item) => item.id))
    const missing = movedItems.filter((item) => !movedItemIds.has(item.id))
    return missing.length > 0 ? [...movedTo, ...missing] : [...movedTo]
  }

  private replicateStateWithoutAnyChange(source?: DataTableColumn[], target?: DataTableColumn[]): void {
    if(source) { this.displayedColumnsModel = [...source] }
    if(target) { this.hiddenColumnsModel = [...target] }
  }

  onPickListMoveToTarget(event: { items: DataTableColumn[] }): void {
    this.syncFromPickListState(event.items, PickListDirection.TO_TARGET)
  }

  onPickListMoveAllToTarget(event: { items: DataTableColumn[] }): void {
    this.syncFromPickListState(event.items, PickListDirection.TO_TARGET)
  }

  onPickListMoveToSource(event: { items: DataTableColumn[] }): void {
    this.syncFromPickListState(event.items, PickListDirection.TO_SOURCE)
  }

  onPickListMoveAllToSource(event: { items: DataTableColumn[] }): void {
    this.syncFromPickListState(event.items, PickListDirection.TO_SOURCE)
  }

  onPickListSourceReorder(): void {
    this.syncFromPickListState()
  }

  onPickListTargetReorder(): void {
    this.syncFromPickListState()
  }
}
