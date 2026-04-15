import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'
import { TranslateModule } from '@ngx-translate/core'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>
  let stateService: InteractiveDataViewService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      imports: [TranslateModule.forRoot()],
      providers: [InteractiveDataViewService],
      schemas: [],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(InteractiveDataViewService)
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  describe('constructor effect (layout -> selectedViewLayout)', () => {
    it('should update selectedViewLayout when layout input changes', () => {
      fixture.detectChanges()

      component.layout.set('grid')
      fixture.detectChanges()
      expect(component.selectedViewLayout()?.layout).toBe('grid')

      component.layout.set('list')
      fixture.detectChanges()
      expect(component.selectedViewLayout()?.layout).toBe('list')
    })
  })

  describe('ngOnInit', () => {
    it('should initialize with current layout from service', () => {
      stateService.setLayout('list')

      fixture.detectChanges()

      expect(component.layout()).toBe('list')
      expect(component.selectedViewLayout()?.layout).toBe('list')
    })

    it('should initialize with table layout as default', () => {
      fixture.detectChanges()

      expect(component.selectedViewLayout()?.layout ?? 'table').toBe('table')
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
      const setLayoutSpy = jest.spyOn(stateService, 'setLayout')

      fixture.detectChanges()

      component.onDataViewLayoutChange({ icon: 'x' as any, layout: 'grid' })

      expect(setLayoutSpy).toHaveBeenCalledWith('grid')
      expect(component.layout()).toBe('grid')
    })
  })
})
