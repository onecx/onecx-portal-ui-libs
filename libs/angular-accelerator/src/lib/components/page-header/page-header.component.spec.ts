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
import { PButtonHarness } from '@onecx/angular-testing'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { firstValueFrom } from 'rxjs'

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent, PageHeaderComponent, DynamicPipe],
      imports: [
        RouterTestingModule,
        BreadcrumbModule,
        MenuModule,
        ButtonModule,
        NoopAnimationsModule,
        TooltipModule,
        AngularAcceleratorModule,
        OcxTooltipDirective
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
    expect(await pageHeaderHarness.getInlineActionButtonByLabel('My Test Action')).toBeFalsy()
    expect(await pageHeaderHarness.getOverFlowMenuItems()).toHaveLength(0)
    expect(await pageHeaderHarness.getElementByAriaLabel('More actions')).toBeFalsy()
  })

  it('should react to permission changes', async () => {
    expect(await pageHeaderHarness.getInlineActionButtons()).toHaveLength(0)
    expect(await pageHeaderHarness.getOverflowActionMenuButton()).toBeNull()

    component.actions = mockActions

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
    expect(await (await (inlineButtons[0] as PButtonHarness).getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await (inlineButtons[1] as PButtonHarness).getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
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
    expect(await (await (inlineButtons[0] as PButtonHarness).getIconSpan())?.checkHasClass('p-button-icon-left')).toBeTruthy()
    expect(await (await (inlineButtons[1] as PButtonHarness).getIconSpan())?.checkHasClass('p-button-icon-right')).toBeTruthy()
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

  it('should render inline routerLink action as anchor with href', async () => {
    component.actions = [
      {
        id: 'inline-router-link',
        label: 'Inline Link',
        icon: PrimeIcons.EXTERNAL_LINK,
        show: 'always',
        permission: 'TEST#TEST_PERMISSION',
        routerLink: '/details',
      },
    ]

    fixture.detectChanges()
    await fixture.whenStable()

    const link = fixture.nativeElement.querySelector('#inline-router-link') as HTMLAnchorElement | null
    expect(link).toBeTruthy()
    expect(link?.tagName).toBe('A')
    expect(link?.getAttribute('href')).toContain('/details')
  })

  it('should create inline routerLink action with provided action configuration', async () => {
    component.actions = [
      {
        id: 'inline-router-link-harness',
        label: 'Inline Link Harness',
        show: 'always',
        permission: 'TEST#TEST_PERMISSION',
        routerLink: '/details',
      },
    ]

    fixture.detectChanges()
    await fixture.whenStable()

    const inlineButtons = await pageHeaderHarness.getInlineActionButtons()

    expect(inlineButtons.length).toBe(1)
  })

  it('should render overflow routerLink action as menu link with href', async () => {
    component.actions = [
      {
        id: 'overflow-router-link',
        label: 'Overflow Link',
        show: 'asOverflow',
        permission: 'TEST#TEST_PERMISSION',
        routerLink: '/details',
      },
    ]

    fixture.detectChanges()
    await fixture.whenStable()

    const menuOverflowButton = await pageHeaderHarness.getOverflowActionMenuButton()
    expect(menuOverflowButton).toBeTruthy()
    await menuOverflowButton?.click()
    await fixture.whenStable()

    const documentRoot = fixture.nativeElement.ownerDocument as Document
    const menuLinks = Array.from(documentRoot.querySelectorAll('.p-menu-item-link')) as HTMLAnchorElement[]
    const overflowLink = menuLinks.find((item) => item.textContent?.includes('Overflow Link'))
    expect(overflowLink).toBeTruthy()
    expect(overflowLink?.getAttribute('href')).toContain('/details')
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

  describe('helper branch coverage', () => {
    it('should return empty translations when no labelKey/titleKey exist', async () => {
      const result = await firstValueFrom((component as any).getActionTranslationKeys([{ show: 'always' }]))

      expect(result).toEqual({})
    })

    it('should fall back to the user service permissions when no permission checker is provided', async () => {
      ;(component as any).hasPermissionChecker = undefined
      userServiceMock.permissionsTopic$.publish(['TEST#TEST_PERMISSION'])

      const filteredActions = (await firstValueFrom(
        (component as any).filterActionsBasedOnPermissions([
          { show: 'always', permission: 'TEST#TEST_PERMISSION' },
          { show: 'always', permission: 'OTHER#PERMISSION' },
        ])
      )) as Action[]

      expect(filteredActions).toHaveLength(1)
      expect(filteredActions[0].permission).toBe('TEST#TEST_PERMISSION')
    })

    it('should map overflow label fallback to title, id and Action', () => {
      const titleFallback = (component as any).mapOverflowActionsToMenuItems(
        [{ show: 'asOverflow', title: 'Title Fallback' }],
        {}
      )
      const idFallback = (component as any).mapOverflowActionsToMenuItems([{ show: 'asOverflow', id: 'id-fallback' }], {})
      const defaultFallback = (component as any).mapOverflowActionsToMenuItems([{ show: 'asOverflow' }], {})

      expect(titleFallback[0].label).toBe('Title Fallback')
      expect(idFallback[0].label).toBe('id-fallback')
      expect(defaultFallback[0].label).toBe('Action')
    })

    it('should prefer translated labelKey for overflow menu labels when provided', () => {
      const items = (component as any).mapOverflowActionsToMenuItems(
        [{ show: 'asOverflow', labelKey: 'LABEL_KEY' }],
        { LABEL_KEY: 'Translated Label' }
      )

      expect(items[0].label).toBe('Translated Label')
    })

    it('should map tooltip from titleKey translation when provided', () => {
      const items = (component as any).mapOverflowActionsToMenuItems(
        [{ show: 'asOverflow', titleKey: 'TITLE_KEY' }],
        { TITLE_KEY: 'Translated Title' }
      )

      expect(items[0].tooltipOptions?.tooltipLabel).toBe('Translated Title')
    })

    it('should map command only when routerLink is missing', () => {
      const callback = jest.fn()
      const withoutRouter = (component as any).mapOverflowActionsToMenuItems(
        [{ show: 'asOverflow', actionCallback: callback }],
        {}
      )
      const withRouter = (component as any).mapOverflowActionsToMenuItems(
        [{ show: 'asOverflow', routerLink: '/details', actionCallback: callback }],
        {}
      )

      expect(withoutRouter[0].command).toBe(callback)
      expect(withRouter[0].command).toBeUndefined()
    })
  })

  describe('accessible names', () => {
    const cb = () => undefined
    let warnSpy: jest.SpyInstance

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    })
    afterEach(() => warnSpy.mockRestore())

    async function actionButtonName(details: Partial<ObjectDetailItem>): Promise<string | null | undefined> {
      component.objectDetails = [
        { label: 'Venue', value: 'AIE', actionItemIcon: 'pi pi-copy', actionItemCallback: cb, ...details },
      ]
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
      component.actions = [
        { id: 'a1', label: 'Save', title: 'Persist', ariaLabel: 'Store it', show: 'always', actionCallback: cb },
      ]
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()
      const btn: HTMLElement = fixture.nativeElement.querySelector('#a1 button, button#a1')
      expect(btn.getAttribute('aria-label')).toBeNull()
      expect(btn.textContent).toContain('Save')
    })

    it('should name icon-only inline actions by ariaLabel, then title', async () => {
      component.actions = [
        { id: 'a1', icon: 'pi pi-lock', title: 'Title', ariaLabel: 'Aria', show: 'always', actionCallback: cb },
        { id: 'a2', icon: 'pi pi-lock', title: 'Title only', show: 'always', actionCallback: cb },
      ]
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('#a1 button, button#a1').getAttribute('aria-label')).toBe('Aria')
      expect(fixture.nativeElement.querySelector('#a2 button, button#a2').getAttribute('aria-label')).toBe('Title only')
    })

    it('should render the figure image as decorative and the subheader as plain content', async () => {
      component.figureImage = 'assets/x.png'
      component.subheader = 'Sub'
      fixture.detectChanges()
      const img = fixture.nativeElement.querySelector('.figure img')
      expect(img?.getAttribute('alt')).toBe('')
      const sub = fixture.nativeElement.querySelector('#page-subheader')
      expect(sub.getAttribute('role')).toBeNull()
      expect(sub.getAttribute('aria-label')).toBeNull()
    })

    it('should give icon-only object details a text alternative', async () => {
      component.objectDetails = [
        { label: 'Status', icon: 'pi pi-check', valueTooltipKey: 'STATUS_OK' },
      ]
      TestBed.inject(TranslateService).setTranslation('en', { STATUS_OK: 'Confirmed' })
      TestBed.inject(TranslateService).use('en')
      fixture.detectChanges()
      expect(fixture.nativeElement.querySelector('[name="object-detail-value"] .sr-only').textContent).toBe('Confirmed')
    })
  })
})
