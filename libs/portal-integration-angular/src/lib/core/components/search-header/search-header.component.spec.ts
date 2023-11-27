import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing'
import { SearchHeaderComponent } from './search-header.component'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { RouterTestingModule } from '@angular/router/testing'
import { ConfigurationService } from '../../../services/configuration.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { MockAuthService } from '../../../mock-auth/mock-auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ButtonModule } from 'primeng/button'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { AppStateService } from '../../../services/app-state.service'

describe('SearchHeaderComponent', () => {
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

  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  const mockService = new MockAuthService()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent],
      imports: [
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule,
        HttpClientTestingModule,
        ButtonModule,
        BreadcrumbModule,
      ],
      providers: [ConfigurationService, AppStateService, { provide: AUTH_SERVICE, useValue: mockService }],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
    await appStateService.currentPortal$.isInitialized

    fixture = TestBed.createComponent(SearchHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
