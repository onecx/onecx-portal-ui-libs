import * as z from 'zod'
import { applyDefaultsRecursive } from './defaults-helper'

describe('applyDefaultsRecursive', () => {
  it('applies a default to a scalar key present in the defaults tree', () => {
    const shape = z.object({ a: z.string().optional() })
    const schema = applyDefaultsRecursive(shape, { a: 'hello' })

    expect(schema.parse({})).toEqual({ a: 'hello' })
  })

  it('leaves a scalar key absent from the defaults tree optional/undefined', () => {
    const shape = z.object({ a: z.string().optional(), b: z.string().optional() })
    const schema = applyDefaultsRecursive(shape, { a: 'hello' })

    expect(schema.parse({})).toEqual({ a: 'hello' })
    expect(schema.parse({})['b']).toBeUndefined()
  })

  it('recurses into nested zod objects when the default value is a plain object', () => {
    const shape = z.object({
      nested: z.object({ x: z.string().optional(), y: z.string().optional() }).prefault({}),
    })
    const schema = applyDefaultsRecursive(shape, { nested: { x: 'foo' } })

    expect(schema.parse({})).toEqual({ nested: { x: 'foo' } })
  })

  it('leaves keys inside a nested object that are absent from its own defaults optional', () => {
    const shape = z.object({
      nested: z.object({ x: z.string().optional(), y: z.string().optional() }).prefault({}),
    })
    const schema = applyDefaultsRecursive(shape, { nested: { x: 'foo' } })

    expect((schema.parse({})['nested'] as Record<string, unknown>)['y']).toBeUndefined()
  })

  it('recurses through multiple levels of nesting', () => {
    const shape = z.object({
      level1: z
        .object({
          level2: z.object({ leaf: z.string().optional() }).prefault({}),
        })
        .prefault({}),
    })
    const schema = applyDefaultsRecursive(shape, { level1: { level2: { leaf: 'deep' } } })

    expect(schema.parse({})).toEqual({ level1: { level2: { leaf: 'deep' } } })
  })

  it('applies a non-object default (e.g. an array) directly, without recursing', () => {
    const shape = z.object({ list: z.array(z.string()).optional() })
    const schema = applyDefaultsRecursive(shape, { list: ['a', 'b'] })

    expect(schema.parse({})).toEqual({ list: ['a', 'b'] })
  })

  it('applies a null default directly, without recursing', () => {
    const shape = z.object({ a: z.string().nullable().optional() })
    const schema = applyDefaultsRecursive(shape, { a: null })

    expect(schema.parse({})).toEqual({ a: null })
  })

  it('applies a default to a key not present in the shape without throwing', () => {
    const shape = z.object({ a: z.string().optional() })

    expect(() => applyDefaultsRecursive(shape, { a: 'hello', extra: 'ignored' })).not.toThrow()
  })

  it('lets explicit input override the applied default', () => {
    const shape = z.object({ a: z.string().optional() })
    const schema = applyDefaultsRecursive(shape, { a: 'hello' })

    expect(schema.parse({ a: 'world' })).toEqual({ a: 'world' })
  })

  it('lets explicit input override a nested applied default', () => {
    const shape = z.object({
      nested: z.object({ x: z.string().optional() }).prefault({}),
    })
    const schema = applyDefaultsRecursive(shape, { nested: { x: 'foo' } })

    expect(schema.parse({ nested: { x: 'bar' } })).toEqual({ nested: { x: 'bar' } })
  })

  it('returns a schema that still parses successfully when no defaults are provided at all', () => {
    const shape = z.object({ a: z.string().optional() })
    const schema = applyDefaultsRecursive(shape, {})

    expect(schema.safeParse({}).success).toBe(true)
    expect(schema.parse({})['a']).toBeUndefined()
  })
})

// Regression coverage for the scalar-or-scale form the global typography primitive uses: a field
// that is either a scalar string or a partial object of named tokens (e.g. font size). The default
// tree supplies a (possibly partial) object, and partial baseline *input* must keep its supplied
// entries while gaining the defaulted ones — without ever synthesizing a value the author omitted.
describe('applyDefaultsRecursive on a scalar-or-scale (union) field', () => {
  const ref = (s: z.ZodTypeAny) => z.union([s, z.string()]) // mimics `withRef`
  const scaleShape = z.object({
    // A "scale" leaf: scalar CSS string/ref, or an object of named tokens (intentionally partial).
    size: z
      .union([
        ref(z.string()),
        z.object({
          sm: ref(z.string()).optional(),
          md: ref(z.string()).optional(),
          lg: ref(z.string()).optional(),
        }),
      ])
      .optional(),
  })

  it('fills a scale leaf from a partial object default when the input is empty', () => {
    const schema = applyDefaultsRecursive(scaleShape, { size: { md: '1rem' } })

    expect(schema.parse({})).toEqual({ size: { md: '1rem' } })
  })

  it('keeps supplied scale entries and gains the defaulted ones (partial baseline fill)', () => {
    const schema = applyDefaultsRecursive(scaleShape, { size: { md: '1rem' } })

    // The author supplies only `sm`; the baseline default fills `md` — the supplied value wins.
    expect(schema.parse({ size: { sm: '0.875rem' } })).toEqual({ size: { sm: '0.875rem', md: '1rem' } })
  })

  it('lets a supplied scalar beat the scale default (no object is synthesized)', () => {
    const schema = applyDefaultsRecursive(scaleShape, { size: { md: '1rem' } })

    expect(schema.parse({ size: '14px' })).toEqual({ size: '14px' })
  })

  it('does not fill a scale entry that has no default of its own', () => {
    const schema = applyDefaultsRecursive(scaleShape, { size: { md: '1rem' } })

    // `lg` has no default; a partial input must not gain one.
    expect((schema.parse({ size: { sm: '0.875rem' } })['size'] as Record<string, unknown>)['lg']).toBeUndefined()
  })

  it('still parses when no default is supplied for the scale field', () => {
    const schema = applyDefaultsRecursive(scaleShape, {})

    expect(schema.parse({})['size']).toBeUndefined()
    expect(schema.parse({ size: { md: '12px' } })).toEqual({ size: { md: '12px' } })
  })

  it('unwraps a default/prefault-wrapped union before recursing (wrapper forms)', () => {
    const wrapped = z.object({
      size: z
        .union([
          ref(z.string()).optional(),
          z.object({ md: ref(z.string()).optional(), lg: ref(z.string()).optional() }),
        ])
        .optional()
        .prefault({}),
    })
    const schema = applyDefaultsRecursive(wrapped, { size: { md: '1rem' } })

    expect(schema.parse({})).toEqual({ size: { md: '1rem' } })
    expect(schema.parse({ size: { lg: '1.125rem' } })).toEqual({ size: { md: '1rem', lg: '1.125rem' } })
  })
})
