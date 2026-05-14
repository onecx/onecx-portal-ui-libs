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

  it('should use browser locales if user profile settings are missing', (done) => {
    mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

    userServiceMock.profile$.publish({} as UserProfile)

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

  it('should support nested translations via dotted keys', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'nested.key',
      translateService: createTranslateServiceMock({
        en: { nested: { key: 'Nested value' } },
      }).translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Nested value')
      done()
    })
  })

  it('should coerce primitive translation values to strings', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en', 'de'],
      },
    } as UserProfile)

    const paramsNumber: MissingTranslationHandlerParams = {
      key: 'value.number',
      translateService: createTranslateServiceMock({
        en: { 'value.number': 123 },
      }).translateService,
    }

    handler.handle(paramsNumber).subscribe((result) => {
      expect(result).toBe('123')

      const paramsBoolean: MissingTranslationHandlerParams = {
        key: 'value.bool',
        translateService: createTranslateServiceMock({
          de: { 'value.bool': true },
        }).translateService,
      }

      handler.handle(paramsBoolean).subscribe((boolResult) => {
        expect(boolResult).toBe('true')
        done()
      })
    })
  })

  it('should return key when loader is missing', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslations = jest.fn(() => ({}))
    const translateService = {
      store: { getTranslations },
      currentLoader: undefined,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('missing.key')
      expect(getTranslations).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should try next language when loader translation is missing for a language', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en', 'fr'],
      },
    } as UserProfile)

    const getTranslations = jest.fn(() => ({}))
    const getTranslation = jest.fn((lang: string) => of(lang === 'fr' ? { 'test.key': 'OK' } : {}))
    const translateService = {
      store: { getTranslations },
      currentLoader: { getTranslation },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('OK')
      expect(getTranslation).toHaveBeenCalledTimes(2)
      done()
    })
  })

  it('should handle missing stored translations (undefined) and still resolve via loader', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslation = jest.fn(() => of({ 'test.key': 'From loader' }))
    const translateService = {
      store: {},
      currentLoader: { getTranslation },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('From loader')
      expect(getTranslation).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should handle missing store in translateService and still resolve via loader', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslation = jest.fn(() => of({ 'test.key': 'From loader' }))
    const translateService = {
      currentLoader: { getTranslation },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('From loader')
      expect(getTranslation).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should treat object-valued translations as missing and continue lookup', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService: createTranslateServiceMock({
        en: { 'test.key': { not: 'a string' } },
      }).translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('test.key')
      done()
    })
  })

  it('should use translateService parser getValue when provided', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslations = jest.fn(() => ({ any: 'Value via getValue' }))
    const translateService = {
      store: { getTranslations },
      currentLoader: { getTranslation: jest.fn(() => of({})) },
      parser: {
        getValue: jest.fn((obj: Record<string, unknown>, key: string) => obj[key]),
      },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'any',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Value via getValue')
      done()
    })
  })

  it('should support function-valued translations', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    parserMock.interpolate.mockImplementationOnce((value) => {
      if (typeof value === 'function') {
        return value({})
      }
      return value
    })

    const params: MissingTranslationHandlerParams = {
      key: 'fn.key',
      translateService: createTranslateServiceMock({
        en: {
          'fn.key': () => 'From function',
        },
      }).translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('From function')
      done()
    })
  })
})
