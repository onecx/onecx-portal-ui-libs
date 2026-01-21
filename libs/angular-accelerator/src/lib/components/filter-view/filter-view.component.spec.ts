import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FilterViewComponent } from './filter-view.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import type { Filter } from '../../model/filter.model'
import { take } from 'rxjs'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
    predefinedGroupKeys: overrides.predefinedGroupKeys,
  }) as DataTableColumn

describe('FilterViewComponent (class logic)', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let component: FilterViewComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewComponent)
    component = fixture.componentInstance

    // Minimal stubs to avoid accessing real PrimeNG components
    component.manageButton = {
      el: {
        nativeElement: {
          firstChild: {
            focus: jest.fn(),
          },
        },
      },
    } as any

    component.panel = {
      toggle: jest.fn(),
    } as any
  })

  it('should initialize columnFilterDataRows$ and emit initial componentStateChanged in ngOnInit', (done) => {
    component.columns = [makeColumn({ id: 'c1', nameKey: 'C1' }), makeColumn({ id: 'c2', nameKey: 'C2' })]
    component.filters = [
      { columnId: 'c2', value: 'v2' } as Filter,
      { columnId: 'c1', value: 'v1' } as Filter,
      { columnId: 'missing', value: 'ignored' } as Filter,
    ]

    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

    component.ngOnInit()

    expect(stateSpy).toHaveBeenCalledWith({ filters: component.filters })

    const rows$ = component.columnFilterDataRows$
    if (!rows$) {
      done(new Error('Expected columnFilterDataRows$ to be defined after ngOnInit'))
      return
    }

    let finished = false
    const finishOnce = (err?: any) => {
      if (finished) return
      finished = true
      if (err) done(err)
      else done()
    }

    rows$.pipe(take(1)).subscribe({
      next: (rows) => {
        try {
          // Sorted by the order of columns (c1 then c2)
          expect((rows as any[]).map((r) => (r as any).valueColumnId)).toEqual(['c1', 'c2'])
          expect(rows.map((r) => r.column)).toEqual(['C1', 'C2'])
          finishOnce()
        } catch (e) {
          finishOnce(e as any)
        }
      },
      error: finishOnce,
    })
  })

  it('should set and expose defaultTemplates via the setter', () => {
    component.defaultTemplates = undefined
    expect(component.defaultTemplates$.getValue()).toBeUndefined()
  })

  it('should map template accessors (_filterViewChipContent, _filterViewShowMoreChip, _fitlerViewNoSelection)', () => {
    component.fitlerViewNoSelection = undefined
    component.filterViewChipContent = undefined
    component.filterViewShowMoreChip = undefined

    expect(component._fitlerViewNoSelection).toBeUndefined()
    expect(component._filterViewChipContent).toBeUndefined()
    expect(component._filterViewShowMoreChip).toBeUndefined()
  })

  it('should map input templates by type in templates setter', () => {
    const noSelectionTemplate = {} as any
    const chipContentTemplate = {} as any
    const showMoreTemplate = {} as any

    const templates = [
      { getType: () => 'fitlerViewNoSelection', template: noSelectionTemplate },
      { getType: () => 'filterViewChipContent', template: chipContentTemplate },
      { getType: () => 'filterViewShowMoreChip', template: showMoreTemplate },
      { getType: () => 'ignored', template: {} },
    ] as any

    component.templates = templates

    expect(component.fitlerViewNoSelection).toBe(noSelectionTemplate)
    expect(component.filterViewChipContent).toBe(chipContentTemplate)
    expect(component.filterViewShowMoreChip).toBe(showMoreTemplate)
  })

  it('should reset filters and emit events onResetFilersClick', () => {
    component.filters = [{ columnId: 'c1', value: 'v1' } as Filter]

    const filteredSpy = jest.spyOn(component.filtered, 'emit')
    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

    component.onResetFilersClick()

    expect(component.filters).toEqual([])
    expect(filteredSpy).toHaveBeenCalledWith([])
    expect(stateSpy).toHaveBeenCalledWith({ filters: [] })
  })

  it('should remove a chip by value and emit events onChipRemove', () => {
    component.filters = [{ columnId: 'c1', value: 'keep' } as Filter, { columnId: 'c2', value: 'remove' } as Filter]

    const filteredSpy = jest.spyOn(component.filtered, 'emit')
    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

    component.onChipRemove({ columnId: 'c2', value: 'remove' } as Filter)

    expect(component.filters).toEqual([{ columnId: 'c1', value: 'keep' }])
    expect(filteredSpy).toHaveBeenCalledWith([{ columnId: 'c1', value: 'keep' }])
    expect(stateSpy).toHaveBeenCalledWith({ filters: [{ columnId: 'c1', value: 'keep' }] })
  })

  it('should delete filter by row valueColumnId/value and emit events onFilterDelete', () => {
    component.filters = [{ columnId: 'c1', value: 'keep' } as Filter, { columnId: 'c2', value: 'remove' } as Filter]

    const filteredSpy = jest.spyOn(component.filtered, 'emit')
    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

    component.onFilterDelete({ id: 'row', valueColumnId: 'c2', value: 'remove' } as any)

    expect(component.filters).toEqual([{ columnId: 'c1', value: 'keep' }])
    expect(filteredSpy).toHaveBeenCalledWith([{ columnId: 'c1', value: 'keep' }])
    expect(stateSpy).toHaveBeenCalledWith({ filters: [{ columnId: 'c1', value: 'keep' }] })
  })

  it('should focus trigger when trigger id is ocxFilterViewShowMore', () => {
    const focusSpy = jest.fn()
    component.trigger = { id: 'ocxFilterViewShowMore', focus: focusSpy } as any

    component.focusTrigger()

    expect(focusSpy).toHaveBeenCalled()
  })

  it('should focus manageButton when trigger is not show more', () => {
    component.trigger = { id: 'other' } as any

    const focusSpy = (component.manageButton as any).el.nativeElement.firstChild.focus as jest.Mock

    component.focusTrigger()

    expect(focusSpy).toHaveBeenCalled()
  })

  it('should toggle panel and set trigger in showPanel', () => {
    const event = { srcElement: { id: 'x' } } as any

    component.showPanel(event)

    expect(component.trigger).toBe(event.srcElement)
    expect((component.panel as any).toggle).toHaveBeenCalledWith(event)
  })

  it('should expose helpers: getColumnForFilter, getColumn, resolveFieldData, row mapping helpers', () => {
    const cols = [makeColumn({ id: 'c1' }), makeColumn({ id: 'c2' })]

    expect(component.getColumnForFilter({ columnId: 'c2', value: 'v' } as Filter, cols)).toBe(cols[1])
    expect(component.getColumn('c1', cols)).toBe(cols[0])

    const obj = { a: { b: 1 } }
    expect(component.resolveFieldData(obj, 'a.b')).toBe(1)

    expect(component.getRowObjectFromFiterData({ columnId: 'c2', value: 123 } as Filter)).toEqual({ c2: 123 })

    expect(component.getRowForValueColumn({ id: 'row', valueColumnId: 'c1', value: 'x' } as any)).toEqual({
      id: 'row',
      c1: 'x',
    })
  })

  it('should compute templates in columns setter (chipTemplates$ and tableTemplates$) with default nulls', (done) => {
    component.columns = [makeColumn({ id: 'c1', columnType: ColumnType.STRING })]

    component.defaultTemplates = undefined
    component.templates = undefined

    const chip$ = component.chipTemplates$
    const table$ = component.tableTemplates$

    if (!chip$) {
      done(new Error('Expected chipTemplates$ to be defined after setting columns'))
      return
    }

    if (!table$) {
      done(new Error('Expected tableTemplates$ to be defined after setting columns'))
      return
    }

    let chipTemplates: Record<string, any> | undefined
    let tableTemplates: Record<string, any> | undefined

    const maybeFinish = () => {
      if (!chipTemplates || !tableTemplates) return

      try {
        expect(chipTemplates).toEqual({ c1: null })

        // tableTemplates includes columns + columnFilterTableColumns
        expect(Object.keys(tableTemplates).sort()).toEqual(['actions', 'c1', 'column', 'value'].sort())
        expect(tableTemplates['c1']).toBeNull()
        done()
      } catch (e) {
        done(e as any)
      }
    }

    chip$.pipe(take(1)).subscribe({
      next: (value) => {
        chipTemplates = value
        maybeFinish()
      },
      error: done,
    })

    table$.pipe(take(1)).subscribe({
      next: (value) => {
        tableTemplates = value
        maybeFinish()
      },
      error: done,
    })
  })
})
