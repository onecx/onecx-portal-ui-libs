import { formatDate } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { Observable, map, of } from 'rxjs'
import { SelectItem } from 'primeng/api'
import { ColumnType } from '../model/column-type.model'
import { FilterType } from '../model/filter.model'
import { DataTableColumn } from '../model/data-table-column.model'
import { Row } from '../components/data-table/data-table.component'
import { ObjectUtils } from './objectutils'

/**
 * Derives the distinct values present in `rows` for a single column, mirroring the
 * {@link DataTableComponent} per-column filter derivation so the add-filter dialog offers the
 * same value options as the table's native filter row.
 *
 * - For {@link FilterType.IS_NOT_EMPTY} (truthy) columns the options are the fixed Yes/No values.
 * - For {@link ColumnType.DATE} columns values are de-duplicated by timestamp and labelled using the column's date format.
 * - For {@link ColumnType.TRANSLATION_KEY} columns values are translated before being shown.
 * - Already-selected filters for the column are always kept visible, even when the value is no longer present in the data.
 *
 * @param column the column to derive filter options for
 * @param rows the loaded data rows
 * @param filters the current filters (used to keep already-selected values visible)
 * @param translateService the translation service used for {@link ColumnType.TRANSLATION_KEY} columns
 * @param locale the locale used to format {@link ColumnType.DATE} values
 * @returns an observable of the distinct {@link SelectItem} options for the column
 */
export function buildFilterColumnOptions(
  column: DataTableColumn,
  rows: Row[],
  filters: { value: unknown }[],
  translateService: TranslateService,
  locale: string
): Observable<SelectItem[]> {
  // Truthy (IS_NOT_EMPTY) columns only ever filter on "value exists" vs "value is empty".
  if (column.filterType === FilterType.IS_NOT_EMPTY) {
    return translateService.get(['OCX_FILTER_VIEW.FILTER_YES', 'OCX_FILTER_VIEW.FILTER_NO']).pipe(
      map(
        (translated) =>
          [
            { value: true, label: translated['OCX_FILTER_VIEW.FILTER_YES'] },
            { value: false, label: translated['OCX_FILTER_VIEW.FILTER_NO'] },
          ] as SelectItem[]
      )
    )
  }

  const selectedValues = filters
    .filter((filter) => filter.value !== null && filter.value !== undefined && filter.value !== '')
    .map((filter) => filter.value)

  const rawValues = rows
    .map((row) => ObjectUtils.resolveFieldData(row, column.id))
    .filter((value) => value !== null && value !== undefined && value !== '')

  // DATE columns are de-duplicated by timestamp and labelled using the column's date format.
  if (column.columnType === ColumnType.DATE) {
    const uniqueValues = [
      ...new Map(
        rawValues.map((value) => [new Date(value as any).getTime(), value])
      ).values(),
    ]
    return of(
      uniqueValues.map(
        (value) =>
          ({
            label: formatDate(new Date(value as any), column.dateFormat ?? 'medium', locale),
            value: value,
          }) as SelectItem
      )
    )
  }

  const isTranslationKeyColumn = column.columnType === ColumnType.TRANSLATION_KEY
  const translatedKeys = rawValues.map((value) => String(value)).filter((value) => !!value)
  const translateObservable = isTranslationKeyColumn
    ? translatedKeys.length
      ? translateService.get(translatedKeys)
      : of({})
    : of(Object.fromEntries(translatedKeys.map((key) => [key, key])))

  return translateObservable.pipe(
    map((translatedValues: Record<string, string>) => {
      const byValue = new Map<unknown, SelectItem>()
      const entries: Array<[string, string]> = isTranslationKeyColumn
        ? translatedKeys.map((key) => [key, translatedValues[key] ?? key])
        : rawValues.map((value) => [String(value), String(value)])

      entries.forEach(([key, translatedValue]) => {
        byValue.set(key, { label: translatedValue, value: key })
      })

      // Keep already-selected values visible, even when the value no longer exists in the loaded data.
      selectedValues.forEach((value) => {
        const key = String(value)
        if (!byValue.has(key)) {
          byValue.set(key, { label: translatedValues[key] ?? key, value: key })
        }
      })

      return Array.from(byValue.values())
    })
  )
}
