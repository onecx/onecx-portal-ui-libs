import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxContentComponent } from './ocx-content.component'

describe('OcxContentComponent', () => {
  let component: OcxContentComponent
  let fixture: ComponentFixture<OcxContentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxContentComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
