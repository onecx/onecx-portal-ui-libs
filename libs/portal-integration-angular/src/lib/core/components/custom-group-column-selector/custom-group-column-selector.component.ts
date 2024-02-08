import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableColumn } from '../../../model/data-table-column.model'

export type ColumnSelectionChangedEvent = { activeColumns: DataTableColumn[] }
export type ActionColumnChangedEvent = {
  stickyActionColumn: boolean
  actionColumnPosition: 'left' | 'right'
}

@Component({
  selector: 'ocx-custom-group-column-selector',
  templateUrl: './custom-group-column-selector.component.html',
  styleUrls: ['./custom-group-column-selector.component.scss'],
})
export class CustomGroupColumnSelectorComponent {
  @Input() columns: DataTableColumn[] = []
  @Input() displayedColumns: DataTableColumn[] = []
  @Input() dialogTitle = ''
  @Input() openButtonTitle = ''
  @Input() saveButtonLabel = ''
  @Input() cancelButtonLabel = ''
  @Input() activeColumnsLabel = ''
  @Input() inactiveColumnsLabel = ''
  @Input() stickyActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()
  @Output() actionColumnConfigChanged: EventEmitter<ActionColumnChangedEvent> = new EventEmitter()

  hiddenColumnsModel: DataTableColumn[] = []
  displayedColumnsModel: DataTableColumn[] = []
  stickyActionColumnModel = false
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

  stickyOptions = [
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.YES',
      value: true,
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.NO',
      value: false,
    },
  ]

  constructor(private translate: TranslateService) {}

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.displayedColumnsModel = [...this.displayedColumns]
    this.hiddenColumnsModel = this.columns.filter(
      (column) => !this.displayedColumnsModel.map((c) => c.id).includes(column.id)
    )
    this.stickyActionColumnModel = this.stickyActionColumn
    this.actionColumnPositionModel = this.actionColumnPosition
    this.visible = true
  }

  onSaveClick() {
    this.visible = false
    const colIdsBefore = this.displayedColumns.map(column => column.id).sort()
    const colIdsAfter = this.displayedColumnsModel.map(column => column.id).sort()
    if(!colIdsBefore.every((colId, i) => colId === colIdsAfter[i])) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel] })
    }
    if(this.stickyActionColumn != this.stickyActionColumnModel || this.actionColumnPosition != this.actionColumnPositionModel) {
      this.actionColumnConfigChanged.emit({
        stickyActionColumn: this.stickyActionColumnModel,
        actionColumnPosition: this.actionColumnPositionModel,
      })
    }
  }

  onCancelClick() {
    this.visible = false
  }
}
