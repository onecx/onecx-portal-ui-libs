import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PortalViewportComponent } from './portal-viewport.component'

describe('OcxWorkspaceViewportComponent', () => {
  let component: PortalViewportComponent
  let fixture: ComponentFixture<PortalViewportComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortalViewportComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PortalViewportComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
