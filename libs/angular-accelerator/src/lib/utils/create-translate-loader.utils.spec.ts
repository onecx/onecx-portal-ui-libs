import { HttpClient } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { EnvironmentInjector } from '@angular/core'
import { MockService } from 'ng-mocks'
import { Observable, of } from 'rxjs'
import { MfeInfo } from '@onecx/integration-interface'
import { AppStateService } from '@onecx/angular-integration-interface'
import { createTranslateLoader } from './create-translate-loader.utils'
import { TranslationCacheService } from '../services/translation-cache.service'

describe('CreateTranslateLoader', () => {
  const httpClientMock = MockService(HttpClient)
  httpClientMock.get = jest.fn(() => of({}, {}, {})) as any
  let currentMfe$: Observable<Partial<MfeInfo>>
  let globalLoading$: Observable<boolean>
  let environmentInjector: EnvironmentInjector
  let translationCacheService: TranslationCacheService

  const appStateServiceMock = {
    currentMfe$: { asObservable: () => currentMfe$ },
    globalLoading$: { asObservable: () => globalLoading$ },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents()
    environmentInjector = TestBed.inject(EnvironmentInjector)
    translationCacheService = TestBed.inject(TranslationCacheService)
    window['onecxTranslations'] = {}
    jest.clearAllMocks()
  })

  describe('without TranslationCache parameter', () => {
    it('should call httpClient get 4 times if a remoteBaseUrl is set and if global loading is finished', (done) => {
      currentMfe$ = of({ remoteBaseUrl: 'remoteUrl' })
      globalLoading$ = of(false)
      const translateLoader = environmentInjector.runInContext(() =>
        createTranslateLoader(httpClientMock, <AppStateService>(<unknown>appStateServiceMock))
      )

      translateLoader.getTranslation('en').subscribe(() => {
        expect(httpClientMock.get).toHaveBeenCalledTimes(4)
        done()
      })
    })

    it('should not call httpClient get if global loading is not finished', (done) => {
      currentMfe$ = of({})
      globalLoading$ = of(true)
      const translateLoader = environmentInjector.runInContext(() =>
        createTranslateLoader(httpClientMock, <AppStateService>(<unknown>appStateServiceMock))
      )

      translateLoader.getTranslation('en').subscribe(() => {
        expect(httpClientMock.get).toHaveBeenCalledTimes(0)
        done()
      })
    })
  })

  describe('with TranslationCache parameter', () => {
    it('should call httpClient get 4 times if a remoteBaseUrl is set and if global loading is finished', (done) => {
      currentMfe$ = of({ remoteBaseUrl: 'remoteUrl' })
      globalLoading$ = of(false)
      const translateLoader = createTranslateLoader(
        httpClientMock,
        <AppStateService>(<unknown>appStateServiceMock),
        translationCacheService
      )

      translateLoader.getTranslation('en').subscribe(() => {
        expect(httpClientMock.get).toHaveBeenCalledTimes(4)
        done()
      })
    })

    it('should not call httpClient get if global loading is not finished', (done) => {
      currentMfe$ = of({})
      globalLoading$ = of(true)
      const translateLoader = createTranslateLoader(
        httpClientMock,
        <AppStateService>(<unknown>appStateServiceMock),
        translationCacheService
      )

      translateLoader.getTranslation('en').subscribe(() => {
        expect(httpClientMock.get).toHaveBeenCalledTimes(0)
        done()
      })
    })
  })
})
