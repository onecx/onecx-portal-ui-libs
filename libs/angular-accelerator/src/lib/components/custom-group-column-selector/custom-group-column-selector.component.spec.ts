import { CommonModule } from '@angular/common'
import { signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { By } from '@angular/platform-browser'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  const makeColumn = (id: string): DataTableColumn => ({ id, nameKey: id }) as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), OcxTooltipDirective],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
  })

  describe('ngOnInit', () => {
    it('should emit initial componentStateChanged with actionColumnConfig and displayedColumns', () => {
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')
      component.displayedColumns.set([makeColumn('c1')])

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
      component.displayedColumns.set([c1, c3])
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(component.visible()).toBe(true)
      expect(component.displayedColumnsModel()).toEqual([c1, c3])
      expect(component.hiddenColumnsModel()).toEqual([c2])
      expect(component.frozenActionColumnModel()).toBe(true)
      expect(component.actionColumnPositionModel()).toBe('left')
    })
  })

  describe('onSaveClick', () => {
    it('should emit columnSelectionChanged + componentStateChanged when columns order/content changed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')

      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1, c2])

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onSaveClick()

      expect(component.visible()).toBe(false)
      expect(columnChangedSpy).toHaveBeenCalledWith({ activeColumns: [c1, c2] })
      expect(stateSpy).toHaveBeenCalledWith({ displayedColumns: [c1, c2] })
    })

    it('should emit actionColumnConfigChanged + componentStateChanged when action column config changed', () => {
      const c1 = makeColumn('c1')
      fixture.componentRef.setInput('customGroupKey', 'custom')
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')

      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionCfgSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onSaveClick()

      expect(component.visible()).toBe(false)
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
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1])

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')

      component.onSaveClick()

      expect(columnChangedSpy).not.toHaveBeenCalled()
    })
  })

  describe('onCancelClick', () => {
    it('should set visible=false', () => {
      component.visible.set(true)

      component.onCancelClick()

      expect(component.visible()).toBe(false)
    })
  })

  describe('constructor effect', () => {
    it('should emit componentStateChanged when displayedColumns changes (effect)', () => {
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')

      const emitSpy = jest.spyOn(component.componentStateChanged, 'emit')

      // first detectChanges triggers the constructor effect
      fixture.detectChanges()
      emitSpy.mockClear()

      component.displayedColumns.set([makeColumn('c1')])
      fixture.detectChanges()

      expect(emitSpy).toHaveBeenCalledWith({
        actionColumnConfig: {
          frozen: true,
          position: 'left',
        },
        displayedColumns: [makeColumn('c1')],
      })
    })
  })

  describe('columnsChanged computed property', () => {
    it('should return false when the active columns match the committed ones in membership and order', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1, c2])
      component.displayedColumnsModel.set([c1, c2])

      expect(component.columnsChanged()).toBe(false)
    })

    it('should return true when a column was added or removed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1, c2])
      component.displayedColumnsModel.set([c1])

      expect(component.columnsChanged()).toBe(true)
    })

    it('should return true when the active columns were reordered', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1, c2])
      component.displayedColumnsModel.set([c2, c1])

      expect(component.columnsChanged()).toBe(true)
    })
  })

  describe('actionSettingsChanged computed property', () => {
    it('should return false when the action settings match the committed values', () => {
      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      expect(component.actionSettingsChanged()).toBe(false)
    })

    it('should return true when the frozen setting differs from the committed value', () => {
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('right')

      expect(component.actionSettingsChanged()).toBe(true)
    })

    it('should return true when the position setting differs from the committed value', () => {
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')
      component.frozenActionColumnModel.set(false)
      component.actionColumnPositionModel.set('left')

      expect(component.actionSettingsChanged()).toBe(true)
    })
  })

  describe('canSave computed property', () => {
    it('should be false when there are no active columns even if the configuration changed', () => {
      component.displayedColumns.set([makeColumn('c1')])
      component.displayedColumnsModel.set([])
      component.frozenActionColumnModel.set(true)

      expect(component.hasActiveColumns()).toBe(false)
      expect(component.canSave()).toBe(false)
    })

    it('should be false when active columns exist but nothing changed (freshly opened state)', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(false)
      component.actionColumnPositionModel.set('right')

      expect(component.canSave()).toBe(false)
    })

    it('should be true when active columns exist and the active columns changed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1, c2])

      expect(component.canSave()).toBe(true)
    })

    it('should be true when active columns exist and only the action settings changed', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      expect(component.columnsChanged()).toBe(false)
      expect(component.canSave()).toBe(true)
    })

    it('should be false again when the changes are reverted back to the committed values', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1, c2])
      fixture.componentRef.setInput('frozenActionColumn', false)
      fixture.componentRef.setInput('actionColumnPosition', 'right')

      // Change then undo
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      expect(component.canSave()).toBe(true)

      component.displayedColumnsModel.set([c1, c2])
      component.frozenActionColumnModel.set(false)
      component.actionColumnPositionModel.set('right')
      expect(component.canSave()).toBe(false)
    })

    it('should not be enabled when only a PickList item is highlighted (no model change)', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      component.displayedColumns.set([c1, c2])
      component.displayedColumnsModel.set([c1, c2])
      component.frozenActionColumnModel.set(false)
      component.actionColumnPositionModel.set('right')

      // Simulate the user highlighting an item without moving it: the models are untouched,
      // so save must stay disabled even though the real PickList reports a selection.
      const pickListMock = { selectedItemsSource: [] as DataTableColumn[], selectedItemsTarget: [] as DataTableColumn[], triggerChangeDetection: jest.fn() }
      // viewChild() produces a read-only signal, so substitute a writable one for this test.
      Object.defineProperty(component, 'pickList', { value: signal(pickListMock), configurable: true })
      component.pickList().selectedItemsSource = [c1]

      expect(component.pickList().selectedItemsSource).toEqual([c1])
      expect(component.columnsChanged()).toBe(false)
      expect(component.actionSettingsChanged()).toBe(false)
      expect(component.canSave()).toBe(false)
    })
  })

  describe('onSaveClick canSave guard', () => {
    it('should not emit or close when nothing changed even with active columns', () => {
      const c1 = makeColumn('c1')
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(false)
      component.actionColumnPositionModel.set('right')
      component.visible.set(true)

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionChangedSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      component.onSaveClick()

      expect(component.visible()).toBe(true)
      expect(columnChangedSpy).not.toHaveBeenCalled()
      expect(actionChangedSpy).not.toHaveBeenCalled()
    })

    it('should emit the action event even when the first listener synchronously commits the columns', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      // Both columns and action settings changed
      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1, c2])
      fixture.componentRef.setInput('frozenActionColumn', false)
      component.frozenActionColumnModel.set(true)
      component.visible.set(true)

      const columnChangedSpy = jest.spyOn(component.columnSelectionChanged, 'emit')
      const actionChangedSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')

      // A synchronous parent update from the first emitted event commits the columns
      columnChangedSpy.mockImplementation((event) => {
        component.displayedColumns.set(event.activeColumns)
      })

      component.onSaveClick()

      expect(component.visible()).toBe(false)
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
      component.displayedColumnsModel.set([a, c, b])
      component.hiddenColumnsModel.set([])

      component.syncColumnModels()

      expect(ids(component.displayedColumnsModel())).toEqual(['A', 'C', 'B'])
    })

    it('should restore the active order to the main column order when restoration is enabled', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      // Restoring B into active [A, C] produces [A, B, C]
      fixture.componentRef.setInput('columns', [a, b, c])
      component.displayedColumnsModel.set([a, c, b])
      component.hiddenColumnsModel.set([])

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel())).toEqual(['A', 'B', 'C'])
    })

    it('should restore order after moving a column out and back (main order [A, B])', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel.set([b, a])
      component.hiddenColumnsModel.set([])

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel())).toEqual(['A', 'B'])
    })

    it('should reorder both lists and keep the active list in the main order', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      const d = makeColumn('D')
      fixture.componentRef.setInput('columns', [a, b, c, d])
      component.displayedColumnsModel.set([d, a])
      component.hiddenColumnsModel.set([c, b])

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel())).toEqual(['A', 'D'])
      expect(ids(component.hiddenColumnsModel())).toEqual(['B', 'C'])
    })

    it('should preserve items absent from columns by appending them in their existing order', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const z = makeColumn('Z')
      const y = makeColumn('Y')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel.set([z, a])
      component.hiddenColumnsModel.set([b, y])

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel())).toEqual(['A', 'Z'])
      expect(ids(component.hiddenColumnsModel())).toEqual(['B', 'Y'])
    })

    it('should reorder a non-empty hidden list while the active list is empty', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      fixture.componentRef.setInput('columns', [a, b])
      component.displayedColumnsModel.set([])
      component.hiddenColumnsModel.set([b, a])

      component.syncColumnModels(true)

      expect(ids(component.displayedColumnsModel())).toEqual([])
      expect(ids(component.hiddenColumnsModel())).toEqual(['A', 'B'])
    })

    it('should not drop or duplicate items and should not mutate the main column list', () => {
      const a = makeColumn('A')
      const b = makeColumn('B')
      const c = makeColumn('C')
      const d = makeColumn('D')
      const available = [a, b, c, d]
      fixture.componentRef.setInput('columns', available)
      component.displayedColumnsModel.set([c, a])
      component.hiddenColumnsModel.set([d, b])
      const availableIdsBefore = available.map((column) => column.id)

      component.syncColumnModels(true)

      const resultIds = [...ids(component.displayedColumnsModel()), ...ids(component.hiddenColumnsModel())]
      expect(resultIds.sort()).toEqual(['A', 'B', 'C', 'D'])
      expect(ids(component.columns())).toEqual(availableIdsBefore)
    })
  })

  describe('resetColumnSelection', () => {
    it('should not throw when the PickList is not available yet', () => {
      Object.defineProperty(component, 'pickList', { value: signal(undefined), configurable: true })
      expect(() => component.resetColumnSelection()).not.toThrow()
    })

    it('should clear both source and target selection and trigger change detection', () => {
      const triggerChangeDetection = jest.fn()
      const pickListMock = {
        selectedItemsSource: [makeColumn('c1')] as DataTableColumn[],
        selectedItemsTarget: [makeColumn('c2')] as DataTableColumn[],
        triggerChangeDetection,
      }
      // viewChild() produces a read-only signal, so substitute a writable one for this test.
      Object.defineProperty(component, 'pickList', { value: signal(pickListMock), configurable: true })

      component.resetColumnSelection()

      expect(pickListMock.selectedItemsSource).toEqual([])
      expect(pickListMock.selectedItemsTarget).toEqual([])
      expect(triggerChangeDetection).toHaveBeenCalled()
    })

    it('should call the reset before the dialog becomes visible', () => {
      let visibleAtReset: boolean | undefined
      jest.spyOn(component, 'resetColumnSelection').mockImplementation(() => {
        visibleAtReset = component.visible()
      })

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(component.visible()).toBe(true)
      expect(visibleAtReset).toBe(false)
    })
  })

  describe('new boolean inputs', () => {
    it('should default resizableColumnGroupSelectorDialog to false', () => {
      expect(component.resizableColumnGroupSelectorDialog()).toBe(false)
    })

    it('should default restoreColumnGroupSelectorOrder to false', () => {
      expect(component.restoreColumnGroupSelectorOrder()).toBe(false)
    })

    it('should default draggableColumnGroupSelectorDialog to true and keep it independent of resizing', () => {
      expect(component.draggableColumnGroupSelectorDialog()).toBe(true)
      expect(component.resizableColumnGroupSelectorDialog()).toBe(false)
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
      const pickList = component.pickList()
      if (!pickList) {
        throw new Error('Expected the real PickList to exist after opening the dialog')
      }
      pickList.selectedItemsSource = [a]
      pickList.selectedItemsTarget = [b]
      expect(pickList.selectedItemsSource).toEqual([a])
      expect(pickList.selectedItemsTarget).toEqual([b])

      component.onCancelClick()
      fixture.detectChanges()

      expect(component.visible()).toBe(false)
      expect(component.pickList()).toBe(pickList)
      expect(pickList.selectedItemsSource).toEqual([a])
      expect(pickList.selectedItemsTarget).toEqual([b])

      const triggerChangeDetectionSpy = jest.spyOn(pickList, 'triggerChangeDetection')

      component.onOpenCustomGroupColumnSelectionDialogClick()

      expect(triggerChangeDetectionSpy).toHaveBeenCalledTimes(1)
      expect(pickList.selectedItemsSource).toEqual([])
      expect(pickList.selectedItemsTarget).toEqual([])

      fixture.detectChanges()

      expect(component.visible()).toBe(true)
      expect(component.pickList()).toBe(pickList)
      expect(pickList.selectedItemsSource).toEqual([])
      expect(pickList.selectedItemsTarget).toEqual([])
      expect(document.querySelectorAll('.p-listbox-option[aria-selected="true"]').length).toBe(0)
    })
  })
})
