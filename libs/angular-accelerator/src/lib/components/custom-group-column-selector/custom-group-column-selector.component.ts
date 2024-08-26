import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
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

@Component({
  selector: 'ocx-custom-group-column-selector',
  templateUrl: './custom-group-column-selector.component.html',
  styleUrls: ['./custom-group-column-selector.component.scss'],
})
export class CustomGroupColumnSelectorComponent implements OnInit {
  @Input() columns: DataTableColumn[] = []
  @Input() displayedColumns: DataTableColumn[] = []
  @Input() dialogTitle = ''
  @Input() openButtonTitle = ''
  @Input() saveButtonLabel = ''
  @Input() cancelButtonLabel = ''
  @Input() activeColumnsLabel = ''
  @Input() inactiveColumnsLabel = ''
  @Input() frozenActionColumn = false
  @Input() actionColumnPosition: 'left' | 'right' = 'right'

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()
  @Output() actionColumnConfigChanged: EventEmitter<ActionColumnChangedEvent> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<CustomGroupColumnSelectorComponentState> = new EventEmitter()

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

  constructor(private translate: TranslateService) {}

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
        actionColumnConfig: {
          frozen: this.frozenActionColumnModel,
          position: this.actionColumnPositionModel,
        },
        activeColumnGroupKey: undefined
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
      })
    }
  }

  onCancelClick() {
    this.visible = false
  }
}
