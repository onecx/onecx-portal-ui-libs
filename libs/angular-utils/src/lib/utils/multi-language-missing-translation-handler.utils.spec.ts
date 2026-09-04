import { TestBed } from '@angular/core/testing'
import { APP_ID } from '@angular/core'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DynamicTranslationService } from '@onecx/angular-integration-interface'
import { MissingTranslationHandlerParams, TranslateNoOpLoader, TranslateParser, getValue } from '@ngx-translate/core'
import { firstValueFrom, of, throwError } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'
import { MULTI_LANGUAGE_IDENTIFIER } from '../injection-tokens/multi-language-identifier'

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

jest.mock('./logger.utils', () => ({
  createLogger: jest.fn(),
}))

import { createLogger } from './logger.utils'

describe('MultiLanguageMissingTranslationHandler', () => {
  let handler: MultiLanguageMissingTranslationHandler
  let userServiceMock: UserServiceMock
  let dynamicTranslationServiceMock: { getTranslations: jest.Mock }
  let loggerMock: { debug: jest.Mock; info: jest.Mock; warn: jest.Mock; error: jest.Mock }
  let mockedGetNormalizedBrowserLocales: jest.Mock

  const parserMock = {
    interpolate: jest.fn((value) => value),
  }

  const defaultIdentifiers = [{ name: 'test-context', version: '1.0.0', type: 'app' as const }]

  beforeEach(() => {
    loggerMock = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() }
    jest.mocked(createLogger).mockReturnValue(loggerMock)

    dynamicTranslationServiceMock = { getTranslations: jest.fn() }

    parserMock.interpolate.mockReset()
    parserMock.interpolate.mockImplementation((value) => value)
    ;(getValue as jest.Mock).mockClear()

    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        MultiLanguageMissingTranslationHandler,
        { provide: TranslateParser, useValue: parserMock },
        { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
        { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: defaultIdentifiers },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
    mockedGetNormalizedBrowserLocales.mockReset()
    dynamicTranslationServiceMock.getTranslations.mockReset()
  })

  function createTranslateServiceMock(translationsByLang: Record<string, Record<string, unknown>> = {}) {
    const getTranslation = jest.fn((lang: string) => of(translationsByLang[lang] ?? {}))
    const translateService = {
      currentLoader: { getTranslation },
      parser: parserMock,
      setTranslation: jest.fn(),
      reloadLang: jest.fn(),
      use: jest.fn(),
      currentLang: 'en',
    } as unknown as MissingTranslationHandlerParams['translateService']

    return {
      translateService,
      getTranslation,
      setTranslation: translateService.setTranslation,
      reloadLang: translateService.reloadLang,
      use: translateService.use,
    }
  }

  describe('locale resolution order', () => {
    it('should use locales from user profile if available', async () => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

      userServiceMock.profile$.publish({
        settings: { locales: ['fr', 'en'] },
      } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: createTranslateServiceMock({ fr: { 'test.key': 'Test French' }, en: {} }).translateService,
      }

      expect(await firstValueFrom(handler.handle(params))).toBe('Test French')
    })

    it('should use browser locales if locales from user profile are unavailable', async () => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

      userServiceMock.profile$.publish({ settings: { locales: undefined } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: createTranslateServiceMock({ de: { 'test.key': 'Test German' } }).translateService,
      }

      expect(await firstValueFrom(handler.handle(params))).toBe('Test German')
      expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalledTimes(1)
    })

    it('should use browser locales if user profile settings are missing', async () => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['de'])

      userServiceMock.profile$.publish({} as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: createTranslateServiceMock({ de: { 'test.key': 'Test German' } }).translateService,
      }

      expect(await firstValueFrom(handler.handle(params))).toBe('Test German')
      expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalledTimes(1)
    })
  })

  describe('static lookup', () => {
    it('should resolve a static hit without consulting the dynamic source', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: createTranslateServiceMock({ fr: { 'test.key': 'Test French' } }).translateService,
      }

      expect(await firstValueFrom(handler.handle(params))).toBe('Test French')
      expect(dynamicTranslationServiceMock.getTranslations).not.toHaveBeenCalled()
    })

    it('should try to load for every available language until one resolves', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en', 'pl'] } } as UserProfile)

      const { translateService, getTranslation } = createTranslateServiceMock({
        fr: {},
        en: {},
        pl: { 'test.key': 'Test Polish' },
      })
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      const params: MissingTranslationHandlerParams = { key: 'test.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('Test Polish')
      expect(getTranslation).toHaveBeenCalledTimes(3)
    })

    it('should return the locale B static value when locale A misses both static and dynamic', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: createTranslateServiceMock({ en: { 'test.key': 'Test English' } }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      expect(await firstValueFrom(handler.handle(params))).toBe('Test English')
    })

    it('should return the key if no translation is found in any locale', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en', 'pl'] } } as UserProfile)

      const { translateService, getTranslation } = createTranslateServiceMock({ fr: {}, en: {}, pl: {} })
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      const params: MissingTranslationHandlerParams = { key: 'missing.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('missing.key')
      expect(getTranslation).toHaveBeenCalledTimes(3)
      expect(loggerMock.warn).toHaveBeenCalledWith('No translation found for key:', 'missing.key', expect.any(Error))
    })

    it('should return the key when the loader throws', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'broken.key',
        translateService: {
          currentLoader: { getTranslation: jest.fn(() => throwError(() => new Error('Loader failed'))) },
          parser: parserMock,
          setTranslation: jest.fn(),
          reloadLang: jest.fn(),
        } as unknown as MissingTranslationHandlerParams['translateService'],
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      expect(await firstValueFrom(handler.handle(params))).toBe('broken.key')
      expect(loggerMock.warn).toHaveBeenCalledWith('No translation found for key:', 'broken.key', expect.any(Error))
    })

    it('should support non-string translation values accepted by interpolation (static)', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en', 'de'] } } as UserProfile)

      const paramsNumber: MissingTranslationHandlerParams = {
        key: 'value.number',
        translateService: createTranslateServiceMock({ en: { 'value.number': 123 } }).translateService,
      }

      expect(await firstValueFrom(handler.handle(paramsNumber))).toBe('123')

      const paramsFunction: MissingTranslationHandlerParams = {
        key: 'value.fn',
        translateService: createTranslateServiceMock({ de: { 'value.fn': () => 'From function' } }).translateService,
      }

      parserMock.interpolate.mockImplementationOnce((value) => {
        if (typeof value === 'function') {
          return value({})
        }

        return value
      })

      expect(await firstValueFrom(handler.handle(paramsFunction))).toBe('From function')
    })

    it('should use ngx-translate getValue and injected parser', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const translateService = {
        currentLoader: { getTranslation: jest.fn(() => of({ nested: { key: 'Value from service parser' } })) },
        parser: { interpolate: jest.fn() },
        setTranslation: jest.fn(),
        reloadLang: jest.fn(),
      } as unknown as MissingTranslationHandlerParams['translateService']

      const params: MissingTranslationHandlerParams = { key: 'nested.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('Value from service parser')
      expect(getValue).toHaveBeenLastCalledWith({ nested: { key: 'Value from service parser' } }, 'nested.key')
    })
  })

  describe('dynamic fallback', () => {
    it('should return a dynamic value when static misses but dynamic holds the key for the same locale', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const { translateService, getTranslation } = createTranslateServiceMock({ fr: {}, en: {} })
      dynamicTranslationServiceMock.getTranslations.mockImplementation((lang: string) =>
        of(lang === 'en' ? { 'test-context@1.0.0': { 'dynamic.key': 'Dynamic English' } } : {})
      )

      const params: MissingTranslationHandlerParams = { key: 'dynamic.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('Dynamic English')
      expect(getTranslation).toHaveBeenCalledWith('fr')
      expect(getTranslation).toHaveBeenCalledWith('en')
    })

    it('should interpolate dynamic values with the provided params', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'greeting',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
        interpolateParams: { name: 'World' },
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({ 'test-context@1.0.0': { greeting: 'Hello {{name}}' } })
      )

      parserMock.interpolate.mockImplementationOnce((value, p) => {
        if (typeof value === 'string' && p) {
          let output = value
          for (const key of Object.keys(p)) {
            output = output.replace(`{{${key}}}`, String(p[key]))
          }
          return output
        }
        return value
      })

      expect(await firstValueFrom(handler.handle(params))).toBe('Hello World')
      expect(parserMock.interpolate).toHaveBeenCalledWith('Hello {{name}}', { name: 'World' })
    })

    it('should request dynamic translations scoped to the derived translation contexts', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'scoped.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({ 'test-context@1.0.0': { 'scoped.key': 'Scoped' } })
      )

      expect(await firstValueFrom(handler.handle(params))).toBe('Scoped')
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
        { name: 'test-context', version: '1.0.0' },
      ])
    })

    it('should deep-merge context-keyed dynamic maps before resolving the key', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'merged.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'context1@1.0.0': { 'other.key': 'value1' },
          'context2@2.0.0': { 'merged.key': 'Merged Value' },
        })
      )

      expect(await firstValueFrom(handler.handle(params))).toBe('Merged Value')
    })

    it('should fall through to the next locale when a locale has no dynamic translations', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: createTranslateServiceMock({ fr: {}, en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockImplementation((lang: string) =>
        of(lang === 'en' ? { 'test-context@1.0.0': { 'dynamic.key': 'English Dynamic' } } : {})
      )

      expect(await firstValueFrom(handler.handle(params))).toBe('English Dynamic')
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledTimes(2)
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('fr', [
        { name: 'test-context', version: '1.0.0' },
      ])
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
        { name: 'test-context', version: '1.0.0' },
      ])
    })

    it('should fall back to the raw key when the shell yields empty dynamic records', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const { translateService, getTranslation } = createTranslateServiceMock({ fr: {}, en: {} })
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      const params: MissingTranslationHandlerParams = { key: 'missing.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('missing.key')
      expect(getTranslation).toHaveBeenCalledTimes(2)
    })

    describe('dynamic value shapes', () => {
      it('should interpolate a dynamic string value', async () => {
        userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-context@1.0.0': { 'value.key': 'String Value' } })
        )

        const params: MissingTranslationHandlerParams = {
          key: 'value.key',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }

        expect(await firstValueFrom(handler.handle(params))).toBe('String Value')
      })

      it('should interpolate a dynamic function value', async () => {
        userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-context@1.0.0': { 'value.fn': () => 'From function' } })
        )

        const params: MissingTranslationHandlerParams = {
          key: 'value.fn',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }

        parserMock.interpolate.mockImplementationOnce((value) => {
          if (typeof value === 'function') {
            return value({})
          }

          return value
        })

        expect(await firstValueFrom(handler.handle(params))).toBe('From function')
      })

      it('should stringify a dynamic number value', async () => {
        userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-context@1.0.0': { 'value.number': 123 } })
        )

        const params: MissingTranslationHandlerParams = {
          key: 'value.number',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }

        expect(await firstValueFrom(handler.handle(params))).toBe('123')
      })

      it('should stringify a dynamic boolean value', async () => {
        userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-context@1.0.0': { 'value.bool': true } })
        )

        const params: MissingTranslationHandlerParams = {
          key: 'value.bool',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }

        expect(await firstValueFrom(handler.handle(params))).toBe('true')
      })

      it('should stringify a dynamic bigint value', async () => {
        userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-context@1.0.0': { 'value.bigint': 42n } })
        )

        const params: MissingTranslationHandlerParams = {
          key: 'value.bigint',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }

        expect(await firstValueFrom(handler.handle(params))).toBe('42')
      })
    })

    it('should request dynamic translations with empty contexts when no identifier is provided', async () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const newUserServiceMock = TestBed.inject(UserServiceMock)
      newUserServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      expect(await firstValueFrom(newHandler.handle(params))).toBe('dynamic.key')
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [])
    })

    it('should request dynamic translations with empty contexts when the app identity is unavailable', async () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: APP_ID, useValue: undefined },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const newUserServiceMock = TestBed.inject(UserServiceMock)
      newUserServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      expect(await firstValueFrom(newHandler.handle(params))).toBe('dynamic.key')
      expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [])
    })

    it('should ignore undefined context records when merging dynamic translations', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'context1@1.0.0': undefined as unknown as Record<string, unknown>,
          'context2@2.0.0': { 'dynamic.key': 'Dynamic Value' },
        })
      )

      expect(await firstValueFrom(handler.handle(params))).toBe('Dynamic Value')
    })

    describe('context derivation', () => {
      it('should include the app identifier derived from the app element name when no app identifier is provided', async () => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          providers: [
            provideUserServiceMock(),
            MultiLanguageMissingTranslationHandler,
            { provide: TranslateParser, useValue: parserMock },
            { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
            { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
            { provide: APP_ID, useValue: { appElementName: 'my-app' } },
          ],
        })

        const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
        const newUserServiceMock = TestBed.inject(UserServiceMock)
        newUserServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

        const params: MissingTranslationHandlerParams = {
          key: 'app.key',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'test-lib@1.0.0': {}, myapp: { 'app.key': 'App Value' } })
        )

        expect(await firstValueFrom(newHandler.handle(params))).toBe('App Value')
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
          { name: 'test-lib', version: '1.0.0' },
          { name: 'my-app' },
        ])
      })

      it('should not add a duplicate app identifier when one already exists', async () => {
        TestBed.resetTestingModule()
        TestBed.configureTestingModule({
          providers: [
            provideUserServiceMock(),
            MultiLanguageMissingTranslationHandler,
            { provide: TranslateParser, useValue: parserMock },
            { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
            {
              provide: MULTI_LANGUAGE_IDENTIFIER,
              useValue: [{ name: 'my-app', version: '1.0.0', type: 'app' }],
            },
            { provide: APP_ID, useValue: { appElementName: 'my-app' } },
          ],
        })

        const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
        const newUserServiceMock = TestBed.inject(UserServiceMock)
        newUserServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

        const params: MissingTranslationHandlerParams = {
          key: 'app.key',
          translateService: createTranslateServiceMock({ en: {} }).translateService,
        }
        dynamicTranslationServiceMock.getTranslations.mockReturnValue(
          of({ 'my-app@1.0.0': { 'app.key': 'App Value' } })
        )

        expect(await firstValueFrom(newHandler.handle(params))).toBe('App Value')
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
          { name: 'my-app', version: '1.0.0' },
        ])
      })
    })
  })

  describe('logging', () => {
    it('should log a warning via the library logger when the loader is a no-op loader', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const translateService = {
        currentLoader: new TranslateNoOpLoader(),
        parser: parserMock,
        setTranslation: jest.fn(),
        reloadLang: jest.fn(),
      } as unknown as MissingTranslationHandlerParams['translateService']
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      const params: MissingTranslationHandlerParams = { key: 'missing.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('missing.key')
      expect(loggerMock.warn).toHaveBeenCalledWith('No translation loader configured')
    })

    it('should log a debug message when resolving a missing key', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'missing.key',
        translateService: createTranslateServiceMock({ en: {} }).translateService,
      }
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      await firstValueFrom(handler.handle(params))

      expect(loggerMock.debug).toHaveBeenCalled()
    })
  })

  describe('no global language state mutation', () => {
    it('should never call reloadLang, use, or setTranslation on the translate service', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['fr', 'en'] } } as UserProfile)

      const { translateService, reloadLang, use, setTranslation } = createTranslateServiceMock({ fr: {}, en: {} })
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      const params: MissingTranslationHandlerParams = { key: 'missing.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('missing.key')
      expect(reloadLang).not.toHaveBeenCalled()
      expect(use).not.toHaveBeenCalled()
      expect(setTranslation).not.toHaveBeenCalled()
    })

    it('should never mutate active-language state when a dynamic value resolves', async () => {
      userServiceMock.profile$.publish({ settings: { locales: ['en'] } } as UserProfile)

      const { translateService, reloadLang, use, setTranslation } = createTranslateServiceMock({ en: {} })
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({ 'test-context@1.0.0': { 'dynamic.key': 'Dynamic English' } })
      )

      const params: MissingTranslationHandlerParams = { key: 'dynamic.key', translateService }

      expect(await firstValueFrom(handler.handle(params))).toBe('Dynamic English')
      expect(reloadLang).not.toHaveBeenCalled()
      expect(use).not.toHaveBeenCalled()
      expect(setTranslation).not.toHaveBeenCalled()
    })
  })
})
