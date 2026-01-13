import { TestBed } from '@angular/core/testing'
import { TranslateLoader } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { OnecxTranslateLoader } from './onecx-translate-loader.utils'
import { TRANSLATION_PATH } from '../injection-tokens/translation-path'

jest.mock('./caching-translate-loader.utils', () => {
  class FakeCachingTranslateLoader {
    constructor(public path: string) {
      console.log('FakeCachingTranslateLoader created with path:', path)
    }
  }

  return {
    CachingTranslateLoader: jest.fn().mockImplementation((_service, _injector, path, _suffix) => {
      return new FakeCachingTranslateLoader(path)
    }),
  }
})

jest.mock('./translate.combined.loader', () => {
  class FakeTranslateCombinedLoader implements TranslateLoader {
    public lastLanguage: string | undefined
    public loaders: TranslateLoader[] = []
    constructor(
      private result: any,
      ...loaders: TranslateLoader[]
    ) {
      this.loaders = loaders
      console.log('FakeTranslateCombinedLoader created with loaders:', loaders)
    }

    getTranslation(lang: string): Observable<any> {
      this.lastLanguage = lang
      return of(this.result)
    }
  }

  return {
    TranslateCombinedLoader: jest.fn().mockImplementation((...loaders: TranslateLoader[]) => {
      return new FakeTranslateCombinedLoader({ hello: 'world' }, ...loaders)
    }),
  }
})

describe('OnecxTranslateLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OnecxTranslateLoader,
        {
          provide: TRANSLATION_PATH,
          useValue: ['assets/i18n/', of('assets/more-i18n/')],
        },
      ],
    })
  })

  describe('creation', () => {
    it('should be created', () => {
      const onecxTranslateLoader = TestBed.inject(OnecxTranslateLoader)
      expect(onecxTranslateLoader).toBeTruthy()
    })

    it('should create TranslateCombinedLoader with unique paths', (done) => {
      const onecxTranslateLoader = TestBed.inject(OnecxTranslateLoader)
      ;(onecxTranslateLoader as any).translateLoader$.subscribe((loader: any) => {
        expect(loader).toBeTruthy()
        expect(loader.loaders.length).toBe(2) // Ensure no duplicates
        expect(loader.loaders[0].path).toBe('assets/i18n/')
        expect(loader.loaders[1].path).toBe('assets/more-i18n/')
        done()
      })
    })
  })

  describe('getTranslation', () => {
    it('should get translations', (done) => {
      const onecxTranslateLoader = TestBed.inject(OnecxTranslateLoader)

      onecxTranslateLoader.getTranslation('en').subscribe({
        next: (t) => {
          expect(t).toEqual({ hello: 'world' })
          done()
        },
        error: done,
      })
    })

    it('should return empty object if no loader', (done) => {
      const onecxTranslateLoader = TestBed.inject(OnecxTranslateLoader)
      ;(onecxTranslateLoader as any).translateLoader$ = of(null)

      onecxTranslateLoader.getTranslation('en').subscribe({
        next: (t) => {
          expect(t).toEqual({})
          done()
        },
        error: done,
      })
    })
  })
})
