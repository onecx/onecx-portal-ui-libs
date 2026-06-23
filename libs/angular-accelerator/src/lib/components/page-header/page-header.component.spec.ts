import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import {
  AppStateServiceMock,
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { TooltipModule } from 'primeng/tooltip'
import { PageHeaderHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { TranslateService } from '@ngx-translate/core'
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
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
        BreadcrumbModule,
        MenuModule,
        ButtonModule,
        NoopAnimationsModule,
        TooltipModule,
        OcxTooltipDirective
      ],
      providers: [
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
    const menuLinks = Array.from(documentRoot.querySelectorAll('.p-menuitem-link')) as HTMLAnchorElement[]
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
    const disabledActionElement = overFlowMenuItems[1]

    expect(overFlowMenuItems).toBeTruthy()
    expect(overFlowMenuItems?.length).toBe(2)
    expect(disabledActionElement).toBeTruthy()
    expect(await (await disabledActionElement.host()).hasClass('p-disabled')).toBe(true)
    await (await disabledActionElement.host()).click()
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

  it('should show translationKeys over plain tooltip properties', async () => {
    const translate = TestBed.inject(TranslateService)

    translate.setTranslation(
      'en',
      {
        LABEL_KEY: 'From Key',
        VALUE_KEY: 'From Key',
        ACTION_KEY: 'From Key',
      },
      true
    )
    translate.use('en')

    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        labelTooltipKey: 'LABEL_KEY',
        labelTooltip: 'Plain Label',
        valueTooltipKey: 'VALUE_KEY',
        valueTooltip: 'Plain Value',
        actionItemTooltipKey: 'ACTION_KEY',
        actionItemTooltip: 'Plain Action',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    expect(await objectInfo.getLabelTooltipContent()).toBe('From Key')
    expect(await objectInfo.getValueTooltipContent()).toBe('From Key')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('From Key')
  })

  it('should fallback to plain tooltip properties when *Key properties are not provided', async () => {
    component.objectDetails = [
      {
        label: 'Venue',
        value: 'AIE Munich',
        labelTooltip: 'Plain Label Tooltip',
        valueTooltip: 'Plain Value Tooltip',
        actionItemTooltip: 'Plain Action Tooltip',
        actionItemIcon: 'pi pi-copy',
        actionItemCallback: () => {
          console.log('Action!')
        },
      },
    ]
    fixture.detectChanges()

    const objectInfo = (await pageHeaderHarness.getObjectInfos())[0]

    expect(await objectInfo.getLabelTooltipContent()).toBe('Plain Label Tooltip')
    expect(await objectInfo.getValueTooltipContent()).toBe('Plain Value Tooltip')
    expect(await objectInfo.getActionItemTooltipContent()).toBe('Plain Action Tooltip')
  })

  it('should fallback to empty string if input.key is missing in object', () => {
      expect(component.extractKeyAndParams({ parameters: { foo: 'bar' } })).toEqual({ key: '', params: { foo: 'bar' } });
  });

  it('should set null key and params  when extractKeyAndParams is called with missing key', () => {
      expect(component.extractKeyAndParams({parameters: undefined })).toEqual({ key: '', params: undefined });
  });

  it('should set empty key when extractKeyAndParams is called with missing key', () => {
      expect(component.extractKeyAndParams(1234)).toEqual({ key: '', params: undefined });
  });

  it('should emit save event when onAction("save") is called', () => {
    jest.spyOn(component.save, 'emit');
    component.onAction('save');
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('should not emit save event when onAction is called with other action', () => {
    jest.spyOn(component.save, 'emit');
    component.onAction('other');
    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should set figureImageLoadError to true when handleImageError is called', () => {
    component.figureImageLoadError = false;
    component.handleImageError();
    expect(component.figureImageLoadError).toBe(true);
  });
 

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
})
