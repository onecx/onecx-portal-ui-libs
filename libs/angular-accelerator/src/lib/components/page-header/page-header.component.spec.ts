import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { TooltipModule } from 'primeng/tooltip'
import { PageHeaderHarness, provideTranslateTestingService, TestbedHarnessEnvironment } from '../../../../testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { provideRouter, Router } from '@angular/router'
import { of } from 'rxjs'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core'
import { By } from '@angular/platform-browser'

export function provideBreadcrumbServiceMock() {
  return [BreadcrumbServiceMock, { provide: BreadcrumbService, useExisting: BreadcrumbServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbServiceMock {
  itemsHandler = of<MenuItem[]>([
    {
      label: 'Test breadcrumb from itemsHandler',
      show: 'always',
      routerLink: '/test-breadcrumb',
      permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
    },
  ])

  generatedItemsSource = of<MenuItem[]>([
    {
      label: 'Test breadcrumb from generated source',
      show: 'always',
      routerLink: '/test-breadcrumb',
      permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
    },
  ])

  generateBreadcrumbs() {
    return this.generatedItemsSource
  }
}

@Component({ standalone: false, template: '' })
class TestRouteComponent {}

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
      declarations: [PageHeaderComponent, PageHeaderComponent, DynamicPipe, TestRouteComponent],
      imports: [BreadcrumbModule, MenuModule, ButtonModule, TooltipModule, AngularAcceleratorModule],
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
        provideRouter([{ path: '**', component: TestRouteComponent }]),
        provideBreadcrumbServiceMock(),
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

  it('should apply translated aria-label to breadcrumb links when manualBreadcrumbs is true', async () => {
    fixture = TestBed.createComponent(PageHeaderComponent)
    component = fixture.componentInstance
    fixture.componentRef.setInput('manualBreadcrumbs', true)

    fixture.detectChanges()
    await fixture.whenStable()
    pageHeaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PageHeaderHarness)
    component.ngAfterViewInit()

    const breadcrumbItem = await pageHeaderHarness.getBreadcrumbItem('Test breadcrumb from itemsHandler')
    expect(breadcrumbItem).toBeTruthy()
    expect(await breadcrumbItem?.getText()).toContain('Test breadcrumb')
    expect(await breadcrumbItem?.getLinkAriaLabel()).toBe('Go to Test breadcrumb from itemsHandler page')
  })

  it('should apply translated aria-label to breadcrumb links when manualBreadcrumbs is false', async () => {
    fixture.componentRef.setInput('manualBreadcrumbs', false)

    fixture.detectChanges()
    await fixture.whenStable()
    component.ngAfterViewInit()

    const breadcrumbItem = await pageHeaderHarness.getBreadcrumbItem('Test breadcrumb from generated source')
    expect(breadcrumbItem).toBeTruthy()
    expect(await breadcrumbItem?.getText()).toContain('Test breadcrumb')
    expect(await breadcrumbItem?.getLinkAriaLabel()).toBe('Go to Test breadcrumb from generated source page')
  })

  it('should test if breadcrumb is not rendered when there are no breadcrumbs', async () => {
    component.breadcrumbs$ = of([])

    fixture.detectChanges()
    await fixture.whenStable()
    component.ngAfterViewInit()

    const breadcrumbItem = await pageHeaderHarness.getBreadcrumbItem('Test breadcrumb')
    expect(breadcrumbItem).toBeNull()
    expect(await breadcrumbItem?.getText()).toBeUndefined()
  })

  it('should not add aria-current for non-last breadcrumb with empty label', async () => {
    component.breadcrumbs$ = of([
      {
        label: 'Second breadcrumb',
        show: 'always',
        routerLink: '/second',
        permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
      },
      {
        label: '',
        show: 'always',
        routerLink: '/empty',
        permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
      },
    ])

    fixture.detectChanges()
    await fixture.whenStable()
    component.ngAfterViewInit()

    const breadcrumbLinks = fixture.debugElement.queryAll(By.css('.p-breadcrumb-item-link'))
    expect(breadcrumbLinks[0].attributes['aria-current']).toBeUndefined()
  })

  it('should handle null ViewChild', async () => {
    component.breadcrumbElementRef = undefined

    fixture.detectChanges()
    await fixture.whenStable()
    component.ngAfterViewInit()

    const breadcrumbItem = await pageHeaderHarness.getBreadcrumbItem('Test breadcrumb')
    expect(breadcrumbItem).toBeNull()
  })

  it("should check permissions and not render button that user isn't allowed to see", async () => {
    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    fixture.componentRef.setInput('actions', mockActions)

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getInlineActionButtonByLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should react to permission changes', async () => {
    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    fixture.componentRef.setInput('actions', mockActions)

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    expect(await pageHeaderHarness.getInlineActionButtonByLabel('My Test Action')).toBeTruthy()
    await (await pageHeaderHarness.getOverflowActionMenuButton())?.click()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(2)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeTruthy()

    userServiceMock.permissionsTopic$.publish([])

    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getInlineActionButtonByLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should render inline actions buttons with icons', async () => {
    fixture.componentRef.setInput('actions', [
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
    ])

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()
    expect(inlineButtons).toHaveLength(2)
    expect(await (await inlineButtons[0].getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await inlineButtons[1].getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
  })

  it('should show a loading spinner when action is loading', async () => {
    const mockFn = jest.fn()

    fixture.componentRef.setInput('actions', [
      {
        label: 'My Test Loading Action',
        show: 'always',
        actionCallback: mockFn,
        permission: 'TEST#TEST_PERMISSION',
        loading: true,
      },
    ])

    const loadingActionElement = await pageHeaderHarness.getInlineActionButtonByLabel('My Test Loading Action')
    expect(loadingActionElement).toBeTruthy()
    expect(await loadingActionElement?.getLoadingIcon()).toBeTruthy()
    await loadingActionElement?.click()
    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should navigate when inline action has string routerLink', async () => {
    fixture.componentRef.setInput('actions', [
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
    ])

    fixture.detectChanges()
    await fixture.whenStable()

    const routerLinkInline = fixture.debugElement.query(
      By.css('a[data-testid="ocx-page-header-inline-action-icon-button"]')
    )
    expect(routerLinkInline).toBeTruthy()

    routerLinkInline.nativeElement.click()
    await fixture.whenStable()

    expect(router.url).toBe('/inline')
  })

  it('should render overflow action button with routerLink', async () => {
    jest.spyOn(console, 'log')

    fixture.componentRef.setInput('actions', [
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
    ])

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()
    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    expect(menuItems.length).toBe(1)

    await menuItems[0]?.selectItem()
    expect(router.url).toBe('/overflow')
    expect(console.log).not.toHaveBeenCalledWith('My routing Action')
  })

  it('should handle routerLink as function returning string', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkFunction = jest.fn(() => '/function-link')

    fixture.componentRef.setInput('actions', [
      {
        label: 'Action with function routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: routerLinkFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with function routerLink')
    await inlineButton?.click()

    expect(routerLinkFunction).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/function-link'])
  })

  it('should handle routerLink as function returning Promise<string>', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkPromiseFunction = jest.fn(() => Promise.resolve('/promise-function-link'))

    fixture.componentRef.setInput('actions', [
      {
        label: 'Action with promise function routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: routerLinkPromiseFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with promise function routerLink')
    await inlineButton?.click()

    expect(routerLinkPromiseFunction).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(['/promise-function-link'])
  })

  it('should handle routerLink as Promise<string>', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

    fixture.componentRef.setInput('actions', [
      {
        label: 'Action with promise routerLink',
        show: 'always',
        actionCallback: jest.fn(),
        routerLink: Promise.resolve('/promise-link'),
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with promise routerLink')
    await inlineButton?.click()

    expect(spy).toHaveBeenCalledWith(['/promise-link'])
  })

  it('should handle overflow action with function routerLink', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const routerLinkFunction = jest.fn(() => '/overflow-function')

    fixture.componentRef.setInput('actions', [
      {
        label: 'Overflow function routerLink',
        show: 'asOverflow',
        actionCallback: jest.fn(),
        routerLink: routerLinkFunction,
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

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

    await component.onActionClick({
      label: 'Action with routerLink and callback',
      show: 'always',
      actionCallback: callbackSpy,
      routerLink: '/prioritized-link',
      permission: 'TEST#TEST_PERMISSION',
    })

    expect(spy).toHaveBeenCalledWith(['/prioritized-link'])
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it('should prioritize routerLink over actionCallback in overflow menu when both are provided', async () => {
    const callbackSpy = jest.fn()

    fixture.componentRef.setInput('actions', [
      {
        label: 'Overflow with routerLink and callback',
        show: 'asOverflow',
        actionCallback: callbackSpy,
        routerLink: '/overflow-prioritized',
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    await menuItems[0]?.selectItem()

    expect(router.url).toBe('/overflow-prioritized')
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it('should execute actionCallback when no routerLink is provided', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
    const callbackSpy = jest.fn()

    fixture.componentRef.setInput('actions', [
      {
        label: 'Action with callback only',
        show: 'always',
        actionCallback: callbackSpy,
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const inlineButton = await pageHeaderHarness.getInlineActionButtonByLabel('Action with callback only')
    await inlineButton?.click()

    expect(spy).not.toHaveBeenCalled()
    expect(callbackSpy).toHaveBeenCalledTimes(1)
  })

  it('should navigate via routerLink when no actionCallback is provided', async () => {
    const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

    await component.onActionClick({
      label: 'Action with routerLink only',
      show: 'always',
      routerLink: '/routerlink-only',
      permission: 'TEST#TEST_PERMISSION',
    })

    expect(spy).toHaveBeenCalledWith(['/routerlink-only'])
  })

  it('should navigate via routerLink in overflow menu when no actionCallback is provided', async () => {
    fixture.componentRef.setInput('actions', [
      {
        label: 'Overflow with routerLink only',
        show: 'asOverflow',
        routerLink: '/overflow-routerlink-only',
        permission: 'TEST#TEST_PERMISSION',
      },
    ])

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    await menuOverflowButton?.click()

    const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
    await menuItems[0]?.selectItem()

    expect(router.url).toBe('/overflow-routerlink-only')
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

    fixture.componentRef.setInput('objectDetails', objectDetailsWithoutIcons)

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

    fixture.componentRef.setInput('objectDetails', objectDetailsWithIcons)

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

    fixture.componentRef.setInput('objectDetails', objectDetailsWithIcons)

    expect((await pageHeaderHarness.getObjectInfos()).length).toEqual(1)
    const firstDetail = await pageHeaderHarness.getObjectInfoByLabel('Venue')
    const firstDetailStyles = await firstDetail?.getValueStyles()
    expect(firstDetailStyles?.includes('bg-green-400')).toBeTruthy()
    expect(firstDetailStyles?.includes('text-white')).toBeTruthy()
  })

  it('should show overflow actions when menu overflow button clicked', async () => {
    fixture.componentRef.setInput('actions', mockActions)

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

    fixture.componentRef.setInput('actions', mockActions)

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

    fixture.componentRef.setInput('actions', mockActions)

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

    fixture.componentRef.setInput('objectDetails', [
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
    ])
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
    fixture.componentRef.setInput('objectDetails', [
      {
        label: 'Venue',
        value: 'AIE Munich',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ])
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    //tooltips should not be initialise for undefined keys
    expect(await objectInfo.getLabelTooltipContent()).toBeNull()
    expect(await objectInfo.getValueTooltipContent()).toBeNull()
    expect(await objectInfo.getActionItemTooltipContent()).toBeNull()
  })

  describe('accessible names', () => {
    const cb = () => undefined
    let warnSpy: jest.SpyInstance

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    })
    afterEach(() => warnSpy.mockRestore())

    async function actionButtonName(details: Partial<ObjectDetailItem>): Promise<string | null | undefined> {
      fixture.componentRef.setInput('objectDetails', [
        { label: 'Venue', value: 'AIE', actionItemIcon: 'pi pi-copy', actionItemCallback: cb, ...details },
      ])
      fixture.detectChanges()
      const btn: HTMLElement = fixture.nativeElement.querySelector('[name="object-detail-value"] button')
      return btn.getAttribute('aria-label')
    }

    it('should resolve the object detail action name by key, label, tooltip key, then detail label', async () => {
      const translate = TestBed.inject(TranslateService)
      translate.setTranslation('en', { ARIA: 'Aria key', TIP: 'Tip key' })
      translate.use('en')
      expect(
        await actionButtonName({
          actionItemAriaLabelKey: 'ARIA',
          actionItemAriaLabel: 'Aria',
          actionItemTooltipKey: 'TIP',
        })
      ).toBe('Aria key')
      expect(await actionButtonName({ actionItemAriaLabel: 'Aria', actionItemTooltipKey: 'TIP' })).toBe('Aria')
      expect(await actionButtonName({ actionItemTooltipKey: 'TIP' })).toBe('Tip key')
      expect(warnSpy.mock.calls.filter(([m]) => String(m).startsWith('ocx-page-header'))).toHaveLength(0)
    })

    it('should fall back to the detail label with a dev warning and never expose the icon class', async () => {
      const name = await actionButtonName({})
      expect(name).toBe('Venue')
      expect(name).not.toContain('pi pi-')
      expect(name).not.toContain('button for')
      expect(warnSpy.mock.calls.filter(([m]) => String(m).startsWith('ocx-page-header'))).toHaveLength(1)
    })

    it('should render the object detail action button at least 24x24 px via the min-size class', async () => {
      await actionButtonName({})
      const btn: HTMLElement = fixture.nativeElement.querySelector('[name="object-detail-value"] button')
      expect(btn.classList.contains('object-info-action-button')).toBe(true)
    })

    it('should let a visible label win over title and ariaLabel on inline actions', async () => {
      fixture.componentRef.setInput('actions', [
        { id: 'a1', label: 'Save', title: 'Persist', ariaLabel: 'Store it', show: 'always', actionCallback: cb },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()
      const btn: HTMLElement = fixture.nativeElement.querySelector('#a1 button, button#a1')
      expect(btn.getAttribute('aria-label')).toBeNull()
      expect(btn.textContent).toContain('Save')
    })

    it('should name icon-only inline actions by ariaLabel, then title', async () => {
      fixture.componentRef.setInput('actions', [
        { id: 'a1', icon: 'pi pi-lock', title: 'Title', ariaLabel: 'Aria', show: 'always', actionCallback: cb },
        { id: 'a2', icon: 'pi pi-lock', title: 'Title only', show: 'always', actionCallback: cb },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('#a1 button, button#a1').getAttribute('aria-label')).toBe('Aria')
      expect(fixture.nativeElement.querySelector('#a2 button, button#a2').getAttribute('aria-label')).toBe('Title only')
    })

    it('should render the figure image as decorative and the subheader as plain content', async () => {
      fixture.componentRef.setInput('figureImage', 'assets/x.png')
      fixture.componentRef.setInput('subheader', 'Sub')
      fixture.detectChanges()
      const img = fixture.nativeElement.querySelector('.figure img')
      expect(img?.getAttribute('alt')).toBe('')
      const sub = fixture.nativeElement.querySelector('#page-subheader')
      expect(sub.getAttribute('role')).toBeNull()
      expect(sub.getAttribute('aria-label')).toBeNull()
    })

    it('should give icon-only object details a text alternative', async () => {
      fixture.componentRef.setInput('objectDetails', [
        { label: 'Status', icon: 'pi pi-check', valueTooltipKey: 'STATUS_OK' },
      ])
      TestBed.inject(TranslateService).setTranslation('en', { STATUS_OK: 'Confirmed' })
      TestBed.inject(TranslateService).use('en')
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('[name="object-detail-value"] .sr-only').textContent).toBe('Confirmed')
    })
  })

  describe('object panel layout classes', () => {
    const details = [{ label: 'Venue', value: 'AIE' }]

    it('should use the default layout classes when enableGridView is undefined', () => {
      expect(component.enableGridView()).toBeUndefined()
      expect(component.objectPanelLayoutClasses()).toBe('flex flex-column row-gap-2 md:flex-row md:justify-content-between')
      expect(component.objectInfoLayoutClasses()).toBe('flex flex-row md:flex-column md:align-items-center md:gap-2')
    })

    it('should apply the grid layout classes and default to col-4 when enableGridView is true', () => {
      fixture.componentRef.setInput('enableGridView', true)
      fixture.componentRef.setInput('objectDetails', details)
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('.object-panel').classList.contains('grid')).toBe(true)
      expect(fixture.nativeElement.querySelector('.object-info').className).toContain('lg:col-4')
    })

    it('should compute lg:col-N from gridLayoutDesktopColumns', () => {
      fixture.componentRef.setInput('enableGridView', true)
      fixture.componentRef.setInput('gridLayoutDesktopColumns', 3)
      fixture.componentRef.setInput('objectDetails', details)
      fixture.detectChanges()

      // 12 / 3 = 4 columns
      expect(fixture.nativeElement.querySelector('.object-info').className).toContain('lg:col-4')
    })

    it('should compute lg:col-6 from a 2-column desktop grid', () => {
      fixture.componentRef.setInput('enableGridView', true)
      fixture.componentRef.setInput('gridLayoutDesktopColumns', 2)
      fixture.componentRef.setInput('objectDetails', details)
      fixture.detectChanges()

      // 12 / 2 = 6 columns
      expect(fixture.nativeElement.querySelector('.object-info').className).toContain('lg:col-6')
    })

    it('should apply the column layout classes when enableGridView is false', () => {
      fixture.componentRef.setInput('enableGridView', false)
      fixture.componentRef.setInput('objectDetails', details)
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('.object-panel').classList.contains('flex')).toBe(true)
      expect(fixture.nativeElement.querySelector('.object-panel').classList.contains('overflow-x-auto')).toBe(true)
      expect(fixture.nativeElement.querySelector('.object-info').classList.contains('min-w-120')).toBe(true)
    })
  })

  describe('conditional action visibility', () => {
    it('should hide a conditional inline action when showCondition is false', async () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Hidden inline',
          show: 'always',
          conditional: true,
          showCondition: false,
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    })

    it('should show a conditional inline action when showCondition is true', async () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Visible inline',
          show: 'always',
          conditional: true,
          showCondition: true,
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
      expect(await pageHeaderHarness.getInlineActionButtonByLabel('Visible inline')).toBeTruthy()
    })

    it('should hide the overflow menu when all overflow actions are conditionally hidden', async () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Hidden overflow',
          show: 'asOverflow',
          conditional: true,
          showCondition: false,
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])

      expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()
    })

    it('should show a conditional overflow action when showCondition is true', async () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Visible overflow',
          show: 'asOverflow',
          conditional: true,
          showCondition: true,
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])

      const overflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
      expect(overflowButton).toBeTruthy()
      await overflowButton?.click()
      expect((await pageHeaderHarness.getOverFlowMenuItems()).length).toBe(1)
    })
  })

  describe('save action and figure image error', () => {
    it('should emit save when onAction is called with "save"', () => {
      const saveSpy = jest.fn()
      component.save.subscribe(saveSpy)

      component.onAction('save')

      expect(saveSpy).toHaveBeenCalledTimes(1)
    })

    it('should not emit save for an unknown action', () => {
      const saveSpy = jest.fn()
      component.save.subscribe(saveSpy)

      component.onAction('delete')

      expect(saveSpy).not.toHaveBeenCalled()
    })

    it('should mark the figure image as failed when handleImageError is called', () => {
      expect(component.figureImageLoadError()).toBe(false)

      component.handleImageError()

      expect(component.figureImageLoadError()).toBe(true)
    })

    it('should render the colorblob when the figure image fails to load', () => {
      fixture.componentRef.setInput('figureImage', 'assets/x.png')
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('.colorblob')).toBeNull()

      component.figureImageLoadError.set(true)
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('.colorblob')).toBeTruthy()
    })
  })

  describe('translation key resolution', () => {
    it('should resolve an object-form TranslationKey with parameters for the action button label', async () => {
      const translate = TestBed.inject(TranslateService)
      translate.setTranslation('en', { PARAM_KEY: 'Label {{name}}' })
      translate.use('en')

      const item: ObjectDetailItem = {
        label: 'Venue',
        value: 'AIE',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => undefined,
        actionItemAriaLabelKey: { key: 'PARAM_KEY', parameters: { name: 'ACME' } },
      }
      fixture.componentRef.setInput('objectDetails', [item])
      fixture.detectChanges()

      const btn: HTMLElement = fixture.nativeElement.querySelector('[name="object-detail-value"] button')
      expect(btn.getAttribute('aria-label')).toBe('Label ACME')
    })

    it('should fall back to the object detail label when an object-form aria key resolves to nothing', async () => {
      const translate = TestBed.inject(TranslateService)
      // instant() returns the key when untranslated, so map it to an empty string to reach the `translated || undefined` fallback
      translate.setTranslation('en', { MISSING_KEY: '' })
      translate.use('en')
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

      const item: ObjectDetailItem = {
        label: 'Venue',
        value: 'AIE',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => undefined,
        actionItemAriaLabelKey: { key: 'MISSING_KEY' },
      }
      fixture.componentRef.setInput('objectDetails', [item])
      fixture.detectChanges()

      const btn: HTMLElement = fixture.nativeElement.querySelector('[name="object-detail-value"] button')
      expect(btn.getAttribute('aria-label')).toBe('Venue')
      expect(warnSpy.mock.calls.filter(([m]) => String(m).startsWith('ocx-page-header'))).toHaveLength(1)
      warnSpy.mockRestore()
    })

    it('should render the inline action label from a translated labelKey', async () => {
      const translate = TestBed.inject(TranslateService)
      translate.setTranslation('en', { ACTION_LABEL_KEY: 'Saved label' })
      translate.use('en')

      fixture.componentRef.setInput('actions', [
        {
          id: 'a1',
          labelKey: 'ACTION_LABEL_KEY',
          title: 'Title',
          show: 'always',
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      const btn: HTMLElement = fixture.nativeElement.querySelector('#a1')
      expect(btn.textContent).toContain('Saved label')
      // a visible label wins, so no aria-label override is set
      expect(btn.getAttribute('aria-label')).toBeNull()
    })

    it('should name an icon-only inline action from a translated ariaLabelKey, with titleKey as fallback', async () => {
      const translate = TestBed.inject(TranslateService)
      translate.setTranslation('en', { ARIA_KEY: 'Aria via key', TITLE_KEY: 'Title via key' })
      translate.use('en')

      fixture.componentRef.setInput('actions', [
        { id: 'a1', icon: 'pi pi-lock', ariaLabelKey: 'ARIA_KEY', show: 'always', actionCallback: () => undefined },
        { id: 'a2', icon: 'pi pi-lock', titleKey: 'TITLE_KEY', show: 'always', actionCallback: () => undefined },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('#a1 button').getAttribute('aria-label')).toBe('Aria via key')
      expect(fixture.nativeElement.querySelector('#a2 button').getAttribute('aria-label')).toBe('Title via key')
    })


    it('should render translated labelKey and titleKey in the overflow menu items', async () => {
      const translate = TestBed.inject(TranslateService)
      translate.setTranslation('en', { OVERFLOW_LABEL: 'Overflow label', OVERFLOW_TITLE: 'Overflow title' })
      translate.use('en')

      fixture.componentRef.setInput('actions', [
        {
          labelKey: 'OVERFLOW_LABEL',
          titleKey: 'OVERFLOW_TITLE',
          show: 'asOverflow',
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      const overflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
      await overflowButton?.click()
      const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
      expect(menuItems).toHaveLength(1)
      expect(await menuItems[0].getText()).toBe('Overflow label')
    })

    it('should render overflow actions without translation keys as-is', async () => {
      fixture.componentRef.setInput('actions', [
        {
          label: 'Plain label',
          title: 'Plain title',
          show: 'asOverflow',
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      const overflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
      await overflowButton?.click()
      const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
      expect(await menuItems[0].getText()).toBe('Plain label')
    })

    it('should name an icon-only overflow action from the ariaLabel/title fallback, matching the inline branch', async () => {
      fixture.componentRef.setInput('actions', [
        { id: 'o1', icon: 'pi pi-lock', ariaLabel: 'Overflow aria', title: 'Overflow title', show: 'asOverflow', actionCallback: () => undefined },
        { id: 'o2', icon: 'pi pi-lock', title: 'Only title', show: 'asOverflow', actionCallback: () => undefined },
        { id: 'o3', label: 'Visible label', icon: 'pi pi-lock', ariaLabel: 'Should not win', show: 'asOverflow', actionCallback: () => undefined },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      const overflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
      await overflowButton?.click()
      const menuItems = await pageHeaderHarness.getOverFlowMenuItems()
      expect(menuItems).toHaveLength(3)
      // ariaLabel wins over title for the first icon-only action
      expect(await menuItems[0].getText()).toBe('Overflow aria')
      // title is the last fallback for the second icon-only action
      expect(await menuItems[1].getText()).toBe('Only title')
      // a visible label always wins — the ariaLabel fallback must not override it
      expect(await menuItems[2].getText()).toBe('Visible label')
    })

    it('should render no actions for a user without any permissions', async () => {
      userServiceMock.permissionsTopic$.publish([])

      fixture.componentRef.setInput('actions', [
        {
          label: 'Action with permission',
          show: 'always',
          actionCallback: () => undefined,
          permission: 'TEST#TEST_PERMISSION',
        },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    })

    it('should name an icon-only inline action from a plain ariaLabel when no ariaLabelKey is set', async () => {
      fixture.componentRef.setInput('actions', [
        { id: 'a1', icon: 'pi pi-lock', ariaLabel: 'Plain aria', show: 'always', actionCallback: () => undefined },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('#a1 button').getAttribute('aria-label')).toBe('Plain aria')
    })

    it('should leave the aria-label unset for an icon-only action with no accessible name', async () => {
      fixture.componentRef.setInput('actions', [
        { id: 'a1', icon: 'pi pi-lock', show: 'always', actionCallback: () => undefined },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('#a1 button').getAttribute('aria-label')).toBeNull()
    })
  })

  describe('permission checker resolution', () => {
    // filterActionsBasedOnPermissions reads this.hasPermissionChecker lazily on each actions emission,
    // so it can be swapped on the existing component without reconfiguring the test module.
    const setChecker = (checker: unknown) => {
      ;(component as unknown as { hasPermissionChecker: unknown }).hasPermissionChecker = checker
    }

    it('should fall back to the user service for permissions when the checker has no getPermissions', async () => {
      setChecker({ permissions: of([]) }) // no getPermissions → falls back to userService
      // userService (configured in beforeEach) grants TEST#TEST_PERMISSION
      fixture.componentRef.setInput('actions', [
        { label: 'Allowed', show: 'always', actionCallback: () => undefined, permission: 'TEST#TEST_PERMISSION' },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    })

    it('should use the permission checker when it exposes getPermissions', async () => {
      // give the userService NO permission so the button can only appear via the checker
      userServiceMock.permissionsTopic$.publish([])
      setChecker({ getPermissions: () => of(['TEST#TEST_PERMISSION']) })

      fixture.componentRef.setInput('actions', [
        { label: 'Allowed', show: 'always', actionCallback: () => undefined, permission: 'TEST#TEST_PERMISSION' },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    })

    it('should fall back to the user service when no permission checker is provided', async () => {
      setChecker(null) // nullish checker → hasPermissionChecker?.getPermissions resolves to undefined
      fixture.componentRef.setInput('actions', [
        { label: 'Allowed', show: 'always', actionCallback: () => undefined, permission: 'TEST#TEST_PERMISSION' },
      ])
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(1)
    })
  })

  describe('breadcrumb aria labels', () => {
    it('should skip aria-current on the last breadcrumb link when its text is empty', () => {
      const breadcrumbService = TestBed.inject(BreadcrumbServiceMock)
      breadcrumbService.itemsHandler = of([
        { label: 'First', show: 'always', routerLink: '/first', permission: 'TEST#TEST_BREADCRUMB_PERMISSION' },
        { label: '', show: 'always', routerLink: '/empty', permission: 'TEST#TEST_BREADCRUMB_PERMISSION' },
      ])

      const newFixture = TestBed.createComponent(PageHeaderComponent)
      newFixture.componentRef.setInput('manualBreadcrumbs', true)
      newFixture.detectChanges()

      const links = newFixture.debugElement.queryAll(By.css('.p-breadcrumb-item-link'))
      expect(links.length).toBeGreaterThan(0)
      expect(links[links.length - 1].attributes['aria-current']).toBeUndefined()
    })

    it('should ignore breadcrumb links that are not elements or have no innerText (defensive null-guards)', () => {
      const setAttributeSpy = jest.fn()
      const renderer = { setAttribute: setAttributeSpy } as unknown as Renderer2
      ;(component as unknown as { renderer: Renderer2 }).renderer = renderer
      // A fabricated breadcrumb host exercising the `?.` null-guards in applyBreadcrumbAriaLabels.
      const host = {
        querySelectorAll: () => [null, { innerText: undefined }],
      } as unknown as HTMLElement
      component.breadcrumbElementRef = new ElementRef(host)

      // must not throw; no aria attributes set for non-text links
      expect(setAttributeSpy).not.toHaveBeenCalled()

      // a normal link still gets labelled
      const normalHost = { querySelectorAll: () => [{ innerText: 'A page' }] } as unknown as HTMLElement
      component.breadcrumbElementRef = new ElementRef(normalHost)
      expect(setAttributeSpy).toHaveBeenCalled()
    })
  })
})
