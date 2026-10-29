import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableColumn } from '../../model/data-table-column.model'
import { PickList } from 'primeng/picklist'

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

  /**
   * Controls whether the column selection dialog can be resized by the user.
   * Independent of {@link draggableColumnGroupSelectorDialog}.
   */
  @Input() resizableColumnGroupSelectorDialog = true

  /**
   * When enabled, transfers rebuild both the active and inactive column lists in the order of
   * {@link columns} instead of appending to the target, so the active columns keep the
   * main column order. When disabled, the normal PickList transfer order is preserved.
   */
  @Input() restoreColumnGroupSelectorOrder = false

  @ViewChild(PickList) pickList?: PickList

  get hasActiveColumns(): boolean {
    return this.displayedColumnsModel.length > 0
  }

  /**
   * Whether the active-column membership or order differs from the committed
   * {@link displayedColumns}. Membership and order both count.
   */
  get columnsChanged(): boolean {
    const model = this.displayedColumnsModel
    const committed = this.displayedColumns
    return model.length !== committed.length || model.some((column, index) => column.id !== committed[index].id)
  }

  /**
   * Whether the frozen/position action-column settings differ from the committed
   * {@link frozenActionColumn} / {@link actionColumnPosition} input values.
   */
  get actionSettingsChanged(): boolean {
    return (
      this.frozenActionColumnModel !== this.frozenActionColumn || this.actionColumnPositionModel !== this.actionColumnPosition
    )
  }

  /**
   * Whether the Save button is enabled: at least one active column and either the columns or the
   * action settings have changed. Item highlighting alone is not a change.
   */
  get canSave(): boolean {
    return this.hasActiveColumns && (this.columnsChanged || this.actionSettingsChanged)
  }

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

  ngOnInit(): void {
    this.componentStateChanged.emit({
      actionColumnConfig: {
        frozen: this.frozenActionColumn,
        position: this.actionColumnPosition,
      },
      displayedColumns: this.displayedColumns,
    })
  }

  syncColumnModels(restoreMainOrder = false) {
    if (restoreMainOrder) {
      const activeIds = new Set(this.displayedColumnsModel.map((column) => column.id))
      const inactiveIds = new Set(this.hiddenColumnsModel.map((column) => column.id))
      const originalColumns = this.columns
      const originalIds = new Set(originalColumns.map((column) => column.id))

      this.displayedColumnsModel = [
        ...originalColumns.filter((column) => activeIds.has(column.id)),
        ...this.displayedColumnsModel.filter((column) => !originalIds.has(column.id)),
      ]
      this.hiddenColumnsModel = [
        ...originalColumns.filter((column) => inactiveIds.has(column.id)),
        ...this.hiddenColumnsModel.filter((column) => !originalIds.has(column.id)),
      ]
      return
    }

    this.displayedColumnsModel = [...this.displayedColumnsModel]
    this.hiddenColumnsModel = [...this.hiddenColumnsModel]
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

  /**
   * Clears the current PickList item selection (source and target) so a stale highlight from a
   * previous opening does not persist into a reopened dialog. It does not change column membership,
   * order, action settings, or the dialog visibility.
   */
  resetColumnSelection() {
    const pickList = this.pickList
    if (!pickList) {
      return
    }
    pickList.setSelectionList(pickList.SOURCE_LIST, [])
    pickList.setSelectionList(pickList.TARGET_LIST, [])
    pickList.cd.markForCheck()
  }

  onSaveClick() {
    if (!this.canSave) {
      return
    }

    this.visible = false

    // Capture both change checks up front so a synchronous parent update triggered by the first
    // emitted event cannot suppress the second event in a combined save.
    const columnChanged = this.columnsChanged
    const actionSettingsChanged = this.actionSettingsChanged

    if (columnChanged) {
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
