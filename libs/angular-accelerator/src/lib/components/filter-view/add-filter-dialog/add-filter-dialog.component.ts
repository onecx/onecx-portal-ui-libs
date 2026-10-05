import { CommonModule, formatDate } from '@angular/common'
import { Component, LOCALE_ID, computed, effect, inject, input, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Subject, firstValueFrom } from 'rxjs'
import { SelectItem } from 'primeng/api'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectModule } from 'primeng/select'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { ColumnType } from '../../../model/column-type.model'
import { Filter, FilterType } from '../../../model/filter.model'
import { RowListGridData } from '../../../model/row-list-grid-data.model'
import { ObjectUtils } from '../../../utils/objectutils'
import { DialogPrimaryButtonDisabled, DialogResult } from '../../../services/portal-dialog.service'

/**
 * Content component for the Filter View "Add filter" dialog, opened through the
 * {@link PortalDialogService} (see {@link filter-view.component.ts}).
 *
 * It lets the user pick one column and one or more of the values for that column.
 * Only columns whose {@link DataTableColumn.filterable} flag is set are offered -
 * the same single source of truth the Table mode uses for its column header
 * filters - so a column can be filtered via this dialog (List / Grid views)
 * if and only if it is also filterable in the Table view.
 * The produced {@link Filter}s are exposed
 * via the {@link DialogResult} interface and are returned to the caller by the
 * PortalDialogService on confirm. Appending/replacing those filters on the
 * shared {@link DataViewStateService} is what actually filters the List, Grid
 * and Table layouts, because all of them derive their visible rows from the
 * same client-side filtering logic.
 *
 * The value options and the produced {@link FilterType} are driven by the
 * column's {@link DataTableColumn.filterType}:
 *  - `EQUALS` (or unset) shows the distinct cell values of the column and
 *    produces {@link FilterType.EQUALS} filters.
 *  - `IS_NOT_EMPTY` shows the fixed yes/no options and produces
 *    {@link FilterType.IS_NOT_EMPTY} filters whose value is a boolean, matching
 *    the column header filter in the Table mode and the client-side filtering.
 * Values are stored as-is (the raw cell value, or the yes/no boolean) so they
 * match the comparison performed by the client-side filtering. The dialog's
 * confirm button is kept disabled until at least one value is selected
 * (see {@link DialogPrimaryButtonDisabled}).
 */
@Component({
  selector: 'ocx-add-filter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MultiSelectModule, SelectModule],
  template: `
    @if (column()) {
    <div class="flex flex-column gap-3">
      <label class="block text-sm font-medium" for="ocxAddFilterColumnSelect">{{
        'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.COLUMN_LABEL' | translate
      }}</label>
      <p-select
        id="ocxAddFilterColumnSelect"
        [autofocus]="true"
        [options]="columnOptions()"
        [optionLabel]="'label'"
        [optionValue]="'value'"
        [ngModel]="selectedColumnId()"
        (ngModelChange)="onColumnChange($event)"
        [showClear]="false"
        [placeholder]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.COLUMN_PLACEHOLDER' | translate"
        [ariaLabel]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.COLUMN_ARIA_LABEL' | translate"
        appendTo="body"
        class="w-full"
      ></p-select>

      @if (valueOptions(); as values) {
      <label class="block text-sm font-medium" for="ocxAddFilterValueSelect">{{
        'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_LABEL' | translate
      }}</label>
      <p-multiSelect
        id="ocxAddFilterValueSelect"
        [options]="values"
        [optionLabel]="'label'"
        [optionValue]="'value'"
        [ngModel]="selectedValues()"
        (ngModelChange)="selectedValues.set($event)"
        [filter]="true"
        [showClear]="true"
        [maxSelectedLabels]="3"
        [resetFilterOnHide]="true"
        filterBy="toFilterBy"
        [emptyFilterMessage]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_EMPTY_MESSAGE' | translate"
        [filterPlaceHolder]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_FILTER_PLACEHOLDER' | translate"
        [placeholder]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_PLACEHOLDER' | translate"
        [ariaFilterLabel]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_FILTER_ARIA_LABEL' | translate"
        appendTo="body"
        [style]="{ 'min-width': '100%' }"
        class="w-full"
      >
        <ng-template pTemplate="header">
          <div class="p-3 border-bottom-1 surface-border">
            {{ 'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.VALUE_SELECTION_HEADER' | translate }}
          </div>
        </ng-template>
      </p-multiSelect>
      }
    </div>
    }
  `,
})
export class AddFilterDialogComponent implements DialogResult<Filter[]>, DialogPrimaryButtonDisabled {
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  readonly columns = input<DataTableColumn[]>([])
  readonly data = input<RowListGridData[]>([])
  readonly existingFilters = input<Filter[]>([])
  readonly preselectColumnId = input<string | undefined>(undefined)

  /**
   * Result captured by the PortalDialogService when a dialog button is clicked.
   * Kept in sync with the selected column and values so that confirming returns
   * the filters produced for the currently selected column.
   */
  dialogResult: Filter[] = []

  /**
   * Enables/disables the dialog's primary (confirm) button. Emitted whenever the
   * selected values change; the button is only enabled when at least one value is
   * selected, mirroring the previous inline confirm button behaviour.
   */
  readonly primaryButtonEnabled = new Subject<boolean>()

  private readonly columnInitialized = signal(false)

  readonly selectedColumnId = signal<string | null>(null)
  readonly selectedValues = signal<unknown[]>([])
  readonly valueOptions = signal<SelectItem[] | undefined>(undefined)

  /**
   * The columns offered in the column select. Only columns that are marked
   * `filterable` and whose {@link FilterType} this dialog can produce a working
   * filter for are offered - unset/EQUALS (value multiselect) and IS_NOT_EMPTY
   * (yes/no), the same types the Table renders controls for. Every other type is
   * a no-op in the client-side filtering, so offering it would produce a filter
   * that matches nothing. The column's `nameKey` is a translation key by contract
   * (see {@link DataTableColumn}), so it is translated for the display label -
   * mirroring the Table's column header - rather than shown as a raw key.
   */
  readonly columnOptions = computed<SelectItem[]>(() =>
    this.columns()
      .filter(
        (column) =>
          column.filterable &&
          (column.filterType === undefined ||
            column.filterType === FilterType.EQUALS ||
            column.filterType === FilterType.IS_NOT_EMPTY)
      )
      .map((column) => {
        const label = this.translateService.instant(column.nameKey)
        return { label, value: column.id, toFilterBy: label }
      })
  )
  readonly column = computed<DataTableColumn | null>(() => this.getColumnById(this.selectedColumnId()))

  constructor() {
    // Select a column once columns become available: the preselected one if it
    // exists, otherwise the first offered column. A preselected column that is not
    // offered (not filterable, or an unsupported filterType) is skipped.
    effect(() => {
      const offeredColumns = this.columns().filter(
        (column) =>
          column.filterable &&
          (column.filterType === undefined ||
            column.filterType === FilterType.EQUALS ||
            column.filterType === FilterType.IS_NOT_EMPTY)
      )
      if (offeredColumns.length === 0 || this.columnInitialized()) {
        return
      }
      this.columnInitialized.set(true)
      const preselect = this.preselectColumnId()
      const initialId =
        preselect && offeredColumns.some((c) => c.id === preselect) ? preselect : offeredColumns[0].id
      this.selectedColumnId.set(initialId)
    })

    // Keep the value options and the pre-selected values in sync with the
    // currently selected column and the data / existing filters.
    effect(() => {
      const id = this.selectedColumnId()
      if (!id || this.columns().length === 0) {
        return
      }
      this.refreshForColumn(id)
    })

    // Keep the captured result and the primary button state in sync with the
    // currently selected column and values, so that confirming returns the
    // filters for the selected column and the confirm button is only enabled
    // when at least one value is selected.
    effect(() => {
      const column = this.column()
      const values = this.selectedValues()
      this.dialogResult = column && values.length > 0 ? this.buildFilters(column, values) : []
      this.primaryButtonEnabled.next(values.length > 0)
    })
  }

  onColumnChange(columnId: string | null) {
    this.selectedColumnId.set(columnId)
  }

  /**
   * Builds the filters for the given column and values. The produced
   * {@link FilterType} is derived from the column (defaulting to
   * {@link FilterType.EQUALS}). Values are stored as-is (the raw cell value for
   * EQUALS columns, or the yes/no boolean for IS_NOT_EMPTY columns) so they match
   * the comparison performed by the client-side filtering.
   */
  private buildFilters(column: DataTableColumn, values: unknown[]): Filter[] {
    const filterType = column.filterType ?? FilterType.EQUALS
    return values.map((value) => ({ columnId: column.id, value, filterType }) satisfies Filter)
  }

  private getColumnById(columnId: string | null): DataTableColumn | null {
    if (!columnId) {
      return null
    }
    return this.columns().find((c) => c.id === columnId) ?? null
  }

  /**
   * Re-derives the value options and pre-selects the values already filtered on
   * the given column (that are still present in the data), delegating to the
   * column's {@link FilterType}: {@link FilterType.IS_NOT_EMPTY} columns build
   * the fixed yes/no options, all other columns the distinct cell values.
   */
  private refreshForColumn(columnId: string) {
    const column = this.getColumnById(columnId)
    if (!column) {
      this.valueOptions.set(undefined)
      this.selectedValues.set([])
      return
    }
    if (column.filterType === FilterType.IS_NOT_EMPTY) {
      this.refreshIsNotEmptyColumn(column)
      return
    }
    this.refreshValueColumn(column)
  }

  /**
   * IS_NOT_EMPTY columns offer the fixed yes/no options (a boolean value) rather
   * than the column's distinct values, mirroring the column header filter in the
   * Table mode and the boolean semantics of the client-side filtering.
   */
  private refreshIsNotEmptyColumn(column: DataTableColumn) {
    const yes = this.translateService.instant('OCX_FILTER_VIEW.FILTER_YES')
    const no = this.translateService.instant('OCX_FILTER_VIEW.FILTER_NO')
    this.valueOptions.set([
      { label: yes, value: true, toFilterBy: yes } as SelectItem,
      { label: no, value: false, toFilterBy: no } as SelectItem,
    ])
    this.selectedValues.set(this.getExistingFilterValues(column, FilterType.IS_NOT_EMPTY))
  }

  /**
   * Builds the value options from the column's distinct cell values and
   * pre-selects the values already filtered on this column (EQUALS only) so the
   * dialog behaves as an editor of the column's value set, mirroring the
   * multi-select column header filter. Every existing selection is kept selected;
   * selections that are not present in the currently loaded data are additionally
   * added as options (mirroring the Table, which appends existing filters missing
   * from the current rows) so confirming does not silently drop active filters.
   */
  private refreshValueColumn(column: DataTableColumn) {
    const rawValues = this.getColumnRawValues(column)
    const presentKeys = new Set(rawValues.map((value) => this.toComparableKey(column, value)))
    const existingValues = this.getExistingFilterValues(column, FilterType.EQUALS)
    // Existing selections absent from the loaded data (e.g. server-side paging or
    // refreshed data), kept and de-duplicated by comparable key.
    const seenMissing = new Set<string>()
    const missingValues = existingValues.filter((value) => {
      if (presentKeys.has(this.toComparableKey(column, value))) {
        return false
      }
      const key = this.toComparableKey(column, value)
      if (seenMissing.has(key)) {
        return false
      }
      seenMissing.add(key)
      return true
    })
    // Keep all existing values selected; the missing ones are offered as options
    // so they stay visible in the selector instead of being dropped on confirm.
    this.selectedValues.set(existingValues)
    this.setValueOptions(column, [...rawValues, ...missingValues])
  }

  /**
   * Sets the value options for a column whose options are its distinct values (plus
   * any existing selections not present in the loaded data).
   * {@link ColumnType.TRANSLATION_KEY} columns get their labels translated while
   * keeping the raw key as the filter value, mirroring the column header filter
   * in the Table mode.
   */
  private setValueOptions(column: DataTableColumn, optionValues: unknown[]) {
    if (column.columnType !== ColumnType.TRANSLATION_KEY) {
      this.valueOptions.set(
        optionValues.map((value) => {
          const label = this.labelForValue(column, value)
          return { label, value, toFilterBy: label } as SelectItem
        })
      )
      return
    }

    // Translate the option labels while keeping the raw key as the filter value,
    // mirroring the column header filter in the Table mode.
    this.valueOptions.set(undefined)
    Promise.all(
      optionValues.map(
        (value) =>
          new Promise<SelectItem>((resolve) => {
            firstValueFrom(this.translateService.get(value as string))
              .then((translated) => {
                const label = typeof translated === 'string' && translated !== '' ? translated : String(value)
                resolve(({ label, value, toFilterBy: label }) as SelectItem)
              })
              .catch(() => resolve(({ label: String(value), value, toFilterBy: String(value) }) as SelectItem))
          })
      )
    ).then((translatedOptions) => {
      // Guard against the column being changed while the translation resolved.
      if (this.getColumnById(this.selectedColumnId())?.id === column.id) {
        this.valueOptions.set(translatedOptions)
      }
    })
  }

  /**
   * The values of the existing filters of the given column matching the given
   * filter type; untyped filters count as {@link FilterType.EQUALS}.
   */
  private getExistingFilterValues(column: DataTableColumn, filterType: FilterType): unknown[] {
    return this.existingFilters()
      .filter((filter) => filter.columnId === column.id && (filter.filterType ?? FilterType.EQUALS) === filterType)
      .map((filter) => filter.value)
  }

  /**
   * The display label for a cell value: dates are formatted with the column's
   * date format, all other values are stringified.
   */
  private labelForValue(column: DataTableColumn, value: unknown): string {
    return column.columnType === ColumnType.DATE
      ? formatDate(new Date(value as string | number), column.dateFormat ?? 'medium', this.locale)
      : String(value)
  }

  /**
   * Raw, de-duplicated values of a column in first-appearance order.
   * Raw values are kept (e.g. the original date string) so the produced filters
   * match the string comparison used by the client-side filtering.
   */
  private getColumnRawValues(column: DataTableColumn): unknown[] {
    const seen = new Map<string, unknown>()
    for (const row of this.data()) {
      const value = ObjectUtils.resolveFieldData(row, column.id)
      if (value !== null && value !== undefined && value !== '') {
        seen.set(this.toComparableKey(column, value), value)
      }
    }
    return Array.from(seen.values())
  }

  /**
   * A stable key used to de-duplicate and test membership. Dates are keyed by
   * their timestamp and numbers by their numeric value so that visually
   * distinct values are never collapsed together.
   */
  private toComparableKey(column: DataTableColumn, value: unknown): string {
    if (column.columnType === ColumnType.DATE) {
      const date = new Date(value as string | number)
      return Number.isNaN(date.getTime()) ? String(value) : date.getTime().toString()
    }
    if (column.columnType === ColumnType.NUMBER) {
      const number = typeof value === 'number' ? value : Number(value)
      return Number.isNaN(number) ? String(value) : number.toString()
    }
    return String(value)
  }
}
