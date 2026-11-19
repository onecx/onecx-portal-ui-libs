import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { SlotHarness } from '@onecx/angular-accelerator/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchHeaderComponent } from './search-header.component'
import { of } from 'rxjs'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'

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
        TooltipModule,
        OcxTooltipDirective
      ],
      providers: [
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideUserServiceMock(),
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

@Component({
  standalone: false,
  template: `
    <ocx-search-header>
      <form [formGroup]="form">
        <input formControlName="name" />
        <input formControlName="status" />
      </form>
    </ocx-search-header>
  `,
})
class SearchHeaderWithFormComponent {
  @ViewChild(SearchHeaderComponent, { static: true }) searchHeader!: SearchHeaderComponent
  form = new FormGroup({
    name: new FormControl<string | null>(null),
    status: new FormControl<string | null>('active'),
  })
}

describe('SearchHeaderComponent field values', () => {
  let fixture: ComponentFixture<SearchHeaderWithFormComponent>
  let host: SearchHeaderWithFormComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderWithFormComponent, SearchHeaderComponent, PageHeaderComponent, IfPermissionDirective],
      imports: [
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule,
        ReactiveFormsModule,
        ButtonModule,
        BreadcrumbModule,
        AngularAcceleratorModule,
        TooltipModule,
        OcxTooltipDirective,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideUserServiceMock(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchHeaderWithFormComponent)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should report every search field with its current value before the form is changed', fakeAsync(() => {
    const values: { [key: string]: unknown }[] = []
    host.searchHeader.fieldValues$?.subscribe((v) => values.push(v))

    tick(100)

    expect(values).toEqual([{ name: undefined, status: 'active' }])
  }))

  it('should report the changed values when the form changes', fakeAsync(() => {
    const values: { [key: string]: unknown }[] = []
    host.searchHeader.fieldValues$?.subscribe((v) => values.push(v))
    tick(100)

    host.form.patchValue({ name: 't1' })
    tick(100)

    expect(values[values.length - 1]).toEqual({ name: 't1', status: 'active' })
  }))
})
