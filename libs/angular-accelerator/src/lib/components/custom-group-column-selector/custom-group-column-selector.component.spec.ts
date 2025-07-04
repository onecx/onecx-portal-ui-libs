import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { FormsModule } from '@angular/forms'

describe('CustomGroupColumnSelectorComponent', () => {
  let component: CustomGroupColumnSelectorComponent
  let fixture: ComponentFixture<CustomGroupColumnSelectorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGroupColumnSelectorComponent],
      imports: [TranslateTestingModule.withTranslations({}), AngularAcceleratorPrimeNgModule, FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGroupColumnSelectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
