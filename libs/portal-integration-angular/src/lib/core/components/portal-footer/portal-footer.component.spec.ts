import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PortalFooterComponent } from './portal-footer.component'
import { ConfigurationService } from '../../../services/configuration.service'
import { AppStateService } from '@onecx/angular-integration-interface'

describe('PortalFooterComponent', () => {
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

  let component: PortalFooterComponent
  let fixture: ComponentFixture<PortalFooterComponent>

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      declarations: [PortalFooterComponent],
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService, AppStateService],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
