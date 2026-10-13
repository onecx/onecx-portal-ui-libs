import { ColumnType } from '../model/column-type.model'
import { DataTableColumn } from '../model/data-table-column.model'
import { Filter, FilterType } from '../model/filter.model'
import {
  buildColumnFilters,
  formatFilterValueLabel,
  getExistingFilterValues,
  getFilterableColumns,
  getFilterOptionValues,
  isSupportedFilterType,
  limit,
} from './filter.utils'

const column = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({ id: 'c1', nameKey: 'C1', columnType: ColumnType.STRING, filterable: true, ...overrides }) as DataTableColumn

describe('filter.utils', () => {
  describe('limit', () => {
    const filters: Filter[] = [1, 2, 3].map((value) => ({ columnId: 'c', value, filterType: FilterType.EQUALS }))

    it('should return the first entries', () => {
      expect(limit(filters, 2, { reverse: false }).map((f) => f.value)).toEqual([1, 2])
    })

    it('should return the last entries reversed', () => {
      expect(limit(filters, 2, { reverse: true }).map((f) => f.value)).toEqual([3, 2])
    })
  })

  describe('isSupportedFilterType', () => {
    it.each([undefined, FilterType.EQUALS, FilterType.IS_NOT_EMPTY])('should support %s', (type) => {
      expect(isSupportedFilterType(type)).toBe(true)
    })

    it('should not support other filter types', () => {
      expect(isSupportedFilterType(FilterType.CONTAINS)).toBe(false)
    })
  })

  describe('getFilterableColumns', () => {
    it('should only return filterable columns with a supported filter type', () => {
      const columns = [
        column({ id: 'a' }),
        column({ id: 'b', filterable: false }),
        column({ id: 'c', filterType: FilterType.IS_NOT_EMPTY }),
        column({ id: 'd', filterType: FilterType.CONTAINS }),
      ]

      expect(getFilterableColumns(columns).map((c) => c.id)).toEqual(['a', 'c'])
    })
  })

  describe('getExistingFilterValues', () => {
    it('should return values of the column filters matching its filter type', () => {
      const filters: Filter[] = [
        { columnId: 'c1', value: 'a', filterType: FilterType.EQUALS },
        { columnId: 'c1', value: 'b' } as Filter,
        { columnId: 'c1', value: true, filterType: FilterType.IS_NOT_EMPTY },
        { columnId: 'other', value: 'x', filterType: FilterType.EQUALS },
      ]

      expect(getExistingFilterValues(column(), filters)).toEqual(['a', 'b'])
      expect(getExistingFilterValues(column({ filterType: FilterType.IS_NOT_EMPTY }), filters)).toEqual([true])
    })
  })

  describe('getFilterOptionValues', () => {
    it('should return distinct non-empty values and append existing values missing from the data', () => {
      const data = [{ c1: 'a' }, { c1: 'b' }, { c1: 'a' }, { c1: '' }, { c1: null }, { c1: undefined }]
      const filters: Filter[] = [
        { columnId: 'c1', value: 'b', filterType: FilterType.EQUALS },
        { columnId: 'c1', value: 'gone', filterType: FilterType.EQUALS },
        { columnId: 'c1', value: 'gone', filterType: FilterType.EQUALS },
      ]

      expect(getFilterOptionValues(column(), data, filters)).toEqual(['a', 'b', 'gone'])
    })

    it('should compare values by their string representation', () => {
      const filters: Filter[] = [{ columnId: 'c1', value: '1', filterType: FilterType.EQUALS }]

      expect(getFilterOptionValues(column(), [{ c1: 1 }], filters)).toEqual([1])
    })
  })

  describe('formatFilterValueLabel', () => {
    it('should stringify non-date values', () => {
      expect(formatFilterValueLabel(column(), 5, 'en')).toBe('5')
    })

    it('should format date values with the column date format', () => {
      const dateColumn = column({ columnType: ColumnType.DATE, dateFormat: 'yyyy-MM-dd' })

      expect(formatFilterValueLabel(dateColumn, '2024-05-06T12:00:00.000Z', 'en')).toBe('2024-05-06')
    })

    it('should fall back to the medium format for date columns without a date format', () => {
      const dateColumn = column({ columnType: ColumnType.DATE })

      expect(formatFilterValueLabel(dateColumn, '2024-05-06T12:00:00.000Z', 'en')).toMatch(/2024/)
    })
  })

  describe('buildColumnFilters', () => {
    it('should build EQUALS filters by default', () => {
      expect(buildColumnFilters(column(), ['a', 'b'])).toEqual([
        { columnId: 'c1', value: 'a', filterType: FilterType.EQUALS },
        { columnId: 'c1', value: 'b', filterType: FilterType.EQUALS },
      ])
    })

    it('should use the filter type of the column', () => {
      expect(buildColumnFilters(column({ filterType: FilterType.IS_NOT_EMPTY }), [true])).toEqual([
        { columnId: 'c1', value: true, filterType: FilterType.IS_NOT_EMPTY },
      ])
    })

    it('should return no filters for a non-array selection', () => {
      expect(buildColumnFilters(column(), null)).toEqual([])
    })
  })
})
