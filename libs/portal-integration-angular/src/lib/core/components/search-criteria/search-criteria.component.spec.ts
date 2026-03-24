import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { InputSwitchModule } from 'primeng/inputswitch'
import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { SearchCriteriaComponent } from './search-criteria.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('SearchCriteriaComponent', () => {
  let component: SearchCriteriaComponent
  let fixture: ComponentFixture<SearchCriteriaComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchCriteriaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [InputSwitchModule, RouterTestingModule, MockAuthModule, TranslateTestingModule.withTranslations({})],
      providers: [
        ConfigurationService,
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchCriteriaComponent)
    component = fixture.componentInstance

    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeDefined()
  })

  it('should emit search event after click on search button', () => {
    const searchEmitterSpy = jest.spyOn(component.search, 'emit')
    fixture.debugElement.nativeElement.querySelector('#ocx-search-button').click()
    expect(searchEmitterSpy).toHaveBeenCalledTimes(1)
  })
  it('reset button should be null when simple criteria enabled', () => {
    // component.advancedSearchActive = false
    component.disableAdvancedToggle = true
    fixture.detectChanges()
    expect(fixture.debugElement.nativeElement.querySelector('#ocx-reset-button')).toBeNull()
  })
  it('should emit reset event after click on reset button when advanced criteria enabled', () => {
    const resetEmitterSpy = jest.spyOn(component.reset, 'emit')

    // component.advancedSearchActive = true
    component.disableAdvancedToggle = false
    fixture.detectChanges()

    component.actions?.filter((a) => (a.label = 'Advanced'))?.[0].actionCallback()
    fixture.detectChanges()

    fixture.debugElement.nativeElement.querySelector('#ocx-reset-button').click()
    expect(resetEmitterSpy).toHaveBeenCalledTimes(1)
  })
})
