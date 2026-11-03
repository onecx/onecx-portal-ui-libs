import { inject, provideEnvironmentInitializer } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { provideStandaloneHtmlLang, STANDALONE_FALLBACK_LANGUAGE } from './standalone-html-lang.utils'

describe('provideStandaloneHtmlLang', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('lang')
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), provideTranslateTestingService({}), provideStandaloneHtmlLang()],
    })
  })

  it('should set html lang from the user language and update it on change', () => {
    const userService = TestBed.inject(UserService)
    userService.lang$.next('de')
    expect(document.documentElement.getAttribute('lang')).toBe('de')

    userService.lang$.next('fr')
    expect(document.documentElement.getAttribute('lang')).toBe('fr')
  })

  it('should set the fallback language when none is configured', () => {
    TestBed.inject(UserService)
    expect(TestBed.inject(TranslateService).getFallbackLang()).toBe(STANDALONE_FALLBACK_LANGUAGE)
  })

  it('should not override a fallback language configured by the app', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        provideTranslateTestingService({}),
        // runs before the standalone initializer, like an app-level configuration would
        provideEnvironmentInitializer(() => inject(TranslateService).setFallbackLang('de')),
        provideStandaloneHtmlLang(),
      ],
    })
    expect(TestBed.inject(TranslateService).getFallbackLang()).toBe('de')
  })

  it('should not write html lang when the provider is not used (shell mode)', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({ providers: [provideUserServiceMock(), provideTranslateTestingService({})] })
    TestBed.inject(UserService).lang$.next('de')
    expect(document.documentElement.hasAttribute('lang')).toBe(false)
  })
})
