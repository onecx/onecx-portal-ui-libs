import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { FilterViewComponent } from './filter-view.component'
import { FilterViewAddFilterDialogComponent } from './filter-view-add-filter-dialog.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { ColumnType } from '../../model/column-type.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import type { Filter } from '../../model/filter.model'
import { FilterType } from '../../model/filter.model'
import { SelectItem } from 'primeng/api'
import { of, take } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { PopoverModule } from 'primeng/popover'
import { TooltipModule } from 'primeng/tooltip'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { PortalDialogService } from '../../services/portal-dialog.service'

const makeColumn = (overrides: Partial<DataTableColumn> = {}): DataTableColumn =>
  ({
    id: overrides.id ?? 'id',
    nameKey: overrides.nameKey ?? 'nameKey',
    columnType: overrides.columnType ?? ColumnType.STRING,
    predefinedGroupKeys: overrides.predefinedGroupKeys,
    filterable: overrides.filterable,
    filterType: overrides.filterType,
  }) as DataTableColumn

describe('FilterViewComponent (class logic)', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let component: FilterViewComponent
  let stateService: DataViewStateService
  let openDialogSpy: jest.Mock
  const panelMock = {
    toggle: jest.fn(),
  } as any

  beforeEach(async () => {
    // The add-filter dialog is opened lazily via PortalDialogService; stub it so the component can
    // be constructed without the full dialog/translate/router dependency graph.
    openDialogSpy = jest.fn().mockReturnValue(of(null))

    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [CommonModule, FormsModule, TranslateModule.forRoot(), ButtonModule, PopoverModule, TooltipModule],
      providers: [
        provideTranslateTestingService({}),
        DataViewStateService,
        { provide: PortalDialogService, useValue: { openDialog: openDialogSpy } },
      ],
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

  describe('add filter', () => {
    const filterable = makeColumn({ id: 'c1', nameKey: 'C1', filterable: true, columnType: ColumnType.STRING })
    const nonFilterable = makeColumn({ id: 'c2', nameKey: 'C2', filterable: false, columnType: ColumnType.STRING })

    it('should derive filterableColumns from displayed columns only', () => {
      // availableColumns is set through the `columns` input; displayed columns come from the service.
      stateService.columns.set([filterable, nonFilterable])
      fixture.detectChanges()

      expect(component.filterableColumns().map((c) => c.id)).toEqual(['c1'])
      expect(component.canAddFilter()).toBe(true)
    })

    it('should report canAddFilter as false when no displayed column is filterable', () => {
      stateService.columns.set([nonFilterable])
      fixture.detectChanges()

      expect(component.filterableColumns()).toEqual([])
      expect(component.canAddFilter()).toBe(false)
    })

    it('should add a new filter to the shared state via onFilterAdded', () => {
      stateService.filters.set([{ columnId: 'c0', value: 'existing' } as Filter])
      fixture.detectChanges()

      component.onFilterAdded({ columnId: 'c1', value: 'v1', filterType: FilterType.EQUALS })
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([
        { columnId: 'c0', value: 'existing' },
        { columnId: 'c1', value: 'v1', filterType: FilterType.EQUALS },
      ])
    })

    it('should ignore a duplicate column/value filter in onFilterAdded', () => {
      stateService.filters.set([{ columnId: 'c1', value: 'v1' } as Filter])
      fixture.detectChanges()

      component.onFilterAdded({ columnId: 'c1', value: 'v1' })

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'v1' }])
    })

    it('should open the add-filter dialog with the displayed filterable columns and loaded rows', () => {
      stateService.columns.set([filterable])
      stateService.data.set([{ id: 1, c1: 'a' }, { id: 2, c1: 'b' }])
      stateService.filters.set([])
      fixture.detectChanges()

      component.openAddFilterDialog()

      expect(openDialogSpy).toHaveBeenCalledTimes(1)
      const [title, componentArg, primary, secondary, extras] = openDialogSpy.mock.calls[0]
      expect(title).toBe('OCX_FILTER_VIEW.ADD_FILTER.DIALOG_TITLE')
      expect(componentArg.type).toBe(FilterViewAddFilterDialogComponent)
      expect(componentArg.inputs.columns).toEqual([filterable])
      expect(componentArg.inputs.rows).toEqual([{ id: 1, c1: 'a' }, { id: 2, c1: 'b' }])
      expect(componentArg.inputs.existingFilters).toEqual([])
      expect(primary).toBe('OCX_BUTTON_DIALOG.CONFIRM')
      expect(secondary).toBe('OCX_BUTTON_DIALOG.CANCEL')
      expect(extras).toEqual({ closable: true })
    })

    it('should apply the chosen filter when the primary dialog button is confirmed', () => {
      openDialogSpy.mockReturnValueOnce(of({ button: 'primary', result: { columnId: 'c1', value: 'a' } }))
      stateService.columns.set([filterable])
      stateService.filters.set([])
      fixture.detectChanges()

      component.openAddFilterDialog()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([{ columnId: 'c1', value: 'a' }])
    })

    it('should not change the shared filters when the dialog is dismissed or the secondary button is clicked', () => {
      openDialogSpy.mockReturnValueOnce(of(null))
      openDialogSpy.mockReturnValueOnce(of({ button: 'secondary', result: undefined }))
      stateService.filters.set([])
      fixture.detectChanges()

      component.openAddFilterDialog()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([])

      openDialogSpy.mockReturnValueOnce(of({ button: 'secondary', result: undefined }))
      component.openAddFilterDialog()
      fixture.detectChanges()

      expect(component.stateService.filters()).toEqual([])
    })

    it('should derive distinct EQUALS options for a string column from the loaded data', (done) => {
      stateService.columns.set([filterable])
      stateService.data.set([{ id: 1, c1: 'a' }, { id: 2, c1: 'b' }, { id: 3, c1: 'a' }])
      fixture.detectChanges()

      component.deriveColumnFilterOptions(filterable).pipe(take(1)).subscribe((options: SelectItem[]) => {
        expect(options.map((o) => o.value).sort()).toEqual(['a', 'b'])
        done()
      })
    })

    it('should keep an already-selected value visible even when it is no longer in the data', (done) => {
      stateService.columns.set([filterable])
      stateService.data.set([{ id: 1, c1: 'a' }])
      stateService.filters.set([{ columnId: 'c1', value: 'gone' } as Filter])
      fixture.detectChanges()

      component.deriveColumnFilterOptions(filterable).pipe(take(1)).subscribe((options: SelectItem[]) => {
        expect(options.map((o) => o.value).sort()).toEqual(['a', 'gone'])
        done()
      })
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
