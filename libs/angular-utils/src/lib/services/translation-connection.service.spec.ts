import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { FallbackLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TranslationConnectionService } from './translation-connection.service'
import { of, Subject } from 'rxjs'
import { PrimeNG } from 'primeng/config'
import { mock } from 'node:test'

const mockTranslationChangeEvent: TranslationChangeEvent = {
  translations: {},
  lang: 'en'
}

const mockLangChangeEvent: LangChangeEvent = {
  lang: 'en',
  translations: {}
}

const mockFallbackLangChangeEvent: FallbackLangChangeEvent = {
  lang: 'en',
  translations: {}
}

const mockGetTranslation = { accept: 'Accept' };

describe('TranslationConnectionService', () => {
  let service: TranslationConnectionService
  let userService: UserService
  let translateService: TranslateService
  let configuration: PrimeNG

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        provideTranslateTestingService({}),
        TranslationConnectionService,
        PrimeNG
      ],
    })

    userService = TestBed.inject(UserService)
    translateService = TestBed.inject(TranslateService)
    configuration = TestBed.inject(PrimeNG)
  })


  it('should create', fakeAsync(() => {
    service = TestBed.inject(TranslationConnectionService)
    
    expect(service).toBeTruthy()
    expect(translateService.getCurrentLang()).toBe('en')

    userService.lang$.next('de')
    tick(100);
    expect(translateService.getCurrentLang()).toBe('de')
  }))

  it('should set primeng configuration on translation events', fakeAsync(() => {
    const translationChangeSubject = new Subject<TranslationChangeEvent>()
    const langChangeSubject = new Subject<LangChangeEvent>()
    const fallbackLangChangeSubject = new Subject<FallbackLangChangeEvent>()

    jest.spyOn(translateService, 'onTranslationChange', 'get').mockReturnValue(translationChangeSubject.asObservable())
    jest.spyOn(translateService, 'onLangChange', 'get').mockReturnValue(langChangeSubject.asObservable())
    jest.spyOn(translateService, 'onFallbackLangChange', 'get').mockReturnValue(fallbackLangChangeSubject.asObservable())
    jest.spyOn(translateService, 'get').mockReturnValue(of(mockGetTranslation))
    const setTranslationSpy = jest.spyOn(configuration, 'setTranslation')

    service = TestBed.inject(TranslationConnectionService)

    translationChangeSubject.next(mockTranslationChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)

    langChangeSubject.next(mockLangChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)
    fallbackLangChangeSubject.next(mockFallbackLangChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)
    expect(setTranslationSpy).toHaveBeenCalledTimes(3)
  })
  )
})
