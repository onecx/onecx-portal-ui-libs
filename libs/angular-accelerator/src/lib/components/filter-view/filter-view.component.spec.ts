import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule, formatDate } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { FilterViewComponent } from './filter-view.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import { FilterType, type Filter } from '../../model/filter.model'
import { of, take } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { PopoverModule } from 'primeng/popover'
import { TooltipModule } from 'primeng/tooltip'
import { SelectModule } from 'primeng/select'
import { LiveAnnouncer } from '@angular/cdk/a11y'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
    predefinedGroupKeys: overrides.predefinedGroupKeys,
    filterable: overrides.filterable,
  }) as DataTableColumn

describe('FilterViewComponent (class logic)', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let component: FilterViewComponent
  let stateService: DataViewStateService
  const panelMock = {
    toggle: jest.fn(),
  } as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        ButtonModule,
        PopoverModule,
        TooltipModule,
        SelectModule,
      ],
      providers: [provideTranslateTestingService({}), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewComponent)
    component = fixture.componentInstance

    // Minimal stubs to avoid accessing real PrimeNG components
    ;(component as any).manageButton = () => {
      return {
        el: {
          nativeElement: {
            firstChild: {
              focus: jest.fn(),
            },
          },
        },
      } as any
    }
    ;(component as any).panel = () => {
      return panelMock
    }
    stateService = TestBed.inject(DataViewStateService)
  })

  it('should initialize columnFilterDataRows and display filters from service', () => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'c1', nameKey: 'C1' }), makeColumn({ id: 'c2', nameKey: 'C2' })])
    fixture.componentRef.setInput('filters', [
      { columnId: 'c2', value: 'v2' } as Filter,
      { columnId: 'c1', value: 'v1' } as Filter,
      { columnId: 'missing', value: 'ignored' } as Filter,
    ])

    fixture.detectChanges()

    const rows = component.columnFilterDataRows

    expect((rows() as any[]).map((r) => (r as any).valueColumnId)).toEqual(['c1', 'c2'])
    expect(rows().map((r) => r.column)).toEqual(['C1', 'C2'])
  })

  it('should map template accessors (_filterViewChipContent, _filterViewShowMoreChip, _filterViewNoSelection)', () => {
    component.filterViewNoSelection.set(undefined)
    component.filterViewChipContent.set(undefined)
    component.filterViewShowMoreChip.set(undefined)

    expect(component.filterViewNoSelection()).toBeUndefined()
    expect(component.filterViewChipContent()).toBeUndefined()
    expect(component.filterViewShowMoreChip()).toBeUndefined()
  })

  it('should map input templates by type in templates setter', () => {
    const noSelectionTemplate = {} as any
    const chipContentTemplate = {} as any
    const showMoreTemplate = {} as any

    const templates = [
      { getType: () => 'filterViewNoSelection', template: noSelectionTemplate },
      { getType: () => 'filterViewChipContent', template: chipContentTemplate },
      { getType: () => 'filterViewShowMoreChip', template: showMoreTemplate },
      { getType: () => 'ignored', template: {} },
    ] as any

    fixture.componentRef.setInput('templates', templates)
    fixture.detectChanges()

    expect(component.filterViewNoSelection()).toBe(noSelectionTemplate)
    expect(component.filterViewChipContent()).toBe(chipContentTemplate)
    expect(component.filterViewShowMoreChip()).toBe(showMoreTemplate)
  })

  it('should reset filters by calling service setFilters when onResetFilersClick is called', () => {
    const setFiltersSpy = jest.spyOn(stateService.filters, 'set')

    stateService.filters.set([{ columnId: 'c1', value: 'v1' } as Filter])
    fixture.detectChanges()

    component.onResetFilersClick()
    fixture.detectChanges()

    expect(setFiltersSpy).toHaveBeenCalledWith([])
    expect(component.stateService.filters()).toEqual([])
  })

  it('should remove a chip by value by calling service setFilters when onChipRemove is called', () => {
    const setFiltersSpy = jest.spyOn(stateService.filters, 'set')

    fixture.componentRef.setInput('filters', [
      { columnId: 'c1', value: 'keep' } as Filter,
      { columnId: 'c2', value: 'remove' } as Filter,
    ])
    fixture.detectChanges()

    component.onChipRemove({ columnId: 'c2', value: 'remove' } as Filter)
    fixture.detectChanges()

    expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'keep' }])
    expect(setFiltersSpy).toHaveBeenCalledWith([{ columnId: 'c1', value: 'keep' }])
  })

  it('should delete filter by row valueColumnId/value by calling service setFilters when onFilterDelete is called', () => {
    const setFiltersSpy = jest.spyOn(stateService.filters, 'set')

    fixture.componentRef.setInput('filters', [
      { columnId: 'c1', value: 'keep' } as Filter,
      { columnId: 'c2', value: 'remove' } as Filter,
    ])
    fixture.detectChanges()

    component.onFilterDelete({ id: 'row', valueColumnId: 'c2', value: 'remove' } as any)
    fixture.detectChanges()

    expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'keep' }])
    expect(setFiltersSpy).toHaveBeenCalledWith([{ columnId: 'c1', value: 'keep' }])
  })

  it('should focus trigger when trigger id is ocxFilterViewShowMore', () => {
    const focusSpy = jest.fn()
    component.trigger.set({ id: 'ocxFilterViewShowMore', focus: focusSpy } as any)

    component.focusTrigger()

    expect(focusSpy).toHaveBeenCalled()
  })

  it('should toggle panel and set trigger in showPanel', () => {
    const event = { srcElement: { id: 'x' } } as any

    component.showPanel(event)
    fixture.detectChanges()

    expect(component.trigger()).toBe(event.srcElement)
    expect(panelMock.toggle).toHaveBeenCalledWith(event)
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

  it('should compute templates in columns setter (tableTemplates$)', (done) => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'c1', columnType: ColumnType.STRING })])
    fixture.componentRef.setInput('templates', undefined)

    fixture.detectChanges()

    const table$ = component.tableTemplates$

    if (!table$) {
      done(new Error('Expected tableTemplates$ to be defined after setting columns'))
      return
    }

    table$.pipe(take(1)).subscribe({
      next: (value) => {
        expect(Object.keys(value).sort()).toEqual(['actions', 'c1', 'column', 'value'].sort())
        expect(value['c1']).toBeDefined()
        done()
      },
    })
  })

  it('should compute templates in columns setter (chipTemplates$)', (done) => {
    fixture.componentRef.setInput('columns', [makeColumn({ id: 'c1', columnType: ColumnType.STRING })])
    fixture.componentRef.setInput('templates', undefined)

    fixture.detectChanges()

    const chip$ = component.chipTemplates$

    if (!chip$) {
      done(new Error('Expected chipTemplates$ to be defined after setting columns'))
      return
    }

    chip$.pipe(take(1)).subscribe({
      next: (value) => {
        expect(value['c1']).toBeDefined()
        done()
      },
    })
  })

  describe('[a11y] - filter', () => {
      it('announces NO_FILTERS when filters are empty', async () => {
        const translateService = TestBed.inject(TranslateService)
        const liveAnnouncer = TestBed.inject(LiveAnnouncer)
  
        jest.spyOn(translateService, 'get').mockReturnValue(of('no-results'))
        const announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()
  
        component.filters = []
        fixture.detectChanges()
  
        await Promise.resolve()
  
        expect(translateService.get).toHaveBeenCalledWith('OCX_FILTER_VIEW.NO_FILTERS')
        expect(announceSpy).toHaveBeenCalledWith('no-results')

        component.filters = undefined as any
        fixture.detectChanges()
  
        await Promise.resolve()
  
        expect(translateService.get).toHaveBeenCalledWith('OCX_FILTER_VIEW.NO_FILTERS')
        expect(announceSpy).toHaveBeenCalledWith('no-results')
      })
  
      it('announces SELECTED_FILTERS_COUNT when filters are active', async () => {
        const translateService = TestBed.inject(TranslateService)
        const liveAnnouncer = TestBed.inject(LiveAnnouncer)
  
        jest.spyOn(translateService, 'get').mockReturnValue(of('some-results'))
        const announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()        
  
        component.filters = [{ columnId: 'c1', filterType: 'equals', value: 'v1' } as Filter]
        fixture.detectChanges()
  
        await Promise.resolve()
  
        expect(translateService.get).toHaveBeenCalledWith('OCX_FILTER_VIEW.SELECTED_FILTERS_COUNT', { results: 1 })
        expect(announceSpy).toHaveBeenCalledWith('some-results')
      })
    })

  describe('add-filter (layout-agnostic)', () => {
    const setupAddFilter = (c1Overrides: Partial<DataTableColumn> = {}) => {
      fixture.componentRef.setInput('columns', [
        { ...makeColumn({ id: 'c1', nameKey: 'C1', columnType: ColumnType.STRING, filterable: true }), ...c1Overrides },
        makeColumn({ id: 'c2', nameKey: 'C2', columnType: ColumnType.STRING, filterable: true }),
      ])
      stateService.data.set([{ id: 'r1', c1: 'a', c2: 'x' } as any, { id: 'r2', c1: 'b', c2: 'x' } as any])
      fixture.detectChanges()
    }

    it('should expose only the displayed columns in addFilterColumns', () => {
      setupAddFilter()

      expect(component.addFilterColumns().map((c) => c.id)).toEqual(['c1', 'c2'])
    })

    it('should expose no add-filter columns when displayedColumns is empty', () => {
      setupAddFilter()
      fixture.componentRef.setInput('displayedColumns', [])
      fixture.detectChanges()

      expect(component.addFilterColumns()).toEqual([])
    })

    it('should derive distinct values for the selected column from data', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      fixture.detectChanges()

      expect(component.addFilterColumnValues().map((o: any) => o.value)).toEqual(['a', 'b'])
      expect(component.addFilterColumnValues().map((o: any) => o.label)).toEqual(['a', 'b'])
    })

    it('should derive distinct values that ignore empty values and duplicates', () => {
      setupAddFilter()
      stateService.data.set([{ id: 'r1', c1: 'a' } as any, { id: 'r2', c1: 'a' } as any, { id: 'r3', c1: '' } as any])
      component.onAddFilterColumnChange('c1')
      fixture.detectChanges()

      expect(component.addFilterColumnValues().map((o: any) => o.value)).toEqual(['a'])
    })

    it('should derive distinct values for a DATE column deduplicated by time', () => {
      setupAddFilter({ columnType: ColumnType.DATE })
      stateService.data.set([
        { id: 'r1', c1: new Date(2022, 1, 1, 13, 14, 55) } as any,
        { id: 'r2', c1: new Date(2022, 1, 1, 13, 14, 55) } as any,
        { id: 'r3', c1: new Date(2023, 0, 1, 1, 2, 3) } as any,
      ])
      component.onAddFilterColumnChange('c1')
      fixture.detectChanges()

      expect(component.addFilterColumnValues().length).toBe(2)
    })

    it('should return no add-filter column values when no column is selected', () => {
      setupAddFilter()

      expect(component.addFilterColumnValues()).toEqual([])
    })

    it('should return no add-filter column values for an IS_NOT_EMPTY column', () => {
      stateService.data.set([{ id: 'r1', c2: 'x' } as any])
      fixture.componentRef.setInput('columns', [
        makeColumn({ id: 'c2', nameKey: 'C2', columnType: ColumnType.STRING, filterable: true, filterType: 'isNotEmpty' }),
      ])
      component.onAddFilterColumnChange('c2')
      fixture.detectChanges()

      expect(component.addFilterColumnValues()).toEqual([])
    })

    it('should select a column in onAddFilterColumnChange and clear the value', () => {
      setupAddFilter()
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterColumnChange('c1')
      fixture.detectChanges()

      expect(component.selectedAddFilterColumn()).toBe('c1')
      expect(component.selectedAddFilterValue()).toBeUndefined()
    })

    it('should select a value in onAddFilterValueChange', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      expect(component.selectedAddFilterValue()).toBe('a')
    })

    it('should only enable applying the filter when both a column and a value are selected', () => {
      setupAddFilter()
      expect(component.canApplyAddFilter()).toBe(false)

      component.onAddFilterColumnChange('c1')
      fixture.detectChanges()
      expect(component.canApplyAddFilter()).toBe(false)

      component.onAddFilterValueChange('a')
      fixture.detectChanges()
      expect(component.canApplyAddFilter()).toBe(true)
    })

    it('should add an EQUALS filter for the selected column/value to the shared state in onAddFilterClick', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a', filterType: 'equals' }])
    })

    it('should keep the column filter type when one is already defined on the column', () => {
      setupAddFilter({ filterType: FilterType.ENDS_WITH })
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a', filterType: FilterType.ENDS_WITH }])
    })

    it('should preserve unrelated filters when adding a new filter', () => {
      stateService.filters.set([{ columnId: 'c2', value: 'x', filterType: 'equals' }] as Filter[])
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([
        { columnId: 'c2', value: 'x', filterType: 'equals' },
        { columnId: 'c1', value: 'a', filterType: 'equals' },
      ])
    })

    it('should not duplicate an existing filter when the same value is applied again', () => {
      stateService.filters.set([{ columnId: 'c1', value: 'a', filterType: 'equals' }] as Filter[])
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a', filterType: 'equals' }])
    })

    it('should add a filter when only the filter type differs from an existing filter for the same column/value', () => {
      stateService.filters.set([{ columnId: 'c1', value: 'a', filterType: 'equals' }] as Filter[])
      setupAddFilter({ filterType: FilterType.STARTS_WITH })
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([
        { columnId: 'c1', value: 'a', filterType: 'equals' },
        { columnId: 'c1', value: 'a', filterType: FilterType.STARTS_WITH },
      ])
    })

    it('should not add a filter when an existing filter already matches column, value and type', () => {
      stateService.filters.set([{ columnId: 'c1', value: 'a', filterType: FilterType.STARTS_WITH }] as Filter[])
      setupAddFilter({ filterType: FilterType.STARTS_WITH })
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a', filterType: FilterType.STARTS_WITH }])
    })

    it('should clear the selections in onAddFilterCancel', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterCancel()
      fixture.detectChanges()

      expect(component.selectedAddFilterColumn()).toBeUndefined()
      expect(component.selectedAddFilterValue()).toBeUndefined()
      expect(component.canApplyAddFilter()).toBe(false)
    })

    it('should reset the selections when displayedColumns changes', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      fixture.componentRef.setInput('displayedColumns', [makeColumn({ id: 'c2', nameKey: 'C2' })])
      fixture.detectChanges()

      expect(component.selectedAddFilterColumn()).toBeUndefined()
      expect(component.selectedAddFilterValue()).toBeUndefined()
    })

    it('should return no add-filter column values when the selected column cannot be resolved', () => {
      setupAddFilter()
      component.onAddFilterColumnChange('missing')
      fixture.detectChanges()

      expect(component.addFilterColumnValues()).toEqual([])
    })

    it('should do nothing in onAddFilterClick when no column or value is selected', () => {
      setupAddFilter()
      stateService.filters.set([])

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([])
      expect(component.addFilterOpen()).toBe(false)
    })

    it('should do nothing in onAddFilterClick when the selected column cannot be resolved', () => {
      setupAddFilter()
      stateService.filters.set([])
      component.onAddFilterColumnChange('missing')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([])
      expect(component.addFilterOpen()).toBe(false)
    })

    it('should only offer the add-filter action when there are displayed columns to filter on', () => {
      setupAddFilter()
      expect(component.canAddFilter()).toBe(true)

      fixture.componentRef.setInput('displayedColumns', [])
      fixture.detectChanges()

      expect(component.canAddFilter()).toBe(false)
    })

    it('should open the add-filter form when toggled on', () => {
      setupAddFilter()
      expect(component.addFilterOpen()).toBe(false)

      component.onAddFilterToggle()
      fixture.detectChanges()

      expect(component.addFilterOpen()).toBe(true)
    })

    it('should close the add-filter form and clear selections when toggled off', () => {
      setupAddFilter()
      component.onAddFilterToggle()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterToggle()
      fixture.detectChanges()

      expect(component.addFilterOpen()).toBe(false)
      expect(component.selectedAddFilterColumn()).toBeUndefined()
      expect(component.selectedAddFilterValue()).toBeUndefined()
    })

    it('should close the add-filter form after a successful apply', () => {
      setupAddFilter()
      component.onAddFilterToggle()
      component.onAddFilterColumnChange('c1')
      component.onAddFilterValueChange('a')
      fixture.detectChanges()

      component.onAddFilterClick()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a', filterType: 'equals' }])
      expect(component.addFilterOpen()).toBe(false)
    })
  })

  describe('formatFilterLabel / distinct-value labels', () => {
    const stringCol = makeColumn({ id: 'c1', columnType: ColumnType.STRING })
    const numberCol = makeColumn({ id: 'n1', columnType: ColumnType.NUMBER })
    const dateCol: DataTableColumn = { id: 'd1', nameKey: 'D1', columnType: ColumnType.DATE, dateFormat: 'yyyy-MM-dd' }

    it('should format string values as-is', () => {
      expect(component.formatFilterLabel('hello', stringCol)).toBe('hello')
    })

    it('should format number values as strings while preserving the typed value', () => {
      expect(component.formatFilterLabel(42, numberCol)).toBe('42')
      expect(component.formatFilterLabel(-0.5, numberCol)).toBe('-0.5')
    })

    it('should format boolean values as strings', () => {
      expect(component.formatFilterLabel(true, numberCol)).toBe('true')
      expect(component.formatFilterLabel(false, numberCol)).toBe('false')
    })

    it('should format date values using the column date display convention', () => {
      const date = new Date(2022, 1, 1)
      expect(component.formatFilterLabel(date, dateCol)).toBe('2022-02-01')
    })

    it('should fall back to medium date format when no dateFormat is configured', () => {
      const date = new Date(2022, 1, 1)
      const col: DataTableColumn = { id: 'd2', nameKey: 'D2', columnType: ColumnType.DATE }
      expect(component.formatFilterLabel(date, col)).toBe(formatDate(date, 'medium', 'en-US'))
    })

    it('should serialise plain object values rather than render [object Object]', () => {
      expect(component.formatFilterLabel({ a: 1 }, stringCol)).toBe('{"a":1}')
    })

    it('should keep the original typed value while producing a string label in getDistinctColumnValues', () => {
      stateService.data.set([{ id: 'r1', n1: 42 } as any, { id: 'r2', n1: 42 } as any])
      fixture.componentRef.setInput('columns', [numberCol])
      fixture.detectChanges()

      const values = component.getDistinctColumnValues(numberCol)
      expect(values).toHaveLength(1)
      expect(values[0].value).toBe(42)
      expect(values[0].label).toBe('42')
    })
  })
})
