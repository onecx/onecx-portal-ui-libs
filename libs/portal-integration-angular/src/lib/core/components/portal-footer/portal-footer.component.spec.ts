import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { PortalFooterComponent } from './portal-footer.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('PortalFooterComponent', () => {
  let component: PortalFooterComponent
  let fixture: ComponentFixture<PortalFooterComponent>

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      declarations: [PortalFooterComponent],
      imports: [],
      providers: [
        ConfigurationService,
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
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
