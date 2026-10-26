import { Component, OnInit, computed, effect, input, model, output, signal, viewChild } from '@angular/core'
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
  readonly columns = input<DataTableColumn[]>([])
  readonly displayedColumns = model<DataTableColumn[]>([])
  readonly customGroupKey = input<string>('')
  readonly dialogTitle = input<string>('')
  readonly dialogTitleKey = input<string>('')
  readonly openButtonTitle = input<string>('')
  readonly openButtonTitleKey = input<string>('')
  readonly openButtonAriaLabel = input<string>('')
  readonly openButtonAriaLabelKey = input<string>('')
  readonly saveButtonLabel = input<string>('')
  readonly saveButtonLabelKey = input<string>('')
  readonly saveButtonAriaLabel = input<string>('')
  readonly saveButtonAriaLabelKey = input<string>('')
  readonly cancelButtonLabel = input<string>('')
  readonly cancelButtonLabelKey = input<string>('')
  readonly cancelButtonAriaLabel = input<string>('')
  readonly cancelButtonAriaLabelKey = input<string>('')
  readonly activeColumnsLabel = input<string>('')
  readonly activeColumnsLabelKey = input<string>('')
  readonly inactiveColumnsLabel = input<string>('')
  readonly inactiveColumnsLabelKey = input<string>('')

  readonly frozenActionColumn = input<boolean>(false)
  readonly actionColumnPosition = input<'left' | 'right'>('right')
  readonly draggableColumnGroupSelectorDialog = input<boolean>(true)
  readonly pickList = viewChild(PickList)

  /**
   * Controls whether the column selection dialog can be resized by the user.
   * Independent of {@link draggableColumnGroupSelectorDialog}.
   */
  readonly resizableColumnGroupSelectorDialog = input<boolean>(false)

  /**
   * When enabled, transfers rebuild both the active and inactive column lists in the order of
   * {@link columns} instead of appending to the target, so the active columns keep the
   * main column order. When disabled, the normal PickList transfer order is preserved.
   */
  readonly restoreColumnGroupSelectorOrder = input<boolean>(false)

  readonly hasActiveColumns = computed(() => this.displayedColumnsModel().length > 0)

  /**
   * Whether the active-column membership or order differs from the committed
   * {@link displayedColumns}. Membership and order both count.
   */
  readonly columnsChanged = computed(() => {
    const model = this.displayedColumnsModel()
    const committed = this.displayedColumns()
    return model.length !== committed.length || model.some((column, index) => column.id !== committed[index].id)
  })

  /**
   * Whether the frozen/position action-column settings differ from the committed
   * {@link frozenActionColumn} / {@link actionColumnPosition} input values.
   */
  readonly actionSettingsChanged = computed(
    () =>
      this.frozenActionColumnModel() !== this.frozenActionColumn() ||
      this.actionColumnPositionModel() !== this.actionColumnPosition()
  )

  /**
   * Whether the Save button is enabled: at least one active column and either the columns or the
   * action settings have changed. Item highlighting alone is not a change.
   */
  readonly canSave = computed(() => this.hasActiveColumns() && (this.columnsChanged() || this.actionSettingsChanged()))

  readonly columnSelectionChanged = output<ColumnSelectionChangedEvent>()
  readonly actionColumnConfigChanged = output<ActionColumnChangedEvent>()
  readonly componentStateChanged = output<CustomGroupColumnSelectorComponentState>()

  readonly hiddenColumnsModel = signal<DataTableColumn[]>([])
  readonly displayedColumnsModel = signal<DataTableColumn[]>([])
  readonly frozenActionColumnModel = signal<boolean>(false)
  readonly actionColumnPositionModel = signal<'left' | 'right'>('right')
  readonly visible = signal<boolean>(false)

  readonly alignmentOptions = signal<{ label: string; value: 'left' | 'right' }[]>([
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.LEFT',
      value: 'left',
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.RIGHT',
      value: 'right',
    },
  ])

  readonly frozenOptions = signal<{ label: string; value: boolean }[]>([
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.YES',
      value: true,
    },
    {
      label: 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.CONFIGURE_ACTION_COLUMN.NO',
      value: false,
    },
  ])

  private readonly _actionColumnState = computed(() => ({
    frozen: this.frozenActionColumn(),
    position: this.actionColumnPosition(),
  }))

  constructor() {
    effect(() => {
      this.componentStateChanged.emit({
        actionColumnConfig: this._actionColumnState(),
        displayedColumns: this.displayedColumns(),
      })
    })
  }

  ngOnInit(): void {
    this.componentStateChanged.emit({
      actionColumnConfig: this._actionColumnState(),
      displayedColumns: this.displayedColumns(),
    })
  }

  syncColumnModels(restoreMainOrder = false) {
    if (restoreMainOrder) {
      const activeIds = new Set(this.displayedColumnsModel().map((column) => column.id))
      const inactiveIds = new Set(this.hiddenColumnsModel().map((column) => column.id))
      const originalColumns = this.columns()
      const originalIds = new Set(originalColumns.map((column) => column.id))

      this.displayedColumnsModel.set([
        ...originalColumns.filter((column) => activeIds.has(column.id)),
        ...this.displayedColumnsModel().filter((column) => !originalIds.has(column.id)),
      ])
      this.hiddenColumnsModel.set([
        ...originalColumns.filter((column) => inactiveIds.has(column.id)),
        ...this.hiddenColumnsModel().filter((column) => !originalIds.has(column.id)),
      ])
      return
    }

    this.displayedColumnsModel.set([...this.displayedColumnsModel()])
    this.hiddenColumnsModel.set([...this.hiddenColumnsModel()])
  }

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.resetColumnSelection()

    this.displayedColumnsModel.set([...this.displayedColumns()])

    const displayedIds = new Set(this.displayedColumnsModel().map((c) => c.id))
    this.hiddenColumnsModel.set(this.columns().filter((column) => !displayedIds.has(column.id)))

    this.frozenActionColumnModel.set(this.frozenActionColumn())
    this.actionColumnPositionModel.set(this.actionColumnPosition())
    this.visible.set(true)
  }

  /**
   * Clears the current PickList item selection (source and target) so a stale highlight from a
   * previous opening does not persist into a reopened dialog. It does not change column membership,
   * order, action settings, or the dialog visibility.
   */
  resetColumnSelection() {
    const pickList = this.pickList()
    if (!pickList) {
      return
    }
    pickList.setSelectionList(pickList.SOURCE_LIST, [])
    pickList.setSelectionList(pickList.TARGET_LIST, [])
    pickList.cd.markForCheck()
  }

  onSaveClick() {
    if (!this.canSave()) {
      return
    }

    this.visible.set(false)

    // Capture both change checks up front so a synchronous parent update triggered by the first
    // emitted event cannot suppress the second event in a combined save.
    const columnChanged = this.columnsChanged()
    const actionSettingsChanged = this.actionSettingsChanged()

    if (columnChanged) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel()] })
      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel()],
      })
    }

    if (actionSettingsChanged) {
      this.actionColumnConfigChanged.emit({
        frozenActionColumn: this.frozenActionColumnModel(),
        actionColumnPosition: this.actionColumnPositionModel(),
      })

      this.componentStateChanged.emit({
        displayedColumns: [...this.displayedColumnsModel()],
        actionColumnConfig: {
          frozen: this.frozenActionColumnModel(),
          position: this.actionColumnPositionModel(),
        },
        activeColumnGroupKey: this.customGroupKey(),
      })
    }
  }

  onCancelClick() {
    this.visible.set(false)
  }
}
