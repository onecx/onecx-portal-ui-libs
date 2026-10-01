import { Component, EventEmitter, Input, LOCALE_ID, OnInit, Output, inject, signal, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SelectModule } from 'primeng/select'
import { SelectItem } from 'primeng/api'
import { firstValueFrom } from 'rxjs'
import { DataTableColumn } from '../../model/data-table-column.model'
import { Filter, FilterType } from '../../model/filter.model'
import { Row } from '../data-table/data-table.component'
import { DialogResult, DialogPrimaryButtonDisabled } from '../../services/portal-dialog.service'
import { buildFilterColumnOptions } from '../../utils/filter-options.util'

/**
 * Result returned by {@link FilterViewAddFilterDialogComponent} when a new filter is confirmed.
 */
export interface AddFilterDialogResult {
  columnId: string
  value: unknown
  filterType?: FilterType
}

/**
 * Pop-up dialog shown by {@link FilterViewComponent} to add a new filter.
 *
 * The user first picks a column (sourced from the currently displayed, filterable columns) and then a
 * value from the distinct values that already exist in the loaded data — the same values the table's native
 * per-column filter row offers. No free-text entry is supported. For columns whose `filterType` is
 * {@link FilterType.IS_NOT_EMPTY} the value is a fixed Yes/No choice.
 *
 * The primary (Add) button stays disabled until both a column and a value have been selected.
 *
 * The dialog is displayed through {@link PortalDialogService.openDialog} and implements
 * {@link DialogResult} (to carry the chosen filter) and {@link DialogPrimaryButtonDisabled} (to gate the
 * primary button). It is intentionally layout-agnostic so it can be opened from any data view layout
 * (table, list, grid).
 *
 * See ADR `docs/adr/0001-filterview-layout-agnostic-filter-management.md` for the rationale behind the
 * "pick a displayed column, then a distinct existing value" interaction and why the table's native
 * per-column filter row is kept alongside this dialog.
 */
@Component({
  standalone: true,
  selector: 'ocx-filter-view-add-filter-dialog',
  templateUrl: './filter-view-add-filter-dialog.component.html',
  imports: [FormsModule, TranslateModule, SelectModule],
})
export class FilterViewAddFilterDialogComponent
  implements
    OnInit,
    DialogResult<AddFilterDialogResult | undefined>,
    DialogPrimaryButtonDisabled
{
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  /** Displayed, filterable columns the user may add a filter to. */
  @Input() columns: DataTableColumn[] = []
  /** Loaded data rows, used to derive the distinct values per column. */
  @Input() rows: Row[] = []
  /** Current filters, used to keep already-selected values visible in the value dropdown. */
  @Input() existingFilters: Filter[] = []

  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  dialogResult: AddFilterDialogResult | undefined

  readonly columnOptions = signal<SelectItem[]>([])
  readonly valueOptions = signal<SelectItem[]>([])
  readonly selectedColumnId = model<string | null>(null)
  readonly selectedValue = model<unknown>(null)

  ngOnInit() {
    this.columnOptions.set(
      this.columns.map((column) => ({ label: column.nameKey, value: column.id }) as SelectItem)
    )
  }

  /**
   * Handles the column selection change. Resets the chosen value and recomputes the available values for
   * the newly selected column.
   */
  onColumnChange(value: string | null) {
    this.selectedColumnId.set(value)
    this.selectedValue.set(null)
    this.valueOptions.set([])
    const column = this.columns.find((c) => c.id === value)
    if (column) {
      const columnFilters = this.existingFilters.filter((filter) => filter.columnId === column.id)
      firstValueFrom(
        buildFilterColumnOptions(column, this.rows, columnFilters, this.translateService, this.locale)
      ).then((options) => this.valueOptions.set(options))
    }
    this.updateState()
  }

  /**
   * Handles the value selection change.
   */
  onValueChange(value: unknown) {
    this.selectedValue.set(value)
    this.updateState()
  }

  private updateState() {
    const columnId = this.selectedColumnId()
    const value = this.selectedValue()
    const enabled = !!columnId && value !== null && value !== undefined
    const column = columnId ? this.columns.find((c) => c.id === columnId) : undefined

    this.dialogResult = enabled && columnId
      ? { columnId, value, filterType: column?.filterType }
      : undefined
    this.primaryButtonEnabled.next(enabled)
  }
}
