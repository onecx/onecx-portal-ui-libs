import { SlotService } from '@onecx/angular-remote-components'
import { TestBed } from '@angular/core/testing'
import { TemplateRef } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PrimeTemplate } from 'primeng/api'
import { InteractiveDataViewComponent } from './interactive-data-view.component'

describe('InteractiveDataViewComponent (class logic)', () => {
  /**
   * Direct instantiation without fixture to control ngOnInit timing and avoid race conditions
   * with async slot service checks and combineLatest streams during initialization.
   * It tests pure class logic in isolation from template bindings and DOM.
   */
  const setInputSignal = <T>(obj: any, prop: string, value: T) => {
    Object.defineProperty(obj, prop, {
      value: () => value,
      writable: true,
      configurable: true,
    })
  }

  const createComponent = (slotDefined = true) => {
    const slotService = {
      isSomeComponentDefinedForSlot: jest.fn(() => new BehaviorSubject<boolean>(slotDefined).asObservable()),
    } as unknown as SlotService

    TestBed.configureTestingModule({
      providers: [{ provide: SlotService, useValue: slotService }],
    })

    const component = TestBed.runInInjectionContext(() => new InteractiveDataViewComponent())
    return { component, slotService }
  }

  describe('component state aggregation (componentStateChanged)', () => {
    it('should startWith column-group + custom-group state when column group component is NOT defined', () => {
      const { component } = createComponent(false)

      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.layout.set('grid')
      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'group-a' } as any])
      component.displayedColumnKeys.set(['c1'])
      setInputSignal(component, 'defaultGroupKey', 'dg')
      setInputSignal(component, 'customGroupKey', 'custom')
      component.selectedGroupKey.set('group-a')

      component.ngOnInit()

      component.dataLayoutComponentState$.next({ layout: 'grid', supportedViewLayouts: ['grid'] } as any)
      component.dataListGridSortingComponentState$.next({} as any)
      component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)
      component.filterViewComponentState$.next({} as any)
      component.columnGroupSelectionComponentState$.next({} as any)
      component.customGroupColumnSelectorComponentState$.next({} as any)

      expect(stateSpy).toHaveBeenCalled()

      // When the slot is not defined, the initial merge is primarily driven by the states we actively emit.
      // Verify that the merged state includes the layout + paging state we provided.
      const lastValue = (stateSpy.mock.calls.at(-1) ?? [undefined])[0]
      expect(lastValue).toEqual(
        expect.objectContaining({
          layout: 'grid',
          supportedViewLayouts: ['grid'],
          page: 0,
          pageSize: 10,
        })
      )
    })

    it('should startWith empty sorting state when layout is table', () => {
      const { component } = createComponent(true)

      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
      component.layout.set('table')
      component.ngOnInit()

      // provide required initial values for the ReplaySubjects used in combineLatest
      component.columnGroupSelectionComponentState$.next({} as any)
      component.customGroupColumnSelectorComponentState$.next({} as any)
      component.filterViewComponentState$.next({} as any)

      component.dataLayoutComponentState$.next({ layout: 'table', supportedViewLayouts: ['table'] } as any)
      component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)

      expect(stateSpy).toHaveBeenCalled()
    })

    it('should startWith column-group + custom-group states when layout is not table', () => {
      const { component } = createComponent(true)

      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
      component.layout.set('grid')
      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'C1' } as any])
      component.displayedColumnKeys.set(['c1'])

      component.ngOnInit()

      component.dataListGridSortingComponentState$.next({} as any)
      component.filterViewComponentState$.next({} as any)

      component.dataLayoutComponentState$.next({ layout: 'grid', supportedViewLayouts: ['grid'] } as any)
      component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)

      const lastValue = (stateSpy.mock.calls.at(-1) ?? [undefined])[0]
      expect(lastValue).toEqual(
        expect.objectContaining({
          activeColumnGroupKey: component.selectedGroupKey(),
          actionColumnConfig: expect.any(Object),
        })
      )
    })

    it('should startWith filter state when filter view is disabled', () => {
      const { component } = createComponent(true)

      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
      setInputSignal(component, 'disableFilterView', true)
      component.filters.set([{ columnId: 'c1', filterType: 'stringContains', value: 'x' } as any])
      component.ngOnInit()

      component.columnGroupSelectionComponentState$.next({} as any)
      component.customGroupColumnSelectorComponentState$.next({} as any)
      component.dataListGridSortingComponentState$.next({} as any)

      component.dataLayoutComponentState$.next({ layout: 'table', supportedViewLayouts: ['table'] } as any)
      component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)

      const lastValue = (stateSpy.mock.calls.at(-1) ?? [undefined])[0]
      expect(lastValue).toEqual(expect.objectContaining({ filters: component.filters() }))
    })
  })

  describe('group selection + layout interactions', () => {
    it('should keep selectedGroupKey unchanged on layout change when column group selection component is NOT defined', () => {
      const { component } = createComponent(false)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'some-group' } as any])
      component.selectedGroupKey.set('not-present')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.dataViewLayoutChange.emit('grid')

      expect(component.selectedGroupKey()).toBe('not-present')
    })
    it('should trigger subscription when groupSelectionChanged is called', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'G', predefinedGroupKeys: [] } as any])
      component.displayedColumnKeys.set(['c1'])
      setInputSignal(component, 'defaultGroupKey', 'test-default')

      component.triggerGroupSelectionChanged(undefined)

      // Should use defaultGroupKey as fallback
      expect(component.selectedGroupKey()).toBe('test-default')
    })
    it('should set groupSelectionChangedSlotEmitter fallback groupKey to defaultGroupKey when selectedGroupKey is undefined', () => {
      const { component } = createComponent(true)

      const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'G', predefinedGroupKeys: [] } as any])
      component.displayedColumnKeys.set(['c1'])
      setInputSignal(component, 'defaultGroupKey', 'dg')

      component.triggerGroupSelectionChanged(undefined)

      expect(component.selectedGroupKey()).toBe('dg')
      // Effect emission happens async
      TestBed.tick()
      expect(emitSpy).toHaveBeenCalledWith(['c1'])
    })

    it('should not clear selectedGroupKey on layout change when selectedGroupKey matches a column nameKey', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any])
      component.selectedGroupKey.set('some-group')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.dataViewLayoutChange.emit('grid')

      expect(component.selectedGroupKey()).toBe('some-group')
    })

    it('should not clear selectedGroupKey on layout change when selectedGroupKey equals customGroupKey', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any])
      setInputSignal(component, 'customGroupKey', 'custom')
      component.selectedGroupKey.set('custom')

      component.dataViewLayoutChange.emit('grid')

      expect(component.selectedGroupKey()).toBe('custom')
    })

    it('should update column group selection state when groupSelectionChangedSlotEmitter emits undefined', () => {
      const { component } = createComponent(true)
      const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
      const stateSpy = jest.fn()
      component.columnGroupSelectionComponentState$.subscribe(stateSpy)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'G', predefinedGroupKeys: [] } as any])
      component.displayedColumnKeys.set(['c1'])
      setInputSignal(component, 'defaultGroupKey', 'dg')
      component.selectedGroupKey.set('sg')

      component.triggerGroupSelectionChanged(undefined)

      // When `undefined` is passed, it uses current selectedGroupKey ('sg') as fallback
      expect(component.displayedColumnKeys()).toEqual(['c1'])
      expect(component.selectedGroupKey()).toBe('sg')
      // Effect emission happens async
      TestBed.tick()
      expect(emitSpy).toHaveBeenCalledWith(['c1'])
      expect(stateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          activeColumnGroupKey: 'sg',
          displayedColumns: [expect.objectContaining({ id: 'c1' })],
        })
      )
    })

    it('should clear selectedGroupKey on layout change when column group defined and selection is invalid', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any])
      component.selectedGroupKey.set('not-present')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.dataViewLayoutChange.emit('grid')
      TestBed.tick()

      expect(component.selectedGroupKey()).toBeUndefined()
    })

    it('should initialize displayedColumnKeysChange when defaultGroupKey equals customGroupKey', () => {
      const { component } = createComponent(true)

      const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
      setInputSignal(component, 'columns', [{ id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any])
      setInputSignal(component, 'customGroupKey', 'custom')
      setInputSignal(component, 'defaultGroupKey', 'custom')

      component.ngOnInit()
      TestBed.tick()

      expect(component.displayedColumnKeys()).toEqual([])
      expect(emitSpy).toHaveBeenCalledWith([])
    })

    it('should keep displayedColumnKeys empty when defaultGroupKey is empty', () => {
      const { component } = createComponent(true)

      const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
      setInputSignal(component, 'columns', [{ id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any])
      setInputSignal(component, 'defaultGroupKey', '')

      component.ngOnInit()
      TestBed.tick()

      expect(component.displayedColumnKeys()).toEqual([])
      expect(emitSpy).toHaveBeenCalledWith([])
    })

    it('should set displayedColumnKeys from predefinedGroupKeys when defaultGroupKey is set and not customGroupKey', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [
        { id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any,
        { id: 'b', nameKey: 'B', predefinedGroupKeys: ['g2'] } as any,
        { id: 'c', nameKey: 'C', predefinedGroupKeys: ['g1', 'g2'] } as any,
      ])
      setInputSignal(component, 'defaultGroupKey', 'g2')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.ngOnInit()
      TestBed.tick()

      expect(component.displayedColumnKeys()).toEqual(['b', 'c'])
    })

    it('should initialize displayedColumnKeys from defaultGroupKey and emit displayedColumnKeysChange', () => {
      const { component } = createComponent(true)

      const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
      // Set up columns where nameKey matches the defaultGroupKey to avoid the layout effect clearing it
      setInputSignal(component, 'columns', [
        { id: 'a', nameKey: 'g1', predefinedGroupKeys: ['g1'] } as any,
        { id: 'b', nameKey: 'g2', predefinedGroupKeys: ['g2'] } as any,
      ])
      setInputSignal(component, 'defaultGroupKey', 'g1')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.ngOnInit()
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('g1')
      expect(component.displayedColumnKeys()).toEqual(['a'])
      expect(emitSpy).toHaveBeenCalledWith(['a'])
    })

    it('should update displayedColumnKeys and selectedGroupKey on column group selection change', () => {
      const { component } = createComponent(true)

      const displayedColumnKeysSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

      // Set columns so the layout effect doesn't clear selectedGroupKey
      setInputSignal(component, 'columns', [
        { id: 'a', nameKey: 'g1',predefinedGroupKeys: [] } as any,
        { id: 'b', nameKey: 'g2', predefinedGroupKeys: [] } as any,
      ])
      setInputSignal(component, 'customGroupKey', 'custom')

      component.onColumnGroupSelectionChange({
        groupKey: 'g1',
        activeColumns: [{ id: 'a' } as any, { id: 'b' } as any],
      } as any)
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('g1')
      expect(component.displayedColumnKeys()).toEqual(['a', 'b'])
      expect(displayedColumnKeysSpy).toHaveBeenCalledWith(['a', 'b'])
    })

    it('should update displayedColumnKeys and set selectedGroupKey to customGroupKey on column selection change', () => {
      const { component } = createComponent(true)

      const displayedColumnKeysSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
      setInputSignal(component, 'customGroupKey', 'custom')

      component.onColumnSelectionChange({ activeColumns: [{ id: 'x' } as any] } as any)
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('custom')
      expect(component.displayedColumnKeys()).toEqual(['x'])
      expect(displayedColumnKeysSpy).toHaveBeenCalledWith(['x'])
    })
  })

  describe('reactive streams (signals)', () => {
    it('should update displayedColumnKeys when displayedColumnKeys model is set', () => {
      const { component } = createComponent(true)

      component.displayedColumnKeys.set(['a', 'b'])

      expect(component.displayedColumnKeys()).toEqual(['a', 'b'])
    })

    it('should initialize displayedColumns and map keys to columns', () => {
      const { component } = createComponent(true)

      const c1 = { id: 'c1', nameKey: 'C1' } as any
      const c2 = { id: 'c2', nameKey: 'C2' } as any
      setInputSignal(component, 'columns', [c1, c2])

      component.ngOnInit()

      component.displayedColumnKeys.set(['c2', 'missing', 'c1'])

      // displayedColumns is a computed signal that filters out missing keys
      expect(component.displayedColumns()).toEqual([c2, c1])
    })

    it('should reflect selectedGroupKey through signal', () => {
      const { component } = createComponent(true)

      component.selectedGroupKey.set('g1')
      expect(component.selectedGroupKey()).toBe('g1')
    })
  })

  describe('inputs + setters', () => {
    it('should not set groupSelectionNoGroupSelectedKey when already set', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'groupSelectionNoGroupSelectedKey', 'ALREADY_SET')
      component.ngOnInit()

      expect(component.groupSelectionNoGroupSelectedKey()).toBe('ALREADY_SET')
    })

    it('should update data when data input setter is called', () => {
      const { component } = createComponent(true)

      const data = [{ id: '1' } as any]
      setInputSignal(component, 'data', data)

      expect(component.data()).toBe(data)
    })

    it('should update selectedRows input without side effects', () => {
      const { component } = createComponent(true)

      const rows = [{ id: 'r1' } as any]
      setInputSignal(component, 'selectedRows', rows)

      expect(component.selectedRows()).toBe(rows as any)
    })

    it('should cover Input defaults (selectDisplayedChips, sortStates, pageSizes, fallbackImage)', () => {
      const { component } = createComponent(true)

      expect(component.fallbackImage()).toBe('placeholder.png')
      expect(component.pageSizes()).toEqual([10, 25, 50])
      expect(component.sortStates()).toEqual(['ASCENDING', 'DESCENDING', 'NONE'] as any)

      const f1 = { columnId: 'c1' } as any
      const f2 = { columnId: 'c2' } as any
      const f3 = { columnId: 'c3' } as any
      const f4 = { columnId: 'c4' } as any

      // should return limited list (implementation uses limit(..., 3, { reverse: true }))
      const selected = component.selectDisplayedChips()([f1, f2, f3, f4], [])
      expect(selected.length).toBe(3)
      expect(selected).toEqual([f4, f3, f2])

      // templates is now a contentChildren signal
      expect(component.templates()).toBeDefined()
    })

    it('should map displayedColumnKeys to existing columns via displayedColumns computed signal', () => {
      const { component } = createComponent(true)

      const c1 = { id: 'c1', nameKey: 'C1' } as any
      const c2 = { id: 'c2', nameKey: 'C2' } as any
      setInputSignal(component, 'columns', [c1, c2])
      component.displayedColumnKeys.set(['c2', 'missing', 'c1'])

      expect(component.displayedColumns()).toEqual([c2, c1])
    })

    it('should set listGridPaginator and tablePaginator via paginator setter', () => {
      const { component } = createComponent(true)

      component.listGridPaginator.set(false)
      component.tablePaginator.set(false)

      component.paginator = true

      expect(component.listGridPaginator()).toBe(true)
      expect(component.tablePaginator()).toBe(true)
      expect(component.paginator).toBe(true)
    })

    it('should have correct default value for groupSelectionNoGroupSelectedKey', () => {
      const { component } = createComponent(true)

      expect(component.groupSelectionNoGroupSelectedKey()).toBe('OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED')
    })
  })

  describe('wiring and event forwarding (EventEmitters)', () => {
    it('should not forward delete/view/edit when not observed', () => {
      const { component } = createComponent(true)

      const deleteEmitSpy = jest.spyOn(component.deleteItem, 'emit')
      const viewEmitSpy = jest.spyOn(component.viewItem, 'emit')
      const editEmitSpy = jest.spyOn(component.editItem, 'emit')

      const element = { id: 'x' } as any
      
      component.onDeleteElement(element)
      component.onViewElement(element)
      component.onEditElement(element)

      expect(deleteEmitSpy).not.toHaveBeenCalled()
      expect(viewEmitSpy).not.toHaveBeenCalled()
      expect(editEmitSpy).not.toHaveBeenCalled()
    })

    it('should forward row selection only when selectionChanged is observed', () => {
      const { component } = createComponent(true)

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit')
      const rows = [{ id: 'r1' } as any]

      component.onRowSelectionChange(rows as any)
      expect(emitSpy).not.toHaveBeenCalled()

      component.selectionChanged.subscribe(jest.fn())
      component.onRowSelectionChange(rows as any)
      expect(emitSpy).toHaveBeenCalledWith(rows)
    })
  })

  describe('public handlers', () => {
    it('should update sort inputs and emit sorted on sort changes', () => {
      const { component } = createComponent(true)

      const sortedSpy = jest.spyOn(component.sorted, 'emit')
      component.sortDirection.set('ASCENDING' as any)
      component.sortField.set('old')

      component.onSortChange('new')
      TestBed.tick()
      expect(component.sortField()).toBe('new')
      expect(sortedSpy).toHaveBeenLastCalledWith({ sortColumn: 'new', sortDirection: 'ASCENDING' })

      component.onSortDirectionChange('DESCENDING' as any)
      TestBed.tick()
      expect(component.sortDirection()).toBe('DESCENDING')
      expect(sortedSpy).toHaveBeenLastCalledWith({ sortColumn: 'new', sortDirection: 'DESCENDING' })
    })

    it('should update layout and emit dataViewLayoutChange', () => {
      const { component } = createComponent(true)

      const layoutSpy = jest.spyOn(component.dataViewLayoutChange, 'emit')
      component.onDataViewLayoutChange('list')
      TestBed.tick()
      expect(component.layout()).toBe('list')
      expect(layoutSpy).toHaveBeenCalledWith('list')
    })

    it('should update selection state and emit on page events', () => {
      const { component } = createComponent(true)

      const pageSpy = jest.spyOn(component.pageChanged, 'emit')
      const pageSizeSpy = jest.spyOn(component.pageSizeChanged, 'emit')

      component.onPageChange(2)
      TestBed.tick()
      expect(component.page()).toBe(2)
      expect(pageSpy).toHaveBeenCalledWith(2)

      component.onPageSizeChange(25)
      TestBed.tick()
      expect(component.pageSize()).toBe(25)
      expect(pageSizeSpy).toHaveBeenCalledWith(25)
    })

    it('should update filters and emit filtered in filtering()', () => {
      const { component } = createComponent(true)

      const filteredSpy = jest.spyOn(component.filtered, 'emit')
      const filters = [{ columnId: 'c1', filterType: 'stringContains', value: 'x' } as any]

      component.filtering(filters)
      TestBed.tick()

      expect(component.filters()).toBe(filters)
      expect(filteredSpy).toHaveBeenCalledWith(filters)
    })

    it('should update sorting fields and emit sorted in sorting()', () => {
      const { component } = createComponent(true)

      const sortedSpy = jest.spyOn(component.sorted, 'emit')
      const event = { sortColumn: 'c1', sortDirection: 'DESCENDING' } as any

      component.sorting(event)
      TestBed.tick()

      expect(component.sortField()).toBe('c1')
      expect(component.sortDirection()).toBe('DESCENDING')
      expect(sortedSpy).toHaveBeenCalledWith(event)
    })

    it('should update action column config onActionColumnConfigChange', () => {
      const { component } = createComponent(true)

      component.frozenActionColumn.set(false)
      component.actionColumnPosition.set('right' as any)

      component.onActionColumnConfigChange({ frozenActionColumn: true, actionColumnPosition: 'left' } as any)

      expect(component.frozenActionColumn()).toBe(true)
      expect(component.actionColumnPosition()).toBe('left' as any)
    })
  })

  describe('template computed signals', () => {
    it('should return childTableCell when no PrimeNG template is defined', () => {
      const { component } = createComponent(true)

      const mockTemplate = {} as TemplateRef<any>
      setInputSignal(component, 'childTableCell', mockTemplate)
      setInputSignal(component, 'templates', [])

      expect(component._tableCell()).toBe(mockTemplate)
    })

    it('should return PrimeNG template when defined for tableCell', () => {
      const { component } = createComponent(true)

      const mockPrimeTemplate = {} as TemplateRef<any>
      const primeTemplateWrapper = {
        getType: () => 'tableCell',
        template: mockPrimeTemplate,
      } as PrimeTemplate

      setInputSignal(component, 'templates', [primeTemplateWrapper])

      expect(component.primeNgTableCell()).toBe(mockPrimeTemplate)
      expect(component._tableCell()).toBe(mockPrimeTemplate)
    })

    it('should prioritize PrimeNG template over childContent for dateTableCell', () => {
      const { component } = createComponent(true)

      const childTemplate = {} as TemplateRef<any>
      const primeTemplate = {} as TemplateRef<any>
      const primeTemplateWrapper = {
        getType: () => 'dateTableCell',
        template: primeTemplate,
      } as PrimeTemplate

      setInputSignal(component, 'childDateTableCell', childTemplate)
      setInputSignal(component, 'templates', [primeTemplateWrapper])

      expect(component._dateTableCell()).toBe(primeTemplate)
    })

    it('should return undefined when no template is defined for gridItem', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'childGridItem', undefined)
      setInputSignal(component, 'templates', [])

      expect(component._gridItem()).toBeUndefined()
    })

    it('should handle multiple template types and return correct ones', () => {
      const { component } = createComponent(true)

      const gridItemTemplate = {} as TemplateRef<any>
      const listItemTemplate = {} as TemplateRef<any>

      const templates = [
        { getType: () => 'gridItem', template: gridItemTemplate } as PrimeTemplate,
        { getType: () => 'listItem', template: listItemTemplate } as PrimeTemplate,
      ]

      setInputSignal(component, 'templates', templates)

      expect(component.primeNgGridItem()).toBe(gridItemTemplate)
      expect(component.primeNgListItem()).toBe(listItemTemplate)
      expect(component._gridItem()).toBe(gridItemTemplate)
      expect(component._listItem()).toBe(listItemTemplate)
    })

    it('should handle all table cell types with PrimeNG template prioritization', () => {
      const { component } = createComponent(true)

      const relativeDateTableCellTemplate = {} as TemplateRef<any>
      const translationKeyTableCellTemplate = {} as TemplateRef<any>
      const stringTableCellTemplate = {} as TemplateRef<any>
      const numberTableCellTemplate = {} as TemplateRef<any>

      const templates = [
        { getType: () => 'relativeDateTableCell', template: relativeDateTableCellTemplate } as PrimeTemplate,
        { getType: () => 'translationKeyTableCell', template: translationKeyTableCellTemplate } as PrimeTemplate,
        { getType: () => 'stringTableCell', template: stringTableCellTemplate } as PrimeTemplate,
        { getType: () => 'numberTableCell', template: numberTableCellTemplate } as PrimeTemplate,
      ]

      setInputSignal(component, 'templates', templates)

      expect(component._relativeDateTableCell()).toBe(relativeDateTableCellTemplate)
      expect(component._translationKeyTableCell()).toBe(translationKeyTableCellTemplate)
      expect(component._stringTableCell()).toBe(stringTableCellTemplate)
      expect(component._numberTableCell()).toBe(numberTableCellTemplate)
    })

    it('should handle list value templates with PrimeNG template prioritization', () => {
      const { component } = createComponent(true)

      const listValueTemplate = {} as TemplateRef<any>
      const translationKeyListValueTemplate = {} as TemplateRef<any>
      const numberListValueTemplate = {} as TemplateRef<any>
      const relativeDateListValueTemplate = {} as TemplateRef<any>
      const stringListValueTemplate = {} as TemplateRef<any>
      const dateListValueTemplate = {} as TemplateRef<any>

      const templates = [
        { getType: () => 'listValue', template: listValueTemplate } as PrimeTemplate,
        { getType: () => 'translationKeyListValue', template: translationKeyListValueTemplate } as PrimeTemplate,
        { getType: () => 'numberListValue', template: numberListValueTemplate } as PrimeTemplate,
        { getType: () => 'relativeDateListValue', template: relativeDateListValueTemplate } as PrimeTemplate,
        { getType: () => 'stringListValue', template: stringListValueTemplate } as PrimeTemplate,
        { getType: () => 'dateListValue', template: dateListValueTemplate } as PrimeTemplate,
      ]

      setInputSignal(component, 'templates', templates)

      expect(component._listValue()).toBe(listValueTemplate)
      expect(component._translationKeyListValue()).toBe(translationKeyListValueTemplate)
      expect(component._numberListValue()).toBe(numberListValueTemplate)
      expect(component._relativeDateListValue()).toBe(relativeDateListValueTemplate)
      expect(component._stringListValue()).toBe(stringListValueTemplate)
      expect(component._dateListValue()).toBe(dateListValueTemplate)
    })

    it('should handle table filter cell templates with PrimeNG template prioritization', () => {
      const { component } = createComponent(true)

      const tableFilterCellTemplate = {} as TemplateRef<any>
      const dateTableFilterCellTemplate = {} as TemplateRef<any>
      const relativeDateTableFilterCellTemplate = {} as TemplateRef<any>
      const translationKeyTableFilterCellTemplate = {} as TemplateRef<any>
      const stringTableFilterCellTemplate = {} as TemplateRef<any>
      const numberTableFilterCellTemplate = {} as TemplateRef<any>

      const templates = [
        { getType: () => 'tableFilterCell', template: tableFilterCellTemplate } as PrimeTemplate,
        { getType: () => 'dateTableFilterCell', template: dateTableFilterCellTemplate } as PrimeTemplate,
        { getType: () => 'relativeDateTableFilterCell', template: relativeDateTableFilterCellTemplate } as PrimeTemplate,
        { getType: () => 'translationKeyTableFilterCell', template: translationKeyTableFilterCellTemplate } as PrimeTemplate,
        { getType: () => 'stringTableFilterCell', template: stringTableFilterCellTemplate } as PrimeTemplate,
        { getType: () => 'numberTableFilterCell', template: numberTableFilterCellTemplate } as PrimeTemplate,
      ]

      setInputSignal(component, 'templates', templates)

      expect(component._tableFilterCell()).toBe(tableFilterCellTemplate)
      expect(component._dateTableFilterCell()).toBe(dateTableFilterCellTemplate)
      expect(component._relativeDateTableFilterCell()).toBe(relativeDateTableFilterCellTemplate)
      expect(component._translationKeyTableFilterCell()).toBe(translationKeyTableFilterCellTemplate)
      expect(component._stringTableFilterCell()).toBe(stringTableFilterCellTemplate)
      expect(component._numberTableFilterCell()).toBe(numberTableFilterCellTemplate)
    })

    it('should handle subtitle and other miscellaneous templates', () => {
      const { component } = createComponent(true)

      const gridItemSubtitleLinesTemplate = {} as TemplateRef<any>
      const listItemSubtitleLinesTemplate = {} as TemplateRef<any>
      const topCenterTemplate = {} as TemplateRef<any>

      const templates = [
        { getType: () => 'gridItemSubtitleLines', template: gridItemSubtitleLinesTemplate } as PrimeTemplate,
        { getType: () => 'listItemSubtitleLines', template: listItemSubtitleLinesTemplate } as PrimeTemplate,
        { getType: () => 'topCenter', template: topCenterTemplate } as PrimeTemplate,
      ]

      setInputSignal(component, 'templates', templates)

      expect(component._gridItemSubtitleLines()).toBe(gridItemSubtitleLinesTemplate)
      expect(component._listItemSubtitleLines()).toBe(listItemSubtitleLinesTemplate)
      expect(component._topCenter()).toBe(topCenterTemplate)
    })
  })

  describe('effects behavior', () => {
    it('should trigger filtered output when filters change via effect', () => {
      const { component } = createComponent(true)

      const filteredSpy = jest.spyOn(component.filtered, 'emit')
      const filters = [{ columnId: 'c1', filterType: 'stringContains', value: 'test' } as any]

      component.filters.set(filters)
      TestBed.tick()

      expect(filteredSpy).toHaveBeenCalledWith(filters)
    })

    it('should trigger sorted output when sortField without sortDirection changes via effect', () => {
      const { component } = createComponent(true)

      const sortedSpy = jest.spyOn(component.sorted, 'emit')

      component.sortField.set('name')
      TestBed.tick()

      expect(sortedSpy).toHaveBeenCalledWith({ sortColumn: 'name', sortDirection: 'NONE' })
    })

    it('should trigger sorted output when sortDirection without sortField changes via effect', () => {
      const { component } = createComponent(true)

      const sortedSpy = jest.spyOn(component.sorted, 'emit')

      component.sortDirection.set('DESCENDING' as any)
      TestBed.tick()

      expect(sortedSpy).toHaveBeenCalledWith({ sortColumn: '', sortDirection: 'DESCENDING' })
    })

    it('should trigger sorted output when sortField and sortDirection changes via effect', () => {
      const { component } = createComponent(true)

      const sortedSpy = jest.spyOn(component.sorted, 'emit')

      component.sortField.set('name')
      component.sortDirection.set('ASCENDING' as any)
      TestBed.tick()

      expect(sortedSpy).toHaveBeenCalledWith({ sortColumn: 'name', sortDirection: 'ASCENDING' })
    })

    it('should trigger dataViewLayoutChange when layout changes via effect', () => {
      const { component } = createComponent(true)

      const layoutSpy = jest.spyOn(component.dataViewLayoutChange, 'emit')

      component.layout.set('grid')
      TestBed.tick()

      expect(layoutSpy).toHaveBeenCalledWith('grid')
    })

    it('should trigger pageChanged when page changes via effect', () => {
      const { component } = createComponent(true)

      const pageSpy = jest.spyOn(component.pageChanged, 'emit')

      component.page.set(3)
      TestBed.tick()

      expect(pageSpy).toHaveBeenCalledWith(3)
    })

    it('should trigger pageSizeChanged when pageSize changes via effect', () => {
      const { component } = createComponent(true)

      const pageSizeSpy = jest.spyOn(component.pageSizeChanged, 'emit')

      component.pageSize.set(50)
      TestBed.tick()

      expect(pageSizeSpy).toHaveBeenCalledWith(50)
    })

    it('should not trigger pageSizeChanged when pageSize is undefined', () => {
      const { component } = createComponent(true)

      const pageSizeSpy = jest.spyOn(component.pageSizeChanged, 'emit')

      component.pageSize.set(undefined)
      TestBed.tick()

      expect(pageSizeSpy).not.toHaveBeenCalled()
    })

    it('should trigger displayedColumnKeysChange when displayedColumnKeys changes via effect', () => {
      const { component } = createComponent(true)

      const displayedSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

      component.displayedColumnKeys.set(['c1', 'c2'])
      TestBed.tick()

      expect(displayedSpy).toHaveBeenCalledWith(['c1', 'c2'])
    })

    it('should clear selectedGroupKey via layout effect when invalid group is selected', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'validGroup', predefinedGroupKeys: [] } as any])
      setInputSignal(component, 'customGroupKey', 'custom')
      component.selectedGroupKey.set('invalidGroup')

      component.layout.set('grid')
      TestBed.tick()

      expect(component.selectedGroupKey()).toBeUndefined()
    })

    it('should not clear selectedGroupKey via layout effect when valid group is selected', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'validGroup', predefinedGroupKeys: [] } as any])
      setInputSignal(component, 'customGroupKey', 'custom')
      component.selectedGroupKey.set('validGroup')

      component.layout.set('table')
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('validGroup')
    })

    it('should not clear selectedGroupKey when it equals customGroupKey', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'group1', predefinedGroupKeys: [] } as any])
      setInputSignal(component, 'customGroupKey', 'myCustom')
      component.selectedGroupKey.set('myCustom')

      component.layout.set('list')
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('myCustom')
    })
  })

  describe('registerEventListenerForDataView', () => {
    it('should not register listeners when outputs are not observed', () => {
      const { component } = createComponent(true)

      // Given: No subscriptions to parent InteractiveDataViewComponent outputs
      // (component.deleteItem, viewItem, etc. are not observed)

      // Given: Mock child DataViewComponent
      const mockDataView = {
        deleteItem: { observed: () => false, subscribe: jest.fn() },
        viewItem: { observed: () => false, subscribe: jest.fn() },
        editItem: { observed: () => false, subscribe: jest.fn() },
        selectionChanged: { observed: () => false, subscribe: jest.fn() },
      }

      setInputSignal(component, 'dataViewComponent', mockDataView)

      // When: Registering event listeners
      component.registerEventListenerForDataView()

      // Then: Since parent outputs are not observed, don't subscribe to child
      expect(mockDataView.deleteItem.subscribe).not.toHaveBeenCalled()
      expect(mockDataView.viewItem.subscribe).not.toHaveBeenCalled()
      expect(mockDataView.editItem.subscribe).not.toHaveBeenCalled()
      expect(mockDataView.selectionChanged.subscribe).not.toHaveBeenCalled()
    })

    it('should register deleteItem listener when observed and not already registered', () => {
      const { component } = createComponent(true)

      // Given: Subscribe to parent InteractiveDataViewComponent's deleteItem output
      // This simulates an external consumer listening to the parent component's events
      component.deleteItem.subscribe(jest.fn())

      // Given: Mock child DataViewComponent where deleteItem is NOT yet observed
      // observed() returns false = no one has subscribed to the child's output yet
      // This means we need to create a subscription to forward events from child to parent
      const mockDataView = {
        deleteItem: { observed: () => false, subscribe: jest.fn() },
        viewItem: { observed: () => false, subscribe: jest.fn() },
        editItem: { observed: () => false, subscribe: jest.fn() },
        selectionChanged: { observed: () => false, subscribe: jest.fn() },
      }

      setInputSignal(component, 'dataViewComponent', mockDataView)

      // When: Registering event listeners
      component.registerEventListenerForDataView()

      // Then: Since parent's deleteItem is observed but child's is not,
      // the method should subscribe to child's deleteItem to establish event forwarding
      expect(mockDataView.deleteItem.subscribe).toHaveBeenCalled()
    })

    it('should not register listeners twice when already observed in dataView', () => {
      const { component } = createComponent(true)

      // Given: Subscribe to parent InteractiveDataViewComponent's outputs
      component.deleteItem.subscribe(jest.fn())
      component.viewItem.subscribe(jest.fn())

      // Given: Mock child DataViewComponent where outputs are ALREADY observed
      // observed() returns true = someone already subscribed (previous call established forwarding)
      const mockDataView = {
        deleteItem: { observed: () => true, subscribe: jest.fn() },
        viewItem: { observed: () => true, subscribe: jest.fn() },
        editItem: { observed: () => false, subscribe: jest.fn() },
        selectionChanged: { observed: () => false, subscribe: jest.fn() },
      }

      setInputSignal(component, 'dataViewComponent', mockDataView)

      // When: Registering event listeners
      component.registerEventListenerForDataView()

      // Then: Child's outputs are already observed, so don't subscribe again
      expect(mockDataView.deleteItem.subscribe).not.toHaveBeenCalled()
      expect(mockDataView.viewItem.subscribe).not.toHaveBeenCalled()
    })
  })

  describe('edge cases and integration', () => {
    it('should handle rapid layout changes without breaking state', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [{ id: 'c1', nameKey: 'group1', predefinedGroupKeys: [] } as any])
      setInputSignal(component, 'customGroupKey', 'custom')

      component.layout.set('grid')
      TestBed.tick()
      component.layout.set('list')
      TestBed.tick()
      component.layout.set('table')
      TestBed.tick()

      expect(component.layout()).toBe('table')
    })

    it('should handle empty columns array gracefully', () => {
      const { component } = createComponent(true)

      setInputSignal(component, 'columns', [])
      component.displayedColumnKeys.set(['c1', 'c2'])

      expect(component.displayedColumns()).toEqual([])
    })

    it('should properly filter displayedColumns when some keys do not match', () => {
      const { component } = createComponent(true)

      const c1 = { id: 'c1', nameKey: 'C1' } as any
      const c2 = { id: 'c2', nameKey: 'C2' } as any
      setInputSignal(component, 'columns', [c1, c2])

      component.displayedColumnKeys.set(['c1', 'nonexistent', 'c2', 'another-missing'])

      expect(component.displayedColumns()).toEqual([c1, c2])
    })

    it('should maintain correct order of displayedColumns based on displayedColumnKeys', () => {
      const { component } = createComponent(true)

      const c1 = { id: 'c1', nameKey: 'C1' } as any
      const c2 = { id: 'c2', nameKey: 'C2' } as any
      const c3 = { id: 'c3', nameKey: 'C3' } as any
      setInputSignal(component, 'columns', [c1, c2, c3])

      component.displayedColumnKeys.set(['c3', 'c1', 'c2'])

      expect(component.displayedColumns()).toEqual([c3, c1, c2])
    })
  })

  describe('state synchronization', () => {
    it('should synchronize state when multiple inputs change in ngOnInit', () => {
      const { component } = createComponent(true)

      // Set columns where one nameKey matches the defaultGroupKey to avoid layout effect clearing it
      setInputSignal(component, 'columns', [
        { id: 'c1', nameKey: 'g1', predefinedGroupKeys: ['g1'] } as any,
        { id: 'c2', nameKey: 'G2', predefinedGroupKeys: ['g2'] } as any,
      ])
      setInputSignal(component, 'defaultGroupKey', 'g1')
      setInputSignal(component, 'customGroupKey', 'custom')
      component.layout.set('grid')

      component.ngOnInit()
      TestBed.tick()

      expect(component.selectedGroupKey()).toBe('g1')
      expect(component.displayedColumnKeys()).toEqual(['c1'])
    })

    it('should handle componentStateChanged emission with all state sources', () => {
      const { component } = createComponent(true)

      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.layout.set('table')
      component.ngOnInit()

      component.columnGroupSelectionComponentState$.next({ activeColumnGroupKey: 'g1', displayedColumns: [] } as any)
      component.customGroupColumnSelectorComponentState$.next({ displayedColumns: [], activeColumnGroupKey: 'g1' } as any)
      component.dataLayoutComponentState$.next({ layout: 'table', supportedViewLayouts: ['table'] } as any)
      component.dataListGridSortingComponentState$.next({ sortField: 'name', sortDirection: 'ASCENDING' } as any)
      component.dataViewComponentState$.next({ page: 1, pageSize: 25 } as any)
      component.filterViewComponentState$.next({ filters: [] } as any)

      TestBed.tick()

      expect(stateSpy).toHaveBeenCalled()
      const emittedState = stateSpy.mock.calls[stateSpy.mock.calls.length - 1][0]
      expect(emittedState).toBeDefined()
      expect(emittedState.layout).toBe('table')
    })
  })
})
