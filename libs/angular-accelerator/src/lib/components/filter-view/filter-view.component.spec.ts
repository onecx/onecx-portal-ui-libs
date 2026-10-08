import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { FilterViewComponent } from './filter-view.component'
import { AddFilterDialogComponent } from './add-filter-dialog/add-filter-dialog.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import { PortalDialogService } from '../../services/portal-dialog.service'
import type { Filter } from '../../model/filter.model'
import { FilterType } from '../../model/filter.model'
import { of, take } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { PopoverModule } from 'primeng/popover'
import { TooltipModule } from 'primeng/tooltip'
import { LiveAnnouncer } from '@angular/cdk/a11y'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
    filterable: overrides.filterable ?? true,
    predefinedGroupKeys: overrides.predefinedGroupKeys,
  }) as DataTableColumn

describe('FilterViewComponent (class logic)', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let component: FilterViewComponent
  let stateService: DataViewStateService
  let portalDialogService: jest.Mocked<PortalDialogService>
  const panelMock = {
    toggle: jest.fn(),
  } as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [CommonModule, FormsModule, TranslateModule.forRoot(), ButtonModule, PopoverModule, TooltipModule],
      providers: [
        provideTranslateTestingService({}),
        DataViewStateService,
        {
          provide: PortalDialogService,
          useValue: { openDialog: jest.fn().mockReturnValue(of(null)) },
        },
      ],
    }).compileComponents()

    portalDialogService = TestBed.inject(PortalDialogService) as jest.Mocked<PortalDialogService>

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

  it('should open the add filter dialog via PortalDialogService in onAddFilter', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([])

    component.onAddFilter('c2')
    // onAddFilter resolves the closeAriaLabel translation before opening, so let the microtask settle.
    await Promise.resolve()

    const openDialogSpy = portalDialogService.openDialog as jest.Mock
    expect(openDialogSpy).toHaveBeenCalledTimes(1)
    const [title, componentOrMessage, primary, secondary, extras] = openDialogSpy.mock.calls[0]
    expect(title).toBe('OCX_FILTER_VIEW.ADD_FILTER.DIALOG.TITLE')
    expect((componentOrMessage as any).type).toBe(AddFilterDialogComponent)
    expect((componentOrMessage as any).inputs.preselectColumnId).toBe('c2')
    expect(primary).toBe('OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CONFIRM_BUTTON')
    expect(secondary).toBe('OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CANCEL_BUTTON')
    // Dialog is capped to the viewport and restores focus to the triggering control.
    expect(extras).toEqual(
      expect.objectContaining({
        width: 'min(350px, 90vw)',
        onCloseFocus: 'initiator',
      })
    )
  })

  it('should pass the triggering element as initiatorRef so focus is restored after close', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([])

    const initiatorElement = { id: 'ocxFilterViewAddFilter' } as unknown as HTMLElement
    component.onAddFilter('c2', { currentTarget: initiatorElement } as unknown as Event)
    await Promise.resolve()

    const [, , , , extras] = (portalDialogService.openDialog as jest.Mock).mock.calls[0]
    expect(extras).toEqual(expect.objectContaining({ initiatorRef: initiatorElement, onCloseFocus: 'initiator' }))
  })

  it('should only apply filters when the primary (confirm) button is clicked, not on cancel/X', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([])

    // Simulate the dialog being closed via the secondary (cancel) button or the
    // X/Escape, carrying a non-empty result (the dialog pre-selects existing
    // values). No filter must be applied.
    ;(portalDialogService.openDialog as jest.Mock).mockReturnValueOnce(
      of({ button: 'secondary', result: [{ columnId: 'c2', value: 'v', filterType: FilterType.EQUALS }] })
    )
    component.onAddFilter('c2')
    await Promise.resolve()

    expect(stateService.filters()).toEqual([])
  })

  it('should apply the dialog result when the primary (confirm) button is clicked', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([])

    ;(portalDialogService.openDialog as jest.Mock).mockReturnValueOnce(
      of({ button: 'primary', result: [{ columnId: 'c2', value: 'v', filterType: FilterType.EQUALS }] })
    )
    component.onAddFilter('c2')
    await Promise.resolve()

    expect(stateService.filters()).toEqual([{ columnId: 'c2', value: 'v', filterType: FilterType.EQUALS }])
  })

  it('should not apply filters when the primary button is clicked with an empty result', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c2', nameKey: 'C2' })])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([{ columnId: 'c2', value: 'existing', filterType: FilterType.EQUALS }])

    ;(portalDialogService.openDialog as jest.Mock).mockReturnValueOnce(of({ button: 'primary', result: [] }))
    component.onAddFilter('c2')
    await Promise.resolve()

    // Confirming with no selected value leaves the existing filters untouched.
    expect(stateService.filters()).toEqual([{ columnId: 'c2', value: 'existing', filterType: FilterType.EQUALS }])
  })

  it('should only pass filterable columns to the add filter dialog', async () => {
    stateService.availableColumns.set([
      makeColumn({ id: 'c1', nameKey: 'C1', filterable: false }),
      makeColumn({ id: 'c2', nameKey: 'C2' }),
    ])
    stateService.data.set([{ c2: 'v' }] as any)
    stateService.filters.set([])

    component.onAddFilter()
    await Promise.resolve()

    const openDialogSpy = portalDialogService.openDialog as jest.Mock
    expect(openDialogSpy).toHaveBeenCalledTimes(1)
    const [, componentOrMessage] = openDialogSpy.mock.calls[0]
    expect((componentOrMessage as any).inputs.columns.map((column: DataTableColumn) => column.id)).toEqual(['c2'])
  })

  it('should not open the add filter dialog when no column is filterable', async () => {
    stateService.availableColumns.set([makeColumn({ id: 'c1', nameKey: 'C1', filterable: false })])
    stateService.data.set([{ c1: 'v' }] as any)
    stateService.filters.set([])

    component.onAddFilter()
    await Promise.resolve()

    const openDialogSpy = portalDialogService.openDialog as jest.Mock
    expect(openDialogSpy).not.toHaveBeenCalled()
  })

  it('should replace the whole filter set of the added column on applyFilters', () => {
    stateService.filters.set([
      { columnId: 'c1', value: 'old', filterType: FilterType.EQUALS } as Filter,
      { columnId: 'c1', value: 'keepNotEmpty', filterType: FilterType.IS_NOT_EMPTY } as Filter,
      { columnId: 'c2', value: 'other' } as Filter,
    ])

    component.applyFilters([
      { columnId: 'c1', value: 'a', filterType: FilterType.EQUALS } as Filter,
      { columnId: 'c1', value: 'b', filterType: FilterType.EQUALS } as Filter,
    ])

    const result = stateService.filters()
    // the column's previous filters are replaced outright by the dialog's output
    const c1 = result.filter((f) => f.columnId === 'c1')
    expect(c1.map((f) => f.value)).toEqual(['a', 'b'])
    // the previous IS_NOT_EMPTY filter of the column is not kept
    expect(result.some((f) => f.columnId === 'c1' && f.filterType === FilterType.IS_NOT_EMPTY)).toBe(false)
    // other columns are untouched
    expect(result.some((f) => f.columnId === 'c2' && f.value === 'other')).toBe(true)
  })

  it('should replace an existing IS_NOT_EMPTY filter of the added column on applyFilters', () => {
    stateService.filters.set([
      { columnId: 'c1', value: true, filterType: FilterType.IS_NOT_EMPTY } as Filter,
      { columnId: 'c2', value: 'other' } as Filter,
    ])

    component.applyFilters([{ columnId: 'c1', value: false, filterType: FilterType.IS_NOT_EMPTY } as Filter])

    const result = stateService.filters()
    // the previous IS_NOT_EMPTY filter of the column is replaced, not duplicated
    const c1NotEmpty = result.filter((f) => f.columnId === 'c1' && f.filterType === FilterType.IS_NOT_EMPTY)
    expect(c1NotEmpty.map((f) => f.value)).toEqual([false])
    // other columns are untouched
    expect(result.some((f) => f.columnId === 'c2' && f.value === 'other')).toBe(true)
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
})
