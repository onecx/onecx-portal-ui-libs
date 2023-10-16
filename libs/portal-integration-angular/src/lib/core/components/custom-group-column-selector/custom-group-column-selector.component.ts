import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableColumn } from '../../../model/data-table-column.model'

export type ColumnSelectionChangedEvent = { activeColumns: DataTableColumn[] }

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

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()

  hiddenColumnsModel: DataTableColumn[] = []
  displayedColumnsModel: DataTableColumn[] = []
  visible = false

  constructor(private translate: TranslateService) {}

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.displayedColumnsModel = [...this.displayedColumns]
    this.hiddenColumnsModel = this.columns.filter(
      (column) => !this.displayedColumnsModel.map((c) => c.id).includes(column.id)
    )
    this.visible = true
  }

  onSaveClick() {
    this.visible = false
    this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel] })
  }

  onCancelClick() {
    this.visible = false
  }
}
