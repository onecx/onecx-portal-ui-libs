import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { SlotHarness } from '../../../../testing/slot.harness'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import {
  AppStateServiceMock,
  ConfigurationServiceMock,
  provideAppStateServiceMock,
  provideConfigurationServiceMock,
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
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { PageHeaderHarness, SearchHeaderHarness } from '@onecx/angular-accelerator/testing'

describe('SearchHeaderComponent', () => {
  let mockAppStateService: AppStateServiceMock
  let component: SearchHeaderComponent
  let fixture: ComponentFixture<SearchHeaderComponent>
  let loader: HarnessLoader
  let liveAnnouncer: LiveAnnouncer
  let configurationService: ConfigurationServiceMock

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
        provideTranslateTestingService({ en: require('../../../../assets/i18n/en.json') }),
        provideConfigurationServiceMock(),
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

    configurationService = TestBed.inject(ConfigurationService) as any as ConfigurationServiceMock
    await configurationService.setProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED, 'false')

    fixture = TestBed.createComponent(SearchHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    liveAnnouncer = TestBed.inject(LiveAnnouncer)
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('search config', () => {
    it('should not display search config slot if search config change is not observed', async () => {
      const slot = await loader.getHarnessOrNull(SlotHarness)
      expect(slot).toBeFalsy()
    })

    it('should display search config slot if search config change is observed, pageName is defined and permission is met', async () => {
      const userServiceMock = TestBed.inject(UserServiceMock)
      userServiceMock.permissionsTopic$.publish(['PRODUCT#USE_SEARCHCONFIGS'])
      const sub = component.selectedSearchConfigChanged.subscribe(() => undefined)
      fixture.componentRef.setInput('pageName', 'myPageName')
      fixture.componentRef.setInput('searchConfigPermission', 'PRODUCT#USE_SEARCHCONFIGS')

      fixture.detectChanges()
      await fixture.whenStable()

      const slot = await loader.getHarness(SlotHarness)
      expect(slot).toBeTruthy()

      sub.unsubscribe()
    })
  })

  describe('search and reset button order', () => {
    it('should render reset then search when searchButtonsReversed is false and reset observed', () => {
      const sub = component.resetted.subscribe()
      configurationService.setProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED, 'false')
      fixture.detectChanges()

      const controls = fixture.nativeElement.querySelector('section[aria-label="Search controls"]') as HTMLElement
      const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)

      expect(order).toEqual(['resetButton', 'searchButton'])

      sub.unsubscribe()
    })

    it('should render search then reset when searchButtonsReversed is true and reset observed', async () => {
      const sub = component.resetted.subscribe()
      // Set directly since configuration service property is read only during initialization
      component.searchButtonsReversed$ = of(true)
      fixture.detectChanges()

      const controls = fixture.nativeElement.querySelector('section[aria-label="Search controls"]') as HTMLElement
      const order = Array.from(controls.querySelectorAll('#resetButton, #searchButton')).map((el: any) => el.id)

      expect(order).toEqual(['searchButton', 'resetButton'])

      sub.unsubscribe()
    })

    it('should render no controls until searchButtonsReversed is resolved', () => {
      component.searchButtonsReversed$ = of(null)
      fixture.detectChanges()

      const controls = fixture.nativeElement.querySelector('section[aria-label="Search controls"]') as HTMLElement
      const buttons = Array.from(controls.querySelectorAll('#resetButton, #searchButton'))

      expect(buttons.length).toBe(0)
    })
  })

  describe('live announcements', () => {
    it('should announce loading when loading is true', async () => {
      const spy = jest.spyOn(liveAnnouncer, 'announce')
      fixture.componentRef.setInput('loading', true)

      fixture.detectChanges()
      await fixture.whenStable()

      expect(spy).toHaveBeenCalledWith('Searching...', 'polite')
    })

    it('should announce no results when loading is false and searchResultsCount is 0', async () => {
      const spy = jest.spyOn(liveAnnouncer, 'announce')
      fixture.componentRef.setInput('loading', false)
      fixture.componentRef.setInput('searchResultsCount', 0)

      fixture.detectChanges()
      await fixture.whenStable()

      expect(spy).toHaveBeenCalledWith('No results found', 'polite')
    })

    it('should announce results found when loading is false and searchResultsCount is 5', async () => {
      const spy = jest.spyOn(liveAnnouncer, 'announce')
      fixture.componentRef.setInput('loading', false)
      fixture.componentRef.setInput('searchResultsCount', 5)

      fixture.detectChanges()
      await fixture.whenStable()

      expect(spy).toHaveBeenCalledWith('5 results found', 'polite')
    })
  })

  describe('view mode toggle', () => {
    it('should update action button when switching view mode', async () => {
      const componentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')
      // There is an advanced field
      component.hasAdvanced.set(true)
      fixture.detectChanges()

      const pageHeader = await loader.getHarness(PageHeaderHarness)
      const buttons = await pageHeader.getInlineActionButtons()
      expect(buttons.length).toBe(1)
      const advancedButton = buttons[0]
      expect(component.viewMode()).toBe('basic')
      expect(await advancedButton.getLabel()).toBe('Advanced')

      await advancedButton.click()
      fixture.detectChanges()

      const buttons2 = await pageHeader.getInlineActionButtons()
      expect(buttons2.length).toBe(1)
      const advancedButton2 = buttons2[0]
      expect(component.viewMode()).toBe('advanced')
      expect(await advancedButton2.getLabel()).toBe('Simple')
      expect(componentStateChangedSpy).toHaveBeenCalledWith({
        activeViewMode: 'advanced',
      })

      // There is no advanced field
      component.hasAdvanced.set(false)
      fixture.detectChanges()

      const buttons3 = await pageHeader.getInlineActionButtons()
      expect(buttons3.length).toBe(0)
    })
  })

  describe('search button', () => {
    beforeEach(() => {
      configurationService.setProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED, 'false')
      fixture.detectChanges()
    })
    it('should emit searched event when search button is clicked', async () => {
      const searchedSpy = jest.spyOn(component.searched, 'emit')
      const searchHeader = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchHeaderHarness)
      await searchHeader.clickSearchButton()
      expect(searchedSpy).toHaveBeenCalled()
    })
  })

  describe('reset button', () => {
    beforeEach(() => {
      configurationService.setProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED, 'false')
      fixture.detectChanges()
    })
    it('should emit resetted event when reset button is clicked', async () => {
      const sub = component.resetted.subscribe()
      const resettedSpy = jest.spyOn(component.resetted, 'emit')
      const searchHeader = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchHeaderHarness)
      await searchHeader.clickResetButton()
      expect(resettedSpy).toHaveBeenCalled()

      sub.unsubscribe()
    })
  })
})
