import { expectDefaultsMatchShape } from './test-utils'

import { input, inputShape, inputDefaults } from './input'

describe('input schema', () => {
  const parsed = input.parse({})

  it('parses an empty object', () => {
    expect(input.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(inputShape, inputDefaults)
  })
})
