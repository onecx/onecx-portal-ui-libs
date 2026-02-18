import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { SlotHarness } from '../../../../testing/slot.harness'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchHeaderComponent } from './search-header.component'
import { of } from 'rxjs'

describe('SearchHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent, PageHeaderComponent, IfPermissionDirective],
      imports: [RouterTestingModule, ButtonModule, BreadcrumbModule, AngularAcceleratorModule],
      providers: [
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideUserServiceMock(),
        provideTranslateTestingService({}),
      ],
    }).compileComponents()

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    mockAppStateService.currentWorkspace$.publish({
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
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['PRODUCT#USE_SEARCHCONFIGS'])
    const sub = component.selectedSearchConfigChanged.subscribe()
    component.pageName = 'myPageName'
    component.searchConfigPermission = 'PRODUCT#USE_SEARCHCONFIGS'

    fixture.detectChanges()
    await fixture.whenStable()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()

    sub.unsubscribe()
  })

  it('should render reset then search when searchButtonsReversed is false and reset observed', () => {
    const sub = component.resetted.subscribe()
    component.searchButtonsReversed$ = of(false)
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)

    expect(order).toEqual(['resetButton', 'searchButton'])

    sub.unsubscribe()
  })

  it('should render search then reset when searchButtonsReversed is true and reset observed', () => {
    const sub = component.resetted.subscribe()
    component.searchButtonsReversed$ = of(true)
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)

    expect(order).toEqual(['searchButton', 'resetButton'])

    sub.unsubscribe()
  })

  it('should render no controls until searchButtonsReversed is resolved', () => {
    component.searchButtonsReversed$ = of(null)
    fixture.detectChanges()

    const controls = fixture.nativeElement.querySelector('section[aria-label="Search Controls"]') as HTMLElement
    const buttons = Array.from(controls.querySelectorAll('#resetButton, #searchButton'))

    expect(buttons.length).toBe(0)
  })
})
