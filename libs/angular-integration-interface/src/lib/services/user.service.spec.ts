/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { TestBed } from '@angular/core/testing'
import { UserService } from './user.service'
import { UserProfile } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { DEFAULT_LANG } from '../api/constants'

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    getNormalizedBrowserLocales: jest.fn(),
  }
})

import { getNormalizedBrowserLocales } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    UserProfileTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<UserProfile>()
    }),
  }
})

describe('UserService', () => {
  const originalNavigator = window.navigator

  let userService: UserService
  let mockProfile$: FakeTopic<UserProfile>
  let mockedGetNormalizedBrowserLocales: jest.Mock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    })

    userService = TestBed.inject(UserService)
    mockProfile$ = userService.profile$ as any as FakeTopic<UserProfile>
    mockedGetNormalizedBrowserLocales = getNormalizedBrowserLocales as jest.Mock
  })

  afterEach(() => {
    // Restore the original navigator object after each test
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(userService).toBeTruthy()
  })

  describe('lang$', () => {
    describe('old style language setting', () => {
      it('should set to DEFAULT_LANG if no locales are provided and window has no browser languages', () => {
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to DEFAULT_LANG if no locales are provided and window navigator is not defined', () => {
        Object.defineProperty(window, 'navigator', {
          value: undefined,
          configurable: true,
        })
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to DEFAULT_LANG if no locales are provided and window navigator language and languages are not defined', () => {
        Object.defineProperty(window, 'navigator', {
          value: {
            language: undefined,
            languages: undefined,
          },
          configurable: true,
        })
        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
      })

      it('should set to first browser language if no locales are provided and window has browser languages separated with -', () => {
        Object.defineProperty(window, 'navigator', {
          value: { languages: ['de-DE', 'fr-FR'] },
          configurable: true,
        })

        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe('de')
      })

      it('should set to first browser language if no locales are provided and window has browser languages separated with _', () => {
        Object.defineProperty(window, 'navigator', {
          value: { languages: ['de_DE', 'fr_FR'] },
          configurable: true,
        })

        mockProfile$.publish({} as UserProfile)

        expect(userService.lang$.getValue()).toBe('de')
      })

      it('should set to user locale if no locales are provided and preferred locale is defined', () => {
        mockProfile$.publish({
          accountSettings: {
            localeAndTimeSettings: {
              locale: 'es',
            },
          },
        } as UserProfile)

        expect(userService.lang$.getValue()).toBe('es')
      })
    })

    it('should use first general language from locales if provided', () => {
      mockProfile$.publish({
        settings: {
          locales: ['fr-FR', 'fr'],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe('fr')
    })

    it('should use default language if no general language is in locales', () => {
      mockProfile$.publish({
        settings: {
          locales: ['fr-FR', 'de-DE'],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe(DEFAULT_LANG)
    })

    it('should use first language from normalized browser languages if locales is an empty array', () => {
      mockedGetNormalizedBrowserLocales.mockReturnValue(['en-US', 'en', 'fr-FR', 'fr'])

      mockProfile$.publish({
        settings: {
          locales: [] as string[],
        },
      } as UserProfile)

      expect(userService.lang$.getValue()).toBe('en')
    })
  })
})
