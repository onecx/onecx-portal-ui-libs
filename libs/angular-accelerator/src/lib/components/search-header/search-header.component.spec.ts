import userEvent from '@testing-library/user-event'
import { Component } from '@angular/core'
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
import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb'
import { ButtonModule } from '@openng/optimus-ui/button'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchHeaderComponent } from './search-header.component'
import { of } from 'rxjs'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { ResultsAnnouncementService } from '../../services/results-announcement.service'
import { PageHeaderHarness, SearchHeaderHarness } from '@onecx/angular-accelerator/testing'

@Component({
  standalone: false,
  template: `
    <ocx-search-header (searched)="searched()" (resetted)="resetted()">
      <input id="text" type="text" />
      <textarea id="area"></textarea>
      <input id="combo" type="text" role="combobox" aria-expanded="true" aria-controls="comboList" />
      <ul role="listbox"><li role="option" aria-selected="false"><input id="multi" type="text" /></li></ul>
      <input id="closedCombo" type="text" role="combobox" aria-expanded="false" aria-controls="comboList" />
    </ocx-search-header>
  `,
})
class SearchHeaderHostComponent {
  searched = jest.fn()
  resetted = jest.fn()
}

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
    let spy: jest.SpyInstance
    let resultsAnnouncement: ResultsAnnouncementService

    beforeEach(() => {
      spy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()
      resultsAnnouncement = TestBed.inject(ResultsAnnouncementService)
    })

    async function render() {
      fixture.detectChanges()
      await fixture.whenStable()
    }

    it('should announce nothing at page load', async () => {
      const newFixture = TestBed.createComponent(SearchHeaderComponent)
      newFixture.componentRef.setInput('loading', false)
      newFixture.componentRef.setInput('searchResultsCount', 5)
      newFixture.detectChanges()
      await newFixture.whenStable()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not announce loading or result changes without a search', async () => {
      fixture.componentRef.setInput('loading', true)
      await render()
      fixture.componentRef.setInput('loading', false)
      fixture.componentRef.setInput('searchResultsCount', 3)
      await render()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should announce exactly one message with the count after a search with loading', async () => {
      fixture.componentRef.setInput('searchResultsCount', 0)
      await render()

      component.onSearchClicked()
      fixture.componentRef.setInput('loading', true)
      await render()
      fixture.componentRef.setInput('searchResultsCount', 5)
      fixture.componentRef.setInput('loading', false)
      await render()
      fixture.componentRef.setInput('searchResultsCount', 7)
      await render()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('5 results found', 'polite')
    })

    it('should announce no results once when a search returns no results', async () => {
      fixture.componentRef.setInput('searchResultsCount', 5)
      await render()

      component.onSearchClicked()
      fixture.componentRef.setInput('searchResultsCount', 0)
      await render()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('No results found', 'polite')
    })

    it('should announce once per search', async () => {
      fixture.componentRef.setInput('searchResultsCount', 0)
      await render()

      component.onSearchClicked()
      fixture.componentRef.setInput('searchResultsCount', 2)
      await render()
      component.onSearchClicked()
      fixture.componentRef.setInput('searchResultsCount', 4)
      await render()

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenNthCalledWith(1, '2 results found', 'polite')
      expect(spy).toHaveBeenNthCalledWith(2, '4 results found', 'polite')
    })

    it('should ask the data component to announce when it has no result count', async () => {
      component.onSearchClicked()
      fixture.componentRef.setInput('searchResultsCount', 4)
      await render()

      expect(spy).not.toHaveBeenCalled()
      expect(resultsAnnouncement.consumeSearchResultsAnnouncementRequest()).toBe(true)
    })

    it('should not ask the data component to announce when it has a result count', async () => {
      fixture.componentRef.setInput('searchResultsCount', 0)
      await render()

      component.onSearchClicked()

      expect(resultsAnnouncement.consumeSearchResultsAnnouncementRequest()).toBe(false)
    })

    it('should register as search header while it exists', () => {
      expect(resultsAnnouncement.searchHeaderPresent()).toBe(true)

      fixture.destroy()

      expect(resultsAnnouncement.searchHeaderPresent()).toBe(false)
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

  describe('keyboard activation', () => {
    let hostFixture: ComponentFixture<SearchHeaderHostComponent>
    let host: SearchHeaderHostComponent
    let user: ReturnType<typeof userEvent.setup>

    const el = (selector: string) => hostFixture.nativeElement.querySelector(selector) as HTMLElement

    beforeEach(async () => {
      TestBed.resetTestingModule()
      await TestBed.configureTestingModule({
        declarations: [SearchHeaderComponent, SearchHeaderHostComponent, PageHeaderComponent, IfPermissionDirective],
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
      const config = TestBed.inject(ConfigurationService) as any as ConfigurationServiceMock
      await config.setProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED, 'false')
      hostFixture = TestBed.createComponent(SearchHeaderHostComponent)
      host = hostFixture.componentInstance
      hostFixture.detectChanges()
      await hostFixture.whenStable()
      hostFixture.detectChanges()
      user = userEvent.setup()
    })

    it.each([
      ['Enter', '{Enter}'],
      ['Space', ' '],
    ])('should search exactly once on %s on the search button', async (_name, keys) => {
      el('#searchButton button').focus()
      await user.keyboard(keys)
      expect(host.searched).toHaveBeenCalledTimes(1)
    })

    it.each([
      ['Enter', '{Enter}'],
      ['Space', ' '],
    ])('should reset exactly once on %s on the reset button', async (_name, keys) => {
      el('#resetButton button').focus()
      await user.keyboard(keys)
      expect(host.resetted).toHaveBeenCalledTimes(1)
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should search exactly once on Enter in a text input', async () => {
      el('#text').focus()
      await user.keyboard('{Enter}')
      expect(host.searched).toHaveBeenCalledTimes(1)
    })

    it('should search exactly once on NumpadEnter in a text input', () => {
      // the NumpadEnter key reports key "Enter" with code "NumpadEnter"
      el('#text').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'NumpadEnter', bubbles: true }))
      expect(host.searched).toHaveBeenCalledTimes(1)
    })

    it('should search for an input that is added after initialization', async () => {
      const added = document.createElement('input')
      el('section[aria-label="Search Criteria"]').appendChild(added)
      added.focus()
      await user.keyboard('{Enter}')
      expect(host.searched).toHaveBeenCalledTimes(1)
    })

    it('should not search on Enter in a textarea', async () => {
      el('#area').focus()
      await user.keyboard('{Enter}')
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should not search on Enter in a combobox with an open popup', async () => {
      el('#combo').focus()
      await user.keyboard('{Enter}')
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should not search on Enter already handled (default prevented) by a widget', async () => {
      const closed = el('#closedCombo')
      closed.addEventListener('keydown', (e) => e.preventDefault())
      closed.focus()
      await user.keyboard('{Enter}')
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should not search on Enter in an input inside a listbox', async () => {
      el('#multi').focus()
      await user.keyboard('{Enter}')
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should not search on Enter during IME composition', () => {
      el('#text').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }))
      expect(host.searched).not.toHaveBeenCalled()
    })

    it('should search on Enter in a closed combobox', async () => {
      el('#closedCombo').focus()
      await user.keyboard('{Enter}')
      expect(host.searched).toHaveBeenCalledTimes(1)
    })
  })
})
