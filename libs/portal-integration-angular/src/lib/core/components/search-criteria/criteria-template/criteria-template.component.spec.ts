/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

import { CriteriaTemplateComponent } from './criteria-template.component'
import { MockAuthModule } from '../../../../mock-auth/mock-auth.module'

describe('CriteriaTemplateComponent', () => {
  let component: CriteriaTemplateComponent
  let fixture: ComponentFixture<CriteriaTemplateComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaTemplateComponent],
      imports: [FormsModule, DropdownModule, MockAuthModule],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaTemplateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
