import { TranslateService } from '@ngx-translate/core'
import { Observable, map, of } from 'rxjs'
import { flattenObject } from '../../functions/flatten-object'
import { ColumnType } from '../../model/column-type.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { ListGridData } from '../../components/data-list-grid/data-list-grid.component'
import { Row } from '../../components/data-table/data-table.component'
import { ObjectUtils } from '../../utils/objectutils'
import { Filter, FilterType } from '../../model/filter.model'

type RowListGridData = ListGridData | Row

export class DataSortBase {
  constructor(
    protected locale: string,
    protected translateService: TranslateService
  ) {}

  translateItems(
    items: RowListGridData[],
    columns: DataTableColumn[],
    clientSideFiltering: boolean,
    clientSideSorting: boolean
  ): Observable<Record<string, Record<string, string>>> {
    if (clientSideFiltering || clientSideSorting) {
      let translationKeys: string[] = []
      const translatedColumns = columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
      translatedColumns.forEach((c) => {
        translationKeys = [
          ...translationKeys,
          ...items.map((i) => ObjectUtils.resolveFieldData(i, c.id)?.toString()).filter((v) => !!v),
        ]
      })
      if (translationKeys.length) {
        return this.translateService.get(translationKeys).pipe(
          map((translatedValues: Record<string, string>) => {
            const translations: Record<string, Record<string, string>> = {}
            translatedColumns.forEach((c) => {
              translations[c.id] = Object.fromEntries(
                items.map((i) => [
                  ObjectUtils.resolveFieldData(i, c.id)?.toString() || '',
                  translatedValues[ObjectUtils.resolveFieldData(i, c.id)?.toString()],
                ])
              )
            })
            return translations
          })
        )
      }
    }
    return of({})
  }

  filterItems(
    [items, filters, translations]: [RowListGridData[], Filter[], Record<string, Record<string, string>>],
    clientSideFiltering: boolean
  ): RowListGridData[] {
    if (!clientSideFiltering) {
      return items
    }
    return items.filter((item) =>
      filters
        .map((filter) => filter.columnId)
        .filter((value, index, self) => self.indexOf(value) === index && value != null)
        .every((filterColumnId) =>
          filters
            .filter((filter) => filter.columnId === filterColumnId)
            .some((filter) => {
              const value = (
                translations[filter.columnId]?.[ObjectUtils.resolveFieldData(item, filter.columnId)?.toString()] ||
                ObjectUtils.resolveFieldData(item, filter.columnId)
              )?.toString()
              switch (filter.filterType) {
                case undefined:
                case FilterType.EQUALS:
                  return value === String(filter.value)
                case FilterType.IS_NOT_EMPTY: {
                  return filter.value ? !!value : !value
                }
                default:
                  return true
              }
            })
        )
    )
  }

  sortItems(
    [items, sortColumn, sortDirection, translations]: [
      RowListGridData[],
      string,
      DataSortDirection,
      Record<string, Record<string, string>>,
    ],
    columns: DataTableColumn[],
    clientSideSorting: boolean
  ): RowListGridData[] {
    if (!clientSideSorting || sortColumn === '') {
      return items
    }
    const column = columns.find((h) => h.id === sortColumn)
    let colValues: Record<string, string>
    if (column?.columnType === ColumnType.DATE || column?.columnType === ColumnType.RELATIVE_DATE) {
      colValues = Object.fromEntries(
        items.map((i) => [
          ObjectUtils.resolveFieldData(i, sortColumn) as Date,
          ObjectUtils.resolveFieldData(i, sortColumn) as Date,
        ])
      )
    } else {
      colValues = Object.fromEntries(
        items.map((i) => [
          ObjectUtils.resolveFieldData(i, sortColumn)?.toString(),
          ObjectUtils.resolveFieldData(i, sortColumn)?.toString(),
        ])
      )
    }
    if (column?.columnType === ColumnType.TRANSLATION_KEY) {
      colValues = translations[sortColumn]
    }
    return [...items].sort(this.createCompareFunction(colValues, sortColumn, sortDirection))
  }

  flattenItems(items: RowListGridData[]) {
    return items.map((i) => flattenObject(i))
  }

  createCompareFunction(
    translatedColValues: Record<string, string>,
    sortColumn: string,
    sortDirection: DataSortDirection
  ): (a: Record<string, any>, b: Record<string, any>) => number {
    let direction = 0
    if (sortDirection === DataSortDirection.ASCENDING) {
      direction = 1
    } else if (sortDirection === DataSortDirection.DESCENDING) {
      direction = -1
    }
    return (data1, data2) => {
      if (direction === 0) {
        return 0
      }
      let result
      const value1 = translatedColValues[ObjectUtils.resolveFieldData(data1, sortColumn)]
      const value2 = translatedColValues[ObjectUtils.resolveFieldData(data2, sortColumn)]

      if (value1 == null && value2 != null) result = -1
      else if (value1 != null && value2 == null) result = 1
      else if (value1 == null && value2 == null) result = 0
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2, [this.locale, 'en', 'de'], { numeric: true })
      else {
        if (value1 < value2) {
          result = -1
        } else if (value1 > value2) {
          result = 1
        } else {
          result = 0
        }
      }
      return direction * result
    }
  }
}
