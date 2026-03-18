import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TranslationConnectionService } from './translation-connection.service'
import { PrimeNG } from 'primeng/config'
import { Subject } from 'rxjs'

describe('ConnectionService', () => {
  let service: TranslationConnectionService
  let userService: UserService
  let translateService: TranslateService
  let configuration: PrimeNG
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), provideTranslateTestingService({})],
    })

    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })
    userService = TestBed.inject(UserService)
    translateService = TestBed.inject(TranslateService)
    configuration = TestBed.inject(PrimeNG)    
  })


  it('should create', fakeAsync(() => {    
    expect(service).toBeTruthy();
    expect(translateService.getCurrentLang()).toBe('en');

    userService.lang$.next('de');
    tick(100);
    expect(translateService.getCurrentLang()).toBe('de');
  }));

  it('should react to onTranslationChange', fakeAsync(() => {
    const translationChangeSubject = new Subject<{ lang: string; translations: any }>()
    Object.defineProperty(translateService, 'onTranslationChange', {
      get: () => translationChangeSubject.asObservable(),
    })

    const spy = jest.fn();
    translateService.onTranslationChange.subscribe(spy);

    translationChangeSubject.next({ lang: 'de', translations: {} });
    tick(0);
    expect(spy).toHaveBeenCalledWith({ lang: 'de', translations: {} });
  }))

  it('should react to onLangChange', fakeAsync(() => {
    expect(translateService.getCurrentLang()).toBe('en')

    const langChangeSubject = new Subject<{ lang: string; translations: any }>();
    Object.defineProperty(translateService, 'onLangChange', {
      get: () => langChangeSubject.asObservable(),
    })

    const spy = jest.fn();
    translateService.onLangChange.subscribe(spy)

    langChangeSubject.next({ lang: 'de', translations: {} })
    tick(0);
    expect(spy).toHaveBeenCalledWith({ lang: 'de', translations: {} })
  }))

  it('should react to onFallbackLangChange', fakeAsync(() => {
    expect(translateService.getCurrentLang()).toBe('en')

    const fallbackLangChangeSubject = new Subject<{ lang: string; translations: any }>()
    Object.defineProperty(translateService, 'onFallbackLangChange', {
      get: () => fallbackLangChangeSubject.asObservable(),
    })

    const spy = jest.fn();
    translateService.onFallbackLangChange.subscribe(spy);
    fallbackLangChangeSubject.next({ lang: 'de', translations: {} })
    tick(0);
    expect(spy).toHaveBeenCalledWith({ lang: 'de', translations: {} })
  }))
})
