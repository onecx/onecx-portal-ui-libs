import { SlotService } from '@onecx/angular-remote-components'
import { EventEmitter } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs'
import { DataViewComponent, RowListGridData } from '../data-view/data-view.component'
import { InteractiveDataViewComponent } from './interactive-data-view.component'

describe('InteractiveDataViewComponent (class logic)', () => {
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

  it('should startWith column-group + custom-group state when column group component is NOT defined', () => {
    const { component } = createComponent(false)

    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

    component.layout = 'grid'
    component.columns = [{ id: 'c1', nameKey: 'group-a' } as any]
    component.displayedColumnKeys = ['c1']
    component.defaultGroupKey = 'dg'
    component.customGroupKey = 'custom'
    component.selectedGroupKey = 'group-a'

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

  it('should keep selectedGroupKey unchanged on layout change when column group selection component is NOT defined', () => {
    const { component } = createComponent(false)

    component.columns = [{ id: 'c1', nameKey: 'some-group' } as any]
    component.selectedGroupKey = 'not-present'
    component.customGroupKey = 'custom'

    component.dataViewLayoutChange.emit('grid')

    expect(component.selectedGroupKey).toBe('not-present')
  })

  it('should set groupSelectionChangedSlotEmitter fallback groupKey to defaultGroupKey when selectedGroupKey is undefined', () => {
    const { component } = createComponent(true)

    const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

    component.columns = [{ id: 'c1', nameKey: 'G', predefinedGroupKeys: [] } as any]
    component.displayedColumnKeys = ['c1']
    component.defaultGroupKey = 'dg'
    component.selectedGroupKey = undefined

    component.groupSelectionChangedSlotEmitter.emit(undefined)

    expect(component.selectedGroupKey).toBe('dg')
    expect(emitSpy).toHaveBeenCalledWith(['c1'])
  })

  it('should not clear selectedGroupKey on layout change when selectedGroupKey matches a column nameKey', () => {
    const { component } = createComponent(true)

    component.columns = [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any]
    component.selectedGroupKey = 'some-group'
    component.customGroupKey = 'custom'

    component.dataViewLayoutChange.emit('grid')

    expect(component.selectedGroupKey).toBe('some-group')
  })

  it('should not clear selectedGroupKey on layout change when selectedGroupKey equals customGroupKey', () => {
    const { component } = createComponent(true)

    component.columns = [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any]
    component.customGroupKey = 'custom'
    component.selectedGroupKey = 'custom'

    component.dataViewLayoutChange.emit('grid')

    expect(component.selectedGroupKey).toBe('custom')
  })

  it('should initialize displayedColumnKeysChange when defaultGroupKey equals customGroupKey', () => {
    const { component } = createComponent(true)

    const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    component.columns = [{ id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any]
    component.customGroupKey = 'custom'
    component.defaultGroupKey = 'custom'

    component.ngOnInit()

    expect(component.displayedColumnKeys).toEqual([])
    expect(emitSpy).toHaveBeenCalledWith([])
  })

  it('should update displayedColumnKeys when displayedColumnKeys setter is called', () => {
    const { component } = createComponent(true)

    const values: string[][] = []
    const sub = component.displayedColumnKeys$.subscribe((v) => values.push(v))
    component.displayedColumnKeys = ['a', 'b']
    sub.unsubscribe()

    expect(component.displayedColumnKeys).toEqual(['a', 'b'])
    expect(values.at(-1)).toEqual(['a', 'b'])
  })

  it('should reflect template accessors (_tableCell, _gridItem, etc.)', () => {
    const { component } = createComponent(true)

    const tableCell = {} as any
    const gridItem = {} as any
    const listItem = {} as any
    const stringTableCell = {} as any
    const numberTableCell = {} as any
    const dateTableCell = {} as any
    const relativeDateTableCell = {} as any
    const translationKeyTableCell = {} as any
    const gridItemSubtitleLines = {} as any
    const listItemSubtitleLines = {} as any
    const topCenter = {} as any
    const listValue = {} as any
    const translationKeyListValue = {} as any
    const numberListValue = {} as any
    const relativeDateListValue = {} as any
    const stringListValue = {} as any
    const dateListValue = {} as any
    const tableFilterCell = {} as any
    const dateTableFilterCell = {} as any
    const relativeDateTableFilterCell = {} as any
    const translationKeyTableFilterCell = {} as any
    const stringTableFilterCell = {} as any
    const numberTableFilterCell = {} as any

    component.tableCell = tableCell
    component.gridItem = gridItem
    component.listItem = listItem
    component.stringTableCell = stringTableCell
    component.numberTableCell = numberTableCell
    component.dateTableCell = dateTableCell
    component.relativeDateTableCell = relativeDateTableCell
    component.translationKeyTableCell = translationKeyTableCell
    component.gridItemSubtitleLines = gridItemSubtitleLines
    component.listItemSubtitleLines = listItemSubtitleLines
    component.topCenter = topCenter
    component.listValue = listValue
    component.translationKeyListValue = translationKeyListValue
    component.numberListValue = numberListValue
    component.relativeDateListValue = relativeDateListValue
    component.stringListValue = stringListValue
    component.dateListValue = dateListValue
    component.tableFilterCell = tableFilterCell
    component.dateTableFilterCell = dateTableFilterCell
    component.relativeDateTableFilterCell = relativeDateTableFilterCell
    component.translationKeyTableFilterCell = translationKeyTableFilterCell
    component.stringTableFilterCell = stringTableFilterCell
    component.numberTableFilterCell = numberTableFilterCell

    expect(component._tableCell).toBe(tableCell)
    expect(component._gridItem).toBe(gridItem)
    expect(component._listItem).toBe(listItem)
    expect(component._stringTableCell).toBe(stringTableCell)
    expect(component._numberTableCell).toBe(numberTableCell)
    expect(component._dateTableCell).toBe(dateTableCell)
    expect(component._relativeDateTableCell).toBe(relativeDateTableCell)
    expect(component._translationKeyTableCell).toBe(translationKeyTableCell)
    expect(component._gridItemSubtitleLines).toBe(gridItemSubtitleLines)
    expect(component._listItemSubtitleLines).toBe(listItemSubtitleLines)
    expect(component._listValue).toBe(listValue)
    expect(component._translationKeyListValue).toBe(translationKeyListValue)
    expect(component._numberListValue).toBe(numberListValue)
    expect(component._relativeDateListValue).toBe(relativeDateListValue)
    expect(component._stringListValue).toBe(stringListValue)
    expect(component._dateListValue).toBe(dateListValue)
    expect(component._tableFilterCell).toBe(tableFilterCell)
    expect(component._dateTableFilterCell).toBe(dateTableFilterCell)
    expect(component._relativeDateTableFilterCell).toBe(relativeDateTableFilterCell)
    expect(component._translationKeyTableFilterCell).toBe(translationKeyTableFilterCell)
    expect(component._stringTableFilterCell).toBe(stringTableFilterCell)
    expect(component._numberTableFilterCell).toBe(numberTableFilterCell)

    // direct properties that don't have dedicated "_" getters
    expect(component.primeNgTopCenter).toBeUndefined()
    component.primeNgTopCenter = topCenter
    expect(component.primeNgTopCenter).toBe(topCenter)
  })

  it('should initialize displayedColumns$ and map keys to columns', (done) => {
    const { component } = createComponent(true)

    const c1 = { id: 'c1', nameKey: 'C1' } as any
    const c2 = { id: 'c2', nameKey: 'C2' } as any
    component.columns = [c1, c2]

    component.ngOnInit()

    // initial emission should be []
    const values: any[] = []
    const sub = component.displayedColumns$?.subscribe((v) => values.push(v))

    component.displayedColumnKeys = ['c2', 'missing', 'c1']

    setTimeout(() => {
      sub?.unsubscribe()
      expect(values.at(-1)).toEqual([c2, c1])
      done()
    }, 0)
  })

  it('should not set groupSelectionNoGroupSelectedKey when already set', () => {
    const { component } = createComponent(true)

    component.groupSelectionNoGroupSelectedKey = 'ALREADY_SET'
    component.ngOnInit()

    expect(component.groupSelectionNoGroupSelectedKey).toBe('ALREADY_SET')
  })

  it('should set firstColumnId to undefined when columns is empty', () => {
    const { component } = createComponent(true)

    component.columns = []
    component.ngOnInit()

    expect(component.firstColumnId).toBeUndefined()
  })

  it('should set firstColumnId to first column id when columns is non-empty', () => {
    const { component } = createComponent(true)

    component.columns = [{ id: 'first', nameKey: 'First' } as any, { id: 'second', nameKey: 'Second' } as any]
    component.ngOnInit()

    expect(component.firstColumnId).toBe('first')
  })

  it('should keep displayedColumnKeys empty when defaultGroupKey is empty', () => {
    const { component } = createComponent(true)

    const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    component.columns = [{ id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any]
    component.defaultGroupKey = ''

    component.ngOnInit()

    expect(component.displayedColumnKeys).toEqual([])
    expect(emitSpy).toHaveBeenCalledWith([])
  })

  it('should set displayedColumnKeys from predefinedGroupKeys when defaultGroupKey is set and not customGroupKey', () => {
    const { component } = createComponent(true)

    component.columns = [
      { id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any,
      { id: 'b', nameKey: 'B', predefinedGroupKeys: ['g2'] } as any,
      { id: 'c', nameKey: 'C', predefinedGroupKeys: ['g1', 'g2'] } as any,
    ]
    component.defaultGroupKey = 'g2'
    component.customGroupKey = 'custom'

    component.ngOnInit()

    expect(component.displayedColumnKeys).toEqual(['b', 'c'])
  })

  it('should update data when data input setter is called', () => {
    const { component } = createComponent(true)

    const data = [{ id: '1' } as any]
    component.data = data

    expect(component._data).toBe(data)
    expect(component.data).toBe(data)
  })

  it('should update selectedRows input without side effects', () => {
    const { component } = createComponent(true)

    const rows = [{ id: 'r1' } as any]
    component.selectedRows = rows as any

    expect(component.selectedRows).toBe(rows as any)
  })

  it('should cover Input defaults (selectDisplayedChips, sortStates, pageSizes, fallbackImage)', () => {
    const { component } = createComponent(true)

    expect(component.fallbackImage).toBe('placeholder.png')
    expect(component.pageSizes).toEqual([10, 25, 50])
    expect(component.sortStates).toEqual(['ASCENDING', 'DESCENDING', 'NONE'] as any)

    const f1 = { columnId: 'c1' } as any
    const f2 = { columnId: 'c2' } as any
    const f3 = { columnId: 'c3' } as any
    const f4 = { columnId: 'c4' } as any

    // should return limited list (implementation uses limit(..., 3, { reverse: true }))
    const selected = component.selectDisplayedChips([f1, f2, f3, f4], [])
    expect(selected.length).toBe(3)
    expect(selected).toEqual([f4, f3, f2])

    component.templates = undefined
    expect(component.templates$.getValue()).toBeUndefined()
  })

  it('should not subscribe to DataView outputs when DataView already has observers', () => {
    const { component } = createComponent(true)

    component.deleteItem.subscribe(jest.fn())
    component.viewItem.subscribe(jest.fn())
    component.editItem.subscribe(jest.fn())
    component.selectionChanged.subscribe(jest.fn())

    const dvDelete = new EventEmitter<RowListGridData>()
    const dvView = new EventEmitter<RowListGridData>()
    const dvEdit = new EventEmitter<RowListGridData>()
    const dvSelection = new EventEmitter<any[]>()

    // make them "observed" before wiring
    dvDelete.subscribe(jest.fn())
    dvView.subscribe(jest.fn())
    dvEdit.subscribe(jest.fn())
    dvSelection.subscribe(jest.fn())

    const deleteSubscribeSpy = jest.spyOn(dvDelete, 'subscribe')
    const viewSubscribeSpy = jest.spyOn(dvView, 'subscribe')
    const editSubscribeSpy = jest.spyOn(dvEdit, 'subscribe')
    const selectionSubscribeSpy = jest.spyOn(dvSelection, 'subscribe')

    const dataViewMock = {
      deleteItem: dvDelete,
      viewItem: dvView,
      editItem: dvEdit,
      selectionChanged: dvSelection,
    } as unknown as DataViewComponent

    component.dataView = dataViewMock

    expect(deleteSubscribeSpy).not.toHaveBeenCalled()
    expect(viewSubscribeSpy).not.toHaveBeenCalled()
    expect(editSubscribeSpy).not.toHaveBeenCalled()
    expect(selectionSubscribeSpy).not.toHaveBeenCalled()
  })

  it('should initialize displayedColumnKeys from defaultGroupKey and emit displayedColumnKeysChange', () => {
    const { component } = createComponent(true)

    const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    component.columns = [
      { id: 'a', nameKey: 'A', predefinedGroupKeys: ['g1'] } as any,
      { id: 'b', nameKey: 'B', predefinedGroupKeys: ['g2'] } as any,
    ]
    component.defaultGroupKey = 'g1'
    component.customGroupKey = 'custom'

    component.ngOnInit()

    expect(component.selectedGroupKey).toBe('g1')
    expect(component.displayedColumnKeys).toEqual(['a'])
    expect(emitSpy).toHaveBeenCalledWith(['a'])
    expect(component.firstColumnId).toBe('a')
  })

  it('should fall back groupSelectionNoGroupSelectedKey when unset', () => {
    const { component } = createComponent(true)
    component.groupSelectionNoGroupSelectedKey = '' as any

    component.ngOnInit()

    expect(component.groupSelectionNoGroupSelectedKey).toBe('OCX_INTERACTIVE_DATA_VIEW.NO_GROUP_SELECTED')
  })

  it('should update column group selection state when groupSelectionChangedSlotEmitter emits undefined', () => {
    const { component } = createComponent(true)
    const emitSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    const stateSpy = jest.fn()
    component.columnGroupSelectionComponentState$.subscribe(stateSpy)

    component.columns = [{ id: 'c1', nameKey: 'G', predefinedGroupKeys: [] } as any]
    component.displayedColumnKeys = ['c1']
    component.defaultGroupKey = 'dg'
    component.selectedGroupKey = 'sg'

    component.groupSelectionChangedSlotEmitter.emit(undefined)

    expect(component.displayedColumnKeys).toEqual(['c1'])
    expect(component.selectedGroupKey).toBe('sg')
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

    component.columns = [{ id: 'c1', nameKey: 'some-group', predefinedGroupKeys: [] } as any]
    component.selectedGroupKey = 'not-present'
    component.customGroupKey = 'custom'

    component.dataViewLayoutChange.emit('grid')

    expect(component.selectedGroupKey).toBeUndefined()
  })

  it('should wire DataView events only when corresponding outputs are observed', () => {
    const { component } = createComponent(true)

    const deleteSpy = jest.spyOn(component.deleteItem, 'emit')
    const viewSpy = jest.spyOn(component.viewItem, 'emit')
    const editSpy = jest.spyOn(component.editItem, 'emit')
    const selectionSpy = jest.spyOn(component.selectionChanged, 'emit')

    component.deleteItem.subscribe(jest.fn())
    component.viewItem.subscribe(jest.fn())
    component.editItem.subscribe(jest.fn())
    component.selectionChanged.subscribe(jest.fn())

    const dataViewMock = {
      deleteItem: new EventEmitter<RowListGridData>(),
      viewItem: new EventEmitter<RowListGridData>(),
      editItem: new EventEmitter<RowListGridData>(),
      selectionChanged: new EventEmitter<any[]>(),
    } as unknown as DataViewComponent

    component.dataView = dataViewMock

    const element = { id: 'x' } as any
    dataViewMock.deleteItem.emit(element)
    dataViewMock.viewItem.emit(element)
    dataViewMock.editItem.emit(element)
    dataViewMock.selectionChanged.emit([{ id: 'r1' } as any])

    expect(deleteSpy).toHaveBeenCalledWith(element)
    expect(viewSpy).toHaveBeenCalledWith(element)
    expect(editSpy).toHaveBeenCalledWith(element)
    expect(selectionSpy).toHaveBeenCalledWith([{ id: 'r1' } as any])
  })

  it('should update sort inputs and emit sorted on sort changes', () => {
    const { component } = createComponent(true)

    const sortedSpy = jest.spyOn(component.sorted, 'emit')
    component.sortDirection = 'ASCENDING' as any
    component.sortField = 'old'

    component.onSortChange('new')
    expect(component.sortField).toBe('new')
    expect(sortedSpy).toHaveBeenLastCalledWith({ sortColumn: 'new', sortDirection: 'ASCENDING' })

    component.onSortDirectionChange('DESCENDING' as any)
    expect(component.sortDirection).toBe('DESCENDING')
    expect(sortedSpy).toHaveBeenLastCalledWith({ sortColumn: 'new', sortDirection: 'DESCENDING' })
  })

  it('should update layout and emit dataViewLayoutChange', () => {
    const { component } = createComponent(true)

    const layoutSpy = jest.spyOn(component.dataViewLayoutChange, 'emit')
    component.onDataViewLayoutChange('list')
    expect(component.layout).toBe('list')
    expect(layoutSpy).toHaveBeenCalledWith('list')
  })

  it('should update selection state and emit on page events', () => {
    const { component } = createComponent(true)

    const pageSpy = jest.spyOn(component.pageChanged, 'emit')
    const pageSizeSpy = jest.spyOn(component.pageSizeChanged, 'emit')

    component.onPageChange(2)
    expect(component.page).toBe(2)
    expect(pageSpy).toHaveBeenCalledWith(2)

    component.onPageSizeChange(25)
    expect(component.pageSize).toBe(25)
    expect(pageSizeSpy).toHaveBeenCalledWith(25)
  })

  it('should startWith empty sorting state when layout is table', () => {
    const { component } = createComponent(true)

    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
    component.layout = 'table'
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
    component.layout = 'grid'
    component.columns = [{ id: 'c1', nameKey: 'C1' } as any]
    component.displayedColumnKeys = ['c1']

    component.ngOnInit()

    component.dataListGridSortingComponentState$.next({} as any)
    component.filterViewComponentState$.next({} as any)

    component.dataLayoutComponentState$.next({ layout: 'grid', supportedViewLayouts: ['grid'] } as any)
    component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)

    const lastValue = (stateSpy.mock.calls.at(-1) ?? [undefined])[0]
    expect(lastValue).toEqual(
      expect.objectContaining({
        activeColumnGroupKey: component.selectedGroupKey,
        actionColumnConfig: expect.any(Object),
      })
    )
  })

  it('should startWith filter state when filter view is disabled', () => {
    const { component } = createComponent(true)

    const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
    component.disableFilterView = true
    component.filters = [{ columnId: 'c1', filterType: 'stringContains', value: 'x' } as any]
    component.ngOnInit()

    component.columnGroupSelectionComponentState$.next({} as any)
    component.customGroupColumnSelectorComponentState$.next({} as any)
    component.dataListGridSortingComponentState$.next({} as any)

    component.dataLayoutComponentState$.next({ layout: 'table', supportedViewLayouts: ['table'] } as any)
    component.dataViewComponentState$.next({ page: 0, pageSize: 10 } as any)

    const lastValue = (stateSpy.mock.calls.at(-1) ?? [undefined])[0]
    expect(lastValue).toEqual(expect.objectContaining({ filters: component.filters }))
  })

  it('should map PrimeTemplate types to primeNg* templates in ngAfterContentInit', () => {
    const { component } = createComponent(true)

    const makeTpl = (type: string, template: any) => ({
      getType: () => type,
      template,
    })

    const t1 = {} as any
    const t2 = {} as any
    const t3 = {} as any

    component.templates$.next({
      forEach: (cb: any) => {
        ;[makeTpl('tableCell', t1), makeTpl('gridItem', t2), makeTpl('numberTableFilterCell', t3)].forEach((x) => cb(x))
      },
    } as any)

    component.ngAfterContentInit()

    expect(component.primeNgTableCell).toBe(t1)
    expect(component.primeNgGridItem).toBe(t2)
    expect(component.primeNgNumberTableFilterCell).toBe(t3)
  })

  it('should not forward delete/view/edit when not observed', () => {
    const { component } = createComponent(true)

    const deleteSpy = jest.spyOn(component.deleteItem, 'emit')
    const viewSpy = jest.spyOn(component.viewItem, 'emit')
    const editSpy = jest.spyOn(component.editItem, 'emit')

    component.isDeleteItemObserved = false
    component.isViewItemObserved = false
    component.isEditItemObserved = false

    const element = { id: 'x' } as any
    component.onDeleteElement(element)
    component.onViewElement(element)
    component.onEditElement(element)

    expect(deleteSpy).not.toHaveBeenCalled()
    expect(viewSpy).not.toHaveBeenCalled()
    expect(editSpy).not.toHaveBeenCalled()
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

  it('should update filters and emit filtered in filtering()', () => {
    const { component } = createComponent(true)

    const filteredSpy = jest.spyOn(component.filtered, 'emit')
    const filters = [{ columnId: 'c1', filterType: 'stringContains', value: 'x' } as any]

    component.filtering(filters)

    expect(component.filters).toBe(filters)
    expect(filteredSpy).toHaveBeenCalledWith(filters)
  })

  it('should update sorting fields and emit sorted in sorting()', () => {
    const { component } = createComponent(true)

    const sortedSpy = jest.spyOn(component.sorted, 'emit')
    const event = { sortColumn: 'c1', sortDirection: 'DESCENDING' } as any

    component.sorting(event)

    expect(component.sortField).toBe('c1')
    expect(component.sortDirection).toBe('DESCENDING')
    expect(sortedSpy).toHaveBeenCalledWith(event)
  })

  it('should update displayedColumnKeys and selectedGroupKey on column group selection change', () => {
    const { component } = createComponent(true)

    const displayedColumnKeysSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

    component.onColumnGroupSelectionChange({
      groupKey: 'g1',
      activeColumns: [{ id: 'a' } as any, { id: 'b' } as any],
    } as any)

    expect(component.selectedGroupKey).toBe('g1')
    expect(component.displayedColumnKeys).toEqual(['a', 'b'])
    expect(displayedColumnKeysSpy).toHaveBeenCalledWith(['a', 'b'])
  })

  it('should update displayedColumnKeys and set selectedGroupKey to customGroupKey on column selection change', () => {
    const { component } = createComponent(true)

    const displayedColumnKeysSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')
    component.customGroupKey = 'custom'

    component.onColumnSelectionChange({ activeColumns: [{ id: 'x' } as any] } as any)

    expect(component.selectedGroupKey).toBe('custom')
    expect(component.displayedColumnKeys).toEqual(['x'])
    expect(displayedColumnKeysSpy).toHaveBeenCalledWith(['x'])
  })

  it('should update action column config onActionColumnConfigChange', () => {
    const { component } = createComponent(true)

    component.frozenActionColumn = false
    component.actionColumnPosition = 'right' as any

    component.onActionColumnConfigChange({ frozenActionColumn: true, actionColumnPosition: 'left' } as any)

    expect(component.frozenActionColumn).toBe(true)
    expect(component.actionColumnPosition).toBe('left' as any)
  })

  it('should map displayedColumnKeys to existing columns in getDisplayedColumns', () => {
    const { component } = createComponent(true)

    const c1 = { id: 'c1', nameKey: 'C1' } as any
    const c2 = { id: 'c2', nameKey: 'C2' } as any
    component.columns = [c1, c2]
    component.displayedColumnKeys = ['c2', 'missing', 'c1']

    expect(component.getDisplayedColumns()).toEqual([c2, c1])
  })

  it('should set listGridPaginator and tablePaginator via paginator setter', () => {
    const { component } = createComponent(true)

    component.listGridPaginator = false
    component.tablePaginator = false

    component.paginator = true

    expect(component.listGridPaginator).toBe(true)
    expect(component.tablePaginator).toBe(true)
    expect(component.paginator).toBe(true)
  })

  it('should reflect selectedGroupKey through selectedGroupKey$ BehaviorSubject', () => {
    const { component } = createComponent(true)

    component.selectedGroupKey = 'g1'
    expect(component.selectedGroupKey).toBe('g1')
    expect(component.selectedGroupKey$.getValue()).toBe('g1')
  })

  it('should wire DataViewComponent through the dataView ViewChild setter/getter', () => {
    const { component } = createComponent(true)

    const registerSpy = jest.spyOn(component, 'registerEventListenerForDataView')
    const dataViewRef = { deleteItem: new EventEmitter<any>(), viewItem: new EventEmitter<any>(), editItem: new EventEmitter<any>(), selectionChanged: new EventEmitter<any>() } as any

    component.dataView = dataViewRef

    expect(component._dataViewComponent).toBe(dataViewRef)
    expect(component.dataView).toBe(dataViewRef)
    expect(registerSpy).toHaveBeenCalled()
  })

  it('should map all supported PrimeTemplate types in ngAfterContentInit', () => {
    const { component } = createComponent(true)

    const makeTpl = (type: string, template: any) => ({
      getType: () => type,
      template,
    })

    const templatesByType: Record<string, any> = {
      tableCell: {},
      dateTableCell: {},
      relativeDateTableCell: {},
      translationKeyTableCell: {},
      gridItemSubtitleLines: {},
      listItemSubtitleLines: {},
      stringTableCell: {},
      numberTableCell: {},
      gridItem: {},
      listItem: {},
      topCenter: {},
      listValue: {},
      translationKeyListValue: {},
      numberListValue: {},
      relativeDateListValue: {},
      stringListValue: {},
      dateListValue: {},
      tableFilterCell: {},
      dateTableFilterCell: {},
      relativeDateTableFilterCell: {},
      translationKeyTableFilterCell: {},
      stringTableFilterCell: {},
      numberTableFilterCell: {},
    }

    component.templates$.next({
      forEach: (cb: any) => {
        Object.entries(templatesByType)
          .map(([type, tpl]) => makeTpl(type, tpl))
          .forEach((x) => cb(x))
      },
    } as any)

    component.ngAfterContentInit()

    expect(component.primeNgTableCell).toBe(templatesByType['tableCell'])
    expect(component.primeNgDateTableCell).toBe(templatesByType['dateTableCell'])
    expect(component.primeNgRelativeDateTableCell).toBe(templatesByType['relativeDateTableCell'])
    expect(component.primeNgTranslationKeyTableCell).toBe(templatesByType['translationKeyTableCell'])
    expect(component.primeNgGridItemSubtitleLines).toBe(templatesByType['gridItemSubtitleLines'])
    expect(component.primeNgListItemSubtitleLines).toBe(templatesByType['listItemSubtitleLines'])
    expect(component.primeNgStringTableCell).toBe(templatesByType['stringTableCell'])
    expect(component.primeNgNumberTableCell).toBe(templatesByType['numberTableCell'])
    expect(component.primeNgGridItem).toBe(templatesByType['gridItem'])
    expect(component.primeNgListItem).toBe(templatesByType['listItem'])
    expect(component.primeNgTopCenter).toBe(templatesByType['topCenter'])
    expect(component.primeNgListValue).toBe(templatesByType['listValue'])
    expect(component.primeNgTranslationKeyListValue).toBe(templatesByType['translationKeyListValue'])
    expect(component.primeNgNumberListValue).toBe(templatesByType['numberListValue'])
    expect(component.primeNgRelativeDateListValue).toBe(templatesByType['relativeDateListValue'])
    expect(component.primeNgStringListValue).toBe(templatesByType['stringListValue'])
    expect(component.primeNgDateListValue).toBe(templatesByType['dateListValue'])
    expect(component.primeNgTableFilterCell).toBe(templatesByType['tableFilterCell'])
    expect(component.primeNgDateTableFilterCell).toBe(templatesByType['dateTableFilterCell'])
    expect(component.primeNgRelativeDateTableFilterCell).toBe(templatesByType['relativeDateTableFilterCell'])
    expect(component.primeNgTranslationKeyTableFilterCell).toBe(templatesByType['translationKeyTableFilterCell'])
    expect(component.primeNgStringTableFilterCell).toBe(templatesByType['stringTableFilterCell'])
    expect(component.primeNgNumberTableFilterCell).toBe(templatesByType['numberTableFilterCell'])
  })
})

