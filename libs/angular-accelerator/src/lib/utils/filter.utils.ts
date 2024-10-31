import { ColumnFilterData, ColumnFilterDataSelectOptions } from '../model/filter.model'

export function limit(
  columnFilterData: ColumnFilterData[],
  amount: number,
  options: ColumnFilterDataSelectOptions
): ColumnFilterData[] {
  return options.reverse
    ? columnFilterData.slice(-amount, columnFilterData.length).reverse()
    : columnFilterData.slice(0, amount)
}
