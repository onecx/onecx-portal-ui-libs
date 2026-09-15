import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { TooltipModule } from 'primeng/tooltip'
import { provideTranslateTestingService } from '@onecx/angular-testing'

import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'

describe('DataLayoutSelectionComponent', () => {
  let component: DataLayoutSelectionComponent
  let fixture: ComponentFixture<DataLayoutSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayoutSelectionComponent],
      imports: [NoopAnimationsModule, FormsModule, AngularAcceleratorPrimeNgModule, TranslateModule.forRoot(), TooltipModule, OcxTooltipDirective],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataLayoutSelectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should apply autofocus="false" to the data view layout p-selectbutton', async () => {
    // The <p-selectbutton> only renders when viewingLayouts.length > 1, and
    // viewingLayouts is populated in ngOnInit from supportedViewLayouts. Supply
    // three supported layouts and re-run ngOnInit so the host element exists.
    component.supportedViewLayouts = ['list', 'grid', 'table']
    component.ngOnInit()
    fixture.detectChanges()
    await fixture.whenStable()

    // PrimeNG's SelectButton exposes autofocus as an @Input (NOT a host attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the SelectButton component instance.
    const pSelectButton = fixture.debugElement.query(By.css('p-selectbutton'))
    expect(pSelectButton).toBeTruthy()
    expect((pSelectButton.componentInstance as unknown as { autofocus?: unknown }).autofocus).toBe(false)
  })
})
