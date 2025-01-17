import { TestBed } from '@angular/core/testing'
import { DataOperationStrategy } from './data-operation-strategy'
import { DataTableColumn } from '../model/data-table-column.model'
import { FilterObject, FilterType } from '../model/filter.model'
import { ColumnType } from '../model/column-type.model'

class NumberOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) === Number(target)
  }
  override lessThan(column: DataTableColumn, value: unknown, target: unknown): boolean {
    return Number(value) < Number(target)
  }
  override compare(a: unknown, b: unknown, column: DataTableColumn): number {
    return Number(a) - Number(b)
  }
}

class DateOperationStrategy extends DataOperationStrategy {
  override equals(column: DataTableColumn, value: unknown, target: unknown): boolean {
    if (!value || !(value instanceof Date) || !(target instanceof Date)) return false
    // different implementation based on the column
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    if (precision === 'day') {
      return (
        value.getFullYear() === target.getFullYear() &&
        value.getMonth() === target.getMonth() &&
        value.getDate() === target.getDate()
      )
    }
    return value.getFullYear() === target.getFullYear()
  }

  override isNotEmpty(column: DataTableColumn, value: unknown): boolean {
    return !!value
  }

  override compare(a: Date, b: Date, column: DataTableColumn): number {
    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    const aYear = a.getFullYear()
    const aMonth = a.getMonth()
    const aDay = a.getDate()

    const bYear = b.getFullYear()
    const bMonth = b.getMonth()
    const bDay = b.getDate()

    if (aYear !== bYear || precision === 'year') {
      return aYear - bYear
    }
    if (aMonth !== bMonth) {
      return aMonth - bMonth
    }
    return aDay - bDay
  }

  override filterOptions(hayStack: unknown[], filterObject: FilterObject, columns: DataTableColumn[]) {
    if (filterObject.filterType === FilterType.IS_NOT_EMPTY) {
      return ['yes', 'no']
    }

    const hayStackValues = hayStack
      .map((item) => this.mapHaystackItemToValue(item, filterObject))
      .filter((item) => !!item)
    const column = columns.find((c) => c.id === filterObject.columnId)
    if (!column) {
      console.warn('Filter does not have a column id set. All items will be considered a valid option')
      return hayStackValues
    }

    let precision: 'day' | 'year' = 'year'
    if (column.id === 'dayCol') precision = 'day'

    return hayStackValues.filter(
      (item, index, self) => index === self.findIndex((t) => this.compare(t, item, column) === 0)
    )
  }
}

describe('DataOperationStrategy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents()
  })

  describe('NumberOperationStrategy', () => {
    const items = [
      {
        col: 1,
      },
      {
        col: 2,
      },
      {
        col: 3,
      },
      {
        col: 2,
      },
      {
        col: 4,
      },
    ]
    let strategy = new NumberOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'col',
        nameKey: '',
        columnType: ColumnType.NUMBER,
      },
    ]

    it('should result in equal numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 2,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 2 }, { col: 2 }])
    })

    it('should result in lower numbers for filter', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([{ col: 1 }, { col: 2 }, { col: 2 }])
    })

    it('should result in unique numbers for filterOptions', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should return all items for filter if filter type not set', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          columnId: 'col',
        },
        columns
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filter if column not found', () => {
      const result = strategy.filter(
        items,
        {
          value: 3,
          filterType: FilterType.EQUALS,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items)
    })
    it('should return all items for filterOptions if column not found', () => {
      const result = strategy.filterOptions(
        items,
        {
          filterType: FilterType.LESS_THAN,
          columnId: 'col',
        },
        []
      )
      expect(result).toEqual(items.map((i) => i.col))
    })
  })

  describe('DateOperationStrategy', () => {
    const items = [
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2020, 1, 13),
        dayCol: new Date(2020, 1, 13),
      },
      {
        yearCol: new Date(2021, 1, 13),
        dayCol: new Date(2021, 1, 13),
      },
      {
        yearCol: new Date(2022, 7, 20),
        dayCol: new Date(2022, 7, 20),
      },
      {
        yearCol: new Date(2022, 1, 13),
        dayCol: new Date(2022, 1, 13),
      },
      {
        yearCol: new Date(2024, 7, 20),
        dayCol: new Date(2024, 7, 20),
      },
      {
        yearCol: undefined,
        dayCol: undefined,
      },
    ]
    let strategy = new DateOperationStrategy()
    const columns: DataTableColumn[] = [
      {
        id: 'yearCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
      {
        id: 'dayCol',
        nameKey: '',
        columnType: ColumnType.DATE,
      },
    ]
    const yearCol = 'yearCol'
    const dayCol = 'dayCol'

    it('should result in equal dates with year precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
          value: new Date(2022, 7, 20),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2022, 7, 20), dayCol: new Date(2022, 7, 20) },
        { yearCol: new Date(2022, 1, 13), dayCol: new Date(2022, 1, 13) },
      ])
    })

    it('should result in equal dates with day precision', () => {
      const result = strategy.filter(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
          value: new Date(2020, 1, 13),
        },
        columns
      )

      expect(result).toEqual([
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
        { yearCol: new Date(2020, 1, 13), dayCol: new Date(2020, 1, 13) },
      ])
    })
    it('should result in non empty dates', () => {
      const result = strategy.filter(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.IS_NOT_EMPTY,
          value: 'yes',
        },
        columns
      )

      expect(result.length).toEqual(items.length - 1)
    })
    it('should result in unique dates with year precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: yearCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in unique dates with day precision', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.EQUALS,
        },
        columns
      )

      expect(result).toEqual([
        new Date(2020, 1, 13),
        new Date(2021, 1, 13),
        new Date(2022, 7, 20),
        new Date(2022, 1, 13),
        new Date(2024, 7, 20),
      ])
    })
    it('should result in yes and no options with not empty filter', () => {
      const result = strategy.filterOptions(
        items,
        {
          columnId: dayCol,
          filterType: FilterType.IS_NOT_EMPTY,
        },
        columns
      )

      expect(result).toEqual(['yes', 'no'])
    })
  })
})
