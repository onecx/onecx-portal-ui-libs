import { Component, inject, Input, input, output, signal } from '@angular/core'
import { DataTableColumn } from '../../model/data-table-column.model'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

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
export class CustomGroupColumnSelectorComponent {
  private readonly storeService = inject(InteractiveDataViewService)

  @Input()
  get displayedColumns(): DataTableColumn[] {
    return this.storeService.displayedColumns()
  }
  set displayedColumns(value: DataTableColumn[]) {
    this.storeService.setDisplayedColumns(value)
  }

  @Input()
  get frozenActionColumn(): boolean {
    return this.storeService.ActionColumnConfigFrozen()
  }
  set frozenActionColumn(value: boolean) {
    this.storeService.setActionColumnConfig(value, this.actionColumnPosition)
  }

  @Input()
  get actionColumnPosition(): 'left' | 'right' {
    return this.storeService.ActionColumnConfigPosition()
  }
  set actionColumnPosition(value: 'left' | 'right') {
    this.storeService.setActionColumnConfig(this.frozenActionColumn, value)
  }

  readonly columns = input<DataTableColumn[]>([])
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

  readonly displayedColumnsChange = output<DataTableColumn[]>()
  readonly columnSelectionChanged = output<ColumnSelectionChangedEvent>()
  readonly actionColumnConfigChanged = output<ActionColumnChangedEvent>()

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

  onOpenCustomGroupColumnSelectionDialogClick() {
    this.displayedColumnsModel.set([...this.displayedColumns])

    const displayedIds = new Set(this.displayedColumnsModel().map((c) => c.id))
    this.hiddenColumnsModel.set(this.columns().filter((column) => !displayedIds.has(column.id)))

    this.frozenActionColumnModel.set(this.frozenActionColumn)
    this.actionColumnPositionModel.set(this.actionColumnPosition)

    this.visible.set(true)
  }

  onSaveClick() {
    this.visible.set(false)

    const before = this.displayedColumns.map((column) => column.id)
    const after = this.displayedColumnsModel().map((column) => column.id)

    if (!after.every((colId, i) => colId === before[i]) || after.length !== before.length) {
      this.columnSelectionChanged.emit({ activeColumns: [...this.displayedColumnsModel()] })

      const newColumns = [...this.displayedColumnsModel()]
      this.displayedColumns = newColumns
      this.displayedColumnsChange.emit(newColumns)
    }

    if (
      this.frozenActionColumn !== this.frozenActionColumnModel() ||
      this.actionColumnPosition !== this.actionColumnPositionModel() ||
      this.storeService.ActionColumnConfigFrozen() !== this.frozenActionColumnModel() ||
      this.storeService.ActionColumnConfigPosition() !== this.actionColumnPositionModel()
    ) {
      this.actionColumnConfigChanged.emit({
        frozenActionColumn: this.frozenActionColumnModel(),
        actionColumnPosition: this.actionColumnPositionModel(),
      })

      this.storeService.setActionColumnConfig(
        this.frozenActionColumnModel(),
        this.actionColumnPositionModel()
      )
      this.storeService.setActiveColumnGroupKey(this.customGroupKey())
    }
  }

  onCancelClick() {
    this.visible.set(false)
  }
}
