import { expect } from '@jest/globals'

expect.extend({
  toEqualIgnoringWhitespace(received: string, expected: string) {
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim()

    const pass = normalize(received) === normalize(expected)

    return {
      pass,
      message: () =>
        pass
          ? `Expected strings not to be equal ignoring whitespace`
          : `Expected strings to be equal ignoring whitespace.\n\nExpected:\n${expected}\n\nReceived:\n${received}`,
    }
  },
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualIgnoringWhitespace(expected: string): R
    }
  }
}