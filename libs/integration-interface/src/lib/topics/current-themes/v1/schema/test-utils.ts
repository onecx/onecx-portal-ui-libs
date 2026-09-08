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
 *
 * at — walks a parsed/resolved value down a nested path (for invariant
 * assertions on the resolved tree).
 *
 * expectLeafAtTokenPath — asserts a nested path resolves to an expected
 * value, i.e. the leaf sits at exactly that path, not shallower or wrapped.
 *
 * expectNoGroupingWrapperKeys — asserts no nested object in a shape tree is
 * keyed with a grouping-wrapper key (variant/state/severity): the default
 * slots (defaultVariant/defaultState/defaultSeverity) and their named
 * siblings must be flat keys, never wrapped in a category object.
 *
 * objectShape / shapeAt / innerSchema — unwrap ZodPrefault/ZodDefault
 * wrappers to walk/compare the underlying shape tree, e.g. for asserting a
 * child reuses a shared shape by reference.
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

export function expectDefaultsMatchShape(shape: z.ZodObject, defaults: Record<string, unknown>) {
  for (const key of Object.keys(defaults)) {
    expect(Object.keys(shape.shape)).toContain(key)
    const fieldSchema = shape.shape[key]
    const value = defaults[key]
    if (fieldSchema instanceof z.ZodObject && value && typeof value === 'object' && !Array.isArray(value)) {
      expectDefaultsMatchShape(fieldSchema, value as Record<string, unknown>)
    }
  }
}

type AnyRecord = Record<string, any>

/** Walks the parsed output down `path` (for invariant assertions on the resolved tree). */
export function at(o: AnyRecord, path: (string | number)[]): any {
  return path.reduce((acc: any, key) => acc?.[key], o)
}

/**
 * Asserts that `tokenPath` resolves to `expected` in `parsed` — i.e. the leaf
 * sits at exactly that nested path (the default token path), not one level
 * shallower or wrapped in another key.
 */
export function expectLeafAtTokenPath(
  parsed: Record<string, unknown>,
  tokenPath: (string | number)[],
  expected: unknown
): void {
  let current: unknown = parsed
  for (const [i, segment] of tokenPath.entries()) {
    const obj = current as Record<string, unknown> | undefined
    if (!obj || typeof obj !== 'object' || !(segment in obj) || obj[segment] === undefined) {
      throw new Error(
        `token path not resolved at '${tokenPath.slice(0, i + 1).join('.')}': ${JSON.stringify({
          [String(segment)]: '(missing or undefined)',
        })}`
      )
    }
    current = obj[segment]
  }
  expect(current).toStrictEqual(expected)
}

/**
 * Asserts that no nested object in the shape tree is keyed with a
 * grouping-wrapper key (`variant`/`state`/`severity`): the default slots
 * (`defaultVariant`, `defaultState`, `defaultSeverity`) and their named
 * siblings must be flat keys, never wrapped in a category object.
 */
export function expectNoGroupingWrapperKeys(schema: z.ZodTypeAny): void {
  if (schema instanceof z.ZodObject) {
    const wrapperKeys = ['variant', 'state', 'severity'].filter((key) => key in schema.shape)
    expect(wrapperKeys).toEqual([])
    for (const fieldSchema of Object.values(schema.shape)) {
      expectNoGroupingWrapperKeys(fieldSchema)
    }
  }
}

/** Unwraps a ZodPrefault/ZodDefault wrapper and returns the inner object's shape. */
export function objectShape(schema: z.ZodTypeAny): AnyRecord {
  const inner = (schema as { def?: { innerType?: z.ZodTypeAny } }).def?.innerType
  return ((inner ?? schema) as any).shape
}

/** Walks the shape tree down `path`, unwrapping prefaulted objects at each level. */
export function shapeAt(schema: z.ZodTypeAny, path: string[]): z.ZodTypeAny {
  return path.reduce((current, key) => objectShape(current)[key], schema)
}

/** Unwraps a ZodPrefault/ZodDefault wrapper to the underlying schema (for identity checks). */
export function innerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  const inner = (schema as { def?: { innerType?: z.ZodTypeAny } }).def?.innerType
  return inner ?? schema
}
