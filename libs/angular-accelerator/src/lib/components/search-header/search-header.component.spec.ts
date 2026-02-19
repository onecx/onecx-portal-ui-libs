import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ButtonModule } from 'primeng/button'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { SearchHeaderComponent } from './search-header.component'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HarnessLoader } from '@angular/cdk/testing'
import { SlotHarness } from '@onecx/angular-accelerator/testing'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { of } from 'rxjs'

describe('SearchHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent, IfPermissionDirective],
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

  it('should display search config slot if search config change is observed, pageName is defined and permission is met', async () => {
    const userService = TestBed.inject(UserService)
    jest.spyOn(userService, 'getPermissions').mockReturnValue(of(['PRODUCT#USE_SEARCHCONFIGS']))
    const sub = component.selectedSearchConfigChanged.subscribe()
    component.pageName = 'myPageName'
    component.searchConfigPermission = 'PRODUCT#USE_SEARCHCONFIGS'
    fixture.detectChanges()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()

    sub.unsubscribe()
  })

  it('should render reset then search when searchButtonsReversed is false and reset observed', () => {
    const sub = component.resetted.subscribe()
    component.searchButtonsReversed = false
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)
    
    expect(order).toEqual(['resetButton', 'searchButton'])

    sub.unsubscribe()
  })

  it('should render search then reset when searchButtonsReversed is true and reset observed', () => {
    const sub = component.resetted.subscribe()
    component.searchButtonsReversed = true
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)
    
    expect(order).toEqual(['searchButton', 'resetButton'])

    sub.unsubscribe()
  })

  it('should render no controls until searchButtonsReversed is resolved', () => {
    component.searchButtonsReversed = null
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const buttons = Array.from(controls.querySelectorAll('#resetButton, #searchButton'))

    expect(buttons.length).toBe(0)
  })
})
