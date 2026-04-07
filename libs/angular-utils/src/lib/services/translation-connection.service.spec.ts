import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { EventEmitter } from '@angular/core'
import { TranslationConnectionService } from './translation-connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { of } from 'rxjs'
import { PrimeNG } from 'primeng/config'

const mockTranslationChangeEvent: TranslationChangeEvent = {
  translations: {},
  lang: 'en'
}

const mockLangChangeEvent: LangChangeEvent = {
  lang: 'en',
  translations: {}
}

const mockDefaultLangChangeEvent: DefaultLangChangeEvent = {
  lang: 'en',
  translations: {}
}

const mockGetTranslation = { accept: 'Accept' }

describe('ConnectionService', () => {
  let service: TranslationConnectionService
  let translateService: TranslateService
  let configuration: PrimeNG
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [provideUserServiceMock(), TranslationConnectionService],
    })
    translateService = TestBed.inject(TranslateService)
    configuration = TestBed.inject(PrimeNG)
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })

    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))

  it('should set primeng configuration on translation events', fakeAsync(() => {
    const translationChangeSubject = new EventEmitter<TranslationChangeEvent>()
    const langChangeSubject = new EventEmitter<LangChangeEvent>()
    const defaultLangChangeEvent = new EventEmitter<DefaultLangChangeEvent>()

    jest.spyOn(translateService, 'onTranslationChange', 'get').mockReturnValue(translationChangeSubject)
    jest.spyOn(translateService, 'onLangChange', 'get').mockReturnValue(langChangeSubject)
    jest.spyOn(translateService, 'onDefaultLangChange', 'get').mockReturnValue(defaultLangChangeEvent)
    jest.spyOn(translateService, 'get').mockReturnValue(of(mockGetTranslation))
    const setTranslationSpy = jest.spyOn(configuration, 'setTranslation')

    service = TestBed.inject(TranslationConnectionService)

    translationChangeSubject.next(mockTranslationChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)

    langChangeSubject.next(mockLangChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)
    defaultLangChangeEvent.next(mockDefaultLangChangeEvent)
    tick()
    expect(configuration.setTranslation).toHaveBeenCalledWith(mockGetTranslation)
    expect(setTranslationSpy).toHaveBeenCalledTimes(3)
  }))
})
