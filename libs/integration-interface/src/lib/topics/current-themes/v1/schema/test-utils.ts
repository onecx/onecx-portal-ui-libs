/**
 * Shared test utilities for theme token schema tests.
 *
 * expectExactTokens — checks that an object has exactly the expected keys
 * and that each key's value matches the expected value.
 *
 * expectExactUndefinedTokens — verifies that the set of undefined keys
 * in an object matches the expected list, useful for confirming optional
 * tokens (e.g. 'settings') are the only undefined values.
 *
 * expectTokens — checks that specific keys have expected values (without
 * asserting key count).
 *
 * expectDefaultsMatchShape — recursively verifies that every key present in a
 * defaults tree also exists in the corresponding zod shape, catching wiring
 * bugs (typos, renames) independently of the resolved token values.
 */

import * as z from 'zod'

export function expectTokens(o: object | undefined, expectedTokens: Record<string, any>) {
  for (const [key, expected] of Object.entries(expectedTokens)) {
    const actual = (o as any)[key]
    expect(actual).toStrictEqual(expected)
  }
}

export function expectExactTokens(o: object | undefined, expectedTokens: Record<string, any>) {
  expect(Object.keys(o ?? {}).length).toEqual(Object.keys(expectedTokens).length)
  expectTokens(o, expectedTokens)
}

export function expectExactUndefinedTokens(o: object | undefined, schemaShape: any, expectedUndefinedTokens: string[]) {
  const undefinedTokens = Object.keys(schemaShape).filter((key) => (o as any)[key] === undefined)
  for (const key of undefinedTokens) {
    expect(expectedUndefinedTokens).toContain(key)
  }
  expect(undefinedTokens.length).toEqual(expectedUndefinedTokens.length)
  expectUndefinedTokens(o, expectedUndefinedTokens)
}

export function expectUndefinedTokens(o: object | undefined, expectedUndefinedTokens: string[]) {
  for (const key of expectedUndefinedTokens) {
    const actual = (o as any)[key]
    expect(actual).toBeUndefined()
  }
}

export function expectDefaultsMatchShape(shape: z.ZodObject<any>, defaults: Record<string, unknown>) {
  for (const key of Object.keys(defaults)) {
    expect(Object.keys(shape.shape)).toContain(key)
    const fieldSchema = shape.shape[key]
    const value = defaults[key]
    if (fieldSchema instanceof z.ZodObject && value && typeof value === 'object' && !Array.isArray(value)) {
      expectDefaultsMatchShape(fieldSchema, value as Record<string, unknown>)
    }
  }
}
