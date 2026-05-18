import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataViewStateService } from '../../services/data-view-state.service'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>
  let stateService: DataViewStateService
  
  const makeColumn = (id: string): DataTableColumn => ({ id, nameKey: id }) as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), OcxTooltipDirective],
      providers: [provideTranslateTestingService({}), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(DataViewStateService)
  })

  describe('onOpenCustomGroupColumnSelectionDialogClick', () => {
    it('should initialize dialog models and set visible=true', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      const c3 = makeColumn('c3')

      fixture.componentRef.setInput('columns', [c1, c2, c3])
      fixture.componentRef.setInput('displayedColumns', [c1, c3])
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
    it('should update service and close dialog when columns order/content changed', () => {
      const c1 = makeColumn('c1')
      const c2 = makeColumn('c2')
      const setDisplayedSpy = jest.spyOn(stateService.displayedColumns, 'set')

      fixture.componentRef.setInput('displayedColumns', [c1])
      component.displayedColumnsModel.set([c1, c2])

      component.onSaveClick()

      expect(component.visible()).toBe(false)
      expect(setDisplayedSpy).toHaveBeenCalledWith([c1, c2])
    })

    it('should call setActionColumnConfig when action column config changed', () => {
      const c1 = makeColumn('c1')
      const frozenSpy = jest.spyOn(stateService.actionColumnConfigFrozen, 'set')
      const positionSpy = jest.spyOn(stateService.actionColumnConfigPosition, 'set')

      stateService.actionColumnConfigFrozen.set(false)
      stateService.actionColumnConfigPosition.set('right')
      
      fixture.componentRef.setInput('displayedColumns', [c1])
      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      component.onSaveClick()

      expect(component.visible()).toBe(false)
      expect(frozenSpy).toHaveBeenCalledWith(true)
      expect(positionSpy).toHaveBeenCalledWith('left')
    })

    it('should not emit columnSelectionChanged when displayed columns did not change', () => {
      const c1 = makeColumn('c1')
      fixture.componentRef.setInput('displayedColumns', [c1])     
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
    it('should not update service until onSaveClick is called', () => {
      const setDisplayedSpy = jest.spyOn(stateService.displayedColumns, 'set')
      fixture.componentRef.setInput('displayedColumns', [makeColumn('c1')])
      fixture.detectChanges()
      setDisplayedSpy.mockClear()

      component.displayedColumnsModel.set([makeColumn('c1')])
      component.onSaveClick()
      expect(setDisplayedSpy).not.toHaveBeenCalled()
    })
  })

  describe('actionColumnPosition and frozenActionColumn setter', () => {
    it('should call setActionColumnConfig with new position value and current frozenActionColumn', () => {
      const frozenSpy = jest.spyOn(stateService.actionColumnConfigFrozen, 'set')
      const positionSpy = jest.spyOn(stateService.actionColumnConfigPosition, 'set')

      component.stateService.actionColumnConfigFrozen.set(true)
      component.stateService.actionColumnConfigPosition.set('left')

      expect(frozenSpy).toHaveBeenCalledWith(true)
      expect(positionSpy).toHaveBeenCalledWith('left')
    })
  })
})
