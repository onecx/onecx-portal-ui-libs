import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ButtonModule } from 'primeng/button'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { AppStateService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { SearchHeaderComponent } from './search-header.component'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HarnessLoader } from '@angular/cdk/testing'
import { SlotHarness } from '@onecx/angular-accelerator/testing'

describe('SearchHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent],
      imports: [
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule,
        ButtonModule,
        BreadcrumbModule,
        AngularAcceleratorModule,
      ],
      providers: [
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    mockAppStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })

    fixture = TestBed.createComponent(SearchHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should not display search config slot if search config change is not observed', async () => {
    const slot = await loader.getHarnessOrNull(SlotHarness)
    expect(slot).toBeFalsy()
  })

  it('should display search config slot if search config change is observed', async () => {
    const sub = component.selectedSearchConfigChanged.subscribe()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()

    sub.unsubscribe()
  })
})
