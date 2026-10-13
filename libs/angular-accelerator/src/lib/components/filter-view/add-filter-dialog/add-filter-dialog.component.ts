import { CommonModule } from '@angular/common'
import { Component, LOCALE_ID, computed, effect, inject, input, linkedSignal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Observable, Subject, map, of, switchMap } from 'rxjs'
import { SelectItem } from '@openng/optimus-ui/api'
import { MultiSelectModule } from '@openng/optimus-ui/multiselect'
import { SelectModule } from '@openng/optimus-ui/select'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { ColumnType } from '../../../model/column-type.model'
import { Filter, FilterType } from '../../../model/filter.model'
import { RowListGridData } from '../../../model/row-list-grid-data.model'
import {
  buildColumnFilters,
  formatFilterValueLabel,
  getExistingFilterValues,
  getFilterOptionValues,
} from '../../../utils/filter.utils'
import { DialogPrimaryButtonDisabled, DialogResult } from '../../../services/portal-dialog.service'

/**
 * Content component of the Filter View "Add filter" dialog, opened through the
 * {@link PortalDialogService}. The caller passes the columns that may be filtered;
 * the user picks one column and its values, which are returned as {@link Filter}s
 * through {@link DialogResult}.
 *
 * `EQUALS` (or unset) columns offer their distinct cell values, `IS_NOT_EMPTY`
 * columns the fixed yes/no options. The confirm button is disabled until at least
 * one value is selected (see {@link DialogPrimaryButtonDisabled}).
 */
@Component({
  selector: 'ocx-add-filter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MultiSelectModule, SelectModule],
  templateUrl: './add-filter-dialog.component.html',
})
export class AddFilterDialogComponent implements DialogResult<Filter[]>, DialogPrimaryButtonDisabled {
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  readonly columns = input<DataTableColumn[]>([])
  readonly data = input<RowListGridData[]>([])
  readonly existingFilters = input<Filter[]>([])
  readonly preselectColumnId = input<string | undefined>(undefined)

  dialogResult: Filter[] = []

  readonly primaryButtonEnabled = new Subject<boolean>()

  readonly selectedColumnId = linkedSignal<{ columns: DataTableColumn[]; preselectId?: string }, string | null>({
    source: () => ({ columns: this.columns(), preselectId: this.preselectColumnId() }),
    computation: ({ columns, preselectId }, previous) => {
      if (previous?.value && columns.some((column) => column.id === previous.value)) {
        return previous.value
      }
      return columns.find((column) => column.id === preselectId)?.id ?? columns[0]?.id ?? null
    },
  })

  readonly column = computed<DataTableColumn | null>(
    () => this.columns().find((column) => column.id === this.selectedColumnId()) ?? null
  )

  readonly selectedValues = linkedSignal<unknown[]>(() => {
    const column = this.column()
    return column ? getExistingFilterValues(column, this.existingFilters()) : []
  })

  readonly columnOptions$: Observable<SelectItem[]> = toObservable(this.columns).pipe(
    switchMap((columns) =>
      this.translateService
        .get(columns.map((column) => column.nameKey))
        .pipe(
          map((translations) =>
            columns.map((column) => this.toSelectItem(translations[column.nameKey] || column.nameKey, column.id))
          )
        )
    )
  )

  readonly valueOptions$: Observable<SelectItem[] | undefined> = toObservable(
    computed(() => ({ column: this.column(), data: this.data(), existingFilters: this.existingFilters() }))
  ).pipe(
    switchMap(({ column, data, existingFilters }) => {
      if (!column) {
        return of(undefined)
      }
      if (column.filterType === FilterType.IS_NOT_EMPTY) {
        return this.getYesNoOptions$()
      }
      return this.getValueOptions$(column, getFilterOptionValues(column, data, existingFilters))
    })
  )

  constructor() {
    effect(() => {
      const column = this.column()
      const values = this.selectedValues()
      this.dialogResult = column ? buildColumnFilters(column, values) : []
      this.primaryButtonEnabled.next(this.dialogResult.length > 0)
    })
  }

  onColumnChange(columnId: string | null) {
    this.selectedColumnId.set(columnId)
  }

  private toSelectItem(label: string, value: unknown): SelectItem {
    return { label, value, toFilterBy: label } as SelectItem
  }

  private getYesNoOptions$(): Observable<SelectItem[]> {
    return this.translateService
      .get(['OCX_FILTER_VIEW.FILTER_YES', 'OCX_FILTER_VIEW.FILTER_NO'])
      .pipe(
        map((translations) => [
          this.toSelectItem(translations['OCX_FILTER_VIEW.FILTER_YES'], true),
          this.toSelectItem(translations['OCX_FILTER_VIEW.FILTER_NO'], false),
        ])
      )
  }

  private getValueOptions$(column: DataTableColumn, values: unknown[]): Observable<SelectItem[]> {
    if (column.columnType !== ColumnType.TRANSLATION_KEY) {
      return of(values.map((value) => this.toSelectItem(formatFilterValueLabel(column, value, this.locale), value)))
    }
    return this.translateService
      .get(values.map((value) => String(value)))
      .pipe(map((translations) => values.map((value) => this.toSelectItem(translations[String(value)] || String(value), value))))
  }
}
