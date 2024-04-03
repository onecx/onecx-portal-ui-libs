import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PortalViewportComponent } from './portal-viewport.component'

describe('OcxWorkspaceViewportComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })
  
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
