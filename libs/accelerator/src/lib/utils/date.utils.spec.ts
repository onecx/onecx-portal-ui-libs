/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { getUTCDateWithoutTimezoneIssues, isValidDate } from './date.utils'

describe('date.utils', () => {
  describe('isValidDate', () => {
    it('returns true for a valid Date', () => {
      expect(isValidDate(new Date())).toBe(true)
    })

    it('returns false for invalid Date and non-Date values', () => {
      expect(isValidDate(new Date('not-a-date'))).toBe(false)
      expect(isValidDate('2020-01-01')).toBe(false)
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
    })
  })

  describe('getUTCDateWithoutTimezoneIssues', () => {
    it('returns a Date at UTC midnight for the local calendar day', () => {
      const input = new Date(2020, 5, 15, 23, 59, 59)
      const result = getUTCDateWithoutTimezoneIssues(input)

      expect(result).toBeInstanceOf(Date)
      expect(result.getUTCFullYear()).toBe(input.getFullYear())
      expect(result.getUTCMonth()).toBe(input.getMonth())
      expect(result.getUTCDate()).toBe(input.getDate())
      expect(result.getUTCHours()).toBe(0)
      expect(result.getUTCMinutes()).toBe(0)
      expect(result.getUTCSeconds()).toBe(0)
    })
  })
})
