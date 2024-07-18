import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { TranslationCacheService } from '../services/translation-cache.service'
import { CachingTranslateLoader } from './caching-translate-loader.utils'

describe('CachingTranslateLoader', () => {
  let http: HttpClient
  let translationCache: TranslationCacheService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    http = TestBed.inject(HttpClient)
    translationCache = TestBed.inject(TranslationCacheService)
    window['onecxTranslations'] = {}
  })

  it('should get translations', (done) => {
    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockReturnValue(of(translation))
    translateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual(translation)
      done()
    })
  })

  it('should load translations only once', (done) => {
    let httpCalls = 0
    const responses = []
    const translation = { testKey: 'my translation' }
    http.get = jest.fn().mockImplementation(() => {
      httpCalls++
      return of(translation)
    })

    const translateLoader = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
    const translateLoader2 = new CachingTranslateLoader(translationCache, http, `./assets/i18n/`, '.json')
    translateLoader2.getTranslation('en').subscribe((t) => {
      responses.push(t)
      expect(t).toEqual(translation)
      expect(httpCalls).toEqual(1)
      if (responses.length == 2) {
        done()
      }
    })
  })
})
