import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormsModule } from '@angular/forms'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'

describe('DataListGridSortingComponent', () => {
  let component: DataListGridSortingComponent
  let fixture: ComponentFixture<DataListGridSortingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataListGridSortingComponent],
      imports: [TranslateTestingModule.withTranslations({}), AngularAcceleratorPrimeNgModule, FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridSortingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
