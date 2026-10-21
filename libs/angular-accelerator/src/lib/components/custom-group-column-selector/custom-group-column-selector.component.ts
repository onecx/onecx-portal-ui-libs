import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PickList } from 'primeng/picklist'
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
  @Input() draggableColumnGroupSelectorDialog = true
  /** Whether the column selection dialog can be resized. Defaults to true for v7 . */
  @Input() resizableColumnGroupSelectorDialog = true
  /** Whether column transfers restore both lists to the configured column order. */
  @Input() restoreColumnGroupSelectorOrder = false

  @ViewChild(PickList) pickList?: PickList

  @Output() columnSelectionChanged: EventEmitter<ColumnSelectionChangedEvent> = new EventEmitter()
  @Output() actionColumnConfigChanged: EventEmitter<ActionColumnChangedEvent> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<CustomGroupColumnSelectorComponentState> = new EventEmitter()

  hiddenColumnsModel: DataTableColumn[] = []
  displayedColumnsModel: DataTableColumn[] = []
  frozenActionColumnModel = false
  actionColumnPositionModel: 'left' | 'right' = 'right'
  visible = false

  /** Whether at least one column is selected as active. */
  get hasActiveColumns(): boolean {
    return this.displayedColumnsModel.length > 0
  }

  /** Whether active column membership or order differs from the committed selection. */
  get columnsChanged(): boolean {
    return (
      this.displayedColumnsModel.length !== this.displayedColumns.length ||
      this.displayedColumnsModel.some((column, index) => column.id !== this.displayedColumns[index]?.id)
    )
  }

  /** Whether either action-column setting differs from the committed value. */
  get actionSettingsChanged(): boolean {
    return (
      this.frozenActionColumnModel !== this.frozenActionColumn ||
      this.actionColumnPositionModel !== this.actionColumnPosition
    )
  }

  /** Save requires an active column and an actual configuration change. */
  get canSave(): boolean {
    return this.hasActiveColumns && (this.columnsChanged || this.actionSettingsChanged)
  }

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
    this.resetColumnSelection()
    this.displayedColumnsModel = [...this.displayedColumns]
    this.hiddenColumnsModel = this.columns.filter(
      (column) => !this.displayedColumnsModel.map((c) => c.id).includes(column.id)
    )
    this.frozenActionColumnModel = this.frozenActionColumn
    this.actionColumnPositionModel = this.actionColumnPosition
    this.visible = true
  }

  syncColumnModels(restoreMainOrder = false) {
    if (restoreMainOrder) {
      const activeIds = new Set(this.displayedColumnsModel.map((column) => column.id))
      const inactiveIds = new Set(this.hiddenColumnsModel.map((column) => column.id))
      const configuredColumns = this.columns
      const configuredIds = new Set(configuredColumns.map((column) => column.id))

      this.displayedColumnsModel = [
        ...configuredColumns.filter((column) => activeIds.has(column.id)),
        ...this.displayedColumnsModel.filter((column) => !configuredIds.has(column.id)),
      ]
      this.hiddenColumnsModel = [
        ...configuredColumns.filter((column) => inactiveIds.has(column.id)),
        ...this.hiddenColumnsModel.filter((column) => !configuredIds.has(column.id)),
      ]
      return
    }

    this.displayedColumnsModel = [...this.displayedColumnsModel]
    this.hiddenColumnsModel = [...this.hiddenColumnsModel]
  }

  resetColumnSelection() {
    if (!this.pickList) {
      return
    }

    this.pickList.setSelectionList(this.pickList.SOURCE_LIST, [])
    this.pickList.setSelectionList(this.pickList.TARGET_LIST, [])
    this.pickList.cd.markForCheck()
  }

  onSaveClick() {
    if (!this.canSave) {
      return
    }

    // Capture both comparisons before emitting: a synchronous parent update from the first event
    // must not suppress the second event when both parts of the configuration changed.
    const columnsChanged = this.columnsChanged
    const actionSettingsChanged = this.actionSettingsChanged
    this.visible = false

    if (columnsChanged) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel] })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel],
      })
    }

    if (actionSettingsChanged) {
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
}
