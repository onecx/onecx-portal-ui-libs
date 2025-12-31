import { TestBed } from '@angular/core/testing'
import { MockService } from 'ng-mocks'
import { createTranslateLoader, TRANSLATION_PATH } from './create-translate-loader.utils'
import { Injector, runInInjectionContext } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

describe('CreateTranslateLoader', () => {
  const httpClientMock = MockService(HttpClient)
  httpClientMock.get = jest.fn(() => of({}, {}, {})) as any
  let injector: Injector

  describe('with injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          {
            provide: HttpClient,
            useValue: httpClientMock,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_1',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: 'path_2',
            multi: true,
          },
          {
            provide: TRANSLATION_PATH,
            useValue: of('path_3'),
            multi: true,
          },
        ],
      }).compileComponents()

      injector = TestBed.inject(Injector)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })

    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () => createTranslateLoader())

        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(3)
          done()
        })
      })
    })
  })

  describe('without injected TRANSLATION_PATH', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({}).compileComponents()
      injector = TestBed.inject(Injector)
      window['onecxTranslations'] = {}
      jest.clearAllMocks()
    })

    describe('without TranslationCache parameter', () => {
      it('should call httpClient for each TRANSLATION_PATH', (done) => {
        const translateLoader = runInInjectionContext(injector, () => createTranslateLoader())

        translateLoader.getTranslation('en').subscribe(() => {
          expect(httpClientMock.get).toHaveBeenCalledTimes(0)
          done()
        })
      })
    })
  })
})
