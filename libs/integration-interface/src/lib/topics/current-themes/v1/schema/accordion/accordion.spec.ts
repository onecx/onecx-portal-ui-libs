import { expectDefaultsMatchShape } from '../test-utils'

import { z } from 'zod'

import { accordion, accordionDefaults } from './index'

describe('accordion schema', () => {
  const parsed = accordion.parse({})

  it('parses an empty object', () => {
    expect(accordion.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(accordion as unknown as z.ZodObject<z.ZodRawShape>, accordionDefaults)
  })
})