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
