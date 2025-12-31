import { TestBed } from '@angular/core/testing'
import { TranslateLoader } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { OnecxTranslateLoader } from './onecx-translate-loader.utils'
import { TranslationCacheService } from '../services/translation-cache.service'
import { TRANSLATION_PATH } from './create-translate-loader.utils'

describe('OnecxTranslateLoader', () => {
  class FakeTranslateLoader implements TranslateLoader {
    public lastLanguage: string | undefined
    constructor(private result: any) {}

    getTranslation(lang: string): Observable<any> {
      this.lastLanguage = lang
      return of(this.result)
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OnecxTranslateLoader,
        {
          provide: TranslationCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        {
          provide: TRANSLATION_PATH,
          useValue: []
        }
      ]
    })
  })

  it('should get translations', (done) => {
    const translations = 'my translations'
    const translateLoader = new FakeTranslateLoader(translations)

    expect(translateLoader.lastLanguage).toBeUndefined()

    const asyncTranslateLoader = TestBed.inject(OnecxTranslateLoader)
    asyncTranslateLoader.getTranslation('en').subscribe((t) => {
      expect(t).toEqual({})
      done()
    })
  })
})
