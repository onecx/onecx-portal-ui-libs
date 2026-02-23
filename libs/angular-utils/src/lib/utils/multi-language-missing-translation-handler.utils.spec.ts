import { TestBed } from '@angular/core/testing'
import { APP_ID } from '@angular/core'
import { MultiLanguageMissingTranslationHandler } from './multi-language-missing-translation-handler.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { MissingTranslationHandlerParams, TranslateParser } from '@ngx-translate/core'
import { of, throwError } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'
import { DynamicTranslationService } from '@onecx/angular-integration-interface'
import { MULTI_LANGUAGE_IDENTIFIER } from '../injection-tokens/multi-language-identifier'

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
  let dynamicTranslationServiceMock: jest.Mocked<DynamicTranslationService>

  const parserMock = {
    interpolate: jest.fn((value, params) => {
      if (!value) return value
      if (params) {
        let result = value
        for (const key of Object.keys(params)) {
          result = result.replace(`{{${key}}}`, params[key])
        }
        return result
      }
      return value
    }),
  }

  beforeEach(() => {
    dynamicTranslationServiceMock = {
      getTranslations: jest.fn(),
      ngOnDestroy: jest.fn(),
    } as any

    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        MultiLanguageMissingTranslationHandler,
        { provide: TranslateParser, useValue: parserMock },
        { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
        { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-context', version: '1.0.0' }] },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    handler = TestBed.inject(MultiLanguageMissingTranslationHandler)
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock

    parserMock.interpolate.mockReset()
    parserMock.interpolate.mockImplementation((value, params) => {
      if (!value) return value
      if (params) {
        let result = value
        for (const key of Object.keys(params)) {
          result = result.replace(`{{${key}}}`, params[key])
        }
        return result
      }
      return value
    })

    dynamicTranslationServiceMock.getTranslations.mockClear()
  })

  describe('handle', () => {
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
        expect(mockedGetNormalizedBrowserLocales).not.toHaveBeenCalled()
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
        translateService: {
          reloadLang: jest.fn().mockImplementation((lang) => {
            if (lang === 'de') {
              return of({ 'test.key': 'Test German' })
            }
            return of({})
          }),
        } as any,
      }

      handler.handle(params).subscribe((result) => {
        expect(result).toBe('Test German')
        expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalled()
        done()
      })
    })

    it('should use browser locales if settings are not present in user profile', (done) => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['it'])

      userServiceMock.profile$.publish({} as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockImplementation((lang) => {
            if (lang === 'it') {
              return of({ 'test.key': 'Test Italian' })
            }
            return of({})
          }),
        } as any,
      }

      handler.handle(params).subscribe((result) => {
        expect(result).toBe('Test Italian')
        expect(mockedGetNormalizedBrowserLocales).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('findTranslationForLang', () => {
    it('should return translation from reloadLang when available', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({ 'test.key': 'Test Value' })),
        } as any,
      }

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Test Value')
        expect(params.translateService.reloadLang).toHaveBeenCalledWith('en')
        expect(parserMock.interpolate).toHaveBeenCalledWith('Test Value', undefined)
        done()
      })
    })

    it('should interpolate translation with parameters', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({ 'test.key': 'Hello {{name}}' })),
        } as any,
        interpolateParams: { name: 'World' },
      }

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Hello World')
        expect(parserMock.interpolate).toHaveBeenCalledWith('Hello {{name}}', { name: 'World' })
        done()
      })
    })

    it('should fallback to dynamic translations when reloadLang fails', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(throwError(() => new Error('Reload failed'))),
        } as any,
      }

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'test-context@1.0.0': { 'dynamic.key': 'Dynamic Value' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Dynamic Value')
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
          { name: 'test-context', version: '1.0.0' },
        ])
        done()
      })
    })

    it('should fallback to dynamic translations when translation not found in reloadLang', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValueOnce(undefined).mockReturnValueOnce('Dynamic Value')

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'test-context@1.0.0': { 'dynamic.key': 'Dynamic Value' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Dynamic Value')
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
          { name: 'test-context', version: '1.0.0' },
        ])
        done()
      })
    })

    it('should merge multiple dynamic translation contexts', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'merged.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValueOnce(undefined).mockReturnValueOnce('Merged Value')

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'context1': { 'other.key': 'value1' },
          'context2': { 'merged.key': 'Merged Value' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Merged Value')
        done()
      })
    })

    it('should merge dynamic contexts when one context value is undefined', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValueOnce(undefined).mockReturnValueOnce('Dynamic Value')

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          context1: undefined as any,
          context2: { 'dynamic.key': 'Dynamic Value' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Dynamic Value')
        done()
      })
    })

    it('should interpolate dynamic translations with parameters', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
        interpolateParams: { user: 'John' },
      }

      parserMock.interpolate.mockReturnValueOnce(undefined).mockReturnValueOnce('Welcome John')

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'test-context@1.0.0': { 'dynamic.key': 'Welcome {{user}}' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe((result) => {
        expect(result).toBe('Welcome John')
        expect(parserMock.interpolate).toHaveBeenCalledWith('Welcome {{user}}', { user: 'John' })
        done()
      })
    })

    it('should throw error if dynamic translation is not found', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'missing.dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValue(undefined)

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'test-context@1.0.0': { 'other.key': 'value' },
        })
      )

      handler.findTranslationForLang('en', params).subscribe({
        error: (err) => {
          expect(err.message).toBe('No dynamic translation found for key: missing.dynamic.key in language: en')
          done()
        },
      })
    })

    it('should handle empty translations object from getTranslations', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'missing.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValue(undefined)

      dynamicTranslationServiceMock.getTranslations.mockReturnValue(of({}))

      handler.findTranslationForLang('en', params).subscribe({
        error: (err) => {
          expect(err.message).toBe('No dynamic translation found for key: missing.key in language: en')
          done()
        },
      })
    })
  })

  describe('loadTranslations', () => {
    it('should try to load for every available language in order', (done) => {
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
        } as any,
      }

      parserMock.interpolate.mockImplementation((value) => value)

      handler.handle(params).subscribe((result) => {
        expect(result).toBe('Test Polish')
        expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
        expect(params.translateService.reloadLang).toHaveBeenNthCalledWith(1, 'fr')
        expect(params.translateService.reloadLang).toHaveBeenNthCalledWith(2, 'en')
        expect(params.translateService.reloadLang).toHaveBeenNthCalledWith(3, 'pl')
        done()
      })
    })

    it('should stop at first successful translation', (done) => {
      userServiceMock.profile$.publish({
        settings: {
          locales: ['fr', 'en', 'de'],
        },
      } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockImplementation((lang) => {
            if (lang === 'en') {
              return of({ 'test.key': 'Test English' })
            }
            return of({})
          }),
        } as any,
      }

      parserMock.interpolate.mockImplementation((value) => value)

      handler.handle(params).subscribe((result) => {
        expect(result).toBe('Test English')
        expect(params.translateService.reloadLang).toHaveBeenCalledTimes(2)
        expect(params.translateService.reloadLang).not.toHaveBeenCalledWith('de')
        done()
      })
    })

    it('should throw an error if no translation is found in any language', (done) => {
      userServiceMock.profile$.publish({
        settings: {
          locales: ['fr', 'en', 'pl'],
        },
      } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'missing.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValue(undefined)
      dynamicTranslationServiceMock.getTranslations.mockReturnValue(
        of({
          'test-context@1.0.0': {},
        })
      )

      handler.handle(params).subscribe({
        error: (err) => {
          expect(err.message).toBe('No translation found for key: missing.key')
          expect(params.translateService.reloadLang).toHaveBeenCalledTimes(3)
          done()
        },
      })
    })

    it('should try dynamic translations for each language before moving to next', (done) => {
      userServiceMock.profile$.publish({
        settings: {
          locales: ['fr', 'en'],
        },
      } as UserProfile)

      const params: MissingTranslationHandlerParams = {
        key: 'dynamic.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate
        .mockReturnValueOnce(undefined) // fr reloadLang
        .mockReturnValueOnce(undefined) // fr dynamic
        .mockReturnValueOnce(undefined) // en reloadLang
        .mockReturnValueOnce('English Dynamic') // en dynamic

      dynamicTranslationServiceMock.getTranslations.mockImplementation((lang) => {
        if (lang === 'en') {
          return of({ 'test-context@1.0.0': { 'dynamic.key': 'English Dynamic' } })
        }
        return of({ 'test-context@1.0.0': {} })
      })

      handler.handle(params).subscribe((result) => {
        expect(result).toBe('English Dynamic')
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledTimes(2)
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('fr', [
          { name: 'test-context', version: '1.0.0' },
        ])
        expect(dynamicTranslationServiceMock.getTranslations).toHaveBeenCalledWith('en', [
          { name: 'test-context', version: '1.0.0' },
        ])
        done()
      })
    })
  })

  describe('multiLanguageIdentifier', () => {
    it('should work with empty multiLanguageIdentifier array', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({})),
        } as any,
      }

      parserMock.interpolate.mockReturnValueOnce(undefined).mockReturnValueOnce('Fallback Value')

      const emptyDynamicService = {
        getTranslations: jest.fn().mockReturnValue(of({ '': { 'test.key': 'Fallback Value' } })),
        ngOnDestroy: jest.fn(),
      } as any

      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: emptyDynamicService },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [] },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const newUserServiceMock = TestBed.inject(UserServiceMock)

      newUserServiceMock.profile$.publish({
        settings: { locales: ['en'] },
      } as UserProfile)

      newHandler.handle(params).subscribe((result) => {
        expect(result).toBe('Fallback Value')
        expect(emptyDynamicService.getTranslations).toHaveBeenCalledWith('en', [])
        done()
      })
    })

    it('should work without multiLanguageIdentifier provider', (done) => {
      const params: MissingTranslationHandlerParams = {
        key: 'test.key',
        translateService: {
          reloadLang: jest.fn().mockReturnValue(of({ 'test.key': 'Test Value' })),
        } as any,
      }

      parserMock.interpolate.mockReturnValueOnce('Test Value')

      const minimalDynamicService = {
        getTranslations: jest.fn().mockReturnValue(of({})),
        ngOnDestroy: jest.fn(),
      } as any

      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: minimalDynamicService },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const newUserServiceMock = TestBed.inject(UserServiceMock)

      newUserServiceMock.profile$.publish({
        settings: { locales: ['en'] },
      } as UserProfile)

      newHandler.handle(params).subscribe((result) => {
        expect(result).toBe('Test Value')
        expect(minimalDynamicService.getTranslations).not.toHaveBeenCalled()
        done()
      })
    })
  })

  describe('createMultiLanguageIdentifiers with APP_ID', () => {
    it('should add app identifier from DynamicAppId when no app identifier exists', () => {
      const dynamicAppId = { appElementName: 'my-app' }

      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
          { provide: APP_ID, useValue: dynamicAppId },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(2)
      expect(identifiers[0]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
      expect(identifiers[1]).toEqual({ name: 'my-app', type: 'app' })
    })

    it('should not add app identifier if one already exists', () => {
      const dynamicAppId = { appElementName: 'my-app' }

      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          {
            provide: MULTI_LANGUAGE_IDENTIFIER,
            useValue: [
              { name: 'existing-app', type: 'app' },
              { name: 'test-lib', version: '1.0.0', type: 'lib' },
            ],
          },
          { provide: APP_ID, useValue: dynamicAppId },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(2)
      expect(identifiers[0]).toEqual({ name: 'existing-app', type: 'app' })
      expect(identifiers[1]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
    })

    it('should not add app identifier if APP_ID is not DynamicAppId', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
          { provide: APP_ID, useValue: 'ng' },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(1)
      expect(identifiers[0]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
    })

    it('should not add app identifier if appElementName is empty', () => {
      const dynamicAppId = { appElementName: '' }

      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
          { provide: APP_ID, useValue: dynamicAppId },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(1)
      expect(identifiers[0]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
    })

    it('should work without APP_ID provider', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(1)
      expect(identifiers[0]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
    })

    it('should not add app identifier when APP_ID is explicitly undefined', () => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        providers: [
          provideUserServiceMock(),
          MultiLanguageMissingTranslationHandler,
          { provide: TranslateParser, useValue: parserMock },
          { provide: DynamicTranslationService, useValue: dynamicTranslationServiceMock },
          { provide: MULTI_LANGUAGE_IDENTIFIER, useValue: [{ name: 'test-lib', version: '1.0.0', type: 'lib' }] },
          { provide: APP_ID, useValue: undefined },
        ],
      })

      const newHandler = TestBed.inject(MultiLanguageMissingTranslationHandler)
      const identifiers = (newHandler as any).multiLanguageIdentifiers

      expect(identifiers).toHaveLength(1)
      expect(identifiers[0]).toEqual({ name: 'test-lib', version: '1.0.0', type: 'lib' })
    })
  })
})
