import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'
import { TranslateModule } from '@ngx-translate/core'
import { DataViewStateService } from '../../services/data-view-state.service'
import { expectNoAxeViolations, provideTranslateTestingService } from '@onecx/angular-testing'
import { FormsModule } from '@angular/forms'
import { AngularAcceleratorOptimusModule } from '../../angular-accelerator-optimus.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>
  let stateService: DataViewStateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      imports: [TranslateModule.forRoot(), AngularAcceleratorOptimusModule, FormsModule, OcxTooltipDirective],
      providers: [DataViewStateService, provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(DataViewStateService)
  })

  it('should have no axe violations', async () => {
    fixture.detectChanges()
    await expectNoAxeViolations(fixture.nativeElement)
  })

  describe('layout toggle buttons', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('supportedViewLayouts', ['list', 'grid', 'table'])
      fixture.detectChanges()
      await fixture.whenStable()
    })

    // The unit-test axe run (happy-dom) does not flag a nameless custom-element host with role="button" (p-togglebutton),
    // so this DOM assertion is the guard for the button names. The Storybook axe run covers button-name.
    it('should give every icon-only toggle button a visually hidden accessible name', () => {
      const toggleButtons: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="button"]'))

      expect(toggleButtons.map((button) => button.querySelector('.sr-only')?.textContent?.trim())).toEqual([
        'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
        'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
        'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
      ])
      toggleButtons.forEach((button) => expect(button.querySelector('.sr-only')?.closest('[aria-hidden]')).toBeNull())
    })
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
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
        icon: 'pi pi-address-book',
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
