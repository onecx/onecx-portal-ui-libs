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
    getValue: jest.fn((obj: Record<string, unknown>, key: string) => obj[key]),
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

  function createTranslateServiceMock(translationsByLang: Record<string, Record<string, unknown>> = {}) {
    const getTranslations = jest.fn((lang: string) => translationsByLang[lang] ?? {})
    const getTranslation = jest.fn((lang: string) => of(translationsByLang[lang] ?? {}))

    const translateService = {
      store: {
        getTranslations,
      },
      currentLoader: {
        getTranslation,
      },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    return { translateService, getTranslations, getTranslation }
  }

  it('should use locales from user profile if available', (done) => {
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: createTranslateServiceMock({
        fr: { 'test.key': 'Test French' },
        en: {},
      }).translateService,
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
      translateService: createTranslateServiceMock({
        de: { 'test.key': 'Test German' },
      }).translateService,
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

    const { translateService, getTranslations } = createTranslateServiceMock({
      fr: {},
      en: {},
      pl: { 'test.key': 'Test Polish' },
    })

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Test Polish')
      expect(getTranslations).toHaveBeenCalledTimes(3)
      done()
    })
  })

  it('should return the key if no translation is found', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const { translateService, getTranslations } = createTranslateServiceMock({
      fr: {},
      en: {},
      pl: {},
    })

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('missing.key')
      expect(getTranslations).toHaveBeenCalledTimes(3)
      done()
    })
  })
})
