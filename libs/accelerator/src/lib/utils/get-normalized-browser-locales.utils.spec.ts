/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

jest.mock('./normalize-locales.utils', () => ({
  normalizeLocales: jest.fn(),
}))

import { normalizeLocales } from './normalize-locales.utils'
import { getNormalizedBrowserLocales } from './get-normalized-browser-locales.utils'

describe('getNormalizedBrowserLocales', () => {
  const originalNavigator = window.navigator
  let mockNormalizeLocales: jest.Mock

  beforeEach(() => {
    mockNormalizeLocales = normalizeLocales as jest.Mock
  })

  afterEach(() => {
    // Restore the original navigator object after each test
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    })
  })

  it('should return ["en"] if navigator is undefined', () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
    })
    expect(getNormalizedBrowserLocales()).toEqual(['en'])
  })

  it('should return normalized locales from navigator.languages', () => {
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['en-US', 'fr-FR'] },
      configurable: true,
    })
    const expected = ['en-US', 'en', 'fr-FR', 'fr']
    mockNormalizeLocales.mockReturnValue(expected)

    const result = getNormalizedBrowserLocales()
    expect(mockNormalizeLocales).toHaveBeenCalledWith(['en-US', 'fr-FR'])
    expect(result).toEqual(expected)
  })

  it('should return normalized locales from navigator.language if navigator.languages is undefined', () => {
    Object.defineProperty(window, 'navigator', {
      value: { language: 'de-DE' },
      configurable: true,
    })
    const expected = ['de-DE', 'de']
    mockNormalizeLocales.mockReturnValue(expected)

    const result = getNormalizedBrowserLocales()
    expect(mockNormalizeLocales).toHaveBeenCalledWith(['de-DE'])
    expect(result).toEqual(expected)
  })
})
