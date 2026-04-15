import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>
  let stateService: InteractiveDataViewService
  
  const makeColumn = (id: string): DataTableColumn => ({ id, nameKey: id }) as any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), OcxTooltipDirective],
      providers: [provideTranslateTestingService({}), InteractiveDataViewService],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(InteractiveDataViewService)
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
      
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

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
      const setDisplayedSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      component.displayedColumns.set([c1])
      component.displayedColumnsModel.set([c1, c2])

      component.onSaveClick()

      expect(component.visible()).toBe(false)
      expect(setDisplayedSpy).toHaveBeenCalledWith([c1, c2])
    })

    it('should not call service action column config when models are sourced from service signals', () => {
      const c1 = makeColumn('c1')
      const setActionConfigSpy = jest.spyOn(stateService, 'setActionColumnConfig')
      const setDisplayedSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      component.displayedColumnsModel.set([c1])
      component.frozenActionColumnModel.set(true)
      component.actionColumnPositionModel.set('left')

      component.onSaveClick()

      expect(component.visible()).toBe(false)
      expect(setActionConfigSpy).not.toHaveBeenCalled()
      expect(setDisplayedSpy).toHaveBeenCalledWith([c1])
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
    it('should not update service until onSaveClick is called', () => {
      const setDisplayedSpy = jest.spyOn(stateService, 'setDisplayedColumns')

      component.displayedColumns.set([makeColumn('c1')])
      expect(setDisplayedSpy).not.toHaveBeenCalled()

      component.displayedColumnsModel.set([makeColumn('c1')])
      component.onSaveClick()
      expect(setDisplayedSpy).not.toHaveBeenCalled()
    })
  })
})
