import { TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { DataSortBase } from './data-sort-base'
import { ColumnType } from '../../model/column-type.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataTableColumn } from '../../model/data-table-column.model'
import { RowListGridData } from '../../model/row-list-grid-data.model'

const translationColumn: DataTableColumn = {
  id: 'status',
  nameKey: 'status.name',
  columnType: ColumnType.TRANSLATION_KEY,
}

const emptyItems: RowListGridData[] = [
  { id: 1, status: null },
  { id: 2, status: '' },
  { id: 3, status: undefined },
]

describe('DataSortBase sorting a TRANSLATION_KEY column absent from the translation map', () => {
  let translateService: TranslateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    translateService = TestBed.inject(TranslateService)
  })

  const createSut = () => new DataSortBase('en', translateService)

  describe('a column whose values are all empty', () => {
    it('given a translation-key column empty in every row, when sorting ascending, then all items are returned in order without throwing', () => {
      const sut = createSut()

      const result = sut.sortItems([emptyItems, 'status', DataSortDirection.ASCENDING, {}], [translationColumn], true)

      expect(result).toEqual(emptyItems)
    })

    it('given a translation-key column empty in every row, when sorting descending, then all items are returned in order without throwing', () => {
      const sut = createSut()

      const result = sut.sortItems([emptyItems, 'status', DataSortDirection.DESCENDING, {}], [translationColumn], true)

      expect(result).toEqual(emptyItems)
    })
  })

  describe('a column mixing empty and translated values', () => {
    it('given a translation-key column with mixed empty and translated values, when sorting ascending, then empty values come first and the rest are sorted by translation', () => {
      const sut = createSut()

      const items: RowListGridData[] = [
        { id: 1, status: 'B' },
        { id: 2, status: null },
        { id: 3, status: 'A' },
      ]
      const translations = { status: { A: 'Active', B: 'Blocked' } }

      const result = sut.sortItems(
        [items, 'status', DataSortDirection.ASCENDING, translations],
        [translationColumn],
        true
      )

      expect(result).toEqual([
        { id: 2, status: null },
        { id: 3, status: 'A' },
        { id: 1, status: 'B' },
      ])
    })
  })
})
