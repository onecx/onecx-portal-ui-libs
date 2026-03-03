import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataLayoutSelectionComponent } from './data-layout-selection.component'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      schemas: [],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
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
    it('should emit initial componentStateChanged with current layout', () => {
      const componentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.componentRef.setInput('layout', 'list')
      fixture.detectChanges()

      expect(componentStateChangedSpy).toHaveBeenCalledWith({ layout: 'list' })
    })

    it('should fallback to table when selectedViewLayout is undefined', () => {
      const componentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.detectChanges()

      expect(componentStateChangedSpy).toHaveBeenCalledWith({ layout: 'table' })
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
    it('should emit dataViewLayoutChange and componentStateChanged with the new layout', () => {
      const dataViewLayoutChangeSpy = jest.spyOn(component.dataViewLayoutChange, 'emit')
      const componentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')

      fixture.detectChanges()
      jest.clearAllMocks()

      component.onDataViewLayoutChange({ icon: 'x' as any, layout: 'grid' })

      expect(dataViewLayoutChangeSpy).toHaveBeenCalledWith('grid')
      expect(componentStateChangedSpy).toHaveBeenCalledWith({ layout: 'grid' })
    })
  })
})
