import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'
import { Action, PageHeaderComponent } from './page-header.component'
import { RouterTestingModule } from '@angular/router/testing'
import { ConfigurationService } from '../../../services/configuration.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Component } from '@angular/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import { AppStateService } from '../../../services/app-state.service'
import { UserService } from '../../../services/user.service'
import { MockUserService } from '../../../../../mocks/mock-user-service'

const mockActions: Action[] = [
  {
    label: 'My Test Action',
    show: 'always',
    actionCallback: () => {
      console.log('Test')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
  {
    label: 'My Test Overflow Action',
    show: 'asOverflow',
    actionCallback: () => {
      console.log('Test')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
]

// Mock host component that's used in our testBed instead of ocx-page-header
// Using this mock host allows us to simulate Angular @Input mechanisms
@Component({
  template: '<ocx-page-header [actions]="actions"></ocx-page-header>',
})
class TestHostComponent {
  actions: Action[] | undefined
}

describe('PageHeaderComponent', () => {
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

  let component: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>
  let userServiceSpy: jest.SpyInstance<boolean, [permissionKey: string], any>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent, TestHostComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../../assets/i18n/en.json'),
          de: require('./../../../../../assets/i18n/de.json'),
        }),
        BreadcrumbModule,
        MenuModule,
        ButtonModule,
      ],
      providers: [ConfigurationService, AppStateService, { provide: UserService, useClass: MockUserService }],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
    await appStateService.currentPortal$.isInitialized
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    const userService = fixture.debugElement.injector.get(UserService)
    userServiceSpy = jest.spyOn(userService, 'hasPermission')
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-wrapper"]')).toHaveLength(
      1
    )
  })

  it('should check permissions and render buttons accordingly', () => {
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-inline-action-button"]')
    ).toHaveLength(0)
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-overflow-action-button"]')
    ).toHaveLength(0)

    component.actions = mockActions
    fixture.detectChanges()

    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-inline-action-button"]')
    ).toHaveLength(1)
    expect(fixture.debugElement.nativeElement.querySelector('[title="My Test Action"]')).toBeTruthy()
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-overflow-action-button"]')
    ).toHaveLength(1)
    expect(fixture.debugElement.nativeElement.querySelector('[title="More actions"]')).toBeTruthy()
    expect(userServiceSpy).toHaveBeenCalledTimes(4)
  })

  it("should check permissions and not render button that user isn't allowed to see", () => {
    userServiceSpy.mockClear()

    userServiceSpy.mockReturnValue(false)

    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-inline-action-button"]')
    ).toHaveLength(0)
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-overflow-action-button"]')
    ).toHaveLength(0)

    component.actions = mockActions
    fixture.detectChanges()

    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-inline-action-button"]')
    ).toHaveLength(0)
    expect(fixture.debugElement.nativeElement.querySelector('[title="My Test Action"]')).toBeFalsy()
    expect(
      fixture.debugElement.nativeElement.querySelectorAll('[data-testid="ocx-page-header-overflow-action-button"]')
    ).toHaveLength(0)
    expect(fixture.debugElement.nativeElement.querySelector('[title="More actions"]')).toBeFalsy()
    expect(userServiceSpy).toHaveBeenCalledTimes(4)
  })
})
