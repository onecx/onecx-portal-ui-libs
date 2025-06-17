/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

import { CriteriaTemplateComponent } from './criteria-template.component'

describe('CriteriaTemplateComponent', () => {
  let component: CriteriaTemplateComponent
  let fixture: ComponentFixture<CriteriaTemplateComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaTemplateComponent],
      imports: [FormsModule, DropdownModule],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaTemplateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
