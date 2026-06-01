import { TestBed } from '@angular/core/testing'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams, TranslateNoOpLoader, TranslateParser, getValue } from '@ngx-translate/core'
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

jest.mock('@ngx-translate/core', () => {
  const actual = jest.requireActual('@ngx-translate/core')
  return {
    ...actual,
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
})

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
    parserMock.interpolate.mockReset()
    parserMock.interpolate.mockImplementation((value) => value)
    parserMock.getValue.mockReset()
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
    mockedGetNormalizedBrowserLocales.mockReset()
    ;(getValue as jest.Mock).mockClear()
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
      expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalledTimes(1)
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
      expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalledTimes(1)
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
      currentLoader: new TranslateNoOpLoader(),
      parser: parserMock,
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'missing.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('missing.key')
      expect(warnSpy).toHaveBeenCalledWith('[MultiLanguageMissingTranslationHandler] No translation loader configured')
      warnSpy.mockRestore()
      done()
    })
  })

  it('should try to load for every available language', (done) => {
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
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'missing.key',
        expect.any(Error)
      )
      warnSpy.mockRestore()
      done()
    })
  })

  it('should return the key when the loader throws', (done) => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const params: MissingTranslationHandlerParams = {
      key: 'broken.key',
      translateService: {
        currentLoader: { getTranslation: jest.fn(() => throwError(() => new Error('Loader failed'))) },
        parser: parserMock,
        setTranslation: jest.fn(),
      } as unknown as MissingTranslationHandlerParams['translateService'],
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('broken.key')
      expect(warnSpy).toHaveBeenCalledWith(
        '[MultiLanguageMissingTranslationHandler] No translation found for key: %s. %O',
        'broken.key',
        expect.any(Error)
      )
      warnSpy.mockRestore()
      done()
    })
  })

  it('should support non-string translation values accepted by interpolation', (done) => {
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

      const paramsFunction: MissingTranslationHandlerParams = {
        key: 'value.fn',
        translateService: createTranslateServiceMock({
          de: { 'value.fn': () => 'From function' },
        }).translateService,
      }

      parserMock.interpolate.mockImplementationOnce((value) => {
        if (typeof value === 'function') {
          return value({})
        }

        return value
      })

      handler.handle(paramsFunction).subscribe((functionResult) => {
        expect(functionResult).toBe('From function')
        done()
      })
    })
  })

  it('should use ngx-translate getValue and injected parser', (done) => {
    userServiceMock.profile$.publish({
      settings: {
        locales: ['en'],
      },
    } as UserProfile)

    const translateService = {
      currentLoader: { getTranslation: jest.fn(() => of({ nested: { key: 'Value from service parser' } })) },
      parser: { interpolate: jest.fn() },
      setTranslation: jest.fn(),
    } as unknown as MissingTranslationHandlerParams['translateService']

    const params: MissingTranslationHandlerParams = {
      key: 'nested.key',
      translateService,
    }

    handler.handle(params).subscribe((result) => {
      expect(result).toBe('Value from service parser')
      expect(getValue).toHaveBeenLastCalledWith({ nested: { key: 'Value from service parser' } }, 'nested.key')
      expect(parserMock.interpolate).toHaveBeenCalledWith('Value from service parser', undefined)
      done()
    })
  })
})
