import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { CommonModule } from '@angular/common'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { By } from '@angular/platform-browser'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  const makeColumn = (id: string): DataTableColumn => ({ id, nameKey: id }) as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [
        CommonModule,
        TranslateTestingModule.withTranslations({}),
        TooltipModule,
        OcxTooltipDirective,
        AngularAcceleratorPrimeNgModule,
        FormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should emit initial componentStateChanged with actionColumnConfig and displayedColumns', () => {
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')
      component.displayedColumns = [makeColumn('c1')]

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.ngOnInit()

      expect(emitSpy).toHaveBeenCalledWith({
        actionColumnConfig: {
          frozen: true,
          position: 'left',
        },
        displayedColumns: [makeColumn('c1')],
      })
    })
  })

  describe('onOpenCustomGroupColumnSelectionDialogClick', () => {
    it('should initialize dialog models and set visible=true', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      const c3 = makeColumn('c3')

      fixture.componentRef.setInput('columns', [c1, c2, c3])
      component.displayedColumns = [c1, c3]
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(component.visible).toBe(true)
      expect(component.displayedColumnsModel).toEqual([c1, c3])
      expect(component.hiddenColumnsModel).toEqual([c2])
      expect(component.frozenActionColumnModel).toBe(true)
      expect(component.actionColumnPositionModel).toBe('left')
    })
  })

  describe('onSaveClick', () => {
    it('should emit columnSelectionChanged + componentStateChanged when columns order/content changed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')

      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1, c2]

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onSaveClick()

      expect(component.visible).toBe(false)
      expect(columnChangedSpy).toHaveBeenCalledWith({ activeColumns: [c1, c2] })
      expect(stateSpy).toHaveBeenCalledWith({ displayedColumns: [c1, c2] })
    })

    it('should emit actionColumnConfigChanged + componentStateChanged when action column config changed', () => {
      const c1 = makeColumn('c1')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')

      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1]
      component.frozenActionColumnModel = true
      component.actionColumnPositionModel = 'left'

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionCfgSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onSaveClick()

      expect(component.visible).toBe(false)
      expect(columnChangedSpy).not.toHaveBeenCalled()
      expect(actionCfgSpy).toHaveBeenCalledWith({
        frozenActionColumn: true,
        actionColumnPosition: 'left',
      })
      expect(stateSpy).toHaveBeenCalledWith({
        displayedColumns: [c1],
        actionColumnConfig: {
          frozen: true,
          position: 'left',
        },
        activeColumnGroupKey: 'custom',
      })
    })

    it('should not emit columnSelectionChanged when displayed columns did not change', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1]

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')

      component.onSaveClick()

      expect(columnChangedSpy).not.toHaveBeenCalled()
    })
  })

  describe('onCancelClick', () => {
    it('should set visible=false', () => {
      component.visible = true

      component.onCancelClick()

      expect(component.visible).toBe(false)
    })
  })

  describe('columnsChanged computed property', () => {
    it('should return false when the active columns match the committed ones in membership and order', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1, c2]
      component.displayedColumnsModel = [c1, c2]

      expect(component.columnsChanged).toBe(false)
    })

    it('should return true when a column was added or removed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1, c2]
      component.displayedColumnsModel = [c1]

      expect(component.columnsChanged).toBe(true)
    })

    it('should return true when the active columns were reordered', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1, c2]
      component.displayedColumnsModel = [c2, c1]

      expect(component.columnsChanged).toBe(true)
    })
  })

  describe('actionSettingsChanged computed property', () => {
    it('should return false when the action settings match the committed values', () => {
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')
      component.frozenActionColumnModel = true
      component.actionColumnPositionModel = 'left'

      expect(component.actionSettingsChanged).toBe(false)
    })

    it('should return true when the frozen setting differs from the committed value', () => {
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')
      component.frozenActionColumnModel = true
      component.actionColumnPositionModel = 'right'

      expect(component.actionSettingsChanged).toBe(true)
    })

    it('should return true when the position setting differs from the committed value', () => {
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')
      component.frozenActionColumnModel = false
      component.actionColumnPositionModel = 'left'

      expect(component.actionSettingsChanged).toBe(true)
    })
  })

  describe('canSave computed property', () => {
    it('should be false when there are no active columns even if the configuration changed', () => {
      component.displayedColumns = [makeColumn('c1')]
      component.displayedColumnsModel = []
      component.frozenActionColumnModel = true

      expect(component.hasActiveColumns).toBe(false)
      expect(component.canSave).toBe(false)
    })

    it('should be false when active columns exist but nothing changed (freshly opened state)', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1]
      component.frozenActionColumnModel = false
      component.actionColumnPositionModel = 'right'

      expect(component.canSave).toBe(false)
    })

    it('should be true when active columns exist and the active columns changed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1, c2]

      expect(component.canSave).toBe(true)
    })

    it('should be true when active columns exist and only the action settings changed', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1]
      component.frozenActionColumnModel = true
      component.actionColumnPositionModel = 'left'

      expect(component.columnsChanged).toBe(false)
      expect(component.canSave).toBe(true)
    })

    it('should be false again when the changes are reverted back to the committed values', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1, c2]
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')

      // Change then undo
      component.displayedColumnsModel = [c1]
      component.frozenActionColumnModel = true
      expect(component.canSave).toBe(true)

      component.displayedColumnsModel = [c1, c2]
      component.frozenActionColumnModel = false
      component.actionColumnPositionModel = 'right'
      expect(component.canSave).toBe(false)
    })

    it('should not be enabled when only a PickList item is highlighted (no model change)', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns = [c1, c2]
      component.displayedColumnsModel = [c1, c2]
      component.frozenActionColumnModel = false
      component.actionColumnPositionModel = 'right'

      // Simulate the user highlighting an item without moving it: the models are untouched,
      // so save must stay disabled even though the real PickList reports a selection.
      const pickListMock = {
        SOURCE_LIST: -1,
        TARGET_LIST: 1,
        setSelectionList: jest.fn(),
        cd: { markForCheck: jest.fn() },
      }
      ;(component as any).pickListRef = pickListMock
      pickListMock.setSelectionList(pickListMock.SOURCE_LIST, [c1])

      expect(pickListMock.setSelectionList).toHaveBeenCalledWith(-1, [c1])
      expect(component.columnsChanged).toBe(false)
      expect(component.actionSettingsChanged).toBe(false)
      expect(component.canSave).toBe(false)
    })
  })

  describe('onSaveClick canSave guard', () => {
    it('should not emit or close when nothing changed even with active columns', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1]
      component.frozenActionColumnModel = false
      component.actionColumnPositionModel = 'right'
      component.visible = true

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionChangedSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      component.onSaveClick()

      expect(component.visible).toBe(true)
      expect(columnChangedSpy).not.toHaveBeenCalled()
      expect(actionChangedSpy).not.toHaveBeenCalled()
    })

    it('should emit the action event even when the first listener synchronously commits the columns', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      // Both columns and action settings changed
      component.displayedColumns = [c1]
      component.displayedColumnsModel = [c1, c2]
      fixture.componentRef.setInput('frozenActionColumn', false)
      component.frozenActionColumnModel = true
      component.visible = true

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionChangedSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      // A synchronous parent update from the first emitted event commits the columns
      columnChangedSpy.mockImplementation((event) => {
        if (event) {
          component.displayedColumns = event.activeColumns
        }
      })

      component.onSaveClick()

      expect(component.visible).toBe(false)
      expect(columnChangedSpy).toHaveBeenCalledTimes(1)
      expect(actionChangedSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('PrimeNG v19 picklist sync workaround', () => {
    const setPickListRef = (source: DataTableColumn[], target: DataTableColumn[]) => {
      ;(component as any).pickListRef = { source, target }
    }

    it('should move items to target and keep source/target in sync with the picklist internal state', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = [a, b]
      component.hiddenColumnsModel = []
      setPickListRef([a], [b])

      component.onPickListMoveToTarget({ items: [b] })

      expect(component.displayedColumnsModel).toEqual([a])
      expect(component.hiddenColumnsModel).toEqual([b])
    })

    it('should not update state when onPickListMoveToTarget receives no items', () => {
      const a = makeColumn('A')
      component.displayedColumnsModel = [a]
      component.hiddenColumnsModel = []
      setPickListRef([a], [])

      component.onPickListMoveToTarget({ items: [] })

      expect(component.displayedColumnsModel).toEqual([a])
      expect(component.hiddenColumnsModel).toEqual([])
    })

    it('should move items to source via onPickListMoveToSource', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = []
      component.hiddenColumnsModel = [a, b]
      setPickListRef([a], [b])

      component.onPickListMoveToSource({ items: [a] })

      expect(component.displayedColumnsModel).toEqual([a])
      expect(component.hiddenColumnsModel).toEqual([b])
    })

    it('should move all items to target via onPickListMoveAllToTarget', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = [a, b]
      component.hiddenColumnsModel = []
      setPickListRef([], [a, b])

      component.onPickListMoveAllToTarget({ items: [a, b] })

      expect(component.displayedColumnsModel).toEqual([])
      expect(component.hiddenColumnsModel).toEqual([a, b])
    })

    it('should move all items to source via onPickListMoveAllToSource', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = []
      component.hiddenColumnsModel = [a, b]
      setPickListRef([a, b], [])

      component.onPickListMoveAllToSource({ items: [a, b] })

      expect(component.displayedColumnsModel).toEqual([a, b])
      expect(component.hiddenColumnsModel).toEqual([])
    })

    it('should not update state when onPickListMoveAllToSource receives no items', () => {
      component.displayedColumnsModel = []
      component.hiddenColumnsModel = []
      setPickListRef([], [])

      component.onPickListMoveAllToSource({ items: [] })

      expect(component.displayedColumnsModel).toEqual([])
      expect(component.hiddenColumnsModel).toEqual([])
    })

    it('should sync source reorder from the picklist internal state', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = [a, b]
      component.hiddenColumnsModel = []
      setPickListRef([b, a], [])

      component.onPickListSourceReorder()

      expect(component.displayedColumnsModel).toEqual([b, a])
    })

    it('should sync target reorder from the picklist internal state', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.displayedColumnsModel = []
      component.hiddenColumnsModel = [a, b]
      setPickListRef([], [b, a])

      component.onPickListTargetReorder()

      expect(component.hiddenColumnsModel).toEqual([b, a])
    })

    it('should fall back to the current models when the picklist ref is not available', () => {
      const a = makeColumn('A')
      component.displayedColumnsModel = [a]
      component.hiddenColumnsModel = []

      component.onPickListSourceReorder()

      expect(component.displayedColumnsModel).toEqual([a])
      expect(component.hiddenColumnsModel).toEqual([])
    })
  })

  describe('restoreColumnGroupSelectorOrder', () => {
    it('should keep the normal PickList transfer order when restoration is disabled', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      component.columns = [a, b, c]
      component.displayedColumnsModel = [a]
      component.hiddenColumnsModel = [b, c]
      // PrimeNG already moved 'c' internally, producing a scrambled (non-main) source order.
      ;(component as any).pickListRef = { source: [c, a], target: [b] }

      component.onPickListMoveToSource({ items: [c] })

      expect(component.displayedColumnsModel.map((col) => col.id)).toEqual(['C', 'A'])
    })

    it('should restore the active order to the main column order when restoration is enabled and a transfer happens', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      component.restoreColumnGroupSelectorOrder = true
      component.columns = [a, b, c]
      component.displayedColumnsModel = [a]
      component.hiddenColumnsModel = [b, c]
      ;(component as any).pickListRef = { source: [c, a], target: [b] }

      component.onPickListMoveToSource({ items: [c] })

      expect(component.displayedColumnsModel.map((col) => col.id)).toEqual(['A', 'C'])
      expect(component.hiddenColumnsModel.map((col) => col.id)).toEqual(['B'])
    })

    it('should not restore order on a plain reorder even when enabled', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      component.restoreColumnGroupSelectorOrder = true
      component.columns = [a, b]
      component.displayedColumnsModel = [a, b]
      component.hiddenColumnsModel = []
      ;(component as any).pickListRef = { source: [b, a], target: [] }

      component.onPickListSourceReorder()

      expect(component.displayedColumnsModel.map((col) => col.id)).toEqual(['B', 'A'])
    })

    it('should preserve items absent from the configured columns by appending them in their existing order', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const z = makeColumn('Z')
      component.restoreColumnGroupSelectorOrder = true
      component.columns = [a, b]
      component.displayedColumnsModel = [z, a]
      component.hiddenColumnsModel = [b]
      ;(component as any).pickListRef = { source: [z, a], target: [b] }

      component.onPickListMoveToSource({ items: [a] })

      expect(component.displayedColumnsModel.map((col) => col.id)).toEqual(['A', 'Z'])
      expect(component.hiddenColumnsModel.map((col) => col.id)).toEqual(['B'])
    })
  })

  describe('resetColumnSelection', () => {
    it('should not throw when the PickList is not available yet', () => {
      ;(component as any).pickListRef = undefined
      expect(() => component.resetColumnSelection()).not.toThrow()
    })

    it('should clear both source and target selection and mark the change detector for check', () => {
      const setSelectionList = jest.fn()
      const markForCheck = jest.fn()
      const pickListMock = {
        SOURCE_LIST: -1,
        TARGET_LIST: 1,
        setSelectionList,
        cd: { markForCheck },
      }
      ;(component as any).pickListRef = pickListMock

      component.resetColumnSelection()

      expect(setSelectionList).toHaveBeenNthCalledWith(1, -1, [])
      expect(setSelectionList).toHaveBeenNthCalledWith(2, 1, [])
      expect(markForCheck).toHaveBeenCalled()
    })

    it('should call the reset before the dialog becomes visible', () => {
      let visibleAtReset: boolean | undefined
      jest.spyOn(component, 'resetColumnSelection').mockImplementation(() => {
        visibleAtReset = component.visible
      })

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(component.visible).toBe(true)
      expect(visibleAtReset).toBe(false)
    })
  })

  describe('new boolean inputs', () => {
    it('should default resizableColumnGroupSelectorDialog to false', () => {
      expect(component.resizableColumnGroupSelectorDialog).toBe(false)
    })

    it('should default restoreColumnGroupSelectorOrder to false', () => {
      expect(component.restoreColumnGroupSelectorOrder).toBe(false)
    })

    it('should default draggableColumnGroupSelectorDialog to true and keep it independent of resizing', () => {
      expect(component.draggableColumnGroupSelectorDialog).toBe(true)
      expect(component.resizableColumnGroupSelectorDialog).toBe(false)
    })
  })

  describe('dialog draggable/resizable DOM binding', () => {
    function openDialog(resizable: boolean, draggable: boolean) {
      const a = makeColumn('A')
      const b = makeColumn('B')
      fixture.componentRef.setInput('columns', [a, b])
      fixture.componentRef.setInput('displayedColumns', [a])
      fixture.componentRef.setInput('resizableColumnGroupSelectorDialog', resizable)
      fixture.componentRef.setInput('draggableColumnGroupSelectorDialog', draggable)
      component.onOpenCustomGroupColumnSelectionDialogClick()
      fixture.detectChanges()
      const dialogElement = fixture.debugElement.query(By.css('p-dialog'))
      return dialogElement ? dialogElement.componentInstance : null
    }

    it('should enable resizing independently of dragging', () => {
      const dialog = openDialog(true, false)

      expect(dialog.resizable).toBe(true)
      expect(dialog.draggable).toBe(false)
      expect(document.querySelector('.p-resizable-handle')).not.toBeNull()
    })

    it('should enable dragging independently of resizing', () => {
      const dialog = openDialog(false, true)

      expect(dialog.draggable).toBe(true)
      expect(dialog.resizable).toBe(false)
      expect(document.querySelector('.p-resizable-handle')).toBeNull()
    })

    it('should disable both dragging and resizing', () => {
      const dialog = openDialog(false, false)

      expect(dialog.draggable).toBe(false)
      expect(dialog.resizable).toBe(false)
      expect(document.querySelector('.p-resizable-handle')).toBeNull()
    })

    it('should enable both dragging and resizing', () => {
      const dialog = openDialog(true, true)

      expect(dialog.draggable).toBe(true)
      expect(dialog.resizable).toBe(true)
      expect(document.querySelector('.p-resizable-handle')).not.toBeNull()
    })
  })

  describe('pick list selection cleared on reopen', () => {
    it('should clear the stale item selection so no option stays highlighted after close and reopen', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      fixture.componentRef.setInput('columns', [a, b, c])
      fixture.componentRef.setInput('displayedColumns', [a, c])

      component.onOpenCustomGroupColumnSelectionDialogClick()
      fixture.detectChanges()
      const pickList = (component as any).pickListRef
      if (!pickList) {
        throw new Error('Expected the real PickList to exist after opening the dialog')
      }
      pickList.setSelectionList(pickList.SOURCE_LIST, [a])
      pickList.setSelectionList(pickList.TARGET_LIST, [b])
      expect(pickList.selectedItemsSource).toEqual([a])
      expect(pickList.selectedItemsTarget).toEqual([b])

      component.onCancelClick()
      fixture.detectChanges()

      expect(component.visible).toBe(false)
      expect((component as any).pickListRef).toBe(pickList)
      expect(pickList.selectedItemsSource).toEqual([a])
      expect(pickList.selectedItemsTarget).toEqual([b])

      const setSelectionListSpy = jest.spyOn(pickList, 'setSelectionList')

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(setSelectionListSpy).toHaveBeenCalledTimes(2)
      expect(setSelectionListSpy).toHaveBeenNthCalledWith(1, pickList.SOURCE_LIST, [])
      expect(setSelectionListSpy).toHaveBeenNthCalledWith(2, pickList.TARGET_LIST, [])
      expect(pickList.selectedItemsSource).toEqual([])
      expect(pickList.selectedItemsTarget).toEqual([])

      fixture.detectChanges()

      expect(component.visible).toBe(true)
      expect((component as any).pickListRef).toBe(pickList)
      expect(pickList.selectedItemsSource).toEqual([])
      expect(pickList.selectedItemsTarget).toEqual([])
      expect(document.querySelectorAll('.p-listbox-option[aria-selected="true"]').length).toBe(0)
    })
  })
})
