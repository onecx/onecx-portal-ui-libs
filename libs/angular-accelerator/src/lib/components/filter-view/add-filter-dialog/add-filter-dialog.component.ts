import { CommonModule, formatDate } from '@angular/common'
import { Component, LOCALE_ID, computed, effect, inject, input, output, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { firstValueFrom } from 'rxjs'
import { SelectItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectModule } from 'primeng/select'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { ColumnType } from '../../../model/column-type.model'
import { Filter, FilterType } from '../../../model/filter.model'
import { RowListGridData } from '../../../model/row-list-grid-data.model'
import { ObjectUtils } from '../../../utils/objectutils'

/**
 * Standalone dialog used from the Filter View "Add filter" affordance.
 *
 * It lets the user pick one column and one or more of the distinct values that
 * column currently holds in the data, and emits the resulting {@link Filter}s on
 * confirm. Appending/replacing those filters on the shared {@link DataViewStateService}
 * is what actually filters the List, Grid and Table layouts, because all of them
 * derive their visible rows from the same client-side filtering logic.
 *
 * The emitted filters always target a single column and use {@link FilterType.EQUALS}.
 * Values are stored as-is (the raw cell value) so they match the string comparison
 * performed by the client-side filtering, exactly like the column header filter in
 * the Table mode does.
 */
@Component({
  selector: 'ocx-add-filter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonModule, DialogModule, MultiSelectModule, SelectModule],
  template: `
    <p-dialog
      id="ocxAddFilterDialog"
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      [modal]="true"
      [blockScroll]="false"
      [closeOnEscape]="true"
      [dismissableMask]="true"
      [draggable]="true"
      [style]="{ width: '26rem' }"
      [closeAriaLabel]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.ARIA_CLOSE_LABEL' | translate"
      [contentStyle]="{ padding: '1rem 1.25rem' }"
    >
      <ng-template pTemplate="header">
        <span id="ocxAddFilterDialogTitle" class="text-xl font-medium">{{
          'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.TITLE' | translate
        }}</span>
      </ng-template>

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

      <ng-template pTemplate="footer">
        <p-button
          [label]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CANCEL_BUTTON' | translate"
          styleClass="p-button-text"
          (onClick)="onVisibleChange(false)"
        ></p-button>
        <p-button
          id="ocxAddFilterDialogConfirm"
          [label]="'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CONFIRM_BUTTON' | translate"
          icon="pi pi-plus"
          iconPos="left"
          [disabled]="selectedValues().length === 0"
          (onClick)="onConfirm()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class AddFilterDialogComponent {
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  readonly visible = input<boolean>(false)
  readonly columns = input<DataTableColumn[]>([])
  readonly data = input<RowListGridData[]>([])
  readonly existingFilters = input<Filter[]>([])
  readonly preselectColumnId = input<string | undefined>(undefined)

  readonly added = output<Filter[]>()
  readonly visibleChange = output<boolean>()

  private readonly columnInitialized = signal(false)

  readonly selectedColumnId = signal<string | null>(null)
  readonly selectedValues = signal<unknown[]>([])
  readonly valueOptions = signal<SelectItem[] | undefined>(undefined)

  readonly columnOptions = computed<SelectItem[]>(() =>
    this.columns().map((column) => ({ label: column.nameKey, value: column.id, toFilterBy: column.nameKey }))
  )
  readonly column = computed<DataTableColumn | null>(() => this.getColumnById(this.selectedColumnId()))

  constructor() {
    // Select a column once columns become available: the preselected one if it
    // exists, otherwise the first available column.
    effect(() => {
      const cols = this.columns()
      if (cols.length === 0 || this.columnInitialized()) {
        return
      }
      this.columnInitialized.set(true)
      const preselect = this.preselectColumnId()
      const initialId = preselect && cols.some((c) => c.id === preselect) ? preselect : cols[0].id
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
  }

  onVisibleChange(visible: boolean) {
    this.visibleChange.emit(visible)
  }

  onColumnChange(columnId: string | null) {
    this.selectedColumnId.set(columnId)
  }

  onConfirm() {
    const column = this.column()
    const values = this.selectedValues()
    if (!column || values.length === 0) {
      return
    }
    const newFilters = values.map(
      (value) => ({ columnId: column.id, value, filterType: FilterType.EQUALS }) satisfies Filter
    )
    this.added.emit(newFilters)
    this.visibleChange.emit(false)
  }

  private getColumnById(columnId: string | null): DataTableColumn | null {
    if (!columnId) {
      return null
    }
    return this.columns().find((c) => c.id === columnId) ?? null
  }

  /**
   * Re-derives the value options and pre-selects the values already filtered on
   * the given column (that are still present in the data).
   */
  private refreshForColumn(columnId: string) {
    const column = this.getColumnById(columnId)
    if (!column) {
      this.valueOptions.set(undefined)
      this.selectedValues.set([])
      return
    }

    const rawValues = this.getColumnRawValues(column)
    const presentKeys = new Set(rawValues.map((value) => this.toComparableKey(column, value)))

    // Pre-select the values already filtered on this column (EQUALS only) so the
    // dialog behaves as an editor of the column's value set, mirroring the
    // multi-select column header filter.
    this.selectedValues.set(
      this.existingFilters()
        .filter((filter) => filter.columnId === columnId && (!filter.filterType || filter.filterType === FilterType.EQUALS))
        .map((filter) => filter.value)
        .filter((value) => presentKeys.has(this.toComparableKey(column, value)))
    )

    const isDateColumn = column.columnType === ColumnType.DATE
    const labelFor = (value: unknown) =>
      isDateColumn
        ? formatDate(new Date(value as string | number), column.dateFormat ?? 'medium', this.locale)
        : String(value)

    const baseOptions: SelectItem[] = rawValues.map(
      (value) => ({ label: labelFor(value), value, toFilterBy: labelFor(value) }) as SelectItem
    )

    if (column.columnType !== ColumnType.TRANSLATION_KEY) {
      this.valueOptions.set(baseOptions)
      return
    }

    // Translate the option labels while keeping the raw key as the filter value,
    // mirroring the column header filter in the Table mode.
    this.valueOptions.set(undefined)
    Promise.all(
      rawValues.map(
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
      if (this.getColumnById(this.selectedColumnId())?.id === columnId) {
        this.valueOptions.set(translatedOptions)
      }
    })
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
