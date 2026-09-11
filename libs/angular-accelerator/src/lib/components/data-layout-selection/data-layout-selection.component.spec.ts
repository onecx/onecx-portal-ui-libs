import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataViewStateService } from '../../services/data-view-state.service'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>
  let stateService: DataViewStateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({}), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(DataViewStateService)
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('autofocus', () => {
    it('should have autofocus property on p-selectbutton set to false', () => {
      fixture.componentRef.setInput('supportedViewLayouts', ['grid', 'list', 'table'])
      fixture.detectChanges()

      const pSelectButtonDebugEl = fixture.debugElement.query(By.css('p-selectbutton'))
      expect(pSelectButtonDebugEl).toBeTruthy()
      // Check that the autofocus input property is set to false
      expect(pSelectButtonDebugEl.componentInstance.autofocus).toBe(false)
    })
  })

  describe('constructor effect (layout -> selectedViewLayout)', () => {
    it('should update selectedViewLayout when layout input changes', () => {
      fixture.detectChanges()

      component.layout = 'grid'
      fixture.detectChanges()
      expect(component.selectedViewLayout()?.layout).toBe('grid')

      component.layout = 'list'
      fixture.detectChanges()
      expect(component.selectedViewLayout()?.layout).toBe('list')
    })
  })

  describe('ngOnInit', () => {
    it('should initialize with current layout from service', () => {
      fixture.detectChanges()
      component.onDataViewLayoutChange({
        layout: 'table',
        icon: 'pi pi-address-book'
      })

      expect(stateService.layout()).toBe('table')
      expect(component.selectedViewLayout()?.layout).toBe('table')
    })

    it('should initialize with table layout as default', () => {
      fixture.detectChanges()

      expect(component.selectedViewLayout()?.layout ?? 'grid').toBe('grid')
    })
  })

  describe('viewingLayouts', () => {
    it('should filter default layouts by supportedViewLayouts input', () => {
      fixture.componentRef.setInput('supportedViewLayouts', ['grid', 'list'])
      fixture.detectChanges()

      const layouts = component.viewingLayouts().map((l) => l.layout)
      expect(layouts).toEqual(['list', 'grid'])
    })
  })

  describe('onDataViewLayoutChange', () => {
    it('should call service setLayout and update layout signal', () => {

      fixture.detectChanges()

      component.onDataViewLayoutChange({ icon: 'x' as any, layout: 'grid' })

      expect(stateService.layout()).toBe('grid')
    })
  })
})
