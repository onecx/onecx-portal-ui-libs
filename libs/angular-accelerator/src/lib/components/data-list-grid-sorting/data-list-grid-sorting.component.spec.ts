import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { FormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { Select } from 'primeng/select'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot(), TooltipModule, OcxTooltipDirective],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should NOT autofocus the data list grid sorting p-select when rendered', () => {
    // The <p-select> renders unconditionally (no @if guard), so no columns input
    // is required for the host element to be present.
    fixture.detectChanges()

    // PrimeNG's Select exposes autofocus as an @Input (NOT a host DOM attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the Select component instance.
    const pSelect = fixture.debugElement.query(By.css('p-select'))
    expect(pSelect).toBeTruthy()
    const select = pSelect.componentInstance as Select
    expect(select.autofocus).toBe(false)
  })
})
