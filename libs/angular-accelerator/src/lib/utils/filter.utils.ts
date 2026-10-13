import { formatDate } from '@angular/common'
import { ColumnType } from '../model/column-type.model'
import { DataTableColumn } from '../model/data-table-column.model'
import { ColumnFilterDataSelectOptions, Filter, FilterType } from '../model/filter.model'
import { RowListGridData } from '../model/row-list-grid-data.model'
import { ObjectUtils } from './objectutils'

export function limit(columnFilterData: Filter[], amount: number, options: ColumnFilterDataSelectOptions): Filter[] {
  return options.reverse
    ? columnFilterData.slice(-amount, columnFilterData.length).reverse()
    : columnFilterData.slice(0, amount)
}

/** Only EQUALS (or unset) and IS_NOT_EMPTY produce filters that the client-side filtering can evaluate. */
export function isSupportedFilterType(filterType: FilterType | undefined): boolean {
  return filterType === undefined || filterType === FilterType.EQUALS || filterType === FilterType.IS_NOT_EMPTY
}

export function getFilterableColumns(columns: DataTableColumn[]): DataTableColumn[] {
  return columns.filter((column) => column.filterable && isSupportedFilterType(column.filterType))
}

export function getExistingFilterValues(column: DataTableColumn, filters: Filter[]): unknown[] {
  const filterType = column.filterType ?? FilterType.EQUALS
  return filters
    .filter((filter) => filter.columnId === column.id && (filter.filterType ?? FilterType.EQUALS) === filterType)
    .map((filter) => filter.value)
}

/**
 * Distinct, non-empty cell values of the column in first-appearance order, followed by
 * existing filter values that are absent from the rows. Values are compared by their
 * string representation, like the client-side filtering does.
 */
export function getFilterOptionValues(column: DataTableColumn, data: RowListGridData[], filters: Filter[]): unknown[] {
  const values = new Map<string, unknown>()
  for (const row of data) {
    const value = ObjectUtils.resolveFieldData(row, column.id)
    if (value !== null && value !== undefined && value !== '') {
      values.set(String(value), value)
    }
  }
  for (const value of getExistingFilterValues(column, filters)) {
    if (!values.has(String(value))) {
      values.set(String(value), value)
    }
  }
  return Array.from(values.values())
}

export function formatFilterValueLabel(column: DataTableColumn, value: unknown, locale: string): string {
  return column.columnType === ColumnType.DATE
    ? formatDate(new Date(value as string | number), column.dateFormat ?? 'medium', locale)
    : String(value)
}

export function buildColumnFilters(column: DataTableColumn, values: unknown): Filter[] {
  const filterType = column.filterType ?? FilterType.EQUALS
  return Array.isArray(values) ? values.map((value) => ({ columnId: column.id, value, filterType })) : []
}
