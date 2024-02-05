import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'
import { Action, PageHeaderComponent } from './page-header.component'
import { RouterTestingModule } from '@angular/router/testing'
import { ConfigurationService } from '../../../services/configuration.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import { AppStateService } from '../../../services/app-state.service'
import { UserService } from '../../../services/user.service'
import { MockUserService } from '../../../../../mocks/mock-user-service'
import { PageHeaderHarness, TestbedHarnessEnvironment } from '../../../../../testing'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { PrimeIcons } from 'primeng/api'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

const mockActions: Action[] = [
  {
    label: 'My Test Action',
    show: 'always',
    actionCallback: () => {
      console.log('My Test Action')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
  {
    label: 'My Test Overflow Action',
    show: 'asOverflow',
    actionCallback: () => {
      console.log('My Test Overflow Action')
    },
    permission: 'TEST#TEST_PERMISSION',
  },
  {
    label: 'My Test Overflow Disabled Action',
    show: 'asOverflow',
    actionCallback: () => {
      console.log('My Test Overflow Disabled Action')
    },
    permission: 'TEST#TEST_PERMISSION',
    disabled: true,
  },
]

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

  let component: PageHeaderComponent
  let fixture: ComponentFixture<PageHeaderComponent>
  let pageHeaderHarness: PageHeaderHarness
  let userServiceSpy: jest.SpyInstance<boolean, [permissionKey: string], any>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent, PageHeaderComponent, DynamicPipe],
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
        NoopAnimationsModule,
      ],
      providers: [ConfigurationService, AppStateService, { provide: UserService, useClass: MockUserService }],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(PageHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    pageHeaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PageHeaderHarness)
    const userService = fixture.debugElement.injector.get(UserService)
    jest.restoreAllMocks()
    userServiceSpy = jest.spyOn(userService, 'hasPermission')
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
    const pageHeaderWrapper = await pageHeaderHarness.getPageHeaderWrapperHarness()
    expect(pageHeaderWrapper).toBeTruthy()
  })

  it('should check permissions and render buttons accordingly', async () => {
    expect(
      await pageHeaderHarness.getInlineActionButtons()
    ).toHaveLength(0)
    expect(
      await pageHeaderHarness.getOverflowActionButtons()
    ).toHaveLength(0)

    component.actions = mockActions
    fixture.detectChanges()

    expect(
      await pageHeaderHarness.getInlineActionButtons()
    ).toHaveLength(1)
    expect(await pageHeaderHarness.getElementByTitle('My Test Action')).toBeTruthy()
    expect(
      await pageHeaderHarness.getOverflowActionButtons()
    ).toHaveLength(1)
    expect(await pageHeaderHarness.getElementByTitle('More actions')).toBeTruthy()
    expect(userServiceSpy).toHaveBeenCalledTimes(3)
  })

  it("should check permissions and not render button that user isn't allowed to see", async () => {
    userServiceSpy.mockClear()

    userServiceSpy.mockReturnValue(false)

    expect(
      await pageHeaderHarness.getInlineActionButtons()
    ).toHaveLength(0)
    expect(
      await pageHeaderHarness.getOverflowActionButtons()
    ).toHaveLength(0)

    component.actions = mockActions
    fixture.detectChanges()

    expect(
      await pageHeaderHarness.getInlineActionButtons()
    ).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByTitle('My Test Action')).toBeFalsy()
    expect(
      await pageHeaderHarness.getOverflowActionButtons()
    ).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByTitle('More actions')).toBeFalsy()
    expect(userServiceSpy).toHaveBeenCalledTimes(3)
  })

  it("should render objectDetails as object info in the page header", async () => {
    const objectDetailsWithoutIcons = [
      {
        label: 'Venue',
        value: 'AIE Munich',
      },
      {
        label: 'Status',
        value: 'Confirmed',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithoutIcons
    
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(2)
    const objectDetailLabels = await pageHeaderHarness.getObjectDetailLabels()
    const objectDetailValues = await pageHeaderHarness.getObjectDetailValues()
    const objectDetailIcons = await pageHeaderHarness.getObjectDetailIcons()
    expect(objectDetailLabels.length).toEqual(2)
    expect(objectDetailValues.length).toEqual(2)
    expect(objectDetailIcons.length).toEqual(0)

    objectDetailLabels.forEach(async (label, i) => {
      expect(await label.text()).toEqual(objectDetailsWithoutIcons[i].label)
    })

    objectDetailValues.forEach(async (value, i) => {
      expect(await value.text()).toEqual(objectDetailsWithoutIcons[i].value)
    })
  })

  it("should render objectDetails with icons as object info in the page header", async () => {
    const objectDetailsWithIcons = [
      {
        label: 'Venue',
        value: 'AIE Munich',
      },
      {
        label: 'Status',
        value: 'Confirmed',
        icon: PrimeIcons.CHECK
      },
      {
        label: 'Done?',
        icon: PrimeIcons.EXCLAMATION_CIRCLE
      },
      {
        label: 'Empty'
      }
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithIcons
    
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(4)
    const objectDetailLabels = await pageHeaderHarness.getObjectDetailLabels()
    const objectDetailValues = await pageHeaderHarness.getObjectDetailValues()
    const objectDetailIcons = await pageHeaderHarness.getObjectDetailIcons()
    expect(objectDetailLabels.length).toEqual(4)
    expect(objectDetailValues.length).toEqual(3)
    expect(objectDetailIcons.length).toEqual(2)

    objectDetailLabels.forEach(async (label, i) => {
      expect(await label.text()).toEqual(objectDetailsWithIcons[i].label)
    })

    objectDetailValues.forEach(async (value, i) => {
      if(objectDetailsWithIcons[i].value) {
        expect(await value.text()).toEqual(objectDetailsWithIcons[i].value)
      }
    })

    expect(await objectDetailIcons[0].getAttribute('class')).toEqual(objectDetailsWithIcons[1].icon)
    expect(await objectDetailIcons[1].getAttribute('class')).toEqual(objectDetailsWithIcons[2].icon)
  })

  it('should show overflow actions when menu overflow button clicked', () => {
    component.actions = mockActions
    fixture.detectChanges()

    const menuOverflowButton = fixture.debugElement.nativeElement.querySelector(
      '[name="ocx-page-header-overflow-action-button"]'
    )
    expect(menuOverflowButton).toBeTruthy()
    menuOverflowButton.click()
    fixture.detectChanges()

    expect(fixture.debugElement.nativeElement.querySelector('[title="My Test Overflow Action"]')).toBeTruthy()
    expect(fixture.debugElement.nativeElement.querySelector('[title="My Test Overflow Disabled Action"]')).toBeTruthy()
  })

  it('should use provided action callback on overflow button click', () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions
    fixture.detectChanges()

    const menuOverflowButton = fixture.debugElement.nativeElement.querySelector(
      '[name="ocx-page-header-overflow-action-button"]'
    )
    expect(menuOverflowButton).toBeTruthy()
    menuOverflowButton.click()
    fixture.detectChanges()

    const enabledActionElement = fixture.debugElement.nativeElement.querySelector('[title="My Test Overflow Action"]')
    expect(enabledActionElement).toBeTruthy()
    expect(enabledActionElement.classList).not.toContain('p-disabled')
    enabledActionElement.click()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('should disable overflow button when action is disabled', () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions
    fixture.detectChanges()

    const menuOverflowButton = fixture.debugElement.nativeElement.querySelector(
      '[name="ocx-page-header-overflow-action-button"]'
    )
    expect(menuOverflowButton).toBeTruthy()
    menuOverflowButton.click()
    fixture.detectChanges()

    const disabledActionElement = fixture.debugElement.nativeElement.querySelector(
      '[title="My Test Overflow Disabled Action"]'
    )
    expect(disabledActionElement).toBeTruthy()
    expect(disabledActionElement.classList).toContain('p-disabled')
    disabledActionElement.click()
    expect(console.log).toHaveBeenCalledTimes(0)
  })
})
