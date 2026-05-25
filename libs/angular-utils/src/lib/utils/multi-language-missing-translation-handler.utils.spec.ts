import { TestBed } from '@angular/core/testing'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams, TranslateFakeLoader } from '@ngx-translate/core'
import { of, throwError } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

describe('MultiLanguageMissingTranslationHandler', () => {
  let handler: MultiLanguageMissingTranslationHandler
  let userServiceMock: UserServiceMock
  let mockedGetNormalizedBrowserLocales: jest.Mock

  const parserMock = {
    interpolate: jest.fn((value) => value),
    getValue: jest.fn((obj: Record<string, unknown>, key: string) => {
      if (key in obj) {
        return obj[key]
      }

      return key.split('.').reduce<unknown>((current, part) => {
        if (typeof current !== 'object' || current === null) {
          return undefined
        }

        return (current as Record<string, unknown>)[part]
      }, obj)
    }),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), MultiLanguageMissingTranslationHandler],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  function createTranslateServiceMock(translationsByLang: Record<string, Record<string, unknown>> = {}) {
    const getTranslation = jest.fn((lang: string) => of(translationsByLang[lang] ?? {}))

    const translateService = {
      currentLoader: {
        getTranslation,
      },
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    return { translateService, getTranslation }
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

  it('should warn when ngx-translate uses TranslateFakeLoader', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const translateService = {
      currentLoader: new TranslateFakeLoader(),
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('missing.key')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'missing.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation loader configured')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: missing.key in language: en')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'missing.key',
        expect.any(Error)
      )
      warnSpy.mockRestore()
      done()
    })
  })

  it('should try to load for every available language', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const { translateService, getTranslation } = createTranslateServiceMock({
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
      expect(getTranslation).toHaveBeenCalledTimes(3)
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'test.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: test.key in language: fr')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: test.key in language: en')
      warnSpy.mockRestore()
      done()
    })
  })

  it('should return the key if no translation is found', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['fr', 'en', 'pl'],
      },
    } as UserProfile)

    const { translateService, getTranslation } = createTranslateServiceMock({
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
      expect(getTranslation).toHaveBeenCalledTimes(3)
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'missing.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: missing.key in language: fr')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: missing.key in language: en')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: missing.key in language: pl')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'missing.key',
        expect.any(Error)
      )
      warnSpy.mockRestore()
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

        const paramsBigInt: MissingTranslationHandlerParams = {
          key: 'value.bigint',
          translateService: createTranslateServiceMock({
            de: { 'value.bigint': BigInt(42) },
          }).translateService,
        }

        handler.handle(paramsBigInt).subscribe((bigIntResult) => {
          expect(bigIntResult).toBe('42')
          done()
        })
      })
    })
  })

  it('should return key when loader warns and returns ngx-translate fallback payload', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslation = jest.fn(() => {
      console.warn('[MultiLanguageMissingTranslationHandler] Using ngx-translate fallback loader response')
      return of({})
    })

    const translateService = {
      currentLoader: { getTranslation },
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('missing.key')
      expect(getTranslation).toHaveBeenCalledWith('en')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'missing.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] Using ngx-translate fallback loader response')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: missing.key in language: en')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'missing.key',
        expect.any(Error)
      )
      warnSpy.mockRestore()
      done()
    })
  })

  it('should try next language when loader translation is missing for a language', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['en', 'fr'],
      },
    } as UserProfile)

    const getTranslation = jest.fn((lang: string) => of(lang === 'fr' ? { 'test.key': 'OK' } : {}))
    const translateService = {
      store: { translations: { en: {}, fr: {} } },
      currentLoader: { getTranslation },
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'test.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('OK')
      expect(getTranslation).toHaveBeenCalledTimes(2)
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'test.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: test.key in language: en')
      warnSpy.mockRestore()
      done()
    })
  })

  it('should log generic final fallback error when loader throws', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    const loaderError = new Error('Loader failed')

    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const translateService = {
      currentLoader: { getTranslation: jest.fn(() => throwError(() => loaderError)) },
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'broken.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('broken.key')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'broken.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'broken.key',
        expect.any(Error)
      )
      expect(loaderError.stack).toBeDefined()
      warnSpy.mockRestore()
      done()
    })
  })

  it('should ignore stored translations and always resolve via loader', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const getTranslation = jest.fn(() => of({ 'test.key': 'From loader' }))
    const translateService = {
      store: { translations: { en: { 'test.key': 'From store' } } },
      currentLoader: { getTranslation },
      parser: parserMock,
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
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

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
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: ',
        'test.key',
        'in language: ',
        undefined,
        '. Trying to resolve with fallback languages...'
      )
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation found for key: test.key in language: en')
      warnSpy.mockRestore()
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

  it('should use parser from translateService', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const serviceParser = {
      getValue: jest.fn(() => 'Value from service parser'),
      interpolate: jest.fn((value) => value),
    }
    const translateService = {
      store: { translations: { en: { ignored: 'value' } } },
      currentLoader: { getTranslation: jest.fn(() => of({})) },
      parser: serviceParser,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'nested.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Value from service parser')
      expect(serviceParser.getValue).toHaveBeenCalled()
      expect(serviceParser.interpolate).toHaveBeenCalledWith('Value from service parser', undefined)
      done()
    })
  })
})
