import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
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
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), TooltipModule, OcxTooltipDirective, NoopAnimationsModule],
      providers: [provideTranslateTestingService({})],
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
      component.pickList = pickListMock as any
      const pickList = component.pickList
      if (!pickList) {
        throw new Error('Expected pickList to be set')
      }
      pickList.setSelectionList(pickList.SOURCE_LIST, [c1])

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

  describe('syncColumnModels order restoration', () => {
    const ids = (columns: DataTableColumn[]) => columns.map((column) => column.id)

    it('should keep the normal PickList transfer order when restoration is disabled', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      fixture.componentRef.setInput('columns', [a, b, c])
      component.displayedColumnsModel = [a, c, b]
      component.hiddenColumnsModel = []

      component.syncColumnModels()

      expect(ids(component.displayedColumnsModel)).toEqual(['A', 'C', 'B'])
    })

    it('should restore the active order to the main column order when restoration is enabled', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      // Restoring B into active [A, C] produces [A, B, C]
      fixture.componentRef.setInput('columns', [a, b, c])
      component.displayedColumnsModel = [a, c, b]
      component.hiddenColumnsModel = []

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel)).toEqual(['A', 'B', 'C'])
    })

    it('should restore order after moving a column out and back (main order [A, B])', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel = [b, a]
      component.hiddenColumnsModel = []

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel)).toEqual(['A', 'B'])
    })

    it('should reorder both lists and keep the active list in the main order', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      const d = makeColumn('D')
      fixture.componentRef.setInput('columns', [a, b, c, d])
      component.displayedColumnsModel = [d, a]
      component.hiddenColumnsModel = [c, b]

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel)).toEqual(['A', 'D'])
      expect(ids(component.hiddenColumnsModel)).toEqual(['B', 'C'])
    })

    it('should preserve items absent from the configured columns by appending them in their existing order', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const z = makeColumn('Z')
      const y = makeColumn('Y')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel = [z, a]
      component.hiddenColumnsModel = [b, y]

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel)).toEqual(['A', 'Z'])
      expect(ids(component.hiddenColumnsModel)).toEqual(['B', 'Y'])
    })

    it('should reorder a non-empty hidden list while the active list is empty', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel = []
      component.hiddenColumnsModel = [b, a]

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel)).toEqual([])
      expect(ids(component.hiddenColumnsModel)).toEqual(['A', 'B'])
    })

    it('should not drop or duplicate items and should not mutate the main column list', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      const d = makeColumn('D')
      const available = [a, b, c, d]
      fixture.componentRef.setInput('columns', available)
      component.displayedColumnsModel = [c, a]
      component.hiddenColumnsModel = [d, b]
      const availableIdsBefore = available.map((column) => column.id)

      component.syncColumnModels(true)

      const resultIds = [...ids(component.displayedColumnsModel), ...ids(component.hiddenColumnsModel)]
      expect(resultIds.sort()).toEqual(['A', 'B', 'C', 'D'])
      expect(ids(component.columns)).toEqual(availableIdsBefore)
    })
  })

  describe('resetColumnSelection', () => {
    it('should not throw when the PickList is not available yet', () => {
      component.pickList = undefined
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
      component.pickList = pickListMock as any

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
    it('should default resizableColumnGroupSelectorDialog to true', () => {
      expect(component.resizableColumnGroupSelectorDialog).toBe(true)
    })

    it('should default restoreColumnGroupSelectorOrder to false', () => {
      expect(component.restoreColumnGroupSelectorOrder).toBe(false)
    })

    it('should default draggableColumnGroupSelectorDialog to true and keep it independent of resizing', () => {
      expect(component.draggableColumnGroupSelectorDialog).toBe(true)
      expect(component.resizableColumnGroupSelectorDialog).toBe(true)
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
      const pickList = component.pickList
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
      expect(component.pickList).toBe(pickList)
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
      expect(component.pickList).toBe(pickList)
      expect(pickList.selectedItemsSource).toEqual([])
      expect(pickList.selectedItemsTarget).toEqual([])
      expect(document.querySelectorAll('.p-listbox-option[aria-selected="true"]').length).toBe(0)
    })
  })
})
