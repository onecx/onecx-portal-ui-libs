import { TestBed } from '@angular/core/testing'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams, TranslateParser } from '@ngx-translate/core'
import { of } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

jest.mock('@ngx-translate/core', () => {
  const actual = jest.requireActual('@ngx-translate/core')
  return {
    ...actual,
    getValue: jest.fn((obj, key) => obj[key]),
  }
})

describe('MultiLanguageMissingTranslationHandler', () => {
  let handler: MultiLanguageMissingTranslationHandler
  let userServiceMock: UserServiceMock
  let mockedGetNormalizedBrowserLocales: jest.Mock

  const parserMock = {
    interpolate: jest.fn((value) => value),
    getValue: jest.fn((obj, key) => obj[key]),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        MultiLanguageMissingTranslationHandler,
        { provide: TranslateParser, useValue: parserMock },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  it('should use locales from user profile if available', (done) => {
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'fr') {
            return of({ 'test.key': 'Test French' })
          }
          return of({})
        }),
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test French')
      done()
    })
  })

  it('should use browser locales if locales from user profile are unavailable', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: undefined,
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'de') {
            return of({ 'test.key': 'Test German' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test German')
      done()
    })
  })

  it('should try to load for every available language', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: {
        reloadLang: jest.fn().mockImplementation((lang) => {
          if (lang === 'pl') {
            return of({ 'test.key': 'Test Polish' })
          }
          return of({})
        }),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test Polish')
      expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
      done()
    })
  })
  it('should throw an error if no translation is found', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService: {
        reloadLang: jest.fn().mockReturnValue(of({})),
        parser: {
          interpolate: jest.fn((value) => value),
          getValue: jest.fn((obj, key) => obj[key]),
        },
      } as any,
    }

    handler.handle(params).subscribe({
      error: (err) => {
        expect(err.message).toBe('No translation found for key: missing.key')
        expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
        done()
      },
    })
  })
})
