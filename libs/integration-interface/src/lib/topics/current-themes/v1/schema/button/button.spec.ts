import { expectDefaultsMatchShape } from '../test-utils'

import { button, buttonShape, buttonDefaults } from './button'

describe('button schema', () => {
  const parsed = button.parse({})

  it('parses an empty object', () => {
    expect(button.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(buttonShape, buttonDefaults)
  })
})
