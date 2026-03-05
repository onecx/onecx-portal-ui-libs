import { firstValueFrom, of } from 'rxjs'

import { DataSortBase } from './data-sort-base'
import { ColumnType } from '../../model/column-type.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { FilterType } from '../../model/filter.model'

describe('DataSortBase', () => {
  const createTranslateServiceMock = (translated: Record<string, string>) => {
    return {
      get: jest.fn((keys: string[]) => {
        const result: Record<string, string> = {}
        keys.forEach((k) => (result[k] = translated[k]))
        return of(result)
      }),
    } as any
  }

  const createSut = (opts?: { locale?: string; translated?: Record<string, string> }) => {
    const translateService = createTranslateServiceMock(opts?.translated ?? {})
    const sut = new DataSortBase(opts?.locale ?? 'en', translateService)
    return { sut, translateService }
  }

  describe('translateItems', () => {
    it('should return empty translations when no client-side flags are enabled', async () => {
      const { sut, translateService } = createSut()

      const items = [{ status: 'A' }]
      const columns: any[] = [{ id: 'status', columnType: ColumnType.TRANSLATION_KEY }]

      const result = await firstValueFrom(
        sut.translateItems(items as any, columns, false, false)
      )

      expect(translateService.get).not.toHaveBeenCalled()
      expect(result).toEqual({})
    })

    it('should request translation keys and build per-column translation map', async () => {
      const { sut, translateService } = createSut({ translated: { A: 'Active', B: 'Blocked' } })

      const items = [{ status: 'A' }, { status: 'B' }]
      const columns: any[] = [
        { id: 'status', columnType: ColumnType.TRANSLATION_KEY },
        { id: 'name', columnType: ColumnType.STRING },
      ]

      const result = await firstValueFrom(
        sut.translateItems(items as any, columns, true, false)
      )

      expect(translateService.get).toHaveBeenCalledWith(['A', 'B'])
      expect(result).toEqual({
        status: {
          A: 'Active',
          B: 'Blocked',
        },
      })
    })
  })

  describe('filterItems', () => {
    it('should return items unchanged when client-side filtering is disabled', () => {
      const { sut } = createSut()

      const items = [{ status: 'A' }, { status: 'B' }]
      const filters: any[] = [{ columnId: 'status', filterType: FilterType.EQUALS, value: 'A' }]

      const result = sut.filterItems([items as any, filters as any, {}], false)

      expect(result).toEqual(items)
    })

    it('should filter by unique column ids and support EQUALS and IS_NOT_EMPTY', () => {
      const { sut } = createSut()

      const items = [{ status: 'A' }, { status: '' }, { status: undefined as any }]
      const filters: any[] = [
        { columnId: 'status', filterType: FilterType.EQUALS, value: 'A' },
        { columnId: 'status', filterType: FilterType.IS_NOT_EMPTY, value: true },
      ]

      const result = sut.filterItems([items as any, filters as any, {}], true)

      expect(result).toEqual([{ status: 'A' }])
    })

    it('should default to true for unknown filter types', () => {
      const { sut } = createSut()

      const items = [{ status: 'A' }, { status: 'B' }]
      const filters: any[] = [{ columnId: 'status', filterType: 'SOMETHING_ELSE', value: 'A' }]

      const result = sut.filterItems([items as any, filters as any, {}], true)

      expect(result).toEqual(items)
    })
  })

  describe('sortItems', () => {
    it('should return items unchanged when sorting disabled or sort column empty', () => {
      const { sut } = createSut()

      const items = [{ name: 'b' }, { name: 'a' }]
      const columns: any[] = [{ id: 'name', columnType: ColumnType.STRING }]

      const noSort = sut.sortItems([items as any, '', DataSortDirection.ASCENDING, {}], columns, true)
      expect(noSort).toEqual(items)

      const disabled = sut.sortItems(
        [items as any, 'name', DataSortDirection.ASCENDING, {}],
        columns,
        false
      )
      expect(disabled).toEqual(items)
    })

    it('should sort using translations for TRANSLATION_KEY columns', () => {
      const { sut } = createSut()

      const items = [{ status: 'B' }, { status: 'A' }]
      const columns: any[] = [{ id: 'status', columnType: ColumnType.TRANSLATION_KEY }]
      const translations = { status: { A: 'Active', B: 'Blocked' } }

      const result = sut.sortItems(
        [items as any, 'status', DataSortDirection.ASCENDING, translations as any],
        columns,
        true
      )

      expect(result).toEqual([{ status: 'A' }, { status: 'B' }])
    })

    it('should build date-based values map for DATE/RELATIVE_DATE columns', () => {
      const { sut } = createSut()

      const d1 = new Date('2020-01-01T00:00:00.000Z')
      const d2 = new Date('2021-01-01T00:00:00.000Z')
      const items = [{ created: d2 }, { created: d1 }]
      const columns: any[] = [{ id: 'created', columnType: ColumnType.DATE }]

      const result = sut.sortItems(
        [items as any, 'created', DataSortDirection.ASCENDING, {}],
        columns,
        true
      )

      expect(result).toEqual([{ created: d1 }, { created: d2 }])
    })

    it('should sort descending when sort direction is DESCENDING', () => {
      const { sut } = createSut()

      const items = [{ name: 'a' }, { name: 'b' }]
      const columns: any[] = [{ id: 'name', columnType: ColumnType.STRING }]

      const result = sut.sortItems(
        [items as any, 'name', DataSortDirection.DESCENDING, {}],
        columns,
        true
      )

      expect(result).toEqual([{ name: 'b' }, { name: 'a' }])
    })
  })

  describe('flattenItems', () => {
    it('should flatten items using flattenObject', () => {
      const { sut } = createSut()

      const result = sut.flattenItems([{ nested: { a: 1 } } as any])

      expect(result).toEqual([{ 'nested.a': 1 }])
    })
  })

  describe('createCompareFunction', () => {
    it('should return 0 for NONE direction', () => {
      const { sut } = createSut()
      const compare = sut.createCompareFunction({ a: 'a', b: 'b' }, 'name', DataSortDirection.NONE)
      expect(compare({ name: 'a' }, { name: 'b' })).toBe(0)
    })

    it('should handle null/undefined values deterministically', () => {
      const { sut } = createSut()
      const compare = sut.createCompareFunction({ a: 'a', b: null as any }, 'name', DataSortDirection.ASCENDING)
      expect(compare({ name: 'b' }, { name: 'a' })).toBeLessThan(0)
    })

    it('should compare non-string values via < and > operators', () => {
      const { sut } = createSut()

      const compare = sut.createCompareFunction({ one: 1 as any, two: 2 as any }, 'value', DataSortDirection.ASCENDING)

      expect(compare({ value: 'one' }, { value: 'two' })).toBeLessThan(0)
      expect(compare({ value: 'two' }, { value: 'one' })).toBeGreaterThan(0)
      expect(compare({ value: 'one' }, { value: 'one' })).toBe(0)
    })
  })
})
