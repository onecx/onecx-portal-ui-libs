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
 * collectAxisScopes / expectAxes — collect the variant/state/severity keys of every
 * fallback scope under a usage and assert them per component.
 *
 * expectFallback — asserts the resolver's single-step fallback for a leaf path under a usage.
 */

import * as z from 'zod'
import { introspectThemeAxisMetadata } from '../utils/axis-metadata'
import { resolveLeafFallback, THEME_VAR_PREFIX } from '../utils/resolve-leaf-fallback'
import { theme } from '../current-themes.schema'

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

export type Axes = { variant?: string[]; state?: string[]; severity?: string[] }

/** Maps every scope path under `usagePath` to the variant/state/severity keys its leaves pass through. */
export function collectAxisScopes(usagePath: string): Map<string, Axes> {
  const scopes = new Map<string, Axes>()
  for (const [leafPath, metadata] of Object.entries(introspectThemeAxisMetadata(theme))) {
    if (!leafPath.startsWith(`${usagePath}.`)) continue
    for (const { scopePath, entries } of metadata.scopes) {
      const axes = scopes.get(scopePath) ?? {}
      for (const { kind, segments } of entries) {
        axes[kind] = [...new Set(axes[kind]).add(segments.join('.'))].sort()
      }
      scopes.set(scopePath, axes)
    }
  }
  return scopes
}

/**
 * Asserts every scope whose path ends with `scopeName` (a component may repeat, e.g. per parent
 * state) has exactly the expected keys. Key order in `expected` does not matter.
 */
export function expectAxes(scopes: Map<string, Axes>, scopeName: string, expected: Axes) {
  const occurrences = [...scopes]
    .filter(([path]) => path === scopeName || path.endsWith(`.${scopeName}`))
    .map(([, axes]) => axes)
  const sorted = Object.fromEntries(Object.entries(expected).map(([kind, keys]) => [kind, [...keys].sort()]))

  expect(occurrences.length).toBeGreaterThan(0)
  occurrences.forEach((axes) => expect(axes).toEqual(sorted))
}

/**
 * Asserts the resolver maps the leaf at `from` to the leaf at `to` in one step (`undefined` means no
 * fallback). Both paths are relative to `usagePath` and are compared as theme variable names.
 */
export function expectFallback(usagePath: string, from: string, to: string | undefined) {
  const toVar = (path: string) => THEME_VAR_PREFIX + `${usagePath}.${path}`.slice('v2.'.length).replace(/\./g, '-')
  expect(resolveLeafFallback(toVar(from))).toBe(to === undefined ? undefined : toVar(to))
}
