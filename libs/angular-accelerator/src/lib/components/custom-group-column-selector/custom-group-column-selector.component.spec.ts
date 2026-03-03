import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  const makeColumn = (id: string): DataTableColumn => ({ id, nameKey: id }) as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
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

      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      const actionCfgSpy = jest.spyOn(component.actionColumnConfigChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onSaveClick()

      expect(component.visible()).toBe(false)
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
})
