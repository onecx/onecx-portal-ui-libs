import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { FilterViewComponent } from './filter-view.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'
import type { Filter } from '../../model/filter.model'
import { take } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { PopoverModule } from 'primeng/popover'
import { TooltipModule } from 'primeng/tooltip'

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
  let stateService: InteractiveDataViewService
  const panelMock = {
    toggle: jest.fn(),
  } as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [CommonModule, FormsModule, TranslateModule.forRoot(), ButtonModule, PopoverModule, TooltipModule],
      providers: [provideTranslateTestingService({}), InteractiveDataViewService],
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
    stateService = TestBed.inject(InteractiveDataViewService)
  })

  it('should initialize columnFilterDataRows and display filters from service', () => {
    component.columns.set([makeColumn({ id: 'c1', nameKey: 'C1' }), makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.setFilters([
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
    const setFiltersSpy = jest.spyOn(stateService, 'setFilters')

    stateService.setFilters([{ columnId: 'c1', value: 'v1' } as Filter])
    fixture.detectChanges()

    component.onResetFilersClick()
    fixture.detectChanges()

    expect(setFiltersSpy).toHaveBeenCalledWith([])
    expect(component.filters()).toEqual([])
  })

  it('should remove a chip by value by calling service setFilters when onChipRemove is called', () => {
    const setFiltersSpy = jest.spyOn(stateService, 'setFilters')

    stateService.setFilters([
      { columnId: 'c1', value: 'keep' } as Filter,
      { columnId: 'c2', value: 'remove' } as Filter,
    ])
    fixture.detectChanges()

    component.onChipRemove({ columnId: 'c2', value: 'remove' } as Filter)
    fixture.detectChanges()

    expect(component.filters()).toEqual([{ columnId: 'c1', value: 'keep' }])
    expect(setFiltersSpy).toHaveBeenCalledWith([{ columnId: 'c1', value: 'keep' }])
  })

  it('should delete filter by row valueColumnId/value by calling service setFilters when onFilterDelete is called', () => {
    const setFiltersSpy = jest.spyOn(stateService, 'setFilters')

    stateService.setFilters([
      { columnId: 'c1', value: 'keep' } as Filter,
      { columnId: 'c2', value: 'remove' } as Filter,
    ])
    fixture.detectChanges()

    component.onFilterDelete({ id: 'row', valueColumnId: 'c2', value: 'remove' } as any)
    fixture.detectChanges()

    expect(component.filters()).toEqual([{ columnId: 'c1', value: 'keep' }])
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
    component.columns.set([makeColumn({ id: 'c1', columnType: ColumnType.STRING })])

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

  it('should compute templates in columns setter (tableTemplates$)', (done) => {
    component.columns.set([makeColumn({ id: 'c1', columnType: ColumnType.STRING })])

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
})
