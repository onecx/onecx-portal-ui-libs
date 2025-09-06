/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { isMobile } from './is-mobile.utils'
import { TestScheduler } from 'rxjs/testing'

// Mocking window and document objects
const mockMatchMedia = (query: string) => ({
  matches: query.includes('max-width: 600px'),
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
})

describe('isMobile', () => {
  let originalMatchMedia: typeof window.matchMedia
  let originalGetComputedStyle: typeof window.getComputedStyle

  beforeAll(() => {
    originalMatchMedia = window.matchMedia
    originalGetComputedStyle = window.getComputedStyle
    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia)
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      getPropertyValue: () => '600px',
    }))
  })

  afterAll(() => {
    window.matchMedia = originalMatchMedia
    window.getComputedStyle = originalGetComputedStyle
  })

  it('should emit true when the window width is less than the mobile breakpoint', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })

    testScheduler.run(({ expectObservable }) => {
      const result$ = isMobile()
      const expectedMarble = '(ab)'
      const expectedValues = { a: false, b: true }

      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })

  it('should emit false when the window width is greater than the mobile breakpoint', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({ matches: false }))

    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })

    testScheduler.run(({ expectObservable }) => {
      const result$ = isMobile()
      const expectedMarble = '(ab)'
      const expectedValues = { a: true, b: false }

      expectObservable(result$).toBe(expectedMarble, expectedValues)
    })
  })
})
