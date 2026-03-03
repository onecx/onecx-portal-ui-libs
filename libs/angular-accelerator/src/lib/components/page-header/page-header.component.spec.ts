import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { TooltipModule } from 'primeng/tooltip'
import { PageHeaderHarness, provideTranslateTestingService, TestbedHarnessEnvironment } from '../../../../testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { Router } from '@angular/router'
import { OcxTooltipDirective } from '../../directives/ocx-tooltip.directive'

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
  let mockAppStateService: AppStateServiceMock
  let component: PageHeaderComponent
  let fixture: ComponentFixture<PageHeaderComponent>
  let pageHeaderHarness: PageHeaderHarness
  let userServiceMock: UserServiceMock
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent, PageHeaderComponent, DynamicPipe, OcxTooltipDirective],
      imports: [
        RouterTestingModule,
        BreadcrumbModule,
        MenuModule,
        ButtonModule,
        NoopAnimationsModule,
        TooltipModule,
        AngularAcceleratorModule,
      ],
      providers: [
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
        provideUserServiceMock(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    mockAppStateService = TestBed.inject(AppStateServiceMock)
    userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['TEST#TEST_PERMISSION'])
    mockAppStateService.currentWorkspace$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })
    router = TestBed.inject(Router)
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(PageHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    pageHeaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PageHeaderHarness)
    jest.restoreAllMocks()
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
    const pageHeaderWrapper = await pageHeaderHarness.getPageHeaderWrapperHarness()
    expect(pageHeaderWrapper).toBeTruthy()
  })

  it("should check permissions and not render button that user isn't allowed to see", async () => {
    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    component.actions = mockActions

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should react to permission changes', async () => {
    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    component.actions = mockActions

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeTruthy()
    await (await pageHeaderHarness.getOverflowActionMenuButton())?.click()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(2)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeTruthy()

    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should render inline actions buttons with icons', async () => {
    component.actions = [
      {
        label: 'Action with left icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
      },
      {
        label: 'Action with right icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
        iconPos: 'right',
      },
    ]

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()
    expect(inlineButtons).toHaveLength(2)
    expect(await (await inlineButtons[0].getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await inlineButtons[1].getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
  })

  it('should render inline actions buttons with icons', async () => {
    component.actions = [
      {
        label: 'Action with left icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
      },
      {
        label: 'Action with right icon',
        show: 'always',
        actionCallback: () => {
          console.log('My Test Action')
        },
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.LOCK,
        iconPos: 'right',
      },
    ]

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()
    expect(inlineButtons).toHaveLength(2)
    expect(await (await inlineButtons[0].getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await inlineButtons[1].getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
  })

  it('should show a loading spinner when action is loading', async () => {
    const mockFn = jest.fn()

    component.actions = [
      {
        label: 'My Test Loading Action',
        show: 'always',
        actionCallback: mockFn,
        permission: 'TEST#TEST_PERMISSION',
        loading: true,
      },
    ]

    const loadingActionElement = await pageHeaderHarness.getInlineActionButtonByLabel('My Test Loading Action')
    expect(loadingActionElement).toBeTruthy()
    expect(await loadingActionElement?.getLoadingIcon()).toBeTruthy()
    await loadingActionElement?.click()
    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should render inline action button with routerLink', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    jest.spyOn(console, 'log')

    component.actions = [
      {
        label: 'Inline action with routerLink',
        show: 'always',
        actionCallback: () => {
          console.log('My routing Action')
        },
        routerLink: '/inline',
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.MAP,
      },
    ]

    const routerLinkInline = await pageHeaderHarness.getInlineActionButtonByLabel('Inline action with routerLink')
    expect(routerLinkInline).toBeTruthy()

    await routerLinkInline?.click()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/inline'])
    expect(console.log).not.toHaveBeenCalledWith('My routing Action')
  })

  it('should render overflow action button with routerLink', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    jest.spyOn(console, 'log')

    component.actions = [
      {
        label: 'Overflow action with routerLink',
        show: 'asOverflow',
        actionCallback: () => {
          console.log('My routing Action')
        },
        routerLink: '/overflow',
        permission: 'TEST#TEST_PERMISSION',
        icon: PrimeIcons.MAP,
      },
    ]

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()
    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(1)

    await menuItems[0]?.selectItem()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/overflow'])
    expect(console.log).not.toHaveBeenCalledWith('My routing Action')
  })

  it('should handle routerLink as function returning string', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkFunction = jest.fn(() => '/function-link')

    component.actions = [
      {
        label: 'Action with function routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: routerLinkFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with function routerLink')
    await inlineButton?.click()

    expect(routerLinkFunction).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/function-link'])
  })

  it('should handle routerLink as function returning Promise<string>', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkPromiseFunction = jest.fn(() => Promise.resolve('/promise-function-link'))

    component.actions = [
      {
        label: 'Action with promise function routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: routerLinkPromiseFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with promise function routerLink')
    await inlineButton?.click()

    expect(routerLinkPromiseFunction).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/promise-function-link'])
  })

  it('should handle routerLink as Promise<string>', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

    component.actions = [
      {
        label: 'Action with promise routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: Promise.resolve('/promise-link'),
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with promise routerLink')
    await inlineButton?.click()

    expect(spy).toHaveBeenCalledWith(['/promise-link'])
  })

  it('should handle overflow action with function routerLink', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkFunction = jest.fn(() => '/overflow-function')

    component.actions = [
      {
        label: 'Overflow function routerLink',
        show: 'asOverflow',
        actionCallback: jest.fn(),
        routerLink: routerLinkFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    await menuItems[0]?.selectItem()

    expect(routerLinkFunction).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/overflow-function'])
  })

  it('should prioritize routerLink over actionCallback when both are provided', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const callbackSpy = jest.fn()

    component.actions = [
      {
        label: 'Action with routerLink and callback',
        show: 'always',
        actionCallback: callbackSpy,
        routerLink: '/prioritized-link',
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with routerLink and callback')
    await inlineButton?.click()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/prioritized-link'])
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it('should prioritize routerLink over actionCallback in overflow menu when both are provided', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const callbackSpy = jest.fn()

    component.actions = [
      {
        label: 'Overflow with routerLink and callback',
        show: 'asOverflow',
        actionCallback: callbackSpy,
        routerLink: '/overflow-prioritized',
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    await menuItems[0]?.selectItem()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/overflow-prioritized'])
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it('should execute actionCallback when no routerLink is provided', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const callbackSpy = jest.fn()

    component.actions = [
      {
        label: 'Action with callback only',
        show: 'always',
        actionCallback: callbackSpy,
        permission: 'TEST#TEST_PERMISSION',
      },
    ]

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with callback only')
    await inlineButton?.click()

    expect(spy).not.toHaveBeenCalled()
    expect(callbackSpy).toHaveBeenCalledTimes(1)
  })

  it('should render objectDetails as object info in the page header', async () => {
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

    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    expect(await firstDetail?.getLabel()).toEqual('Venue')
    expect(await firstDetail?.getValue()).toEqual('AIE Munich')
    expect(await firstDetail?.getIcon()).toBeUndefined()
    const secondDetail = await pageHeaderHarness.getObjectInfoByLabel('Status')
    expect(await secondDetail?.getLabel()).toEqual('Status')
    expect(await secondDetail?.getValue()).toEqual('Confirmed')
    expect(await secondDetail?.getIcon()).toBeUndefined()
  })

  it('should render objectDetails with icons as object info in the page header', async () => {
    const objectDetailsWithIcons: ObjectDetailItem[] = [
      {
        label: 'Venue',
        value: 'AIE Munich',
      },
      {
        label: 'Status',
        value: 'Confirmed',
        icon: PrimeIcons.CHECK,
      },
      {
        label: 'Done?',
        icon: PrimeIcons.EXCLAMATION_CIRCLE,
      },
      {
        label: 'Empty',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithIcons

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(4)
    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    expect(await firstDetail?.getLabel()).toEqual('Venue')
    expect(await firstDetail?.getValue()).toEqual('AIE Munich')
    expect(await firstDetail?.getIcon()).toBeUndefined()
    const secondDetail = await pageHeaderHarness.getObjectInfoByLabel('Status')
    expect(await secondDetail?.getLabel()).toEqual('Status')
    expect(await secondDetail?.getValue()).toEqual('Confirmed')
    expect(await secondDetail?.getIcon()).toEqual(PrimeIcons.CHECK)
    const thirdDetail = await pageHeaderHarness.getObjectInfoByLabel('Done?')
    expect(await thirdDetail?.getLabel()).toEqual('Done?')
    expect(await thirdDetail?.getValue()).toEqual('')
    expect(await thirdDetail?.getIcon()).toEqual(PrimeIcons.EXCLAMATION_CIRCLE)
    const fourthDetail = await pageHeaderHarness.getObjectInfoByLabel('Empty')
    expect(await fourthDetail?.getLabel()).toEqual('Empty')
    expect(await fourthDetail?.getValue()).toBeUndefined()
    expect(await fourthDetail?.getIcon()).toBeUndefined()
  })

  it('should use styles to render objectDetails in the page header', async () => {
    const objectDetailsWithIcons: ObjectDetailItem[] = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        valueCssClass: 'bg-green-400 text-white',
      },
    ]
    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(0)

    component.objectDetails = objectDetailsWithIcons

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(1)
    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    const firstDetailStyles = await firstDetail?.getValueStyles()
    expect(firstDetailStyles?.includes('bg-green-400')).toBeTruthy()
    expect(firstDetailStyles?.includes('text-white')).toBeTruthy()
  })

  it('should show overflow actions when menu overflow button clicked', async () => {
    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()

    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(2)
    expect(await menuItems[0].getText()).toBe('My Test Overflow Action')
    expect(await menuItems[1].getText()).toBe('My Test Overflow Disabled Action')
  })

  it('should use provided action callback on overflow button click', async () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()

    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(2)
    const enabledActionElement = await menuItems[0].host()
    expect(await enabledActionElement.hasClass('p-disabled')).toBe(false)
    await enabledActionElement.click()
    expect(console.log).toHaveBeenCalledWith('My Test Overflow Action')
  })

  it('should disable overflow button when action is disabled', async () => {
    jest.spyOn(console, 'log')

    component.actions = mockActions

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()

    const overFlowMenuItems = await pageHeaderHarness.getOverFlowMenuItems()

    expect(overFlowMenuItems).toBeTruthy()
    expect(overFlowMenuItems?.length).toBe(2)

    const disabledMenuItem = overFlowMenuItems[1]
    expect(disabledMenuItem).toBeTruthy()

    await disabledMenuItem.selectItem()
    expect(console.log).not.toHaveBeenCalledWith('My Test Overflow Disabled Action')
  })

  it('should render labelTooltipKey, valueTooltipKey, and actionItemTooltipKey as translated tooltips when language is changed', async () => {
    const translate = TestBed.inject(TranslateService)

    translate.setTranslation(
      'en',
      {
        LABEL_TOOLTIP_KEY: 'Label Tooltip Key EN',
        VALUE_TOOLTIP_KEY: 'Value Tooltip Key EN',
        ACTION_TOOLTIP_KEY: 'Action Tooltip Key EN',
      },
      true
    )
    translate.setTranslation(
      'de',
      {
        LABEL_TOOLTIP_KEY: 'Label Tooltip Key DE',
        VALUE_TOOLTIP_KEY: 'Value Tooltip Key DE',
        ACTION_TOOLTIP_KEY: 'Action Tooltip Key DE',
      },
      true
    )
    translate.use('en')

    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        labelTooltipKey: 'LABEL_TOOLTIP_KEY',
        valueTooltipKey: 'VALUE_TOOLTIP_KEY',
        actionItemTooltipKey: 'ACTION_TOOLTIP_KEY',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    expect(await objectInfo.getLabelTooltipContent()).toBe('Label Tooltip Key EN')
    expect(await objectInfo.getValueTooltipContent()).toBe('Value Tooltip Key EN')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('Action Tooltip Key EN')

    translate.use('de')
    await fixture.whenStable()
    fixture.detectChanges()

    expect(await objectInfo.getLabelTooltipContent()).toBe('Label Tooltip Key DE')
    expect(await objectInfo.getValueTooltipContent()).toBe('Value Tooltip Key DE')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('Action Tooltip Key DE')
  })

  it('should fallback to empty string if *Key properties are not provided', async () => {
    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    //tooltips should not be initialise for undefined keys
    expect(await objectInfo.getLabelTooltipContent()).toBeNull()
    expect(await objectInfo.getValueTooltipContent()).toBeNull()
    expect(await objectInfo.getActionItemTooltipContent()).toBeNull()
  })
})
